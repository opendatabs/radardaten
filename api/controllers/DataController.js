/**
 * DataController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const basicAuth = require('basic-auth');
const fs = require('fs');

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
        let file = require('path').resolve(sails.config.appPath + '//' + './download/radarDump.sql')

        if (fs.existsSync(file)) {
          res.setHeader('Content-disposition', 'attachment; filename=radardaten.sql');

          let filestream = fs.createReadStream(file);
          filestream.pipe(res);

        } else {
          res.json({ error: "File not Found" });
        }
      } else {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
        res.end('Access denied');
        return;
      }
    },
    createMysqlDump: function (req, res) {
      let file = require('path').resolve(sails.config.appPath + '//' + './download/radarDump.sql')
      // fs.writeFile('./download/radarDump.sql', '', (err) => {
        // if (err) throw err;
        // console.log('Created new empty file');
        // console.log('Writing new MYSQL Dump...');
        mysqldump({ connection, dumpToFile: file }); // Save dump as file
      // });
    }
};

