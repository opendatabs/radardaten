const moment = require('moment');

module.exports = {


  friendlyName: 'Batch create',


  description: 'Creates all records of uploaded text file',


  inputs: {
    id: {
      type: 'number',
      required: true
    },
    text: {
      type: 'string',
      required: true
    }
  },


  exits: {
    serverError: {
      responseType: 'serverError'
    }
  },


  fn: async function (inputs, exits) {

    const matches = [];
    let aggregatedCount;
      try {
        const txt = inputs.text;
        const regex = /[0-2]\d\d\s[0-2]\d:[0-6]\d:[0-6]\d\s\d\d\.[01]\d\.[0-3]\d\s[012]\s\d*\.\d$/gm;
        let match = [];
        do {
          match = regex.exec(txt);
          if (match) {
            if (match.length) {
              const arr = match[0].split('\t');
              if (arr.length === 5) {
                const timestamp = moment([arr[2].slice(0, 6), '20', arr[2].slice(6)].join('') + " " + arr[1], 'DD.MM.YYYY HH:mm:ss').toDate();
                matches.push({
                  timestamp: timestamp,
                  kmh: Number(arr[0]),
                  length: Number(arr[4]),
                  weekday: moment(timestamp).format('dddd'),
                  direction: Number(arr[3]),
                  radar: inputs.id
                });
              }
            }
          }
        } while (match);
        aggregatedCount =  await sails.helpers.aggregateAndInsertRecords(matches);
      } catch(error) {
        console.error(error.stack);
        return exits.serverError({ error: 'Es ist ein Fehler aufgetreten: ' + error })
      }

      for (let i = 0; i < matches.length; i += 50) {
        try {
          await Record.createEach(matches.slice(i, i + 50));
        } catch (e) {
          console.error(e.stack);
          return exits.serverError({ error: 'Es ist ein Fehler beim Speichern der Daten aufgetreten: ' + e });
        }
        sails.sockets.broadcast(sails.sockets.getId(this.req), 'newRecords', {
          data: {
            progress: i / matches.length,
            recordsCreated: i
          }
        });
      }
      return exits.success({ foundMatches: matches.length, aggregatedMatches: aggregatedCount});

  }


};
