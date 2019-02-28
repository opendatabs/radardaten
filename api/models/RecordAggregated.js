/**
 * RecordAggregated.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {

      date: {
        type: 'date'
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

