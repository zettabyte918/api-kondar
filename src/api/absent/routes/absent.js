'use strict';

/**
 * absent router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::absent.absent');
