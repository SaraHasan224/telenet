const winston = require("winston");
const config = require("../config/config");

const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "logs/telnet.log",
      maxsize: 1048576,
      maxFiles: 5,
    }),
  ],
});

module.exports = logger;
