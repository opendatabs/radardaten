module.exports = {


  friendlyName: 'Get record for daily view',


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
    }
  },


  exits: {

  },


  fn: async function (inputs, exits) {

    const radarId = inputs.radarId;
    const direction = inputs.direction;
    const startDay = inputs.startDay;
    const sql = `
    SELECT ROUND(tooFast / numberVehicles, 2) as speedingQuote,
  avgKmh as avgSpeed,
  hour,
  numberVehicles as count
    FROM recordaggregated INNER JOIN radar ON radar.id = recordaggregated.radar
    WHERE direction = $1
    AND recordaggregated.radar = $2
	AND recordaggregated.date = $3
    GROUP BY hour
  `;

    const data = await sails.sendNativeQuery(sql, [direction, radarId, startDay, endDay]);
    return exits.success(data.rows)

  }


};
