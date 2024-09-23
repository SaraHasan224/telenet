const net = require("net");
const logger = require("../views/Logger");

class TelnetConnection {
  constructor(host, port) {
    this.host = host;
    this.port = port;
    this.connection = null;
  }

  connect(callback) {
    this.connection = net.createConnection(
      { host: this.host, port: this.port },
      callback
    );

    this.connection.on("data", (data) => {
      logger.info(`Client received data from controller: ${data}`);
      if (this.onDataCallback) this.onDataCallback(data); // Invoke callback if registered
    });

    this.connection.on("error", (error) => {
      logger.error(`Client encountered an error: ${error.message}`);
      if (this.onErrorCallback) this.onErrorCallback(error);
    });

    this.connection.on("close", () => {
      logger.info("Client connection to controller closed");
      if (this.onCloseCallback) this.onCloseCallback();
    });
  }

  onData(callback) {
    this.onDataCallback = callback;
  }

  onError(callback) {
    this.onErrorCallback = callback;
  }

  onClose(callback) {
    this.onCloseCallback = callback;
  }

  write(data) {
    this.connection.write(data);
  }

  destroy() {
    if (this.connection) this.connection.destroy();
  }
}

module.exports = TelnetConnection;
