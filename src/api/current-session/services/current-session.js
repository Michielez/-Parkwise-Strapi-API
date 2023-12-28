'use strict';

/**
 * current-session service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::current-session.current-session');
