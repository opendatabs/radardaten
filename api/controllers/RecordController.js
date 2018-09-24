const moment = require('moment');
/**
 * RecordController
 *
 * @description :: Server-side logic for managing records
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  addRecords(req, res) {
    const bundle = [];
    let foundMatches = 0;
    if (req.body && req.body.id && req.body.text) {
      try {
        const txt = req.body.text;
        const regex = /[0-2]\d\d\s[0-2]\d:[0-6]\d:[0-6]\d\s\d\d\.[01]\d\.[0-3]\d\s[012]\s\d*\.\d$/gm;
        let match = [];
        do {
          match = regex.exec(txt);
          if (match) {
            if (match.length) {
              foundMatches++;
              const arr = match[0].split('\t');
              if (arr.length === 5) {
                const timestamp = moment([arr[2].slice(0, 6), '20', arr[2].slice(6)].join('') + " " + arr[1], 'DD.MM.YYYY HH:mm:ss').toDate();
                bundle.push({
                  timestamp: timestamp,
                  kmh: Number(arr[0]),
                  length: Number(arr[4]),
                  weekday: moment(timestamp).format('dddd'),
                  direction: Number(arr[3]),
                  radar: req.body.id
                });
              }
            }
          }
        } while (match);
      } catch(error) {
        return res.json(500, { error: 'Es ist ein Fehler aufgetreten: ' + error })
      }
      Record.create(bundle)
        .exec( (err, created) => {
          if (err) {
            if (err.details.includes('duplicate record')) {
              return res.json(500, { error: 'Messungen enthalten Duplikate oder wurden bereits erfasst' });
            } else {
              return res.json(500, { error: 'Es ist ein Fehler beim Speichern der Daten aufgetreten: ' + err });
            }
          }
          return res.json(200, { recordsCreated: created.length, foundMatches: foundMatches, created: created });
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

