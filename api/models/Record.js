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
      type: 'number',
      defaultsTo: 0
    },
    length: {
      type: 'number',
      defaultsTo: 0
    },
    weekday: {
      type: 'string',
      allowNull: true
    },
    direction: {
      type: 'number'
    },
    radar: {
      model: 'radar'
    }

  },

};

