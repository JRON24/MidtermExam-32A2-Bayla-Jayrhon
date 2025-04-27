'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ViewStudentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [student, setStudent] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios.get(`https://localhost:7245/api/students/${id}`)
      .then(res => {
        setStudent(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('⚠️ Failed to fetch student');
        setLoading(false);
      });
  }, [id]);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this student?')) {
      try {
        await axios.delete(`https://localhost:7245/api/students/${id}`);
        toast.success('🗑️ Student deleted');
        router.push('/students');
      } catch (err) {
        toast.error('❌ Failed to delete student');
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-2/3" />
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4" />
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 mt-8">{error}</p>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md">
      <h1 className="text-3xl font-bold mb-6">🎓 Student Details</h1>

      <div className="space-y-2">
        <p><span className="font-semibold">Full Name:</span> {student.fullName}</p>
        <p><span className="font-semibold">Student Number:</span> {student.studentNumber}</p>
        <p><span className="font-semibold">Course:</span> {student.course}</p>
        <p><span className="font-semibold">Age:</span> {student.age}</p>
        <p><span className="font-semibold">Email:</span> {student.email}</p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          onClick={() => router.push(`/students/edit/${id}`)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition"
        >
          ✏️ Edit
        </button>

        <button
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
        >
          🗑️ Delete
        </button>

        <button
          onClick={() => router.push('/students')}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
        >
          🔙 Back
        </button>
      </div>
    </div>
  );
}
