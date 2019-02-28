/**
 * RecordAggregatedController
 *
 * @description :: Server-side logic for managing Recordaggregateds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  getRecordForWeeklyView(req, res) {
    const radarId = req.query.radarId;
    const direction = req.query.direction;
    const startDay = req.query.startDay;
    const endDay = req.query.endDay;
    const sql = `
    SELECT 
      ROUND(SUM(tooFast) / SUM(numberVehicles), 2) AS speedingQuote,
      ROUND(SUM(avgKmh * numberVehicles) / SUM(numberVehicles), 2) AS avgSpeed,
      WEEKDAY(date) as weekday,
      date,
      hour,
      COUNT(*) AS count
  FROM
      recordaggregated
          INNER JOIN
      radar ON radar.id = recordaggregated.radar
  WHERE direction = ?
      AND recordaggregated.radar = ?
      AND recordaggregated.date > ? AND recordaggregated.date < ?
  GROUP BY WEEKDAY(date)
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

    const sql = `SELECT DISTINCT weekofyear(date) as week, MIN(date) as startDay
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

