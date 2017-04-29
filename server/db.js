'use strict'

/**

 Postgres Datbase client.

 */

const pgp = require('pg-promise')();
const config = {
  host:      process.env.RDS_HOSTNAME,
  port:      process.env.RDS_PORT,
  user:      process.env.RDS_USERNAME,
  password:  process.env.RDS_PASSWORD,
  database:  'dev'
};

var db = pgp(config);

module.exports = db;