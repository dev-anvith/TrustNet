const express = require('express');
const router = express.Router();


router.get('/', (req, res)=>{
    res.send("Hello events");
})

router.post('/views', (req, res)=>{
    let {client_id, event_type, timestamp} = req.body;
    console.log(client_id, event_type, timestamp);
    
})

router.post('/signups', (req, res)=>{
    let {client_id, event_type, timestamp, metadata} = req.body;
    console.log(client_id, event_type, timestamp, metadata);
    
})

module.exports = router;