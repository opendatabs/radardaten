/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */


const basicAuth = require('basic-auth');

module.exports = function sessionAuth(req, res, next) {

  let authCredentials = sails.config.custom.authCredentials;

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
