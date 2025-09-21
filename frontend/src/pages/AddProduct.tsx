import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// Convert custom inline tags to safe HTML spans with classes:
// [blue]text[/blue] -> <span class="dc-blue">text</span>
// [xl]text[/xl], [lg]...[/lg], [sm]...[/sm] -> <span class="size-xl|lg|sm">text</span>
function preprocessDescription(input: string): string {
  return input
    .replace(/\[blue\]([\s\S]*?)\[\/blue\]/g, '<span class="dc-blue">$1</span>')
    .replace(/\[xl\]([\s\S]*?)\[\/xl\]/g, '<span class="size-xl">$1</span>')
    .replace(/\[lg\]([\s\S]*?)\[\/lg\]/g, '<span class="size-lg">$1</span>')
    .replace(/\[sm\]([\s\S]*?)\[\/sm\]/g, '<span class="size-sm">$1</span>');
}

// Allow span + class attribute in sanitize schema
const sanitizeSchema: any = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    span: [
      ...(defaultSchema.attributes?.span || []),
      ['className', 'dc-blue', 'size-xl', 'size-lg', 'size-sm'],
    ],
  },
};

const AddProduct: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    long_desc: '',
    price: '',
    brand: '',
    category: '',
    stock: '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const descRef = useRef<HTMLTextAreaElement | null>(null);
  const longDescRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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
    // Save raw description (with custom tags); ProductDetail will preprocess on render
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    images.forEach((img) => data.append('images', img));
    try {
      const res = await fetch(`${apiBaseUrl}/api/products`, {
        method: 'POST',
        body: data,
      });
      if (res.ok) {
        setMessage('Product added!');
        setForm({ name: '', description: '', long_desc: '', price: '', brand: '', category: '', stock: '' });
        setImages([]);
      } else {
        setMessage('Error adding product');
      }
    } catch {
      setMessage('Network error');
    }
    setLoading(false);
  };

  // --- Toolbar helpers ---
  const wrapSelection = (
    prefix: string,
    suffix?: string,
    ref?: React.RefObject<HTMLTextAreaElement>,
    field: 'description' | 'long_desc' = 'description'
  ) => {
    const ta = ref?.current;
    if (!ta) return;
    const start = ta.selectionStart ?? 0;
    const end = ta.selectionEnd ?? 0;
    const before = form[field].slice(0, start);
    const selected = form[field].slice(start, end);
    const after = form[field].slice(end);
    const sfx = suffix ?? prefix;
    const updated = `${before}${prefix}${selected || 'Your text here'}${sfx}${after}`;
    setForm((f) => ({ ...f, [field]: updated }));
    setTimeout(() => {
      const pos = (before + prefix + (selected || 'Your text here') + sfx).length;
      ta.focus();
      ta.setSelectionRange(pos, pos);
    }, 0);
  };

  const insertAtLineStart = (
    token: string,
    ref?: React.RefObject<HTMLTextAreaElement>,
    field: 'description' | 'long_desc' = 'description'
  ) => {
    const ta = ref?.current;
    if (!ta) return;
    const start = ta.selectionStart ?? 0;
    const end = ta.selectionEnd ?? 0;
    const content = form[field];
    const lineStart = content.lastIndexOf('\n', start - 1) + 1;
    const before = content.slice(0, lineStart);
    const sel = content.slice(lineStart, end);
    const after = content.slice(end);
    const updated = `${before}${token}${sel || 'Text'}\n` + after;
    setForm((f) => ({ ...f, [field]: updated }));
    setTimeout(() => {
      const pos = (before + token + (sel || 'Text') + '\n').length;
      ta.focus();
      ta.setSelectionRange(pos, pos);
    }, 0);
  };

  // For preview we preprocess to show colors/sizes, and we preserve whitespace
  const previewHtml = preprocessDescription(form.description);
  const longDescPreviewHtml = preprocessDescription(form.long_desc);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 flex items-center justify-center">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-sky-200 p-6 sm:p-10 w-full max-w-4xl">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent mb-6 text-center">
          Add Product
        </h2>

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Description Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Description (Markdown + custom tags)</label>
                <div className="flex items-center gap-2 text-xs">
                  <button type="button" onClick={() => wrapSelection('**', undefined, descRef, 'description')} className="px-2 py-1 rounded border hover:bg-gray-50" title="Bold">**B**</button>
                  <button type="button" onClick={() => wrapSelection('_', undefined, descRef, 'description')} className="px-2 py-1 rounded border hover:bg-gray-50" title="Italic">_i_</button>
                  <button type="button" onClick={() => insertAtLineStart('# ', descRef, 'description')} className="px-2 py-1 rounded border hover:bg-gray-50" title="H1">H1</button>
                  <button type="button" onClick={() => insertAtLineStart('## ', descRef, 'description')} className="px-2 py-1 rounded border hover:bg-gray-50" title="H2">H2</button>
                  <button type="button" onClick={() => insertAtLineStart('- ', descRef, 'description')} className="px-2 py-1 rounded border hover:bg-gray-50" title="Bullet">•</button>
                  <button type="button" onClick={() => wrapSelection('[', '](https://)', descRef, 'description')} className="px-2 py-1 rounded border hover:bg-gray-50" title="Link">🔗</button>
                  <span className="mx-1 h-4 w-px bg-gray-300" />
                  <button type="button" onClick={() => wrapSelection('[blue]', '[/blue]', descRef, 'description')} className="px-2 py-1 rounded border hover:bg-gray-50" title="Light blue">Blue</button>
                  <button type="button" onClick={() => wrapSelection('[xl]', '[/xl]', descRef, 'description')} className="px-2 py-1 rounded border hover:bg-gray-50" title="XL size">XL</button>
                  <button type="button" onClick={() => wrapSelection('[lg]', '[/lg]', descRef, 'description')} className="px-2 py-1 rounded border hover:bg-gray-50" title="Large size">Lg</button>
                  <button type="button" onClick={() => wrapSelection('[sm]', '[/sm]', descRef, 'description')} className="px-2 py-1 rounded border hover:bg-gray-50" title="Small size">Sm</button>
                </div>
              </div>
              <textarea
                ref={descRef}
                name="description"
                placeholder={
`Use **bold**, _italic_, # Headings, lists:
- item 1
- item 2

Custom tags:
[blue]text[/blue], [xl]Big text[/xl], [lg]Large[/lg], [sm]Small[/sm]
`
                }
                value={form.description}
                onChange={handleChange}
                required
                rows={12}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
              <p className="text-xs text-gray-500 mt-1">
                Whitespace is preserved. Use custom tags for color/size: <code>[blue]...[/blue]</code>, <code>[xl]...[/xl]</code>, <code>[lg]...[/lg]</code>, <code>[sm]...[/sm]</code>.
              </p>
            </div>

            {/* Full Description Field with toolbar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Full Description (Markdown + custom tags)</label>
                <div className="flex items-center gap-2 text-xs">
                  <button type="button" onClick={() => wrapSelection('**', undefined, longDescRef, 'long_desc')} className="px-2 py-1 rounded border hover:bg-gray-50" title="Bold">**B**</button>
                  <button type="button" onClick={() => wrapSelection('_', undefined, longDescRef, 'long_desc')} className="px-2 py-1 rounded border hover:bg-gray-50" title="Italic">_i_</button>
                  <button type="button" onClick={() => insertAtLineStart('# ', longDescRef, 'long_desc')} className="px-2 py-1 rounded border hover:bg-gray-50" title="H1">H1</button>
                  <button type="button" onClick={() => insertAtLineStart('## ', longDescRef, 'long_desc')} className="px-2 py-1 rounded border hover:bg-gray-50" title="H2">H2</button>
                  <button type="button" onClick={() => insertAtLineStart('- ', longDescRef, 'long_desc')} className="px-2 py-1 rounded border hover:bg-gray-50" title="Bullet">•</button>
                  <button type="button" onClick={() => wrapSelection('[', '](https://)', longDescRef, 'long_desc')} className="px-2 py-1 rounded border hover:bg-gray-50" title="Link">🔗</button>
                  <span className="mx-1 h-4 w-px bg-gray-300" />
                  <button type="button" onClick={() => wrapSelection('[blue]', '[/blue]', longDescRef, 'long_desc')} className="px-2 py-1 rounded border hover:bg-gray-50" title="Light blue">Blue</button>
                  <button type="button" onClick={() => wrapSelection('[xl]', '[/xl]', longDescRef, 'long_desc')} className="px-2 py-1 rounded border hover:bg-gray-50" title="XL size">XL</button>
                  <button type="button" onClick={() => wrapSelection('[lg]', '[/lg]', longDescRef, 'long_desc')} className="px-2 py-1 rounded border hover:bg-gray-50" title="Large size">Lg</button>
                  <button type="button" onClick={() => wrapSelection('[sm]', '[/sm]', longDescRef, 'long_desc')} className="px-2 py-1 rounded border hover:bg-gray-50" title="Small size">Sm</button>
                </div>
              </div>
              <textarea
                ref={longDescRef}
                name="long_desc"
                placeholder={
`Use **bold**, _italic_, # Headings, lists:
- item 1
- item 2

Custom tags:
[blue]text[/blue], [xl]Big text[/xl], [lg]Large[/lg], [sm]Small[/sm]
`
                }
                value={form.long_desc}
                onChange={handleChange}
                rows={12}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
              <p className="text-xs text-gray-500 mt-1">
                Whitespace is preserved. Use custom tags for color/size: <code>[blue]...[/blue]</code>, <code>[xl]...[/xl]</code>, <code>[lg]...[/lg]</code>, <code>[sm]...[/sm]</code>.
              </p>
            </div>

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
              <option value="Battery">Battery </option>
              <option value="Drone">Drone </option>
              <option value="Action Camera">Action Camera </option>
              <option value="Gimbal">Gimbal </option>
              <option value="Microphone">Microphone </option>
              <option value="Flash Light">Flash Light </option>
              <option value="Softbox">Softbox </option>
              <option value="Charger">Charger </option>
              <option value="Memory Card">Memory Card </option>

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
            {message && <p className="mt-2 text-center text-sm font-semibold text-sky-700">{message}</p>}
          </div>

          {/* Live Preview */}
          <div className="bg-white/70 rounded-2xl border border-sky-100 p-4 overflow-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description Preview</h3>
            <div className="prose max-w-none whitespace-pre-wrap">
              <style>{`
                .dc-blue { color: #38bdf8; }
                .size-xl { font-size: 1.25rem; line-height: 1.75rem; font-weight: 600; }
                .size-lg { font-size: 1.125rem; line-height: 1.75rem; }
                .size-sm { font-size: 0.875rem; line-height: 1.25rem; }
              `}</style>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema]]}
              >
                {previewHtml || '*Start typing your description on the left…*'}
              </ReactMarkdown>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Full Description Preview</h3>
            <div className="prose max-w-none whitespace-pre-wrap">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema]]}
              >
                {longDescPreviewHtml || '*Start typing your full description above…*'}
              </ReactMarkdown>
            </div>
            <p className="text-xs text-gray-500 mt-3">This is how it will appear on the product page.</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
