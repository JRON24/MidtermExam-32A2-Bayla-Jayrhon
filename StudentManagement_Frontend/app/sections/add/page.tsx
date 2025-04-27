'use client';

import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddSectionPage() {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('https://localhost:7245/api/sections', formData);
      if (response.status === 201) {
        setLoading(false);
        router.push('/sections');
      }
    } catch (err) {
      console.error('Error adding section:', err);
      setError('Failed to add section.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 text-gray-800 dark:text-gray-100">
      <h1 className="text-3xl font-bold">Add New Section</h1>
      <form onSubmit={handleSubmit} className="mt-6">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700">Section Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 mt-2 border rounded dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="subject" className="block text-gray-700">Subject</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full p-2 mt-2 border rounded dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Section'}
          </button>
          <button
            onClick={() => router.push('/sections')}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
