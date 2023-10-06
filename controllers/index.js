const express = require('express')
const router = express.Router()
const _ = require('lodash');
const axios = require('axios');

// cache the get blog status request using lodash memoize function 
const getBlogs =  async () => {
    const url = process.env.URL 
    const headers = {
        'x-hasura-admin-secret': process.env.SECRET,
    };
    const blogs = (await axios.get(url, { headers })).data.blogs
    console.log("Out of cache")
    return blogs
}
const getBlogStatus = _.memoize(async () => {
    // const url = process.env.URL;
    const blogs = await getBlogs()
    const response = {
        "Total Number of blogs": _.size(blogs),
        "Title of Longest blog": _.maxBy(blogs, (blog) => blog.title.length),
        "Number of blogs with privacy": _.filter(blogs, (blog) => {
            return _.includes(blog.title.toLowerCase(), 'privacy')
        }),
        "Arry of unique blog titles": _.uniqBy(blogs, 'title')
    }
    return response
})

const getSearch = _.memoize(async (query) => {
    const blogs = await getBlogs() 
    const searchResults = _.filter(blogs, (blog) =>
        _.includes(blog.title.toLowerCase(), query)
    );
    return searchResults
})

router.get("/api/blog-status", async (req, res) => {
    try {
        let status = await getBlogStatus()
        setTimeout(() => {
            if (getBlogStatus.cache.size > 0) getBlogStatus.cache.clear()
        }, Number(process.env.CLEARAFTER))
        res.status(200).json(status)
    } catch (error) {
        if (getBlogStatus.cache.size > 0) getBlogStatus.cache.clear()
        console.error('Axios error:', error);
        if (error.response) {
            res.status(error.response.status).json(error.response.data)
        }
        else res.status(500).json({ message: "Internal Server Error" })
    }
})

router.get('/api/blog-search', async (req, res) => {
    try {
        // let searchResults = await getSearch
        let searchResults = await getSearch(req.query.query.toLowerCase()) 
        setTimeout(()=>{
            if(getSearch.cache.size > 0) getSearch.cache.clear()
        }, Number(process.env.CLEARAFTER))
        res.status(200).json(searchResults);
    } catch (error) {
        if (getBlogStatus.cache.size > 0) getBlogStatus.cache.clear()
        console.error('Axios error:', error);
        if (error.response) {
            res.status(error.response.status).json(error.response.data)
        }
        else res.status(500).json({ message: "Internal Server Error" })
    }
});

module.exports = { router }