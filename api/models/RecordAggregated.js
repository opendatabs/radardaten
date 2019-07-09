/**
 * RecordAggregated.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    date: {
      type: 'ref',
      columnType: 'date'
    },
    hour: {
      type: 'number'
    },
    avgKmh: {
      type: 'number',
    },
    tooFast: {
      type: 'number'
    },
    numberVehicles: {
      type: 'number',
    },
    direction: {
      type: 'number'
    },
    radar: {
      model: 'radar'
    }

  },

};

