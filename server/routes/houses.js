const routes = require('express').Router();
const House = require('./models/house');
const ProductUser = require('./models/ProductUser');

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
        const response = await axios.get('http://docker.for.mac.localhost:8000/api/user');
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