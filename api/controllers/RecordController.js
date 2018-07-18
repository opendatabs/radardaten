/**
 * RecordController
 *
 * @description :: Server-side logic for managing records
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  addRecords(req, res) {
    if (req.body.length) {
      const radarId = req.body[0].radar;
      Record.create(req.body)
        .exec( (err, created) => {
          if (err) {
            if (err.details.includes('duplicate record')) {
              return res.json(500, { error: 'Messungen enthält Duplikate oder wurde bereits erfasst' });
            } else {
              return res.serverError(err);
            }
          }
          Record.find({ radar: radarId })
            .exec( (err, recordTotal) => {
              if (err) {
                res.json(500, { error: 'Validierungsfehler' })
              }
              Radar.update({ id: radarId }, { recordCount: recordTotal.length })
                .exec( (updated, err) => {
                  if (err) {
                    return res.json(500, { error: 'Validierungsfehler' })
                  }
                  return res.json({
                    recordTotal: recordTotal.length,
                    recordsCreated: created.length
                  });
              });
          });
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
  },

};

