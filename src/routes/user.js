const express = require ('express');
const upload = require('../middleware/multerMiddleware');
const passport = require('passport')
const { signUp, login, getAUserFollowerAndFollowing } = require('../Controller/userController');
const router = express.Router();


router.post('/register', upload.single('profile_pic'), signUp);
router.post('/login', login);
router.get('/',passport.authenticate('jwt',{session:false}),getAUserFollowerAndFollowing )

module.exports = router;
