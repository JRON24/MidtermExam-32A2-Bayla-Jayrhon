{students && students.length > 0 ? (
  <table className="w-full text-left">
    <thead>
      <tr className="border-b border-gray-200 dark:border-gray-700">
        <th className="py-2">Name</th>
        <th className="py-2">Student Number</th>
        <th className="py-2">Course</th>
        <th className="py-2">Age</th>
        <th className="py-2">Email</th> {/* Added Email column */}
      </tr>
    </thead>
    <tbody>
      {students.map((student) => (
        <tr
          key={student.id}
          className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <td className="py-2">{`${student.firstName} ${student.lastName}`}</td>
          <td className="py-2">{student.studentNumber}</td>
          <td className="py-2">{student.course}</td>
          <td className="py-2">{student.age}</td>
          <td className="py-2">{student.email}</td> {/* Added Email data */}
        </tr>
      ))}
    </tbody>
  </table>
) : (
  <p className="text-gray-500">No students found.</p>
)}
