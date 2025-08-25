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
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Add New Advertisement</h2>
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <input name="title" type="text" placeholder="Title" value={form.title} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
        <input name="subtitle" type="text" placeholder="Subtitle" value={form.subtitle} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
        <input name="link" type="text" placeholder="Link (optional)" value={form.link} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
        <input type="file" accept="image/*" onChange={handleImageChange} required className="w-full px-3 py-2 border rounded" />
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Add Advertisement</button>
      </form>
    </div>
  );
};

export default AddAd;