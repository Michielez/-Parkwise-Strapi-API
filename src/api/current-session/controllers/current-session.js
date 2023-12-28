'use strict';

/**
 * current-session controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::current-session.current-session');
