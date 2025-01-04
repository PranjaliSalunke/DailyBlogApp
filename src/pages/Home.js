import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  const { role } = useLocation().state;

  const [searchTerm, setSearchTerm] = useState("");
  const [expandedPost, setExpandedPost] = useState(null);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState("");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [newPost, setNewPost] = useState({
    postName: "",
    postAuthor: "",
    content: "",
  });

  const [posts, setPosts] = useState([
    {
      postName: "Introduction to React",
      postAuthor: "John Doe",
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s...",
    },
    {
      postName: "Understanding JavaScript Closures",
      postAuthor: "Jane Smith",
      content:
        "Closures enable functions to remember their environment. They're a powerful feature for encapsulating and managing state in JavaScript.",
    },
    {
      postName: "Guide to Node.js and Express",
      postAuthor: "Alice Johnson",
      content:
        "Node.js is a runtime for executing JavaScript on the server. Express.js is a framework that simplifies building web applications on Node.",
    },
    {
      postName: "Guide to Java ",
      postAuthor: "James Gosling",
      content:
        "Java is a versatile programming language. SpringBoot simplifies backend development with powerful features and configurations.",
    },
    {
      postName: "Guide to SpringBoot",
      postAuthor: "James Gosling",
      content:
        "SpringBoot is a versatile programming language. SpringBoot simplifies backend development with powerful features and configurations.",
    },
  ]);

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const toggleExpand = (index) =>
    setExpandedPost(expandedPost === index ? null : index);

  const handleCommentChange = (e) => setNewComment(e.target.value);

  const handleCommentSubmit = (postIndex) => {
    const commenterName = JSON.parse(
      localStorage.getItem("userData")
    )?.username;

    if (newComment.trim() && commenterName) {
      setComments((prev) => ({
        ...prev,
        [postIndex]: [
          ...(prev[postIndex] || []),
          { text: newComment, user: commenterName },
        ],
      }));
      setNewComment("");
    } else {
      alert("Please fill in both comment and ensure you're logged in!");
    }
  };

  const handleCreatePostClick = () => {
    setShowCreatePost(true);
    setEditMode(false);
    setNewPost({ postName: "", postAuthor: "", content: "" });
  };

  const handlePostChange = (e) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreatePostSubmit = () => {
    if (newPost.postName && newPost.postAuthor && newPost.content) {
      if (editMode) {
        setPosts((prev) =>
          prev.map((post, index) =>
            index === editIndex ? { ...newPost } : post
          )
        );
      } else {
        setPosts((prev) => [newPost, ...prev]);
      }
      setShowCreatePost(false);
      setNewPost({ postName: "", postAuthor: "", content: "" });
      setEditMode(false);
    } else {
      alert("Please fill in all fields!");
    }
  };

  const handleDeletePost = (index) => {
    const updatedPosts = posts.filter((_, i) => i !== index);
    setPosts(updatedPosts);
  };

  const handleEditPost = (index) => {
    setEditMode(true);
    setEditIndex(index);
    setNewPost(posts[index]);
    setShowCreatePost(true);
  };

  const handleDeleteComment = (postIndex, commentIndex) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      setComments((prev) => {
        const updatedComments = { ...prev };
        updatedComments[postIndex].splice(commentIndex, 1);
        return updatedComments;
      });
    }
  };

  return (
    <div className="home-container">
      <h1 className="page-title">Welcome to My Daily Blogs</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {role === "admin" && (
        <div className="create-post-button-container">
          <button
            className="create-post-button"
            onClick={handleCreatePostClick}
          >
            Create Post
          </button>
        </div>
      )}

      {showCreatePost && (
        <div className="modal-overlay">
          <div className="create-post-modal">
            <h2>{editMode ? "Edit Post" : "Create a New Post"}</h2>
            <input
              type="text"
              name="postName"
              placeholder="Post Title"
              value={newPost.postName}
              onChange={handlePostChange}
            />
            <input
              type="text"
              name="postAuthor"
              placeholder="Author Name"
              value={newPost.postAuthor}
              onChange={handlePostChange}
            />
            <textarea
              name="content"
              placeholder="Post Content"
              value={newPost.content}
              onChange={handlePostChange}
            />
            <div className="modal-actions">
              <button onClick={handleCreatePostSubmit}>
                {editMode ? "Update Post" : "Submit"}
              </button>
              <button onClick={() => setShowCreatePost(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="posts-container">
        {posts
          .filter(
            (post) =>
              post.postName.toLowerCase().includes(searchTerm.toLowerCase()) ||
              post.content.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((post, index) => (
            <div className="post-card" key={index}>
              <h3>{post.postName}</h3>
              <p className="author">By {post.postAuthor}</p>
              <p className="content">
                {expandedPost === index
                  ? post.content
                  : `${post.content.substring(0, 150)}...`}
              </p>
              <span
                className="read-more-button"
                onClick={() => toggleExpand(index)}
              >
                {expandedPost === index ? "Show Less" : "Read More..."}
              </span>

              {role === "admin" && (
                <div className="post-actions">
                  <button
                    onClick={() => handleEditPost(index)}
                    className="edit-post-button"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePost(index)}
                    className="delete-post-button"
                  >
                    Delete
                  </button>
                </div>
              )}

              {/* Comment Section */}
              <div className="comment-section">
                <div className="comments-list">
                  {(comments[index] || []).map((comment, i) => (
                    <div key={i} className="comment">
                      <p>
                        <strong>{comment.user}: </strong>
                        {comment.text}
                      </p>
                      <text
                        className="delete-comment-button"
                        onClick={() => handleDeleteComment(index, i)}
                      >
                        Delete
                      </text>
                    </div>
                  ))}
                </div>
                <textarea
                  value={newComment}
                  onChange={handleCommentChange}
                  placeholder="Write a comment..."
                  className="comment-input"
                />
                <button
                  className="comment-submit"
                  onClick={() => handleCommentSubmit(index)}
                >
                  Submit Comment
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Home;
