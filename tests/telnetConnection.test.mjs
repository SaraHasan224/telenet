// tests/telnetConnection.test.mjs
import { expect } from "chai";
import sinon from "sinon";
import net from "net";
import TelnetConnection from "../models/TelnetConnection.js";
import logger from "../views/Logger.js";

describe("TelnetConnection", () => {
  let client;
  let mockServer;
  let serverSocket;

  before((done) => {
    sinon.stub(logger, "info");
    sinon.stub(logger, "warn");
    sinon.stub(logger, "error");

    mockServer = net.createServer((socket) => {
      serverSocket = socket;
      logger.info("Mock server: New connection established");
    });

    // Start the mock server on port 3001
    mockServer.listen(3001, "127.0.0.1", () => {
      client = new TelnetConnection("127.0.0.1", 3001);
      client.connect(() => {
        logger.info("Client connected to the controller");
        done();
      });
    });
  });

  it("should log client connection", () => {
    expect(logger.info.calledWithMatch(/Client connected to the controller/)).to
      .be.true;
  });

  it("should log data received by the client", (done) => {
    client.onData((data) => {
      expect(
        logger.info.calledWithMatch(
          /Client received data from controller: Test data from server/
        )
      ).to.be.true;
      done();
    });

    serverSocket.write("Test data from server");
  });

  it("should log client disconnection", (done) => {
    client.onClose(() => {
      expect(
        logger.info.calledWithMatch(/Client connection to controller closed/)
      ).to.be.true;
      done();
    });

    serverSocket.end();
  });

  it("should log client error", (done) => {
    client.onError((error) => {
      expect(
        logger.error.calledWithMatch(/Client encountered an error: Test error/)
      ).to.be.true;
      done();
    });

    client.connection.emit("error", new Error("Test error"));
  });

  after((done) => {
    if (client.connection) client.destroy();
    if (mockServer) mockServer.close(done);

    sinon.restore();
  });
});
