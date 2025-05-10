const express = require('express');
const router = express.Router();
const pageviewsModel = require('../models/page-views');
const eventsModel = require('../models/event-tracking');

router.get('/', (req, res)=>{
    res.send("Hello events");
})

router.post('/views', async (req, res)=>{
    let {client_id, event_type, timestamp} = req.body;
    const newViewEntry = await pageviewsModel.create({
        clientId: client_id,
    })
})

router.post('/signups', async (req, res)=>{
    let {client_id, event_type, timestamp} = req.body;
    console.log(client_id, event_type, timestamp);
    const newEventEntry = await eventsModel.create({
        clientId:client_id,
        eventType : event_type
    })
    
});

router.get('/signup-count', async (req, res) => {
    const clientId = req.query.client_id;
    if (!clientId) return res.status(400).json({ error: 'client_id is required' });
  
    try {
      const signupCount = await eventsModel.countDocuments({
        clientId: clientId,
        eventType: 'signup'
      });
  
      res.json({ client_id: clientId, signupCount });
    } catch (err) {
      console.error("Error fetching signup count:", err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

module.exports = router;