const net = require("net");
const TelnetConnection = require("../models/TelnetConnection");
const TelnetService = require("../services/TelnetService");
const logger = require("../views/Logger");
const config = require("../config/config");

class TelnetController {
  constructor() {
    this.telnetService = new TelnetService();
    this.startServer();
  }

  startServer() {
    this.server = net.createServer((socket) => {
      logger.info("New connection to the server established");
      this.createClientConnection(socket);

      socket.on("data", (data) => {
        logger.info(`Server received data from device: ${data}`);
        const processedData = this.telnetService.processData(data);
        if (this.client) {
          this.client.write(processedData);
        }
      });

      socket.on("error", (error) => {
        logger.error(`Server encountered an error: ${error.message}`);
      });

      socket.on("close", () => {
        logger.info("Server connection to device closed");
        if (this.client) {
          this.client.destroy();
        }
      });
    });

    this.server.listen(config.SERVER_PORT, () => {
      logger.info(
        `Server created and listening for connections on port ${config.SERVER_PORT}`
      );
    });
  }

  createClientConnection(deviceSocket) {
    this.client = new TelnetConnection(
      config.CONTROLLER_IP,
      config.TELNET_PORT
    );

    this.client.connect(() => {
      logger.info("Client connected to the controller");
    });

    this.client.onData((data) => {
      logger.info(`Client received data from controller: ${data}`);
      deviceSocket.write(data);
    });

    this.client.onError((error) => {
      logger.error(`Client encountered an error: ${error.message}`);
    });

    this.client.onClose(() => {
      logger.info("Client connection to controller closed");
      deviceSocket.destroy();
    });
  }
}

module.exports = TelnetController;
