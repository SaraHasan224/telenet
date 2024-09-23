const logger = require("../views/Logger");

class TelnetService {
  processData(data) {
    logger.info(`Processing data: ${data}`);
    return data;
  }
}

module.exports = TelnetService;
