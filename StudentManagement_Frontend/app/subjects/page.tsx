'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Subject = {
  id: number;
  code: string;
  description: string;
};

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    setLoading(true);
  
    axios.get('https://localhost:7245/api/subjects') // Your API endpoint for subjects
      .then((res) => {
        // Assuming the response directly contains the data array
        const data = res.data || []; // Adjust this based on the structure of your response
  
        setSubjects(data);
        setFilteredSubjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('API error:', err);
        setError('Failed to fetch subjects.');
        setLoading(false);
      });
  }, []);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filtered = subjects.filter((subject) =>
      subject.code.toLowerCase().includes(term.toLowerCase()) ||
      subject.description.toLowerCase().includes(term.toLowerCase())
    );

    setFilteredSubjects(filtered);
  };

  return (
    <div className="max-w-5xl mx-auto p-8 text-gray-800 dark:text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📚 Subject List</h1>
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/subjects/create')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            ➕ Add Subject
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search by code or description..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full mb-4 px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      />

      {loading && <p className="text-center text-blue-500">Loading...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="py-2">Subject Code</th>
              <th className="py-2">Description</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubjects.length > 0 ? (
              filteredSubjects.map((subject) => (
                <tr key={subject.id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                  <td className="py-2">{subject.code}</td>
                  <td className="py-2">{subject.description}</td>
                  <td className="py-2">
                    <button onClick={() => router.push(`/subjects/view/${subject.id}`)} className="px-3 py-1 text-sm bg-green-500 text-white rounded mr-2 hover:bg-green-600">View</button>
                    <button onClick={() => router.push(`/subjects/edit/${subject.id}`)} className="px-3 py-1 text-sm bg-yellow-500 text-white rounded mr-2 hover:bg-yellow-600">Edit</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-500 dark:text-gray-400">
                  No subjects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
