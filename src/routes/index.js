const express = require ('express');
const upload = require('../middleware/multerMiddleware');
const { signUp } = require('../Controller/userController');
const router = express.Router();


router.post('/register', upload.single('profile_pic'), signUp);

module.exports = router;
