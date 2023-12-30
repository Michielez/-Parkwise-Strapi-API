'use strict';

/**
 * current-session controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::current-session.current-session', ({ strapi }) => ({
  ...createCoreController('api::current-session.current-session'),

  async findCurrentUserCurrentSessions(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized("You're not authorized!");
    }

    const currentSessions = await strapi.entityService.findMany('api::current-session.current-session', {
      filters: { user: user.id },
      populate: {
        duration: true,
        parking: {
          populate: {
            price_rates: true,
            location: true,
            currency: true,
            capacity: true
          }
        },
        user: true,
      }
    });

    console.log(currentSessions);
    const formattedSessions = currentSessions.map(session => {
      return {
        id: session.id,
        attributes: {
          ...session,
          createdAt: undefined,
          publishedAt: undefined,
          updatedAt: undefined,
          duration: session.duration ? {
            data: {
              id: session.duration.id,
              attributes: {
                ...session.duration,
                createdAt: undefined,
                publishedAt: undefined,
                updatedAt: undefined
              }
            }
          } : null,
          parking: session.parking ? {
            data: {
              id: session.parking.id,
              attributes: {
                ...session.parking,
                createdAt: undefined,
                publishedAt: undefined,
                updatedAt: undefined,
                price_rates: session.parking.price_rates.map(rate => ({
                  id: rate.id,
                  attributes: {
                    ...rate,
                    createdAt: undefined,
                    publishedAt: undefined,
                    updatedAt: undefined,
                  }
                })),
                location: session.parking.location ? {
                  data: {
                    id: session.parking.location.id,
                    attributes: {
                      ...session.parking.location,
                      createdAt: undefined,
                      publishedAt: undefined,
                      updatedAt: undefined,
                    }
                  }
                } : null,
                currency: session.parking.currency ? {
                  data: {
                    id: session.parking.currency.id,
                    attributes: {
                      ...session.parking.currency,
                      createdAt: undefined,
                      publishedAt: undefined,
                      updatedAt: undefined,
                    }
                  }
                } : null,
                capacity: session.parking.capacity ? {
                  data: {
                    id: session.parking.capacity.id,
                    attributes: {
                      ...session.parking.capacity,
                      createdAt: undefined,
                      publishedAt: undefined,
                      updatedAt: undefined,
                    }
                  }
                } : null,
              }
            }
          } : null,
        }
      };
    });
    return {
      data: formattedSessions,
      meta: {} // Add any relevant meta information here
    };
  }
}));
