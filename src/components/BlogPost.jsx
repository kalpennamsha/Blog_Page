import React, { useState } from "react";
import FormInput from "./FormInput";
import UpdateButton from "./UpdateButton";
import DeleteButton from "./DeleteButton";

function BlogPost() {
  const [posts, setPosts] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    author: "",
    description: "",
    imageUrl: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isUpdating) {
      const updatedPosts = posts.map((post) =>
        post.id === updatingId ? { ...formData, id: updatingId } : post
      );
      setPosts(updatedPosts);
      setIsUpdating(false);
      setUpdatingId(null);
    } else {
      const newPost = {
        ...formData,
        id: posts.length + 1,
        date: new Date().toLocaleDateString(),
      };
      setPosts([...posts, newPost]);
    }
    setFormData({
      id: "",
      author: "",
      description: "",
      imageUrl: "",
    });
  };

  const handleUpdate = (postId) => {
    const postToUpdate = posts.find((post) => post.id === postId);
    setFormData(postToUpdate);
    setIsUpdating(true);
    setUpdatingId(postId);
  };

  const handleDelete = (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      const updatedPosts = posts.filter((post) => post.id !== postId);
      setPosts(updatedPosts);
    }
  };

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit}>
          <FormInput
            name="id"
            label="ID"
            value={formData.id}
            onChange={handleChange}
            required
          />
          <FormInput
            name="author"
            label="Author"
            value={formData.author}
            onChange={handleChange}
            required
          />
          <FormInput
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <FormInput
            name="imageUrl"
            label="Image URL"
            value={formData.imageUrl}
            onChange={handleChange}
            required
          />
          <button type="submit">
            {isUpdating ? "Update Post" : "Add Post"}
          </button>
        </form>
      </div>
      <div className="im">
        {posts.map((post) => (
          <div className="img" key={post.id}>
            <img src={post.imageUrl} alt={post.title} />
            <p>ID={post.id}</p>
            <p>Author: {post.author} </p>
            <p>Date: {post.date}</p>
            <p>{post.description}</p>
            <UpdateButton onClick={() => handleUpdate(post.id)} />
            <DeleteButton onClick={() => handleDelete(post.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlogPost;
