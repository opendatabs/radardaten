/**
 * DataController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const mysqldump = require('mysqldump');
const basicAuth = require('basic-auth');

let env = {};
let connection;
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  env = require('../../config/env/development');
  connection = env.dumpConnection;
} else {
  env = require('../../config/env/production');
  connection = env.dumpConnection;
}

module.exports = {
    getMysqlDump: function (req, res) {
      const user = basicAuth(req);
      if (!user || !user.name || !user.pass) {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
        res.end('This request requires authentication');
        return;
      }
      if (user.name === env.dumpUser.username && user.pass === env.dumpUser.password) {
        let promise = new Promise((resolve, reject) => {
          const result = mysqldump({ connection });
          // mysqldump({ connection, dumpToFile: './radarDump.sql'}); // Save dump as file
          resolve(result);
        });
        promise
          .then(result => res.send(result))
          .catch(reason => res.send('Error: ' + reason));
      } else {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
        res.end('Access denied');
        return;
      }
    }
};

