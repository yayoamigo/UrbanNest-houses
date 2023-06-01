// consumer.js

const House = require('../models/Houses');

async function consumeMessage(message) {
  console.log('Received in admin');
  console.log(message.content.toString());

  // Parse the message content as JSON
  const data = JSON.parse(message.content.toString());

  // Perform actions based on the content type
  if (message.properties.contentType === 'house_created') {
    const { id, title, image } = data;
    const house = new House({ id, title, image });
    try {
      await house.save();
      console.log('house Created');
    } catch (error) {
      console.error('Error creating house:', error);
    }
  } else if (message.properties.contentType === 'house_updated') {
    const { id, title, image } = data;
    try {
      await House.findOneAndUpdate({ id }, { title, image });
      console.log('house Updated');
    } catch (error) {
      console.error('Error updating house:', error);
    }
  } else if (message.properties.contentType === 'house_deleted') {
    const { id } = data;
    try {
      await House.findOneAndRemove({ id });
      console.log('house Deleted');
    } catch (error) {
      console.error('Error deleting house:', error);
    }
  }
}

module.exports = consumeMessage;
