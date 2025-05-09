const express = require('express');
const router = express.Router();

router.get('/', (req, res)=>{
    res.send("HELLO client");
})

module.exports = router;