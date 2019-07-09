/**
 * Record.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    timestamp: {
      type: 'string',
      columnType: 'datetime'
    },
    kmh: {
      type: 'float',
      defaultsTo: 0
    },
    length: {
      type: 'float',
      defaultsTo: 0
    },
    weekday: {
      type: 'string',
      allowNull: true
    },
    direction: {
      type: 'float'
    },
    radar: {
      model: 'radar'
    }

  },

};

