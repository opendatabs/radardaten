const mysqldump = require('mysqldump');
const exec = require('child_process').exec;

module.exports.cron = {
    createMysqlDump: {
        // ['seconds', 'minutes', 'hours', 'dayOfMonth', 'month', 'dayOfWeek']
        // schedule: '0 */3 * * * *', // Every two minutes
        schedule: '0 0 * * * *', // Run daily at midnight
        onTick: function () {

            let connection = sails.config.custom.dump;

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
    },
    createTsv: {
        schedule: '0 0 * * * *', // Run daily at 2AM
        onTick: function () {
            async function main(table) {

                let connection = sails.config.custom.dump;

                // const table = table;
                let file = require('path').resolve(sails.config.appPath, `./download/${table}.tsv`);
                // Shell script that creats a TSV file in the /download foler
                const cmd = `mysql -u ${connection.user} -p${connection.password} -h ${connection.host} ${connection.database} -e "select * from ${table}" -B > ${file}`
                // run the script
                await exec(cmd, (error, stdout, stderr) => {
                    // command output is in stdout
                    console.log(`Created new TSV file for ${table}`);
                    if (stderr) {
                        console.error(`Problem for table "${table}" detected:`);
                        console.error(stderr)
                    }
                });
            }
            main('record').catch(error => console.error(error));
            main('radar').catch(error => console.error(error));
            main('radaraggregated').catch(error => console.error(error));
        }
    }
};
