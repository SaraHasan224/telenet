require("dotenv").config();

module.exports = {
  SERVER_PORT: process.env.SERVER_PORT || 3000,
  CONTROLLER_IP: process.env.CONTROLLER_IP || "127.0.0.1",
  TELNET_PORT: process.env.TELNET_PORT || 23,
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
};
