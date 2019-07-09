module.exports = {


  friendlyName: 'Authorization',


  description: 'Session authorization of user',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs, exits) {
    // Policy checks the authentication
    return exits.success(true);

  }


};
