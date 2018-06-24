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
    date: {
      type: 'string'
    },
    long: {
      type: 'float'
    },
    lat: {
      type: 'float'
    },
    directionLong: {
      type: 'float'
    },
    directionLat: {
      type: 'float'
    },
    speedingQuote: {
      type: 'integer'
    },
    speedLimit: {
      type: 'integer'
    },
    avgSpeed: {
      type: 'float'
    },
    records: {
      collection: 'record',
      via: 'radar'
    }
  }
};

