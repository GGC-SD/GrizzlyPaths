import React, { useState } from 'react';
import { ref, push, set } from "firebase/database";
import { db } from "../Backend/firebase"; 

function AddCourseForm() {
  const [courseName, setCourseName] = useState('');
  const [courseNumber, setCourseNumber] = useState('');
  const [message, setMessage] = useState(''); 

  const handleAddCourse = async (event) => {
    event.preventDefault(); 

    // NOW this code will actually run because HTML isn't blocking it
    if (!courseName.trim() || !courseNumber) {
      setMessage("Please enter both a course name and number.");
      return;
    }

    const newCourseData = {
      CourseName: courseName,
      CourseNumber: parseInt(courseNumber), 
    };

    try {
      const coursesRef = ref(db, 'courses');
      const newCourseRef = push(coursesRef);
      const generatedCourseId = newCourseRef.key;

      await set(newCourseRef, {
        ...newCourseData,
        courseID: generatedCourseId, 
      });

      setMessage(`Course "${courseName}" added successfully!`);
      setCourseName(''); 
      setCourseNumber('');
    } catch (error) {
      console.error("Error adding course:", error);
      setMessage(`Failed to add course: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Add New Course</h2>
      <form onSubmit={handleAddCourse}>
        <div>
          <label htmlFor="courseName">Course Name:</label>
          <input
            type="text"
            id="courseName"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            // REMOVED 'required' here
          />
        </div>
        <div>
          <label htmlFor="courseNumber">Course Number:</label>
          <input
            type="number"
            id="courseNumber"
            value={courseNumber}
            onChange={(e) => setCourseNumber(e.target.value)}
            // REMOVED 'required' here
          />
        </div>
        <button type="submit">Add Course</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AddCourseForm;