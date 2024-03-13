const express = require ('express');
const upload = require('../middleware/multerMiddleware');
const { signUp, login } = require('../Controller/userController');
const router = express.Router();


router.post('/register', upload.single('profile_pic'), signUp);
router.post('/login', login);

module.exports = router;
