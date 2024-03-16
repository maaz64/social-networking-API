const express = require ('express');
const passport = require('passport');
const router = express.Router();


router.use('/users',require('./user'));
router.use('/post',passport.authenticate('jwt',{session:false}),require('./post'));
router.use('/follower',passport.authenticate('jwt',{session:false}),require('./follower'));

router.get('/',(_,res)=>{
    res.status(200).json({
        message:"Success"
    })
})


module.exports = router;
