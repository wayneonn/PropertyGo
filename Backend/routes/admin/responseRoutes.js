const express = require('express');
const router = express.Router({ mergeParams: true });

const {
   getAllResponses
} = require('../../controllers/admin/responseController');

router.route('/')
    .get(getAllResponses);
    
module.exports = router;