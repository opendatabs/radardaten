const mysqldump = require('mysqldump');
const fs = require('fs');

let env = {};
let connection;
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development')
    env = require('./env/development');
else
    env = require('./env/production');
connection = env.dumpConnection;

module.exports.cron = {
    cronJob: {
        // ['seconds', 'minutes', 'hours', 'dayOfMonth', 'month', 'dayOfWeek']
        // schedule: '0 */2 * * * *', // Every two minutes
        schedule: '0 0 0 * * *', // Every day at midnight
        onTick: function () {
            let file = require('path').resolve(sails.config.appPath, './download/radarDump.sql');

            async function main() {
                await mysqldump({ connection, dumpToFile: file });
                console.log('Created new MYSQL Dump');
            }
            main().catch(error => console.error(error));
            // let promise = new Promise((resolve, reject) => {
            // const result = mysqldump({ connection });
            // resolve(result);
            // });
            // promise
            // .then(result => res.send(result))
            // .catch(reason => res.send('Error: ' + reason));
        }
    }
};