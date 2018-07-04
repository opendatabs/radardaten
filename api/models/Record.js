/**
 * Record.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    timestamp: {
      type: 'dateTime'
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
      type: 'String',
      defaultsTo: null
    },
    radar: {
      model: 'radar'
    }
  }
};

