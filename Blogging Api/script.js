document
  .getElementById("create-blog-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const title = document.getElementById("blog-title").value;
    const description = document.getElementById("blog-description").value;
    const body = document.getElementById("blog-body").value;

    try {
      const response = await fetch("/blog/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title,
          description,
          body,
          state: "draft",
        }),
      });
      const data = await response.json();
      if (response.status === 201) {
        alert("Blog created successfully!");
      } else {
        alert(`Blog creation failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Blog creation error:", error);
      alert("Blog creation failed.");
    }
  });

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/blog/published");
    const blogs = await response.json();
    const publishedBlogs = document.getElementById("published-blogs");
    blogs.forEach((blog) => {
      const li = document.createElement("li");
      li.textContent = blog.title;
      li.addEventListener("click", () => viewBlogDetails(blog));
      publishedBlogs.appendChild(li);
    });
  } catch (error) {
    console.error("Fetch published blogs error:", error);
  }
});

function viewBlogDetails(blog) {
  const titleDetails = document.getElementById("blog-title-details");
  const descriptionDetails = document.getElementById(
    "blog-description-details"
  );
  const bodyDetails = document.getElementById("blog-body-details");

  titleDetails.textContent = `Title: ${blog.title}`;
  descriptionDetails.textContent = `Description: ${blog.description}`;
  bodyDetails.textContent = `Content: ${blog.body}`;
}
