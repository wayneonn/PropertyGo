const express = require('express');
const router = express.Router({ mergeParams: true });

const {
   getAllResponses, addResponse, editResponse, deleteResponse
} = require('../../controllers/admin/responseController');

router.route('/')
    .get(getAllResponses)
    .post(addResponse);

router.route('/:id')
    .patch(editResponse)
    .delete(deleteResponse);
    
module.exports = router;