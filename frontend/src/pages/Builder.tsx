import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Camera, CameraOff, Aperture, Flashlight, HardDrive, Layers, PackageCheck, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Add this import at the top

const builderSections = [
  {
    key: 'camera',
    label: 'Camera',
    icon: <Camera className="h-6 w-6 text-sky-600" />,
    route: '/products?category=Camera',
  },
  {
    key: 'lens',
    label: 'Lens',
    icon: <Aperture className="h-6 w-6 text-sky-600" />,
    route: '/products?category=Lenses',
  },
  {
    key: 'accessory',
    label: 'Accessory',
    icon: <PackageCheck className="h-6 w-6 text-sky-600" />,
    route: '/products?category=Accessory',
  },
  {
    key: 'lighting',
    label: 'Lighting',
    icon: <Flashlight className="h-6 w-6 text-sky-600" />,
    route: '/products?category=Lighting',
  },
  {
    key: 'tripod',
    label: 'Tripod',
    icon: <Layers className="h-6 w-6 text-sky-600" />,
    route: '/products?category=Tripods',
  },
  {
    key: 'storage',
    label: 'Storage',
    icon: <HardDrive className="h-6 w-6 text-sky-600" />,
    route: '/products?category=Storage',
  },
];

interface BuilderProduct {
  id: string;
  name: string;
  price: number;
  images: string[];
}

const getInitialBuilderState = () => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('builderState')) {
    return JSON.parse(decodeURIComponent(params.get('builderState')!));
  }
  const saved = localStorage.getItem('builderState');
  if (saved) return JSON.parse(saved);
  return {
    camera: null,
    lens: null,
    accessory: null,
    lighting: null,
    tripod: null,
    storage: null,
  };
};

const Builder: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const builderStateFromUrl = params.get('builderState')
    ? JSON.parse(decodeURIComponent(params.get('builderState')!))
    : null;

  const [selected, setSelected] = useState<{ [key: string]: BuilderProduct | null }>(getInitialBuilderState());
  const { token } = useAuth(); // Add this line

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('builderState', JSON.stringify(selected));
  }, [selected]);

  // Simulate selecting a product (in real app, use context or pass via route state)
  const handleAdd = (sectionKey: string) => {
    // This would be replaced by actual product selection logic
    // For now, just simulate with a placeholder
    setSelected(prev => ({
      ...prev,
      [sectionKey]: {
        id: sectionKey + '-1',
        name: `Sample ${sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1)}`,
        price: 100 * (Object.keys(selected).indexOf(sectionKey) + 1),
        images: [],
      }
    }));
  };

  const handleRemove = (sectionKey: string) => {
    setSelected(prev => ({
      ...prev,
      [sectionKey]: null,
    }));
  };

  const handleAddAllToCart = async () => {
    if (!token) {
      alert('Please sign in to add items to your cart.');
      return;
    }
    let added = 0;
    for (const item of Object.values(selected)) {
      if (item) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cart`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ productId: item.id, quantity: 1 })
          });
          if (res.ok) added++;
        } catch {
          // Optionally handle error per item
        }
      }
    }
    if (added > 0) {
      alert('All selected items added to cart!');
    } else {
      alert('No items were added.');
    }
  };

  const total = Object.values(selected).reduce((sum, item) => sum + (item ? item.price : 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-sky-200 mb-4">
            <ShoppingCart className="h-4 w-4 text-sky-500" />
            <span className="text-sm font-medium text-sky-700">Camera Builder</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent mb-2">
            Build Your Camera Kit
          </h1>
          <p className="text-gray-600 text-lg">
            Select your preferred camera, lens, and accessories to create your perfect kit.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-sky-200 p-8 space-y-8">
          {builderSections.map(section => (
            <div key={section.key} className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-b last:border-b-0">
              <div className="flex items-center space-x-4">
                {section.icon}
                <span className="text-lg font-semibold text-gray-800">{section.label}</span>
              </div>
              {selected[section.key] ? (
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <span className="font-medium text-sky-700">{selected[section.key]?.name}</span>
                  <span className="font-bold text-blue-700">{selected[section.key]?.price.toFixed(2)}</span>
                  <button
                    onClick={() => handleRemove(section.key)}
                    className="bg-red-100 text-red-700 px-4 py-2 rounded-xl font-semibold hover:bg-red-200 transition"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => {
                      const builderState = encodeURIComponent(JSON.stringify(selected));
                      navigate(`${section.route}&fromBuilder=1&builderState=${builderState}`);
                    }}
                    className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-2 rounded-xl font-semibold shadow hover:from-sky-600 hover:to-blue-700 transition"
                  >
                    Choose
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-6 py-4 rounded-2xl border border-sky-200 shadow-lg">
            <span className="text-xl font-bold text-sky-700">Current Total:</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">
              {total.toFixed(2)}
            </span>
          </div>
        </div>
        {/* Add To Cart Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleAddAllToCart}
            className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:from-sky-600 hover:to-blue-700 transition-all duration-300"
          >
            Add All To Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Builder;