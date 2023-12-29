'use strict';

/**
 * current-session controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::current-session.current-session', ({ strapi }) =>({
  ...createCoreController('api::current-session.current-session'),
  async findCurrentUserCurrentSessions(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized("You're not authorized!");
    }

    const currentSessions = await strapi.entityService.findMany('api::current-session.current-session', {
      filter: { user: user.id },
      populate: {
        duration: true,
        parking: true,
      }
    })

    const filteredCurrentSessions = currentSessions.map(session => {
      const { createdAt, publishedAt, updatedAt, duration, parking,...restSession } = session;
      const filteredDuration = duration? {
        ...duration,
        createdAt: undefined,
        publishedAt: undefined,
        updatedAt: undefined
      } : null;

      const filteredParking = parking? {
        ...parking,
        createdAt: undefined,
        publishedAt: undefined,
        updatedAt: undefined
      } : null;

      return {
        ...restSession,
        duration: filteredDuration,
        parking: filteredParking
      }
    })

    return filteredCurrentSessions[0];
  }
}));
