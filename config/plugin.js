'use strict';

const path = require('path');

module.exports = {
  validate: {
    enable: true,
    package: 'egg-validate',
  },
  sequelize: {
    enable: true,
    package: 'egg-sequelize'
  },
  redis: {
    enable: true,
    package: 'egg-redis'
  },
  nunjucks: {
    enable: true,
    package: 'egg-view-nunjucks',
  },
  cors: {
    enable: true,
    package: 'egg-cors',
  },
  passport: {
    enable: true,
    package: 'egg-passport',
  },
  // oauth2Server = {
  //   enable: true,
  //   package: 'egg-oauth2-server',
  // },
  // schedule: {
  //   enable: true,
  //   path: path.join(__dirname, '../lib/plugin/schedule')
  // },
  // logrotator: {
  //   enable: true,
  //   path: path.join(__dirname, '../lib/plugin/logrotator')
  // },
  // io: {
  //   enable: true,
  //   path: path.join(__dirname, '../lib/plugin/io')
  // }
};
