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
      speedingQuote: parseInt(req.body.speedingQuote), //TODO calculate from Record
      avgSpeed: parseInt(req.body.avgSpeed), //TODO calculate from Record
      long: 0,
      lat: 0,
      directionLong: 0,
      directionLat: 0,
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
        speedLimit: parseInt(req.body.speedLimit)
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

