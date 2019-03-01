const moment = require('moment');

/**
 * RecordAggregatedController
 *
 * @description :: Server-side logic for managing Recordaggregateds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  async aggregateAndInsertRecords(records, socketId) {
    const aggregated = [];
    const radar = await Radar.find({id: records[0].radar}).limit(1);
    const speedLimit = radar[0].speedLimit;
    records.forEach(r => {
      let date = moment(r.timestamp).format('YYYY-MM-DD');
      let hour = moment(r.timestamp).format('hh');
      let tooFast;
      (r.kmh - 5 > speedLimit) ? tooFast = 1 : tooFast = 0;

      let found = false;
      for (let ag of aggregated) {
        if (r.radar === ag.radar
          && r.direction === ag.direction
          && date === ag.date
          && hour === ag.hour
        ) {
          found = true;
          ag.sumKmh += r.kmh;
          ag.tooFast += tooFast;
          ag.numberVehicles++;
        }
      }
      if (!found) {
        aggregated.push({
          date: date,
          hour: hour,
          sumKmh: r.kmh,
          tooFast: tooFast,
          numberVehicles: 1,
          direction: r.direction,
          radar: r.radar
        })
      }
    });
    aggregated.forEach(ag => ag.avgKmh = Math.round(ag.sumKmh / ag.numberVehicles * 100) / 100);
    await RecordAggregated.create(aggregated).exec( (err, created) => {
      sails.sockets.broadcast(socketId, 'recordsAggregated', {
        data: {
          recordsCreated: aggregated.length
        }
      });
    })
  },

  getRecordForWeeklyView(req, res) {
    const radarId = req.query.radarId;
    const direction = req.query.direction;
    const startDay = req.query.startDay;
    const endDay = req.query.endDay;
    const sql = `
    SELECT 
      ROUND(SUM(tooFast) / SUM(numberVehicles), 2) AS speedingQuote,
      ROUND(SUM(avgKmh * numberVehicles) / SUM(numberVehicles), 2) AS avgSpeed,
      WEEKDAY(recordaggregated.date) as weekday,
      recordaggregated.date as date,
      hour,
      COUNT(*) AS count
  FROM
      recordaggregated
          INNER JOIN
      radar ON radar.id = recordaggregated.radar
  WHERE direction = ?
      AND recordaggregated.radar = ?
      AND recordaggregated.date > ? AND recordaggregated.date < ?
  GROUP BY WEEKDAY(recordaggregated.date)
  `;

    RecordAggregated.query(sql, [direction, radarId, startDay, endDay], function (error, data) {
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
    const sql = `SELECT ROUND(tooFast / numberVehicles, 2) as speedingQuote,
  avgKmh as avgSpeed,
  hour,
  numberVehicles as count
    FROM recordaggregated INNER JOIN radar ON radar.id = recordaggregated.radar
    WHERE direction = ?
    AND recordaggregated.radar = ?
	AND recordaggregated.date = ?
    GROUP BY hour`;

    RecordAggregated.query(sql, [direction, radarId, startDay], function (error, data) {
      if (error)
        res.status(500).send(error);
      data.forEach(d => {
        if (d.hour.toString().length === 1)
          d.hour = `0${d.hour}:00`;
        else
          d.hour = `${d.hour}:00`
      });
      res.json(data);
    })
  },

  getMeasurementWeeks(req, res) {
    const radarId = req.query.radarId;
    const direction = req.query.direction;

    const sql = `SELECT DISTINCT weekofyear(recordaggregated.date) as week, MIN(recordaggregated.date) as startDay
FROM recordaggregated INNER JOIN radar ON radar.id = recordaggregated.radar
WHERE radar.id = ?
AND recordaggregated.direction = ?
GROUP BY week`;

    RecordAggregated.query(sql, [radarId, direction], function (error, data) {
      if (error)
        res.status(500).send(error);
      res.json(data);
    })
  },
};

