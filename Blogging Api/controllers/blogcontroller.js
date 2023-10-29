const Blog = require("../models/Blog");
const User = require("../models/User");

const blogController = {};

blogController.create = async (req, res) => {
  try {
    // Ensure the user is authenticated and retrieve the user ID from the JWT
    const userId = req.userData.userId;

    // Create a new blog post
    const { title, description, state, tags, body } = req.body;
    const blog = new Blog({
      title,
      description,
      author: userId,
      state,
      tags,
      body,
      read_count: 0, // Initialize read_count to 0
    });

    await blog.save();
    res.status(201).json({ message: "Blog created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Blog creation failed" });
  }
};

blogController.update = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const { title, description, state, tags, body } = req.body;

    // Update the blog post
    await Blog.findByIdAndUpdate(blogId, {
      title,
      description,
      state,
      tags,
      body,
    });

    res.json({ message: "Blog updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Blog update failed" });
  }
};

blogController.delete = async (req, res) => {
  try {
    const blogId = req.params.blogId;

    // Delete the blog post
    await Blog.findByIdAndRemove(blogId);

    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Blog deletion failed" });
  }
};

blogController.changeState = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const { state } = req.body;

    // Update the state of the blog
    await Blog.findByIdAndUpdate(blogId, { state });

    res.json({ message: "Blog state changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Blog state change failed" });
  }
};

blogController.getPublishedBlogs = async (req, res) => {
  try {
    // Fetch and return a list of published blogs
    const blogs = await Blog.find({ state: "published" }).exec();
    res.json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching published blogs" });
  }
};

// Calculate reading time based on the blog content
blogController.calculateReadingTime = (content) => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

module.exports = blogController;
