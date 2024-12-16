const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const userRouter = require("./api/links/UserRouter");
const dotenv = require("dotenv");

const app = express();
const serverPort = process.argv[2] || 4000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", userRouter);

app.set("serverPort", serverPort);

// Load environment variables from .env file
dotenv.config();

console.log('Type "exit" to stop the server.');

process.stdin.on("data", (input) => {
  if (input === "exit") {
    console.log("Server is shutting down...");
    process.exit(0);
  }
});

app.listen(serverPort, () => {
  console.log(`Server is live at http://localhost:${serverPort}`);
});
