import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const positions = [
  { value: 'topLeft', label: 'Top Left' },
  { value: 'topRight', label: 'Top Right' },
  { value: 'bottomLeft', label: 'Bottom Left' },
  { value: 'bottomRight', label: 'Bottom Right' },
];

const ManageQuadAds: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [ads, setAds] = useState<Record<string, any[]>>({
    topLeft: [],
    topRight: [],
    bottomLeft: [],
    bottomRight: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ position: 'topLeft' });
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Only redirect if user is loaded and not admin
    if (user && !user.isAdmin) {
      navigate('/account');
      return;
    }
    if (!user) return; // Wait for user to load
    const fetchAds = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/quad-ads`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setAds(data.ads || {});
      } catch {
        setError('Failed to fetch quad ads');
      }
      setLoading(false);
    };
    fetchAds();
  }, [user, token, navigate]);

  const handleDelete = async (id: string, position: string) => {
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${apiBaseUrl}/api/quad-ads/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete quad ad');
      setSuccess('Quad ad deleted successfully!');
      setAds({
        ...ads,
        [position]: ads[position].filter(ad => ad._id !== id)
      });
    } catch (err: any) {
      setError(err.message || 'Failed to delete quad ad');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, position: e.target.value });
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
    data.append('position', form.position);
    data.append('image', image);
    try {
      const res = await fetch(`${apiBaseUrl}/api/quad-ads/add`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: data
      });
      if (!res.ok) throw new Error('Failed to add quad ad');
      const newAd = await res.json();
      setSuccess('Quad ad added successfully!');
      setAds({
        ...ads,
        [form.position]: [newAd, ...ads[form.position]]
      });
      setImage(null);
    } catch (err: any) {
      setError(err.message || 'Failed to add quad ad');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-sky-50 to-blue-100 py-10">
      <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-sky-200 p-8 mb-10">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent mb-8 text-center">
          Add Quad Slider Image
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
          <select
            name="position"
            value={form.position}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {positions.map(pos => (
              <option key={pos.value} value={pos.value}>{pos.label}</option>
            ))}
          </select>
          <input type="file" accept="image/*" onChange={handleImageChange} required className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {error && <div className="text-red-500 text-center">{error}</div>}
          {success && <div className="text-green-500 text-center">{success}</div>}
          <button type="submit" className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:from-sky-600 hover:to-blue-700 transition-all duration-300">
            Add Image
          </button>
        </form>
      </div>
      <div className="w-full max-w-3xl bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-sky-200 p-8">
        <h2 className="text-2xl font-bold text-center mb-8">Manage Quad Slider Images</h2>
        {positions.map(pos => (
          <div key={pos.value} className="mb-8">
            <h3 className="font-bold text-lg mb-4">{pos.label}</h3>
            {ads[pos.value]?.length === 0 ? (
              <div className="text-gray-600 mb-4">No images for this position.</div>
            ) : (
              <ul className="flex flex-wrap gap-6">
                {ads[pos.value].map(ad => (
                  <li key={ad._id} className="flex flex-col items-center bg-sky-50 rounded-xl p-4 shadow">
                    <img
                      src={`${apiBaseUrl}${ad.image}`}
                      alt={pos.label}
                      className="h-24 w-36 object-contain rounded-xl border mb-2"
                    />
                    <button
                      onClick={() => handleDelete(ad._id, pos.value)}
                      className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageQuadAds;