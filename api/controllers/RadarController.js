const moment = require('moment');
/**
 * RadarController
 *
 * @description :: Server-side logic for managing radars
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  addRadar(req, res) {
    moment.locale('de-ch');
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

  // TODO: Evt. create as cron
  updateRecordCount(req, res){
    Record.find({ radar: req.body.id })
    .exec( (err, recordTotal) => {
      // void => signal that the return value is unimportant. TODO add handleError(err) function
      if (err) return void res.json(500, { error: 'Validierungsfehler: Keine assoziierten Messungen' });

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

  async getRadarWithAvgSpeedAndSpeedingQuote2(req, res) {
    const radars = await Radar.find().populate('recordsAggregated');
    const aggregated = [];
    radars.forEach(r => {
      let totalNumberVehicles1 = 0;
      let totalNumberVehicles2 = 0;
      let sumAvg1 = 0;
      let sumAvg2 = 0;
      let sumTooFast1 = 0;
      let sumTooFast2 = 0;
      let maxTimeStamp = '1000-01-01';
      r.recordsAggregated.forEach(d => {
        if (d.direction === 1) {
          totalNumberVehicles1 += d.numberVehicles;
          sumAvg1 += d.avgKmh * d.numberVehicles;
          sumTooFast1 += d.tooFast;
        } else {
          totalNumberVehicles2 += d.numberVehicles;
          sumAvg2 += d.avgKmh * d.numberVehicles;
          sumTooFast2 += d.tooFast;
        }
        if (maxTimeStamp < d.date) maxTimeStamp = d.date;
      });
      // copy results to prevent returning all associations
      aggregated.push({
        id: r.id,
        streetName: r.streetName,
        long: r.long,
        lat: r.lat,
        directionOneLong: r.directionOneLong,
        directionOneLat: r.directionOneLat,
        directionTwoLong: r.directionTwoLong,
        directionTwoLat: r.directionTwoLat,
        speedLimit: r.speedLimit,
        recordCount: totalNumberVehicles1 + totalNumberVehicles2,
        avgDir1: Math.round(sumAvg1 / totalNumberVehicles1 * 100) / 100,
        avgDir2: Math.round(sumAvg2 / totalNumberVehicles2 * 100) / 100,
        speedingQuoteDir1: sumTooFast1 / totalNumberVehicles1,
        speedingQuoteDir2: sumTooFast2 / totalNumberVehicles2,
        count1: totalNumberVehicles1,
        count2: totalNumberVehicles2,
      });
    });
    return res.json(aggregated);
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
  ) AS count2,
  (
    SELECT MAX(timestamp)
    FROM record
    WHERE record.radar = radar.id
  ) as maxDate
FROM radar`;
    Radar.query(sql, [], function (error, data) {
      if (error)
        res.status(500).send(error);
      res.json(data);
    })
  }

};

