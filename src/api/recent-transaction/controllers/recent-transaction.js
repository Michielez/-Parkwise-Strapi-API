'use strict';

/**
 * recent-transaction controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::recent-transaction.recent-transaction', ({ strapi }) => ({
  ...createCoreController('api::recent-transaction.recent-transaction'),

  async findCurrentUserRecentTransactions(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized(`You're not authorized!`);
    }

    const recentTransactions = await strapi.entityService.findMany('api::recent-transaction.recent-transaction', {
      filters: { user: user.id },
      populate: {
        duration: true,
        parking: {
          populate: {
            price_rates: true,
            location: true,
            currency: true,
            capacity: true,
          }
        },
        payment: {
          populate: {
            currency: true
          }
        }
      }
    });

    const formattedTransactions = recentTransactions.map(transaction => {
      return {
        id: transaction.id,
        attributes: {
          ...transaction,
          createdAt: undefined,
          publishedAt: undefined,
          updatedAt: undefined,
          duration: transaction.duration ? {
            data: {
              id: transaction.duration.id,
              attributes: {
                ...transaction.duration,
                createdAt: undefined,
                publishedAt: undefined,
                updatedAt: undefined
              }
            }
          } : null,
          parking: transaction.parking ? {
            data: {
              id: transaction.parking.id,
              attributes: {
                ...transaction.parking,
                createdAt: undefined,
                publishedAt: undefined,
                updatedAt: undefined,
                location: transaction.parking.location ? {
                  data: {
                    id: transaction.parking.location.id,
                    attributes: {
                      ...transaction.parking.location,
                      createdAt: undefined,
                      publishedAt: undefined,
                      updatedAt: undefined,
                    }
                  }
                } : null,
                price_rates: {
                  data: transaction.parking.price_rates.map(rate => ({
                    id: rate.id,
                    attributes: {
                      ...rate,
                      createdAt: undefined,
                      publishedAt: undefined,
                      updatedAt: undefined,
                    }
                  }))
                },
                capacity: transaction.parking.capacity ? {
                  data: {
                    id: transaction.parking.capacity.id,
                    attributes: {
                      ...transaction.parking.capacity,
                      createdAt: undefined,
                      publishedAt: undefined,
                      updatedAt: undefined,
                    }
                  }
                } : null,
                currency: transaction.parking.currency ? {
                  data: {
                    id: transaction.parking.currency.id,
                    attributes: {
                      ...transaction.parking.currency,
                      createdAt: undefined,
                      publishedAt: undefined,
                      updatedAt: undefined,
                    }
                  }
                } : null
              }
            }
          } : null,
          payment: transaction.payment ? {
            data: {
              id: transaction.payment.id,
              attributes: {
                ...transaction.payment,
                createdAt: undefined,
                publishedAt: undefined,
                updatedAt: undefined,
                currency: transaction.payment.currency ? {
                  data: {
                    id: transaction.payment.currency.id,
                    attributes: {
                      ...transaction.payment.currency,
                      createdAt: undefined,
                      publishedAt: undefined,
                      updatedAt: undefined,
                    }
                  }
                } : null
              }
            }
          } : null,
        }
      };
    });

    return {
      data: formattedTransactions,
      meta: {} // Add relevant meta information here
    };
  }
}));
