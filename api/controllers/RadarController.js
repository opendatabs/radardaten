/**
 * RadarController
 *
 * @description :: Server-side logic for managing radars
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  addRadar(req, res) {
    const radar = {
      streetName: req.body.streetName,
      speedLimit: parseInt(req.body.speedLimit),
      long: 0,
      lat: 0,
      directionOneLong: 0,
      directionOneLat: 0,
      directionTwoLong: 0,
      directionTwoLat: 0,
    };
    Radar.create(radar)
      .exec( err => {

        if (err) {
          res.serverError(err);
          return;
        }
        return res.json(radar);
      })
  },


  updateRadar(req, res) {
    Radar.update(
      { id: req.body.id }, {
        streetName: req.body.streetName,
        speedLimit: parseInt(req.body.speedLimit),
        lat: req.body.lat,
        long: req.body.long,
        date: req.body.date,
        recordCount: req.body.recordCount,
        directionOneLat: req.body.directionOneLat,
        directionOneLong: req.body.directionOneLong,
        directionTwoLat: req.body.directionTwoLat,
        directionTwoLong: req.body.directionTwoLong,
      })
      .exec( (err, updated) => {

        if (err) {
          res.serverError(err);
          return;
        }
        return res.json(updated);
      })
  },

  updateRecordCount(req, res){
    Record.find({ radar: req.body.id })
    .exec( (err, recordTotal) => {
      if (err) {
        return res.json(500, { error: 'Validierungsfehler: Keine assozierte Messungen' })
      }
      const total = recordTotal.length;
      Radar.update({ id: req.body.id }, { recordCount: total })
        .exec( (err, updated) => {
          if (err) {
            return res.json(500, { error: 'Validierungsfehler: Messstation konnte nicht aktualisiert werden' })
          }
          return res.json(updated);
        });
    });
  },


  getRadarWithAvgSpeedAndSpeedingQuote(req, res) {
    const sql = `SELECT
  radar.*,
  (
    SELECT ROUND(avg(kmh), 2)
    FROM record
    WHERE direction = 1
          AND record.radar = radar.id
  ) AS avgDir1,
  (
    SELECT ROUND(avg(kmh), 2)
    FROM record
    WHERE direction = 2
          AND record.radar = radar.id
  ) AS avgDir2,
  (
    SELECT ROUND(sum(if((kmh-5) > speedLimit, 1, 0))/count(kmh), 4)
    FROM record
    WHERE direction = 1
          AND record.radar = radar.id
  ) AS speedingQuoteDir1,
  (
    SELECT ROUND(sum(if((kmh-5) > speedLimit, 1, 0))/count(kmh), 4)
    FROM record
    WHERE direction = 2
          AND record.radar = radar.id
  ) AS speedingQuoteDir2,
  (
    SELECT count(*)
    FROM record
    WHERE direction = 1
          AND record.radar = radar.id
  ) AS count1,
  (
    SELECT count(*)
    FROM record
    WHERE direction = 2
          AND record.radar = radar.id
  ) AS count2
FROM radar`;
    Radar.query(sql, [], function (error, data) {
      if (error)
        res.status(500).send(error);
      res.json(data);
    })
  }

};

