const express = require('express');
const app = express();
const http = require("http"); // Library for creating an HTTP server
const mongoose = require("mongoose"); // Library for connecting to MongoDB
const helmet = require("helmet"); // Library for setting HTTP headers to improve security
const morgan = require("morgan"); // Library for logging HTTP requests
const dotenv = require("dotenv"); // Library for loading environment variables
const cors = require("cors"); // Library for allowing cross-origin resource sharing

dotenv.config(); // Load environment variables from .env file

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successfull!"))
  .catch((err) => {
    console.log(err);
  });



const server = http.createServer(app);

const corsOptions = {
  origin: '*',
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "token"],
};

app.use(cors(corsOptions));
app.use(morgan("common"));

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "img-src": ["'self'", "data:", "blob:"],
      },
    },
  })
);

app.use(express.json({ limit: "50mb" }));

server.listen(5000, () => {
    console.log("Backend server is running!");
  });
  