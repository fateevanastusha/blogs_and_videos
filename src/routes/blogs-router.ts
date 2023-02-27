import { Router } from "express"
export const blogsRouter = Router()
import {Request, Response} from 'express'
import {Blog, Post} from "../types/types";
import {
    inputValidationMiddleware,
    blogValidationMiddleware,
    postValidationMiddleware,
    titleCheck,
    shortDescriptionCheck,
    contentCheck,
    nameCheck,
    descriptionCheck,
    websiteUrlCheck
} from "../middlewares/input-valudation-middleware"
import {blogsService} from "../domain/blogs-service";
import {postsService} from "../domain/posts-service";
import {param} from "express-validator";


export const basicAuth = require('express-basic-auth')
export const adminAuth = basicAuth({users: { 'admin': 'qwerty' }});

//GET - return all
blogsRouter.get('/', async (req: Request, res: Response) =>{
    let pageSize = +req.query.pageSize;
    let pageNumber = +req.query.pageNumber;
    let sortBy = "" + req.query.sortBy;
    let sortDirection
    if (req.query.sortDirection === "asc"){
        sortDirection = 1
    } else {
        sortDirection = -1
    }
    if (!req.query.pageSize){
        pageSize = 10
    }
    if (!req.query.pageNumber){
        pageNumber = 1
    }
    if (!req.query.sortBy){
        sortBy = "createdAt"
    }
    let allBlogs = await blogsService.returnAllBlogs(pageSize, pageNumber, sortBy, sortDirection);
    res.status(200).send(allBlogs);
    return
});
//GET - return by ID
blogsRouter.get('/:id', async(req: Request, res: Response)=>{
    const foundBlog : Promise <Blog | null>= blogsService.returnBlogById(req.params.id);
    let blog : Blog | null = await foundBlog
    if (blog) {
        res.status(200).send(blog);
        return
    } else {
        res.sendStatus(404)
        return
    }
});
//DELETE - delete by ID
blogsRouter.delete('/:id', adminAuth, async(req: Request, res: Response) => {
    let status = await blogsService.deleteBlogById(req.params.id);
    if (status){
        res.sendStatus(204);
        return
    } else {
        res.sendStatus(404)
        return
    }
});
//POST - create new
blogsRouter.post('/',
    adminAuth,
    nameCheck,
    descriptionCheck,
    websiteUrlCheck,
    inputValidationMiddleware,
    async(req: Request, res: Response)=> {
        console.log(req.body, 'request body params')
    const newBlog : Blog| null = await blogsService.createNewBlog(req.body);
        console.log(newBlog, 'created  a new staff')
    res.status(201).send(newBlog);
    return
});
//PUT - update
blogsRouter.put('/:id', adminAuth, nameCheck, descriptionCheck, websiteUrlCheck, inputValidationMiddleware, async(req: Request, res: Response) => {
    const status : boolean = await blogsService.updateBlogById(req.body, req.params.id)
    if (status){
        res.sendStatus(204)
    } else {
        res.send(404)
    } 
});
//NEW - POST - create post for blog
blogsRouter.post('/:id/posts', adminAuth, titleCheck, shortDescriptionCheck, contentCheck, inputValidationMiddleware, async (req: Request, res: Response) => {
    const foundBlog : Blog | null = await blogsService.returnBlogById(req.params.id);
    if (foundBlog === null) {
        res.sendStatus(404)
    } else {
        const blogId = foundBlog.id;
        const blogName = foundBlog.name;
        const newPost : Post | null = await postsService.createNewPost(req.body, blogName, blogId);
        res.status(201).send(newPost)
    }
});
//NEW - GET - get all posts in blog
blogsRouter.get('/:id/posts', async (req: Request, res: Response) => {
    const blogId = req.params.id;
    const foundBlog : Blog | null = await blogsService.returnBlogById(blogId);
    if (!foundBlog) {
        res.sendStatus(404)
        return
    }
    const foundPosts : Post[] = await postsService.getAllPostsByBlogId(blogId)
    if (foundPosts) {
        res.status(200).send(foundPosts)
        return
    } else {
        res.sendStatus(404)
        return
    }
});


