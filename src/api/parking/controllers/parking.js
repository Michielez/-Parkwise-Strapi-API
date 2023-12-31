'use strict';

/**
 * parking controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::parking.parking', ({ strapi }) => ({
  ...createCoreController('api::parking.parking'),

  async park(ctx){
    const { parkingId, car } = ctx.request.body.data;
    const user = ctx.state.user;

    console.log(ctx.request.body);
    try {

      console.table({parkingId, car});
      console.table(user);

      console.log("Check if parking has available spots");

      const parking = await strapi.entityService.findOne('api::parking.parking', parkingId, {
        populate: {
          capacity: true
        }
      })

      if (!parking || BigInt(parking.capacity.available) <= 0){
        return ctx.badRequest('Parking is not available');
      }

      console.log("Creating a new duration")

      const duration = await strapi.entityService.create('api::duration.duration', {
        data: {
          start: new Date(),
          end: null,
          publishedAt: new Date(),
        }
      })

      console.log("Creating a new parking session")

      const session = await strapi.entityService.create('api::current-session.current-session', {
        data: {
          car: car,
          parking: parkingId,
          duration: duration.id,
          user: user.id,
          publishedAt: new Date(),
        }
      })

      console.log("Updating parking capacity")

      await strapi.entityService.update('api::capacity.capacity', parking.capacity.id, {
        data: {
          available: Number(parking.capacity.available) - 1,
          taken: Number(parking.capacity.taken) + 1,
          updatedAt: new Date(),
        }
      })

      return {message: "Parking session started successfully", session};

    } catch (error) {
      return ctx.internalServerError(error);
    }
  },

  async leave(ctx){
    const { paymentMethod } = ctx.request.body.data;
    const user = ctx.state.user;

    console.log(ctx.request.body);

    try {

      console.log("paymentMethod", paymentMethod);
      console.table(user);

      console.log("Getting user information");

      const userInformation = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: {id: user.id},
        populate: {
          current_session: true
        }
      });

      const currentSessionId = userInformation.current_session.id;

      console.log("Getting current session");

      const currentSession = await strapi.entityService.findOne('api::current-session.current-session', currentSessionId, {
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
        }
      })
      console.log("Updating duration");
      const duration = await strapi.entityService.update('api::duration.duration', currentSession.duration.id, {
        data: {
          end: new Date(),
          updatedAt: new Date(),
        }
      })
      console.log("Updating current session");
      await strapi.entityService.update('api::capacity.capacity', currentSession.parking.capacity.id, {
        data: {
          available: Number(currentSession.parking.capacity.available) + 1,
          taken: Number(currentSession.parking.capacity.taken) - 1,
          updatedAt: new Date(),
        }
      });
      console.log("Deleting current session");
      await strapi.entityService.delete('api::current-session.current-session', currentSessionId);

      function calculatePaymentAmount(priceRates, duration) {
        const sortedRates = priceRates.sort((a, b) => a.minutes - b.minutes);
        const priceRate = sortedRates.find(rate => duration <= rate.minutes);
        if (!priceRate) {
          return 0;
        }
        return priceRate.price;
      }

      function calculateMinutes(startTime, endTime){
        const start = new Date(startTime);
        const end = new Date(endTime);

        const differenceInMilliseconds = end.getTime() - start.getTime();
        const differenceInMinutes = differenceInMilliseconds / (1000 * 60);

        return differenceInMinutes;
      }
      console.log("Creating payment");
      const payment = await strapi.entityService.create('api::payment.payment', {
        data: {
          amount: calculatePaymentAmount(currentSession.parking.price_rates, calculateMinutes(duration.start, duration.end)),
          method: paymentMethod,
          currency: currentSession.parking.currency.id,
          time: new Date(),
          publishedAt: new Date(),
        }
      });
      console.log("Creating recent transaction");
      const recentTransaction = await strapi.entityService.create('api::recent-transaction.recent-transaction', {
        data: {
          car: currentSession.car,
          duration: currentSession.duration.id,
          parking: currentSession.parking.id,
          payment: payment.id,
          user: user.id,
          publishedAt: new Date(),
        }
      });

      return {message: "Parking session left successfully", recentTransaction};

    } catch (error) {
      return ctx.internalServerError(error);
    }
  }

}));
