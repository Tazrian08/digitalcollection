import React, { useState } from 'react';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const AddProduct: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    brand: '',
    category: '',
    stock: '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    images.forEach((img, idx) => data.append('images', img));
    try {
      const res = await fetch(`${apiBaseUrl}/api/products`, {
        method: 'POST',
        body: data,
      });
      if (res.ok) {
        setMessage('Product added!');
        setForm({ name: '', description: '', price: '', brand: '', category: '', stock: '' });
        setImages([]);
      } else {
        setMessage('Error adding product');
      }
    } catch {
      setMessage('Network error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 flex items-center justify-center">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-sky-200 p-10 w-full max-w-lg">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent mb-8 text-center">
          Add Product
        </h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-5">
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="brand"
            placeholder="Brand"
            value={form.brand}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Category</option>
            <option value="Camera">Camera</option>
            <option value="Lens">Lens</option>
            <option value="Accessory">Accessory</option>
          </select>
          <input
            name="stock"
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 rounded-2xl font-bold text-lg shadow-lg hover:from-sky-600 hover:to-blue-700 transition-all duration-300"
          >
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </form>
        {message && <p className="mt-4 text-center text-lg font-semibold text-sky-700">{message}</p>}
      </div>
    </div>
  );
};

export default AddProduct;
