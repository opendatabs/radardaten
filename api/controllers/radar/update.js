module.exports = {


  friendlyName: 'Update',


  description: 'Update radar.',


  inputs: {
    id: {
      type: 'number',
      required: true
    },
    streetName: {
      type: 'string',
      required: true
    },
    speedLimit: {
      type: 'number',
      required: true
    },
    lat: {
      type: 'number',
      required: true
    },
    long: {
      type: 'number',
      required: true
    },
    directionOneLat: {
      type: 'number',
      required: true
    },
    directionOneLong: {
      type: 'number',
      required: true
    },
    directionTwoLat: {
      type: 'number',
      required: true
    },
    directionTwoLong: {
      type: 'number',
      required: true
    },

  },


  exits: {},


  fn: async function (inputs, exits) {

    const updatedRadar = await Radar.updateOne({
      id: inputs.id
    }).set({
      streetName: inputs.streetName,
      speedLimit: parseInt(inputs.speedLimit),
      lat: inputs.lat,
      long: inputs.long,
      directionOneLat: inputs.directionOneLat,
      directionOneLong: inputs.directionOneLong,
      directionTwoLat: inputs.directionTwoLat,
      directionTwoLong: inputs.directionTwoLong,
    });

    return exits.success(updatedRadar);


  }


};
