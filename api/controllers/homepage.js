module.exports = {


  friendlyName: 'View homepage',


  description: 'Redirect to angular for client-side navigation',


  exits: {

    success: {
      responseType: 'homepage'
    }

  },


  fn: async function (inputs, exits) {
    return exits.success();
  }


};
