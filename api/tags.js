const express = require('express');
const tagsRouter = express.Router();
const {getAllTags, getPostsByTagName} = require('../db');

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    const {tagName} = req.params;
    try{
        const posts = await getPostsByTagName(tagName);

        const filtPosts = posts.filter(post => {
            if(post.active){
                return true;
            }

            if(req.user && post.author.id === req.user.id){
                return true;
            }

            return false;
        });

        res.send({posts: filtPosts});
    } catch ({name, message}) {
        next({name, message});
    }
});

tagsRouter.use((req, res, next) => {
    console.log("A request is being made to /tags");

    next();
});

tagsRouter.get('/', async (req, res) => {
    const tags = await getAllTags();
    
    res.send({
        tags
    });
});

module.exports = tagsRouter;