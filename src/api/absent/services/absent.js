'use strict';

/**
 * absent service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::absent.absent');
