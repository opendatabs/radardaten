/**
 * Radar.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

const moment = require('moment');

module.exports = {

  attributes: {
    streetName: {
      type: 'string'
    },
    date: {
      type: 'dateTime',
      defaultsTo: () => {
        moment().format("YYYY-MM-DD HH:mm:ss");
      }
    },
    long: {
      type: 'float',
      defaultsTo: 0
    },
    lat: {
      type: 'float',
      defaultsTo: 0
    },
    directionOneLong: {
      type: 'float',
      defaultsTo: 0
    },
    directionOneLat: {
      type: 'float',
      defaultsTo: 0
    },
    directionTwoLong: {
      type: 'float',
      defaultsTo: 0
    },
    directionTwoLat: {
      type: 'float',
      defaultsTo: 0
    },
    speedingQuote: {
      type: 'integer',
      defaultsTo: 0
    },
    speedLimit: {
      type: 'integer',
      defaultsTo: 0
    },
    avgSpeed: {
      type: 'float',
      defaultsTo: 0
    },
    records: {
      collection: 'record',
      via: 'radar'
    }
  },
  // if deleted, delete all associated records
  afterDestroy: function(destroyedRecords, cb) {
    Record.destroy({radar: _.pluck(destroyedRecords, 'id')}).exec(cb);
  }
};

