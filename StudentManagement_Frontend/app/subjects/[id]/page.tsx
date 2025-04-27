'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

type Subject = {
  id: number;
  code: string;
  description: string;
};

export default function SubjectEditPage() {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState<Subject>({
    id: 0,
    code: '',
    description: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      axios
        .get(`https://localhost:7245/api/subjects/${id}`)
        .then((res) => {
          setFormData(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError('Failed to load subject details.');
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`https://localhost:7245/api/subjects/${id}`, formData);
      if (response.status === 200) {
        setIsEditing(false);
        router.push('/subjects');
      } else {
        setError('Failed to update subject.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to update subject.');
    }
  };

  if (loading) return <div className="text-center py-10 text-blue-500">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 text-gray-800 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6">📝 Edit Subject</h1>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <div>
          <label htmlFor="code" className="block mb-1 font-medium">Code</label>
          <input
            type="text"
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
            disabled={!isEditing}
            className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div className="flex gap-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
