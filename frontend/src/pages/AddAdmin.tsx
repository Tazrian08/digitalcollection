import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const AddAdmin: React.FC = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/account');
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${apiBaseUrl}/api/auth/admin/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add admin');
      setSuccess('Admin added successfully!');
      setForm({ name: '', email: '', password: '', phone: '', address: '' });
      setTimeout(() => {
        navigate('/signin');
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to add admin');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Add New Admin</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" type="text" placeholder="Name" value={form.name} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
        <input name="phone" type="text" placeholder="Phone Number" value={form.phone} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
        <textarea name="address" placeholder="Address" value={form.address} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Add Admin</button>
      </form>
    </div>
  );
};

export default AddAdmin;