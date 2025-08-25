import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const AddAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }
      try {
        const res = await fetch(`${apiBaseUrl}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!data.isAdmin) {
          navigate('/admin/login');
        }
      } catch {
        navigate('/admin/login');
      }
    };
    checkAdmin();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('adminToken');
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
      setForm({ name: '', email: '', password: '' });
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
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Add Admin</button>
      </form>
    </div>
  );
};

export default AddAdmin;