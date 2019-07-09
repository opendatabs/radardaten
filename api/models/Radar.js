/**
 * Radar.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    streetName: {
      type: 'string'
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
    speedLimit: {
      type: 'integer',
      defaultsTo: 0
    },
    records: {
      collection: 'record',
      via: 'radar'
    },
    recordsAggregated: {
      collection: 'recordAggregated',
      via: 'radar'
    },
    recordCount: {
      type: 'float',
      defaultsTo: 0
    }
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

  },
  // if deleted, delete all associated records
  afterDestroy: async function(destroyedRecords, cb) {
    Record.destroy({radar: _.pluck(destroyedRecords, 'id')}).exec(() => {
      RecordAggregated.destroy({radar: _.pluck(destroyedRecords, 'id')}).exec(cb)
    });
  }

};

