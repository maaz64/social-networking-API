const express = require ('express');
const { followORUnfollowAUser } = require('../controller/followerController');
const router = express.Router();

router.post('/follow',followORUnfollowAUser);

module.exports = router;
