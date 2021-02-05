const winston = require('winston')
const {LoggingWinston} = require('@google-cloud/logging-winston');


const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'debug' ,
    transports: [
      new winston.transports.Console(),
      new LoggingWinston()
    ],
  });


  module.exports = {logger}