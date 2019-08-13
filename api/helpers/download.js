module.exports = {


  friendlyName: 'Download',


  description: 'Download something.',


  inputs: {

  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {
    let file = require('path').resolve(sails.config.appPath + '//' + `./download/${item}`)
    if (fs.existsSync(file)) {
      res.setHeader('Content-disposition', `attachment; filename=${fileName}`);
      let filestream = fs.createReadStream(file);
      filestream.pipe(res);
    } else {
      res.json({ error: "File not Found" });
    }
  }


};

