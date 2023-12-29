'use strict';

/**
 * recent-transaction service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::recent-transaction.recent-transaction');
