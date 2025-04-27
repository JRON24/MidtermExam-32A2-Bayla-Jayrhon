'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Student = {
  id: number;
  fullName: string;
  studentNumber: string;
  course: string;
  section: string;
  age: number;
  email: string;
};

const sectionSubjectMap: Record<string, string[]> = {
  'BSIT-1A': ['Intro to Programming', 'Computer Fundamentals', 'Math in IT'],
  'BSIT-2A': ['Web Development', 'Database Systems', 'Data Structures'],
  'BSPSYCH-1A': ['General Psychology', 'Developmental Psych', 'Statistics'],
  'BSPSYCH-2A': ['Abnormal Psych', 'Experimental Psych', 'Research Methods'],
  'BSA-1A': ['Financial Accounting 1', 'Business Mathematics', 'Introduction to Business'],
  'BSA-2A': ['Financial Accounting 2', 'Cost Accounting', 'Business Law'],
  'BSBA-1A': ['Principles of Management', 'Marketing Fundamentals', 'Microeconomics'],
  'BSBA-2A': ['Macroeconomics', 'Human Resource Management', 'Business Communication'],
  'BSN-1A': ['Anatomy & Physiology', 'Health Assessment', 'Biochemistry'],
  'BSN-2A': ['Microbiology & Parasitology', 'Nursing Fundamentals', 'Nutrition'],
  'BSHM-1A': ['Introduction to Hospitality', 'Food & Beverage Services', 'Tourism Principles'],
  'BSHM-2A': ['Housekeeping Operations', 'Bar Management', 'Front Office Procedures'],
  'BSPH-1A': ['Introduction to Public Health', 'Health Ethics', 'Biostatistics'],
  'BSPH-2A': ['Epidemiology', 'Environmental Health', 'Health Promotion & Education'],
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [studentSections, setStudentSections] = useState<Record<number, string>>({});
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    axios.get('https://localhost:7245/api/students')
      .then((res) => {
        const rawData = res?.data['$values'] || [];
        const formatted = rawData.map((s: any) => ({
          ...s,
          fullName: s.fullName || `${s.firstName} ${s.lastName}`,
        }));

        setStudents(formatted);

        const initialSections: Record<number, string> = {};
        formatted.forEach((s: Student) => {
          const defaultSection = `${s.course}-${s.section}`;
          initialSections[s.id] = sectionSubjectMap[defaultSection] ? defaultSection : '';
        });
        setStudentSections(initialSections);
        setLoading(false);
      })
      .catch((err) => {
        console.error('API error:', err);
        setError('Failed to fetch students.');
        setLoading(false);
      });
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSectionChange = (studentId: number, newSection: string) => {
    setStudentSections(prev => ({
      ...prev,
      [studentId]: newSection,
    }));
  };

  const handleView = (id: number) => router.push(`/students/view/${id}`);
  const handleEdit = (id: number) => router.push(`/students/edit/${id}`);
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`https://localhost:7245/api/students/${id}`);
      setStudents(prev => prev.filter((s) => s.id !== id));
    } catch (err) {
      setError('Failed to delete student.');
      console.error('Delete error:', err);
    }
  };

  const filteredStudents = students.filter((s) =>
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-8 text-gray-800 dark:text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📚 Student List</h1>
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/students/create')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            ➕ Add Student
          </button>
          <button
            onClick={() => document.documentElement.classList.toggle('dark')}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-700"
          >
            Toggle Dark Mode
          </button>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      {loading && <p className="text-center text-blue-500">Loading...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 overflow-x-auto">
        <table className="w-full text-left table-auto">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="py-2">Name</th>
              <th className="py-2">Student Number</th>
              <th className="py-2">Course</th>
              <th className="py-2">Section</th>
              <th className="py-2">Subjects</th>
              <th className="py-2">Age</th>
              <th className="py-2">Email</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => {
                const selectedSection = studentSections[student.id] || '';
                const subjects = sectionSubjectMap[selectedSection] || [];

                return (
                  <tr
                    key={student.id}
                    className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <td className="py-2">{student.fullName}</td>
                    <td className="py-2">{student.studentNumber}</td>
                    <td className="py-2">{student.course}</td>
                    <td className="py-2">
                      <select
                        value={selectedSection}
                        onChange={(e) =>
                          handleSectionChange(student.id, e.target.value)
                        }
                        className="px-2 py-1 rounded border dark:bg-gray-700 dark:border-gray-600"
                      >
                        <option value="">Select Section</option>
                        {Object.keys(sectionSubjectMap).map((section) => (
                          <option key={section} value={section}>
                            {section}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2">
                      {subjects.length > 0 ? (
                        <ul className="list-disc list-inside text-sm">
                          {subjects.map((subj, i) => (
                            <li key={i}>{subj}</li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-400 italic text-sm">
                          No subjects
                        </span>
                      )}
                    </td>
                    <td className="py-2">{student.age}</td>
                    <td className="py-2">{student.email}</td>
                    <td className="py-2">
                      <button
                        onClick={() => handleView(student.id)}
                        className="px-3 py-1 text-sm bg-green-500 text-white rounded mr-1 hover:bg-green-600"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(student.id)}
                        className="px-3 py-1 text-sm bg-yellow-500 text-white rounded mr-1 hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>

                  
                );

                
              })
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500 dark:text-gray-400">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
