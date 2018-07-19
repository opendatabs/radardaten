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
            if (err.details.includes('duplicate record')) {
              return res.json(500, { error: 'Messungen enthält Duplikate oder wurde bereits erfasst' });
            } else {
              return res.serverError(err);
            }
          }
          return res.json(created.length);
      });
    } else {
      return res.json(500, { error: 'Upload enthält keine Daten' })
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
  }

};

