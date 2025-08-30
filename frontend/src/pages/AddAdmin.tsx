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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-blue-100">
      <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-sky-200 p-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent mb-8 text-center">
          Add New Admin
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input name="name" type="text" placeholder="Name" value={form.name} onChange={handleChange} required className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input name="phone" type="text" placeholder="Phone Number" value={form.phone} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <textarea name="address" placeholder="Address" value={form.address} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {error && <div className="text-red-500 text-center">{error}</div>}
          {success && <div className="text-green-500 text-center">{success}</div>}
          <button type="submit" className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:from-sky-600 hover:to-blue-700 transition-all duration-300">
            Add Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAdmin;