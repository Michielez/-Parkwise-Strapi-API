'use strict';

/**
 * recent-transaction controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::recent-transaction.recent-transaction', ({strapi})=> ({
  ...createCoreController('api::recent-transaction.recent-transaction'),

  async findCurrentUserRecentTransactions(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized(`You're not authorized!`);
    }

    const recentTransactions = await strapi.entityService.findMany('api::recent-transaction.recent-transaction',{
      filters: { user: user.id },
      populate: ['duration','parking','payment']
    })

    return recentTransactions;
  }
}));
