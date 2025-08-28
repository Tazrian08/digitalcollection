import React, { useState } from 'react';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [maskedPhone, setMaskedPhone] = useState('');
  const [realPhone, setRealPhone] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Step 1: Ask for email
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${apiBaseUrl}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Email not found');
      setMaskedPhone(data.maskedPhone);
      setRealPhone(data.phone);
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Error');
    }
  };

  // Step 2: Ask for phone completion
  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    // Compare input with real phone
    if (realPhone && phoneInput && realPhone === phoneInput) {
      setStep(3);
    } else {
      setError('Phone number does not match.');
    }
  };

  // Step 3: Set new password
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${apiBaseUrl}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to reset password');
      setSuccess('Password reset successful! You can now login.');
      setStep(4);
    } catch (err: any) {
      setError(err.message || 'Error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-blue-100">
      <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-sky-200 p-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent mb-8 text-center">
          Forgot Password
        </h2>
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-5">
            <input
              name="email"
              type="email"
              placeholder="Registered Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error && <div className="text-red-500 text-center">{error}</div>}
            <button type="submit" className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:from-sky-600 hover:to-blue-700 transition-all duration-300">
              Next
            </button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handlePhoneSubmit} className="space-y-5">
            <div className="text-gray-700 text-center mb-2">
              Enter your registered phone number to verify.<br />
              <span className="font-bold">Hint: {maskedPhone}</span>
            </div>
            <input
              name="phone"
              type="text"
              placeholder="Complete Phone Number"
              value={phoneInput}
              onChange={e => setPhoneInput(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error && <div className="text-red-500 text-center">{error}</div>}
            <button type="submit" className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:from-sky-600 hover:to-blue-700 transition-all duration-300">
              Next
            </button>
          </form>
        )}
        {step === 3 && (
          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <input
              name="newPassword"
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error && <div className="text-red-500 text-center">{error}</div>}
            <button type="submit" className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:from-sky-600 hover:to-blue-700 transition-all duration-300">
              Reset Password
            </button>
          </form>
        )}
        {step === 4 && (
          <div className="text-green-600 text-center font-bold">
            {success}
            <div className="mt-4">
              <a href="/signin" className="text-blue-600 underline">Go to Login</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;