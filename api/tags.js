const express = require('express');
const tagsRouter = express.Router();
const {getAllTags, getPostsByTagName} = require('../db/index');

tagsRouter.use((req, res, next) => {
    console.log('a request is being made to /tags')
    next();
})

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    const tagName = req.params
    console.log('this is tag name', tagName)
    try {
        const tagPost = await getPostsByTagName(tagName)
        console.log('this is tagPost', tagPost)
        res.send({
        posts: tagPost
        })
    } catch ({name, message}) {
        next({
            name: 'ErrorGettingTags',
            message: 'failed to get tags'
        })
    }
})

tagsRouter.get('/', async (req, res) => {
    try {
    const tags = await getAllTags();
    res.send({
        tags
    })
    } 
    catch (error) {
        console.log(error)
    }
})

module.exports = tagsRouter;