const express = require('express')
const router = express.Router()
const _ = require('lodash');
const axios = require('axios')

router.get("/api/blog-status", async (req, res) => {
    const url = 'https://intent-kit-16.hasura.app/api/rest/blogs';
    const headers = {
        'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
    };
    try {
        const blogs = (await axios.get(url, { headers })).data.blogs
        res.status(200).json({
            "Total Number of blogs": _.size(blogs),
            "Title of Longest blog": _.maxBy(blogs, (blog) => blog.title.length),
            "Number of blogs with privacy": _.filter(blogs, (blog) => {
                return _.includes(blog.title.toLowerCase(), 'privacy')
            }),
            "Arry of unique blog titles": _.uniqBy(blogs, 'title')
        })
    } catch (error) {
        console.error('Axios error:', error);
        if (error.response) {
            res.status(error.response.status).json(error.response.data)
        }
        else res.status(500).json({ message: "Internal Server Error" })
    }
})
router.get('/api/blog-search', async (req, res) => {
    const url = 'https://intent-kit-16.hasura.app/api/rest/blogs';
    const headers = {
        'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
    };
    try {
        const blogs = (await axios.get(url, { headers })).data.blogs
        const query = req.query.query.toLowerCase();
        const searchResults = _.filter(blogs, (blog) =>
            _.includes(blog.title.toLowerCase(), query)
        );
        res.status(200).json(searchResults);
    } catch (error) {
        console.error('Axios error:', error);
        if (error.response) {
            res.status(error.response.status).json(error.response.data)
        }
        else res.status(500).json({ message: "Internal Server Error" })
    }
});

module.exports = { router }