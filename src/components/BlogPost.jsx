import React, { useState, useEffect } from "react";
import FormInput from "./FormInput";
import UpdateButton from "./UpdateButton";
import DeleteButton from "./DeleteButton";

function isValidImageUrl(url) {
  const imageUrlPattern = /\.(jpg|jpeg|png|gif|webp)$/i;
  const base64Pattern = /^data:image\/(jpeg|png|gif);base64,/i;
  return imageUrlPattern.test(url) || base64Pattern.test(url);
}

function BlogPost() {
  const [posts, setPosts] = useState(() => {
    const storedPosts = localStorage.getItem("posts");
    return storedPosts ? JSON.parse(storedPosts) : [];
  });
  const [formData, setFormData] = useState({
    id: "",
    author: "",
    description: "",
    imageUrl: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(posts));
  }, [posts]);

  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}${month}${day}`;
  };

  const generateNextId = () => {
    const currentDate = getCurrentDate();
    const currentPosts = posts.filter((post) =>
      post.id.startsWith(currentDate)
    );
    const count = currentPosts.length + 1;
    return `${currentDate}${count.toString().padStart(4, "0")}`;
  };

  const getNextId = () => {
    const lastId = posts.length > 0 ? posts[posts.length - 1].id : "0000";
    const numericPart = parseInt(lastId.slice(-4));
    const nextNumericPart = numericPart + 1;
    return `${lastId.slice(0, 8)}${nextNumericPart
      .toString()
      .padStart(4, "0")}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "author") {
      if (/[0-9~`!@#$%^&*()-_+={}[\]:;"'<>,.?/\\|]/.test(value)) {
        alert("Only characters are allowed");
        const sanitizedValue = value.replace(
          /[0-9~`!@#$%^&*()-_+={}[\]:;"'<>,.?/\\|]/g,
          ""
        );
        setFormData({
          ...formData,
          [name]: sanitizedValue.substring(0, 10),
        });
      } else {
        setFormData({
          ...formData,
          [name]: value.substring(0, 10),
        });
      }
    } else if (name === "imageUrl") {
      if (!isValidImageUrl(value)) {
        alert(
          "Invalid image URL. Please provide a valid image URL ending with .jpg, .jpeg, or a valid Base64 encoded image."
        );
        return;
      }
      setFormData({
        ...formData,
        [name]: value,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
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
        id: generateNextId(),
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

  const handleDuplicate = (postId) => {
    const postToDuplicate = posts.find((post) => post.id === postId);
    const newPost = {
      ...postToDuplicate,
      id: getNextId(),
      date: new Date().toLocaleDateString(),
    };
    setPosts([...posts, newPost]);
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
    filterPosts(e.target.value);
  };

  const filterPosts = (query) => {
    const filtered = posts.filter(
      (post) =>
        post.author.toLowerCase().includes(query.toLowerCase()) ||
        post.description.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPosts(filtered);
  };

  const postsToDisplay = searchQuery ? filteredPosts : posts;

  return (
    <div>
      <div>
        <div className="te">
          <input
            type="text"
            placeholder="Search by Author or Description"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </div>
        <div className="te">
          <form onSubmit={handleSubmit}>
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
            <button className="btn btn-info" type="submit">
              {isUpdating ? "Update Post" : "Add Post"}
            </button>
          </form>
        </div>
      </div>
      <div className="im">
        {postsToDisplay.map((post) => (
          <div className="img" key={post.id}>
            <img src={post.imageUrl} alt={post.title} />
            <p>ID={post.id}</p>
            <p>Author: {post.author} </p>
            <p>Date: {post.date}</p>
            <p>{post.description}</p>
            <UpdateButton onClick={() => handleUpdate(post.id)} />
            <DeleteButton onClick={() => handleDelete(post.id)} />
            <button
              className="btn btn-primary"
              onClick={() => handleDuplicate(post.id)}
            >
              Duplicate
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlogPost;
