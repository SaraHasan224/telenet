// tests/telnetController.test.mjs
import { expect } from "chai";
import sinon from "sinon";
import net from "net";
import TelnetController from "../controllers/TelnetController.js";
import logger from "../views/Logger.js";

describe("TelnetController", () => {
  let server;
  let clientSocket;

  before((done) => {
    sinon.stub(logger, "info");
    sinon.stub(logger, "warn");
    sinon.stub(logger, "error");

    server = new TelnetController();

    setTimeout(() => {
      clientSocket = new net.Socket();
      clientSocket.connect(3000, "127.0.0.1", () => {
        done();
      });
    }, 500);
  });

  it("should log server creation", () => {
    expect(logger.info.calledWithMatch(/Server created/)).to.be.true;
  });

  it("should log a new connection to the server", (done) => {
    setTimeout(() => {
      expect(
        logger.info.calledWithMatch(/New connection to the server established/)
      ).to.be.true;
      done();
    }, 200);
  });

  it("should log data received by the server", (done) => {
    clientSocket.write("Test data from device");

    setTimeout(() => {
      expect(logger.info.calledWithMatch(/Server received data from device/)).to
        .be.true;
      done();
    }, 200);
  });

  it("should log server disconnection", (done) => {
    clientSocket.end();

    setTimeout(() => {
      expect(logger.info.calledWithMatch(/Server connection to device closed/))
        .to.be.true;
      done();
    }, 200);
  });

  after((done) => {
    clientSocket.destroy();
    server.server.close(done);
    sinon.restore();
  });
});
