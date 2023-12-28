'use strict';

/**
 * price-rate service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::price-rate.price-rate');
