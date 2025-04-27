'use client';

import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddSubjectPage() {
  const [formData, setFormData] = useState({
    code: '',
    description: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post('https://localhost:7245/api/subjects', formData);  // API endpoint for adding a subject
      if (response.status === 201) {
        router.push('/subjects');  // Redirect to the subjects page upon success
      } else {
        setError('Unexpected response from server.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to add subject. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 text-gray-800 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6">➕ Add New Subject</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="code" className="block mb-1 font-medium">Subject Code</label>
          <input
            type="text"
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block mb-1 font-medium">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        {error && (
          <div className="text-red-500">{error}</div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Subject'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/subjects')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
