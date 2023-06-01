const routes = require('express').Router();
const House = require('../models/Houses');
const ProductUser = require('../models/ProductUser');
const axios = require('axios');
const amqp = require('amqplib');
const { URL } = require('url');

const params = new URL('amqps://ruvcjaov:snVYClXt5TVWRCIp72esmseCiha1RdCi@jackal.rmq.cloudamqp.com/ruvcjaov');

async function publish(method, body) {
  try {
    const connection = await amqp.connect(params.toString());
    const channel = await connection.createChannel();
    await channel.assertExchange('', 'direct', { durable: false });
    await channel.assertQueue('admin');

    channel.publish('', 'admin', Buffer.from(JSON.stringify(body)), { method });
    console.log('Message published');
    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.error('Error publishing message:', error);
  }
}


routes.get('/', async (req, res) => {
    try{
        const products = await House.find();
        res.json(products);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Failed to retrieve products'});
    }
});

routes.post('/:id/like', async (req, res) => {
    try{
        const { id } = req.params;
        const response = await axios.get('http://localhost:8000/api/user/');
        const user = response.data;
        const productUser = new ProductUser({user_id: user.id, product_id: id});
        await productUser.save();
        publish('product_liked', id);

        res.json({ message: 'success' });
  } catch (error) {
        console.error('Error liking product:', error);
        res.status(400).json({ error: 'You already liked this product' });
  }
});

module.exports = routes;