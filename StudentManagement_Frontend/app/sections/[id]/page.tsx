'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

type Section = {
  id: number;
  name: string;
  subject: string;
};

export default function SectionEditPage() {
  const { id } = useParams();
  const [section, setSection] = useState<Section | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Section>({
    id: 0,
    name: '',
    subject: '',
  });

  const router = useRouter();

  useEffect(() => {
    if (id) {
      setLoading(true);
      axios
        .get(`https://localhost:7245/api/sections/${id}`)
        .then((res) => {
          setSection(res.data);
          setFormData(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching section data:', err);
          setError('Failed to fetch section details.');
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`https://localhost:7245/api/sections/${id}`, formData);
      if (response.status === 200) {
        setIsEditing(false);
        router.push('/sections');
      }
    } catch (err) {
      console.error('Error updating section:', err);
      setError('Failed to update section.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto p-8 text-gray-800 dark:text-gray-100">
      <h1 className="text-3xl font-bold">Edit Section</h1>
      <form onSubmit={(e) => e.preventDefault()} className="mt-6">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700">Section Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 mt-2 border rounded dark:bg-gray-700 dark:text-white"
            disabled={!isEditing}
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
            disabled={!isEditing}
          />
        </div>

        <div className="flex gap-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              Edit Section
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
