const basicAuth = require('basic-auth');
/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    // Policy checks the authentication
    auth: (req, res) => {
        res.send(true);
        return;
    }

};

