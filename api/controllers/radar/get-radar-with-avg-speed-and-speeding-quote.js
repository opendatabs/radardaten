module.exports = {


  friendlyName: 'Get radar with avg speed and speeding quote',


  description: '',


  inputs: {
  },


  exits: {
  },


  fn: async function (inputs, exits) {

    const radars = await Radar.find({}).populate('recordsAggregated');
    const aggregated = [];
    radars.forEach(r => {
      let totalNumberVehicles1 = 0;
      let totalNumberVehicles2 = 0;
      let sumAvg1 = 0;
      let sumAvg2 = 0;
      let sumTooFast1 = 0;
      let sumTooFast2 = 0;
      let maxTimeStamp = '1000-01-01';
      r.recordsAggregated.forEach(d => {
        if (d.direction === 1) {
          totalNumberVehicles1 += d.numberVehicles;
          sumAvg1 += d.avgKmh * d.numberVehicles;
          sumTooFast1 += d.tooFast;
        } else {
          totalNumberVehicles2 += d.numberVehicles;
          sumAvg2 += d.avgKmh * d.numberVehicles;
          sumTooFast2 += d.tooFast;
        }
        if (maxTimeStamp < d.date) maxTimeStamp = d.date;
      });
      // copy results to prevent returning all associations
      aggregated.push({
        id: r.id,
        streetName: r.streetName,
        long: r.long,
        lat: r.lat,
        directionOneLong: r.directionOneLong,
        directionOneLat: r.directionOneLat,
        directionTwoLong: r.directionTwoLong,
        directionTwoLat: r.directionTwoLat,
        speedLimit: r.speedLimit,
        recordCount: totalNumberVehicles1 + totalNumberVehicles2,
        avgDir1: Math.round(sumAvg1 / totalNumberVehicles1 * 100) / 100,
        avgDir2: Math.round(sumAvg2 / totalNumberVehicles2 * 100) / 100,
        speedingQuoteDir1: sumTooFast1 / totalNumberVehicles1,
        speedingQuoteDir2: sumTooFast2 / totalNumberVehicles2,
        count1: totalNumberVehicles1,
        count2: totalNumberVehicles2,
      });
    });
    return exits.success(aggregated);

  }


};
