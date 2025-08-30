import React, { useEffect, useState } from 'react';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const ContactInbox: React.FC<{ user: any; token: string }> = ({ user, token }) => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user?.isAdmin) return;
    const fetchContacts = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/contacts`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setContacts(data.contacts || []);
      } catch {
        setError('Failed to fetch contacts');
      }
      setLoading(false);
    };
    fetchContacts();
  }, [user, token]);

  const handleDelete = async (id: string) => {
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${apiBaseUrl}/api/contacts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete contact');
      setSuccess('Contact deleted successfully!');
      setContacts(contacts.filter(c => c._id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete contact');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Inbox</h2>
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      {success && <div className="text-green-500 text-center mb-4">{success}</div>}
      {contacts.length === 0 ? (
        <div className="text-center text-gray-600">No contact messages found.</div>
      ) : (
        <ul className="space-y-6">
          {contacts.map(contact => (
            <li key={contact._id} className="flex flex-col md:flex-row md:items-center gap-4 bg-sky-50 rounded-xl p-4 shadow">
              <div className="flex-1">
                <div className="font-bold text-lg">{contact.name}</div>
                <div className="text-gray-600">{contact.email}</div>
                <div className="text-gray-700 mt-2 whitespace-pre-line">{contact.message}</div>
              </div>
              <button
                onClick={() => handleDelete(contact._id)}
                className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-red-700 transition self-end md:self-auto"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ContactInbox;