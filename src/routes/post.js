const express = require ('express');
const { createPost,getPost, updatePost, deletePost, getLatestPostsOfFollowedUser } = require('../controller/postController');
const router = express.Router();


router.post('/create-post/',createPost);
router.get('/get-a-post',getPost)
router.get('/',getLatestPostsOfFollowedUser);
router.patch('/',updatePost);
router.delete('/',deletePost);


module.exports = router;
