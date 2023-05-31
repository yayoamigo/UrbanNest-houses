const amqp = require('amqplib');

const url = 'amqps://ruvcjaov:snVYClXt5TVWRCIp72esmseCiha1RdCi@jackal.rmq.cloudamqp.com/ruvcjaov';

amqp.connect(url, (error, connection) => {
  if (error) {
    throw error;
  }

  connection.createChannel((error, channel) => {
    if (error) {
      throw error;
    }

    const queue = 'admin';

    channel.assertQueue(queue, { durable: false });

    console.log('Waiting for messages...');

    channel.consume(queue, (message) => {
      console.log('Received in admin');
      console.log(message.content.toString());
    }, { noAck: true });

    process.on('SIGINT', () => {
      channel.close();
      connection.close();
    });
  });
});
