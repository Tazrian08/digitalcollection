import React, { useState,useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Sparkles } from 'lucide-react';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

    useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setLoading(true);

    // Combine subject and message for backend
    const fullMessage = formData.subject
      ? `[${formData.subject}] ${formData.message}`
      : formData.message;

    try {
      const res = await fetch(`${apiBaseUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: fullMessage
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send message');
      setSuccess(data.message || 'Message sent!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
    }
    setLoading(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-sky-200 mb-6">
            <Sparkles className="h-4 w-4 text-sky-500" />
            <span className="text-sm font-medium text-sky-700">Get in Touch</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Have a question about our products or need technical support? We're here to help you capture every moment perfectly!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-sky-200">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent mb-8">
                Get in Touch
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4 group">
                  <div className="bg-gradient-to-br from-sky-100 to-blue-100 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <Phone className="h-6 w-6 text-sky-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">Phone</p>
                    <p className="text-gray-600">+880 1613-799099</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 group">
                  <div className="bg-gradient-to-br from-emerald-100 to-green-100 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <Mail className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">Email</p>
                    <p className="text-gray-600">digitalcollectioncamerashop<br />@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 group">
                  <div className="bg-gradient-to-br from-orange-100 to-pink-100 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">Address</p>
                    <p className="text-gray-600">Shop 42 New Super Market, Baitul Mukarram<br />Dhaka, Bangladesh</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 group">
                  <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">Business Hours</p>
                    <p className="text-gray-600">Mon - Fri: 9:00 AM - 6:00 PM<br />Sat: 10:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-sky-200">
              <h3 className="text-xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent mb-6">
                Frequently Asked
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-sky-50 rounded-2xl">
                  <p className="font-bold text-gray-900 mb-1">Order confirmation and Shipping</p>
                  <p className="text-gray-600 text-sm">Using Whatsapp. Contact number: 01613-799099</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-2xl">
                  <p className="font-bold text-gray-900 mb-1">Order ID</p>
                  <p className="text-gray-600 text-sm">Can be found in accounts tab.<br />Navigate to Accounts and switch to Orders tab </p>
                </div>
                {/* <div className="p-4 bg-orange-50 rounded-2xl">
                  <p className="font-bold text-gray-900 mb-1">Warranty</p>
                  <p className="text-gray-600 text-sm">Extended warranty available on all items</p>
                </div> */}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-sky-200">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent mb-8">
                Send us a Message
              </h2>
              
              {success && <div className="text-green-600 text-center mb-4">{success}</div>}
              {error && <div className="text-red-500 text-center mb-4">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all duration-300"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all duration-300"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-bold text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all duration-300"
                  >
                    <option value="">Select a subject</option>
                    <option value="product-inquiry">Product Inquiry</option>
                    <option value="technical-support">Technical Support</option>
                    <option value="order-status">Order Status</option>
                    <option value="return-exchange">Return/Exchange</option>
                    <option value="general">General Question</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all duration-300 resize-none"
                    placeholder="Please provide details about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-4 px-8 rounded-2xl hover:from-sky-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center space-x-2 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Send className="h-5 w-5" />
                  <span>{loading ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;