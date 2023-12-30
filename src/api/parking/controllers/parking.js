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
    try {

      console.log("Fetching parking");

      const parking = await strapi.entityService.findOne('api::parking.parking', parkingId, {
        populate: {
          capacity: true
        }
      })

      console.log(parking);

      console.log("Checking parking availability");

      if (!parking || BigInt(parking.capacity.available) <= 0){
        return ctx.badRequest('Parking is not available');
      }

      console.log("Creating duration");

      const duration = await strapi.entityService.create('api::duration.duration', {
        data: {
          start: new Date(),
          end: null
        }
      })

      console.log(duration);

      console.log("Creating current session");

      const session = await strapi.entityService.create('api::current-session.current-session', {
        data: {
          car: car,
          parking: parkingId,
          duration: duration.id,
          user: user.id
        }
      })

      console.log(session);

      console.log("Updating parking capacity");

      await strapi.entityService.update('api::capacity.capacity', parking.capacity.id, {
        data: {
          available: Number(parking.capacity.available) - 1,
          taken: Number(parking.capacity.taken) + 1,
        }
      })

      return {message: "Parking session started successfully", session};

    } catch (error) {
      return ctx.internalServerError(error);
    }
  },

  async verlaat(ctx){

  }

}));
