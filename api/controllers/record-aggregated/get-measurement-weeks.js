module.exports = {


  friendlyName: 'Get measurement weeks',


  description: '',


  inputs: {
    radarId: {
      type: 'number',
      required: true
    },
    direction: {
      type: 'number',
      required: true
    }
  },


  exits: {

  },


  fn: async function (inputs, exits) {

    const radarId = inputs.radarId;
    const direction = inputs.direction;

    const sql = `SELECT DISTINCT weekofyear(recordaggregated.date) as week, MIN(recordaggregated.date) as startDay
FROM recordaggregated INNER JOIN radar ON radar.id = recordaggregated.radar
WHERE radar.id = $1
AND recordaggregated.direction = $2
GROUP BY week`;

    const data = await sails.sendNativeQuery(sql, [radarId, direction]);
    return exits.success(data.rows)

  }


};
