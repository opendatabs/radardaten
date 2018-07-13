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
        recordCount: count,
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

  // getRecordCount(id) {
  //   Record.count({radar: id})
  //     .exec(function (err, result) {
  //       return result;
  //     })
  // },

  getRadarWithAvgSpeed(req, res) {
    const sql = `SELECT
  radar.*,
  (
    SELECT avg(kmh)
    FROM record
    WHERE direction = 1
          AND record.radar = radar.id
  ) AS avgDir1,
  (
    SELECT avg(kmh)
    FROM record
    WHERE direction = 2
          AND record.radar = radar.id
  ) AS avgDir2
FROM radar`;
    Radar.query(sql, [], function (error, data) {
      res.json(data);
    })
  }

};

