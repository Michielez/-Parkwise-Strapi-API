'use strict';

/**
 * parking service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::parking.parking');
