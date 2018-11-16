const mysqldump = require('mysqldump');
const fs = require('fs');


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
        schedule: '0 */2 * * * *',
        // schedule: '0 0 */2 * * *', // Every night at 2AM
        onTick: function () {
            let file = require('path').resolve(sails.config.appPath + '//' + './download/radarDump.sql')
            let file2 = require('path').resolve(sails.config.appPath, './download/radarDump.sql')
            let file3 = require('path').resolve(sails.config.appPath)
            let file4 = process.cwd()

            // if (fs.existsSync(file)) {
                console.log('Writing new MYSQL Dump...');
                // mysqldump({ connection, dumpToFile: file });
                console.log(file)
                console.log(file2)
                console.log(file3)
                console.log(file4)


            // } else {
                // console.log('File not Found');
            // }
            // fs.writeFile('./download/radarDump.sql', '', (err) => {
                // if (err) throw err;
                // console.log('Created new empty file');
            // });
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