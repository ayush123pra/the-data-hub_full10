import { useState, useEffect } from 'react';

function App() {
  // This line dynamically sets the API URL. 
  // It uses the Vercel environment variable if deployed, otherwise it falls back to localhost.
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all posts from the backend
  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/posts`);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setPosts(data);
      } else {
        setPosts([]); 
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Handle form submission for creating or updating a post
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || !author) return alert('All fields are required!');

    const postData = { title, content, author };

    try {
      if (editId) {
        // Update existing post
        await fetch(`${API_URL}/posts/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData),
        });
        setEditId(null);
      } else {
        // Create a new post
        await fetch(`${API_URL}/posts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData),
        });
      }

      // Clear input fields and refresh the posts list
      setTitle('');
      setContent('');
      setAuthor('');
      fetchPosts();
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  // Handle deleting a post
  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/posts/${id}`, {
        method: 'DELETE',
      });
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  // Populate the form fields when editing a post
  const handleEditClick = (post) => {
    setEditId(post._id);
    setTitle(post.title);
    setContent(post.content);
    setAuthor(post.author);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#121212', color: '#ffffff', padding: '40px 20px', fontFamily: 'Segoe UI, sans-serif', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '650px', margin: '0 auto' }}>
        
        {/* Clean Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', margin: '0 0 8px 0', lineHeight: '1.3', color: '#ffffff' }}>
            The Data Hub
          </h1>
          <p style={{ margin: 0, fontSize: '1rem', color: '#a0a0a0' }}>
            MERN CRUD Application
          </p>
        </div>

        {/* Form Box */}
        <form onSubmit={handleSubmit} style={{ backgroundColor: '#1e1e1e', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', marginBottom: '35px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.25rem', color: '#f0f0f0' }}>
            {editId ? 'Edit Post' : 'Create New Post'}
          </h3>
          <input 
            type="text" 
            placeholder="Title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            style={{ width: '100%', padding: '10px 12px', marginBottom: '14px', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#2a2a2a', color: '#fff', boxSizing: 'border-box', outline: 'none' }} 
          />
          <textarea 
            placeholder="Content" 
            value={content} 
            rows="3"
            onChange={(e) => setContent(e.target.value)} 
            style={{ width: '100%', padding: '10px 12px', marginBottom: '14px', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#2a2a2a', color: '#fff', boxSizing: 'border-box', outline: 'none', resize: 'vertical' }} 
          />
          <input 
            type="text" 
            placeholder="Author" 
            value={author} 
            onChange={(e) => setAuthor(e.target.value)} 
            style={{ width: '100%', padding: '10px 12px', marginBottom: '18px', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#2a2a2a', color: '#fff', boxSizing: 'border-box', outline: 'none' }} 
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
              {editId ? 'Update Post' : 'Add Post'}
            </button>
            {editId && (
              <button type="button" onClick={() => { setEditId(null); setTitle(''); setContent(''); setAuthor(''); }} style={{ backgroundColor: '#4b5563', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer' }}>
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* All Posts Section */}
        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', borderBottom: '1px solid #2e2e2e', paddingBottom: '10px' }}>
          All Posts
        </h2>
        
        {loading ? (
          <p style={{ color: '#888' }}>Loading posts...</p>
        ) : posts.length === 0 ? (
          <p style={{ color: '#888' }}>No posts found. Create one above!</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '10px', marginBottom: '16px', border: '1px solid #2e2e2e' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.3rem', color: '#38bdf8' }}>{post.title}</h3>
              <p style={{ margin: '0 0 14px 0', color: '#d1d5db', lineHeight: '1.5' }}>{post.content}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>By: {post.author}</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleEditClick(post)} style={{ backgroundColor: '#eab308', color: '#000', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}>Edit</button>
                  <button onClick={() => handleDelete(post._id)} style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}>Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;