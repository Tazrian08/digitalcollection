import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const AddAd: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', subtitle: '', link: '' });
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

    useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!user?.isAdmin) navigate('/account');
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setImage(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!image) {
      setError('Image is required');
      return;
    }
    const data = new FormData();
    data.append('title', form.title);
    data.append('subtitle', form.subtitle);
    data.append('link', form.link);
    data.append('image', image);
    try {
      const res = await fetch(`${apiBaseUrl}/api/ads/add`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: data
      });
      if (!res.ok) throw new Error('Failed to add ad');
      setSuccess('Ad added successfully!');
      setForm({ title: '', subtitle: '', link: '' });
      setImage(null);
    } catch (err: any) {
      setError(err.message || 'Failed to add ad');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-blue-100">
      <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-sky-200 p-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent mb-8 text-center">
          Add New Advertisement
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
          <input name="title" type="text" placeholder="Title" value={form.title} onChange={handleChange} required className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input name="subtitle" type="text" placeholder="Subtitle" value={form.subtitle} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input name="link" type="text" placeholder="Link (optional)" value={form.link} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="file" accept="image/*" onChange={handleImageChange} required className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {error && <div className="text-red-500 text-center">{error}</div>}
          {success && <div className="text-green-500 text-center">{success}</div>}
          <button type="submit" className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:from-sky-600 hover:to-blue-700 transition-all duration-300">
            Add Advertisement
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAd;