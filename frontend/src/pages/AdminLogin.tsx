import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

    useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${apiBaseUrl}/api/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('adminToken', data.token);
      navigate('/admin/add');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Admin Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
        {error && <div className="text-red-500">{error}</div>}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;