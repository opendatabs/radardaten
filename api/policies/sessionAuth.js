/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */

/*let env = {};
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  env = require('../../config/env/development');
} else {
  env = require('../../config/env/production');
}*/
let authCredentials = sails.config.custom.authCredentials;

// using basic-auth https://www.npmjs.com/package/basic-auth
const basicAuth = require('basic-auth');

module.exports = function sessionAuth(req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.status(401).send('Authentication required');
  };

  const user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  };

  if (user.name === authCredentials.username && user.pass === authCredentials.password) {
    return next();
  } else {
    return unauthorized(res);
  };
};
