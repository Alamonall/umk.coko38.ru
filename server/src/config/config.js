const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
console.log(
  'config: DATABASE: ',
  process.env.DB,
  'USER: ',
  process.env.DB_USER,
  'PASSWORD: ',
  process.env.DB_PASSWORD,
  'DIALECT: ',
  process.env.DB_DIALECT,
  'HOST: ',
  process.env.DB_HOST
);
module.exports = {
  port: process.env.PORT || 3000,
  db: {
    database: process.env.DB || 'umk',
    username: process.env.DB_USER || 'SA',
    password: process.env.DB_PASSWORD || 'bringmethehorizon2022!',
    options: {
      host: process.env.DB_HOST || 'localhost',
      instanceName: process.env.DB_INSTANCE || 'DESKTOP-5BD2SNK',
      dialect: process.env.DB_DIALECT || 'mssql',
    },
  },
  authentication: {
    jwtSecret: process.env.JWT_SECRET || 'secret',
  },
};
