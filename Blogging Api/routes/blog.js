const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const authMiddleware = require("../middleware/authMiddleware");

// Protect routes with authentication
router.use(authMiddleware);

router.post("/create", blogController.create);
router.put("/update/:blogId", blogController.update);
router.delete("/delete/:blogId", blogController.delete);

router.put("/change-state/:blogId", blogController.changeState);
router.get("/published", blogController.getPublishedBlogs);
router.get("/view/:blogId", blogController.viewBlog);

module.exports = router;
