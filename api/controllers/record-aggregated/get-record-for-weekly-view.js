module.exports = {


  friendlyName: 'Get record for weekly view',


  description: '',


  inputs: {
    radarId: {
      type: 'number',
      required: true
    },
    direction: {
      type: 'number',
      required: true
    },
    startDay: {
      type: 'string',
      required: true
    },
    endDay: {
      type: 'string',
      required: true
    }
  },


  exits: {

  },


  fn: async function (inputs, exits) {

    const radarId = inputs.radarId;
    const direction = inputs.direction;
    const startDay = inputs.startDay;
    const endDay = inputs.endDay;
    const sql = `
    SELECT 
      ROUND(SUM(tooFast) / SUM(numberVehicles), 2) AS speedingQuote,
      ROUND(SUM(avgKmh * numberVehicles) / SUM(numberVehicles), 2) AS avgSpeed,
      WEEKDAY(recordaggregated.date) as weekday,
      recordaggregated.date as date,
      hour,
      SUM(numberVehicles) AS count
  FROM
      recordaggregated
          INNER JOIN
      radar ON radar.id = recordaggregated.radar
  WHERE direction = $1
      AND recordaggregated.radar = $2
      AND recordaggregated.date >= $3 AND recordaggregated.date < $4
  GROUP BY WEEKDAY(recordaggregated.date)
  `;

    const data = await sails.sendNativeQuery(sql, [direction, radarId, startDay, endDay]);
    return exits.success(data.rows)

  }


};
