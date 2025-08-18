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
    // compatibility left empty
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
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
        <input name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} required />
        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="">Select Category</option>
          <option value="Camera">Camera</option>
          <option value="Lens">Lens</option>
          <option value="Accessory">Accessory</option>
        </select>
        <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required />
        <input type="file" name="images" multiple accept="image/*" onChange={handleImageChange} />
        <button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Product'}</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddProduct;
