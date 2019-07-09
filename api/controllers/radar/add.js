const moment = require('moment');

module.exports = {


  friendlyName: 'Add',


  description: 'Add radar.',


  inputs: {
    streetName: {
      type: 'string',
      required: true
    },
    speedLimit: {
      type: 'number',
      required: true
    }
  },


  exits: {

  },


  fn: async function (inputs, exits) {

    moment.locale('de-ch');
    const radar = {
      streetName: inputs.streetName,
      speedLimit: inputs.speedLimit,
      long: 0,
      lat: 0,
      directionOneLong: 0,
      directionOneLat: 0,
      directionTwoLong: 0,
      directionTwoLat: 0,
    };
    const newRadar = await Radar.create(radar).fetch();
    return exits.success(newRadar);
  }


};
