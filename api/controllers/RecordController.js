/**
 * RecordController
 *
 * @description :: Server-side logic for managing records
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  addRecords(req, res) {
    if (req.body.length) {
      Record.create(req.body)
        .exec( (err, created) => {
          if (err) {
            res.serverError(err);
          }
        return res.json(created.length);
      })
    }
  },

  getRecordsOfRadar(req, res) {
    Record.find({
      radar: req.query.radarId
    }).exec( (err, data) => {
      if (err) {
        res.serverError(err);
        return;
      }
      return res.json(data);
    })
  },

};

