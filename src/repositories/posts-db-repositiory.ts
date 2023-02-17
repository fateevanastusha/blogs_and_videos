
import {postsCollection} from "../db/db";
import {Post} from "../types/types";
export const posts = [
    {
    id: "string",
    title: "string",
    shortDescription: "string",
    content: "string",
    blogId: "string",
    blogName : "string",
    createdAt: "string"
  }
];
export const postsRepository = {
  //return all posts
  async returnAllPost() : Promise<Post[]>{
    return postsCollection.find({}, {projection: {_id: 0}}).toArray()
  },
  //return post by Id
  async returnPostById(id: string) : Promise<Post | null>{
    const post : Post | null = await postsCollection.findOne({id : id}, {projection: {_id: 0}});
    return post;
  },
  //delete post by Id
  async deletePostById(id:string) : Promise<boolean>{
    const result = await postsCollection.deleteOne({id: id});
    return result.deletedCount === 1;
  },
  //delete all data
  async deleteAllData() {
    const result = await postsCollection.deleteMany({});
    return [];
    //return posts
  },
  //create new post
  async createNewPost(post: Post, blogName: string) : Promise <Post | null>{
    const newPost = {
      id: '' + (+(new Date())),
      title : post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: blogName,
      createdAt : new Date().toISOString()
    }
    await postsCollection.insertOne(newPost)
    return this.returnPostById(newPost.id)
  },
  //update post by id
  async updatePostById(post : Post, id : string) : Promise <boolean>{
    const result = await postsCollection.updateOne({id: id}, {$set :
      {
      title : post.title,
      shortDescription : post.shortDescription,
      content : post.content,
      blogId : post.blogId
      }
    })
    return result.matchedCount === 1

  }
};