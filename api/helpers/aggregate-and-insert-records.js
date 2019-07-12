const moment = require('moment');

module.exports = {


  friendlyName: 'Aggregate and insert records',


  description: '',


  inputs: {
    records: {
      type: 'ref',
      required: true
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },
    serverError: {
      description: 'something went wrong'
    }

  },


  fn: async function (inputs, exits) {
    const records = inputs.records;
    const aggregated = [];
    const radar = await Radar.find({id: records[0].radar}).limit(1);
    const speedLimit = radar[0].speedLimit;
    records.forEach(r => {
      let date = moment(r.timestamp).format('YYYY-MM-DD');
      let hour = moment(r.timestamp).format('HH');
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
    try {
      const created = await RecordAggregated.createEach(aggregated).fetch();
      return exits.success(created)
    } catch (e) {
      console.error(e.stack);
      return exits.serverError(e)
    }
  }


};

