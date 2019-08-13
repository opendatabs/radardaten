/**
 * DataController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const basicAuth = require('basic-auth');
const fs = require('fs');

const auth = (req, res) => {
  const user = basicAuth(req);
  if (!user || !user.name || !user.pass) {
    res.statusCode = 401;
    res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
    res.end('This request requires authentication');
    return false;
  }
  if (user.name === sails.config.custom.dump.user && user.pass === sails.config.custom.dump.password) {
    return true;
  } else {
    res.statusCode = 401;
    res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
    res.end('Access denied');
    return false;
  }
};

const download = (res, item, fileName) => {
  let file = require('path').resolve(sails.config.appPath + '//' + `./download/${item}`)
  if (fs.existsSync(file)) {
    res.setHeader('Content-disposition', `attachment; filename=${fileName}`);
    let filestream = fs.createReadStream(file);
    filestream.pipe(res);
  } else {
    res.json({ error: "File not Found" });
  }
}

module.exports = {
  getMysqlDump: (req, res) => {
    if (auth(req, res)) {
      download(res, 'radarDump.sql', 'radardaten.sql')
    }
  },
  getRecordTsv: (req, res) => {
    download(res, 'record.tsv', 'records.tsv')
  },
  getRadarTsv: (req, res) => {
    download(res, 'radar.tsv', 'radars.tsv')
  },
};

