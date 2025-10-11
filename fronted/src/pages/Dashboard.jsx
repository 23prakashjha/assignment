import React, { useEffect, useState, useCallback } from 'react';
import API from '../services/api';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [q, setQ] = useState('');
  const [form, setForm] = useState({ title: '', body: '' });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [error, setError] = useState(null);

  // Load current user profile
  const loadProfile = useCallback(async () => {
    setLoadingProfile(true);
    setError(null);
    try {
      const r = await API.get('/auth/me');
      setProfile(r.data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to load profile');
    } finally {
      setLoadingProfile(false);
    }
  }, []);

  // Load posts
  const loadPosts = useCallback(async (search = '') => {
    setLoadingPosts(true);
    setError(null);
    try {
      const r = await API.get('/posts', { params: { q: search } });
      setPosts(r.data.map((p) => ({ ...p, body: p.content })));
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to load posts');
    } finally {
      setLoadingPosts(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
    loadPosts();
  }, [loadProfile, loadPosts]);

  // Debounce search
  useEffect(() => {
    const id = setTimeout(() => loadPosts(q), 500);
    return () => clearTimeout(id);
  }, [q, loadPosts]);

  const add = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.title.trim()) return setError('Title is required.');

    try {
      await API.post('/posts', { title: form.title.trim(), body: form.body.trim() });
      setForm({ title: '', body: '' });
      loadPosts(q);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to add post');
    }
  };

  const del = async (id) => {
    setError(null);
    if (!window.confirm('Delete this post?')) return;

    try {
      await API.delete(`/posts/${id}`);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to delete post');
      loadPosts(q);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    window.location.replace('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-8">
      {/* Header */}
      <header className="max-w-5xl mx-auto mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-4">
          {loadingProfile ? (
            <span className="text-sm text-gray-500">Loading profile...</span>
          ) : (
            <span className="text-sm text-gray-700">
              👋 Hello,&nbsp;
              <strong className="text-blue-700">{profile?.name || 'User'}</strong>
            </span>
          )}
          <button
            onClick={logout}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white hover:bg-gray-100 shadow-sm transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto space-y-8">
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg shadow-sm text-sm">
            {error}
          </div>
        )}

        {/* Create Post */}
        <section className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            ✍️ Create a New Post
          </h2>
          <form onSubmit={add} className="space-y-4">
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Enter post title..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <textarea
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Write something (optional)..."
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              rows={4}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow transition"
              >
                Add Post
              </button>
            </div>
          </form>
        </section>

        {/* Search */}
        <section>
          <input
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition"
            placeholder="🔍 Search posts..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), loadPosts(q))}
          />
        </section>

        {/* Posts List */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">📰 Your Posts</h3>
            <div className="text-sm text-gray-500">{loadingPosts ? 'Loading...' : `${posts.length} post(s)`}</div>
          </div>

          <ul className="space-y-4">
            {posts.length === 0 && !loadingPosts && (
              <li className="text-center text-sm text-gray-500 italic py-4 bg-white rounded-lg shadow-sm">
                No posts found.
              </li>
            )}

            {posts.map((p) => (
              <li
                key={p.id}
                className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md border border-gray-100 transition"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  {/* Post content */}
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-800">{p.title}</h4>
                    {p.body && <p className="text-gray-600 mt-1 whitespace-pre-line">{p.body}</p>}
                    <time className="block text-xs text-gray-400 mt-2">
                      {new Date(p.createdAt).toLocaleString()}
                    </time>
                  </div>

                  {/* Delete button */}
                  <div className="flex-shrink-0 mt-2 sm:mt-0">
                    <button
                      onClick={() => del(p.id)}
                      className="px-3 py-1 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
