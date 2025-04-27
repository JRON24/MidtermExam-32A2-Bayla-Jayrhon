'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function EditStudentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [student, setStudent] = useState<any>({
    firstName: '',
    lastName: '',
    studentNumber: '',
    course: '',
    age: '',
    email: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`https://localhost:7245/api/students/${id}`)
      .then(res => {
        setStudent(res.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error('⚠️ Failed to fetch student');
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedStudent = {
        firstName: student.firstName,
        lastName: student.lastName,
        studentNumber: student.studentNumber, // Don't change this
        course: student.course,
        age: student.age,
        email: student.email
      };
      await axios.put(`https://localhost:7245/api/students/${id}`, updatedStudent);
      toast.success('✅ Student updated successfully!');
      router.push('/students'); // Navigate to the student list page
    } catch {
      toast.error('❌ Failed to update student');
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this student?')) {
      try {
        await axios.delete(`https://localhost:7245/api/students/${id}`);
        toast.success('🗑️ Student deleted');
        router.push('/students'); // Navigate to the student list page after deletion
      } catch {
        toast.error('❌ Failed to delete student');
      }
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading student data...</p>;
  if (!student) return <p className="text-center text-red-500">Student not found.</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow">
      <h1 className="text-3xl font-bold mb-6">✏️ Edit Student</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name Fields */}
        <div>
          <label className="block text-sm font-medium mb-1">First Name</label>
          <input
            type="text"
            name="firstName"
            value={student.firstName}
            onChange={handleChange}
            className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={student.lastName}
            onChange={handleChange}
            className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>

        {/* Student Number (Locked) */}
        <div>
          <label className="block text-sm font-medium mb-1">Student Number</label>
          <input
            type="text"
            name="studentNumber"
            value={student.studentNumber ?? ''}
            onChange={handleChange}
            className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600"
            disabled // Lock the field
            required
          />
        </div>

        {/* Other Fields */}
        <div>
          <label className="block text-sm font-medium mb-1">Course</label>
          <input
            type="text"
            name="course"
            value={student.course ?? ''}
            onChange={handleChange}
            className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Age</label>
          <input
            type="number"
            name="age"
            value={student.age ?? ''}
            onChange={handleChange}
            className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={student.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition"
          >
            ✅ Update Student
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md transition"
          >
            🗑 Delete Student
          </button>
        </div>
      </form>
    </div>
  );
}
