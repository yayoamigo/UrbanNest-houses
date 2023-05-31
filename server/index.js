const express = require('express');
const app = express();
const http = require("http");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const amqp = require('amqplib');
const consumeMessage = require('./routes/consumer') // Import the consumer function
const House = require('./models/house');
const ProductUser = require('./models/ProductUser');
const HousesRoute = require('./routes/houses');

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successful!"))
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

app.use('/api/houses', HousesRoute);

(async () => {
  const url = 'amqps://ruvcjaov:snVYClXt5TVWRCIp72esmseCiha1RdCi@jackal.rmq.cloudamqp.com/ruvcjaov';

  try {
    const connection = await amqp.connect(url);
    const channel = await connection.createChannel();

    const queue = 'main';

    await channel.assertQueue(queue, { durable: false });

    console.log('Waiting for messages...');

    channel.consume(queue, consumeMessage, { noAck: true });

    process.on('SIGINT', () => {
      channel.close();
      connection.close();
    });
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
  }
})();

server.listen(5000, () => {
  console.log("Backend server is running!");
});
