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
  },

  getRecordForWeeklyView(req, res) {
    const radarId = req.query.radarId;
    const direction = req.query.direction;
    const startDay = req.query.startDay;
    const endDay = req.query.endDay;
    const sql = `SELECT ROUND(sum(if(kmh > speedLimit, 1, 0))/count(kmh), 2) as speedingQuote,
  ROUND(avg(kmh),2) as avgSpeed,
  weekday,
  timestamp,
  count(timestamp) as count
    FROM record INNER JOIN radar ON radar.id = record.radar
    WHERE direction = ?
    AND record.radar = ?
    AND record.timestamp > ? AND record.timestamp < ?
    GROUP BY weekday`;

    Record.query(sql, [direction, radarId, startDay, endDay], function (error, data) {
      if (error)
        res.status(500).send(error);
      res.json(data);
    })
  },
  getRecordForDailyView(req, res) {
    const radarId = req.query.radarId;
    const direction = req.query.direction;
    const startDay = req.query.startDay;
    const endDay = req.query.endDay;
    const sql = `SELECT ROUND(sum(if(kmh > speedLimit, 1, 0))/count(kmh), 2) as speedingQuote,
  ROUND(avg(kmh),2) as avgSpeed,
  CONCAT(DATE_FORMAT(timestamp, "%H"), ':00') as hour,
  count(timestamp) as count
    FROM record INNER JOIN radar ON radar.id = record.radar
    WHERE direction = ?
    AND record.radar = ?
    AND record.timestamp > ?
    AND record.timestamp < ?
    GROUP BY hour`;

    Record.query(sql, [direction, radarId, startDay, endDay], function (error, data) {
      if (error)
        res.status(500).send(error);
      res.json(data);
    })
  },

  getMeasurementWeeks(req, res) {
    const radarId = req.query.radarId;
    const direction = req.query.direction;

    const sql = `SELECT DISTINCT weekofyear(timestamp) as week, MIN(timestamp) as startDay
FROM record INNER JOIN radar ON radar.id = record.radar
WHERE radar.id = ?
AND record.direction = ?
GROUP BY week`;

    Record.query(sql, [radarId, direction], function (error, data) {
      if (error)
        res.status(500).send(error);
      res.json(data);
    })
  },

};

