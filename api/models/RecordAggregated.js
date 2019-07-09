/**
 * RecordAggregated.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    date: {
      type: 'string',
      columnType: 'date'
    },
    hour: {
      type: 'float'
    },
    avgKmh: {
      type: 'float',
    },
    tooFast: {
      type: 'integer'
    },
    numberVehicles: {
      type: 'integer',
    },
    direction: {
      type: 'integer'
    },
    radar: {
      model: 'radar'
    }

  },

};

