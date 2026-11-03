import colors from "colors";
import app from "./app";
import config from "./config/index";
import { createServer } from "http";
// import { initializeSocket } from "./config/socket";

const port =
  typeof config.port === "number" ? config.port : Number(config.port);

const httpServer = createServer(app);
// const io = initializeSocket(httpServer);

httpServer.listen(port, () => {
  console.log(
    colors.green.bold(
      `DistalFlo AI Ltd Server is running on port http://${config.ip_address}:${port}`,
    ),
  );
});
