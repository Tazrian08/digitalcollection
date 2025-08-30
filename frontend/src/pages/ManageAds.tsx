import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const ManageAds: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

    useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/account');
      return;
    }
    const fetchAds = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/ads`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setAds(data.ads || []);
      } catch {
        setError('Failed to fetch ads');
      }
      setLoading(false);
    };
    fetchAds();
  }, [user, token, navigate]);

  const handleDelete = async (id: string) => {
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${apiBaseUrl}/api/ads/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete ad');
      setSuccess('Ad deleted successfully!');
      setAds(ads.filter(ad => ad._id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete ad');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-blue-100">
      <div className="w-full max-w-2xl bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-sky-200 p-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent mb-8 text-center">
          Manage Advertisements
        </h2>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        {success && <div className="text-green-500 text-center mb-4">{success}</div>}
        {ads.length === 0 ? (
          <div className="text-center text-gray-600">No ads found.</div>
        ) : (
          <ul className="space-y-6">
            {ads.map(ad => (
              <li key={ad._id} className="flex items-center gap-4 bg-sky-50 rounded-xl p-4 shadow">
                <img
                  src={`${apiBaseUrl}${ad.image}`}
                  alt={ad.title}
                  className="h-20 w-20 object-contain rounded-xl border"
                />
                <div className="flex-1">
                  <div className="font-bold text-lg">{ad.title}</div>
                  {ad.subtitle && <div className="text-gray-600">{ad.subtitle}</div>}
                  {ad.link && (
                    <a href={ad.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">
                      {ad.link}
                    </a>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(ad._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ManageAds;