const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Endpoint to get information of the user by ID
//@ts-ignore
app.get('/user/:id', async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(req.params.id),
            },
        }); 
        res.json({ message: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

// Endpoint to get a post by ID for a specific user
//@ts-ignore
app.post('/post/:id', async (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        const userId = req.body.userId;

        // Find the post by ID
        const post = await prisma.post.findUnique({
            where: {
                id: postId,
            },
        });

        // Check if the post exists
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the post belongs to the user
        if (post.authorId !== userId) {
            return res.status(403).json({ message: 'Access forbidden' });
        }

        res.json({ message: 'Post retrieved successfully', post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

// Endpoint to delete a post
//@ts-ignore
app.delete('/delete/post/:id', async (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        const userId = req.body.userId;

        // Find the post by ID
        const post = await prisma.post.findUnique({
            where: {
                id: postId,
            },
        });

        // Check if the post exists
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the post belongs to the user
        if (post.authorId !== userId) {
            return res.status(403).json({ message: 'Access forbidden' });
        }

        // Delete the post
        await prisma.post.delete({
            where: {
                id: postId,
            },
        });

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

// Endpoint to get all posts for a specific user
//@ts-ignore
app.post('/posts', async (req, res) => {
    try {
        const userId = req.body.userId;

        // Fetch all posts for the specified user ID
        const posts = await prisma.post.findMany({
            where: {
                authorId: userId,
            },
        });

        if (posts.length === 0) {
            return res.status(404).json({ message: 'No posts found for this user' });
        }
        res.json({ message: 'Posts retrieved successfully', posts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

// Endpoint to create a new user
//@ts-ignore
app.post('/user/create', async (req, res) => {
    try {
        const newUser = await prisma.user.create({
            data: {
                email: req.body.email,
                name: req.body.name,
            },
        });
        res.json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

// Endpoint to create a new post for a user
//@ts-ignore
app.post('/post/user/create', async (req, res) => {
    try {
        const newPost = await prisma.post.create({
            data: {
                title: req.body.title,
                content: req.body.content,
                authorId: req.body.userId,
            },
        });
        res.json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
