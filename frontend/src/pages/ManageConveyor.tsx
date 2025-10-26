import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

type Img = { _id: string; path: string; caption?: string };

const ManageConveyor: React.FC = () => {
  const { token, user } = useAuth();
  const [images, setImages] = useState<Img[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => { fetchList(); }, []);

  const fetchList = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/conveyor`);
      const data = await res.json();
      setImages(data.images || []);
    } catch (err) { console.warn(err); }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setMsg('Select a file');
    setLoading(true); setMsg('');
    const fd = new FormData();
    fd.append('image', file);
    fd.append('caption', caption);
    const res = await fetch(`${apiBaseUrl}/api/conveyor/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: fd
    });
    const data = await res.json();
    if (res.ok) {
      setMsg('Uploaded');
      setFile(null); setCaption('');
      fetchList();
    } else setMsg(data.message || 'Upload failed');
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this image?')) return;
    try {
      const res = await fetch(`${apiBaseUrl}/api/conveyor/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      // robust response parsing
      let body: any = null;
      const ct = res.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        body = await res.json();
      } else {
        body = await res.text();
      }

      if (res.ok) {
        await fetchList();
        setMsg('');
      } else {
        setMsg(body?.message || String(body) || 'Delete failed');
      }
    } catch (err) {
      console.warn(err);
      setMsg('Network error while deleting');
    }
  };

  if (!user?.isAdmin) return <div className="bg-white rounded-lg shadow-md p-6">Unauthorized</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <h2 className="text-xl font-semibold">Manage Conveyor Images</h2>

      <form onSubmit={handleUpload} className="flex items-center space-x-4">
        <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} />
        <input type="text" placeholder="Caption (optional)" value={caption} onChange={e => setCaption(e.target.value)} className="border px-3 py-2 rounded" />
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {msg && <div className="text-sm text-red-600">{msg}</div>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {images.map(img => (
          <div key={img._id} className="border rounded p-2 flex flex-col items-center">
            <img src={`${apiBaseUrl}${encodeURI(img.path)}`} alt={img.caption} className="h-28 object-contain mb-2" />
            <div className="text-sm text-gray-700 mb-2">{img.caption}</div>
            <button onClick={() => handleDelete(img._id)} className="text-sm text-red-600">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageConveyor;