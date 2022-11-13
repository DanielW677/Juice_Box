const express = require('express')
const postsRouter = express.Router();
const {getAllPosts, createPost, getPostById,} = require('../db/index')
const { requireUser } = require('./utils')
const { updatePost } = require('../db/index')

postsRouter.use((req, res, next) => {
    console.log('a request is being made to /posts')
    next()
})

postsRouter.post('/', requireUser, async (req, res, next) => {
    const { title, content, tags = "" } = req.body;
    const tagArr = tags.trim().split(/\s+/)
    const postData = {}

    if(tagArr.length){
        postData.tags = tagArr
    }
    try {
        postData.authorId = req.user.Id
        postData.title = title
        postData.content = content
        const post = await createPost(postData)
        if(post){
            res.send({ post })
        } else {
            res.send({
                name: 'PostGetError',
                message: 'Failed to get posts'
                
            })
        }
    } catch ({name, message}) {
        next({ name, message})
    }
})

postsRouter.get('/', async (req, res) => {
    try {
        const posts = await getAllPosts();
        res.send({
            posts
        })
    } catch (error) {
        console.log(error)
    }
})

postsRouter.patch('/:postId', requireUser, async (req, res, next) => {
    const {postId} = req.params
    const { title, content, tags }= req.body

    const updateFields = {};
    if(tags && tags.length > 0){
        updateFields.tags = tags.trim().split(/\s+/);
    }
    if(title) {
        updateFields.title = title
    }
    if(content){
        updateFields.content = content
    }
    try {
        const originalPost = await getPostById(postId)
        if(originalPost.author.id === req.user.id){
            const updatedPost = await updatePost(postId, updateFields);
            res.send({post: updatedPost})
        }else{
            next({name: 'UnauthorizedUserError', message: 'You cannot update a post that is not yours'
        })
        }
    } catch ({name, message}) {
        next({name, message})
    }
})

postsRouter.delete('/:postId', requireUser, async (req, res, next) => {
    try {
        const post = await getPostById(req.params.postId)

        if(post && post.author.id === req.user.id){
            const updatedPost = await updatePost(post.id, { active: false })
            res.send({post: updatedPost})
        } else {
            next(post ? {
                name: 'UnauthorizedError',
                message: 'You can not delete a post that is not yours'
            }: {
                name: 'PostNotFoundError',
                message: 'That Post does not exists'
            })
        }
    } catch ({name, message}) {
        next({name, message})
    }
})

postsRouter.use((req, res, next) => {
    console.log('a request is being made to /posts')
    next();
})

postsRouter.get('/', async (req, res) => {
    try {
        const posts = await getAllPosts();
        res.send({
            posts
        })
    } catch (error) {
        console.log(error)
    }
    
   
})


module.exports = postsRouter