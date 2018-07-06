/**
 * RecordController
 *
 * @description :: Server-side logic for managing records
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  addRecord: (req, res) => {
    const record = {
      timestamp: req.body.timestamp,
      kmh: req.body.kmh,
      length: req.body.length,
      weekday: req.body.weekday,
      direction: req.body.direction,
      radar: req.body.radar,
    };
    Record.create(record)
      .exec( err => {

        if (err) {
          res.serverError(err);
          return;
        }
        return res.json(record);
      })
  },

  getRecordsOfRadar: (req, res) => {
    Record.find({
      radar: req.query.radarId
    }).exec( (err, data) => {
      if (err) {
        res.serverError(err);
        return;
      }
      return res.json(data);
    })
  }

};

