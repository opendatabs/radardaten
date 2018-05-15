/**
 * Radar.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    streetName: {
      type: 'string'
    },
    long: {
      type: 'number'
    },
    lat: {
      type: 'number'
    },
    directionLong: {
      type: 'number'
    },
    directionLat: {
      type: 'number'
    },
    speedingQuote: {
      type: 'number'
    },
    speedLimit: {
      type: 'number'
    },
    avgSpeed: {
      type: 'number'
    },
    records: {
      collection: 'record',
      via: 'radar'
    }
  }
};

