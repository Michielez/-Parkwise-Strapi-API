'use strict';

/**
 * current-session router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::current-session.current-session');
