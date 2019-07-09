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
      type: 'number',
      defaultsTo: 0
    },
    lat: {
      type: 'number',
      defaultsTo: 0
    },
    directionOneLong: {
      type: 'number',
      defaultsTo: 0
    },
    directionOneLat: {
      type: 'number',
      defaultsTo: 0
    },
    directionTwoLong: {
      type: 'number',
      defaultsTo: 0
    },
    directionTwoLat: {
      type: 'number',
      defaultsTo: 0
    },
    speedLimit: {
      type: 'number',
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
      type: 'number',
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

