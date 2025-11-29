require("dotenv").config();
const httpServer = require("http-server");
const path = require("path");

const directory = process.env.HTTP_SERVER_MEDIA_DIRECTORY;
const absolutePath = path.resolve(directory);

const server = httpServer.createServer({
  root: absolutePath,
  cache: -1,
});

server.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});
