'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Section = {
  id: number;
  name: string;
  subject: string; // Assuming you have subject details stored with the section
};

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [filteredSections, setFilteredSections] = useState<Section[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    setLoading(true);

    axios.get('https://localhost:7245/api/sections')
      .then((res) => {
        const rawData = res?.data['$values'] || [];
        setSections(rawData);
        setFilteredSections(rawData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('API error:', err);
        setError('Failed to fetch sections.');
        setLoading(false);
      });
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filtered = sections.filter((section) =>
      section.name.toLowerCase().includes(term.toLowerCase())
    );

    setFilteredSections(filtered);
  };

  const handleSort = (column: string) => {
    const sorted = [...filteredSections].sort((a, b) => {
      if (column === 'name') {
        return sortAsc
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      return 0;
    });

    setFilteredSections(sorted);
    setSortAsc(!sortAsc);
  };

  const handleView = (id: number) => router.push(`/sections/view/${id}`);
  const handleEdit = (id: number) => router.push(`/sections/edit/${id}`);

  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(`https://localhost:7245/api/sections/${id}`);
      if (response.status === 200) {
        setSections((prev) => prev.filter((section) => section.id !== id));
        setFilteredSections((prev) => prev.filter((section) => section.id !== id));
      } else {
        console.error('Delete failed with response:', response);
        setError('Failed to delete section.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete section.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 text-gray-800 dark:text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📚 Section List</h1>
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/sections/create')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            ➕ Add Section
          </button>
          <button
            onClick={() => document.documentElement.classList.toggle('dark')}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-700"
          >
            Toggle Dark Mode
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full mb-4 px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      />

      {loading && <p className="text-center text-blue-500">Loading...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
        <button
          onClick={() => handleSort('name')}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Sort by Name {sortAsc ? '🔼' : '🔽'}
        </button>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="py-2">Name</th>
              <th className="py-2">Subject</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSections.length > 0 ? (
              filteredSections.map((section) => (
                <tr key={section.id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                  <td className="py-2">{section.name}</td>
                  <td className="py-2">{section.subject}</td>
                  <td className="py-2">
                    <button onClick={() => handleView(section.id)} className="px-3 py-1 text-sm bg-green-500 text-white rounded mr-2 hover:bg-green-600">View</button>
                    <button onClick={() => handleEdit(section.id)} className="px-3 py-1 text-sm bg-yellow-500 text-white rounded mr-2 hover:bg-yellow-600">Edit</button>
                    <button onClick={() => handleDelete(section.id)} className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-500 dark:text-gray-400">
                  No sections found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
