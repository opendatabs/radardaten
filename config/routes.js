/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {


  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/
  'post /Record/batchCreate': {
    action: 'record/batch-create'
  },
  'post /api/radar/addRadar' : {
    action: 'radar/add'
  },
  'put /api/radar/updateRadar' : {
    action: 'radar/update'
  },
  'get  /api/Radar/radarWithAvgSpeedAndSpeedingQuote' : {
    action: 'radar/get-radar-with-avg-speed-and-speeding-quote'
  },
  'post /api/record/addRecords' : {
    action: 'record/add'
  },
  'get /api/record/recordForWeeklyView' : {
    action: 'record-aggregated/get-record-for-weekly-view'
  },
  'get /api/record/recordForDailyView' : {
    action: 'record-aggregated/get-record-for-daily-view'
  },
  'get /api/record/measurementWeeks' : {
    action: 'record-aggregated/get-measurement-weeks'
  },
  'put /api/radar/updateRecordCount' : {
    action: 'radar/update-record-count'
  },
  'get /api/data/getMysqlDump' : {
    action: 'data/get-mysql-dump'
  },
  'get /api/data/getRecord' : {
    action: 'data/get-record-tsv'
  },
  'get /api/data/getRadar' : {
    action: 'data/get-radar-tsv'
  },
  'get /api/auth/auth': {
    action: 'auth/auth'
  },

  /**
   * Redirect to client side navigation
   */
  'GET /*': {
    action: 'homepage',
    skipAssets: true,
    skipRegex: /^(\/api)|(\/__getcookie)/
  },


};
