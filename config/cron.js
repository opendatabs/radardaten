const mysqldump = require('mysqldump');

let env = {};
let connection;
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    env = require('./env/development');
    connection = env.dumpConnection;
} else {
    env = require('./env/production');
    connection = env.dumpConnection;
}

module.exports.cron = {
    cronJob: {
        // ['seconds', 'minutes', 'hours', 'dayOfMonth', 'month', 'dayOfWeek']
        // schedule: '0 */5 * * * *',
        schedule: '0 0 */2 * * *', // Every night at 2AM
        onTick: function () {
            console.log('Creating new MYSQL Dump...');
            mysqldump({ connection, dumpToFile: './download/radarDump.sql'}); // Save dump as file
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