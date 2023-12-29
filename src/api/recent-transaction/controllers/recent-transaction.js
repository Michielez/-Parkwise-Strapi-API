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
      populate: {
        duration: true,
        parking: true,
        payment: {
          populate: {
            currency: true
          }
        }
      }
    })

    const filteredRecentTransactions = recentTransactions.map(transaction => {
      const { createdAt, publishedAt, updatedAt, duration, parking, payment, ...restTransaction } = transaction;

      const filteredDuration = duration ? {
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

      const filteredPayment = payment ? {
        ...payment,
        createdAt: undefined,
        publishedAt: undefined,
        updatedAt: undefined,
        currency: payment.currency ? {
          ...payment.currency,
          createdAt: undefined,
          publishedAt: undefined,
          updatedAt: undefined
        } : null
      } : null;


      return { ...restTransaction, duration: filteredDuration, parking: filteredParking, payment: filteredPayment };
    });


    return filteredRecentTransactions;
  }
}));
