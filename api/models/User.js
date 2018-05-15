/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    email: {
      type: 'email',
      unique: true,
    },
    password: {
      type: 'String',
      required: true
    },
    admin: {
      type: 'boolean'
    },
    toJSON: function () {
      let obj = this.toObject();
      delete obj.password;
      return obj;
    },
    isPasswordValid: function(password, cb) {
      bcrypt.compare(password, this.password, cb)
    }
  }
};

