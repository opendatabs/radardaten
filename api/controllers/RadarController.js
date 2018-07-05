/**
 * RadarController
 *
 * @description :: Server-side logic for managing radars
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  addRadar: (req, res) => {
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


  updateRadar: (req, res) => {
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

};

