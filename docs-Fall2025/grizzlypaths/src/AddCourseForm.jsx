import React, { useState } from 'react';
import { ref, push, set } from "firebase/database";
import { db } from '../firebase'; // Import your initialized database instance

function AddCourseForm() {
  const [courseName, setCourseName] = useState('');
  const [courseNumber, setCourseNumber] = useState('');
  const [message, setMessage] = useState(''); // For user feedback

  const handleAddCourse = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    // Basic validation
    if (!courseName.trim() || !courseNumber) {
      setMessage("Please enter both a course name and number.");
      return;
    }

    const newCourseData = {
      CourseName: courseName,
      CourseNumber: parseInt(courseNumber), // Convert string input to number
    };

    try {
      // Reference to the 'courses' node in your Realtime Database
      const coursesRef = ref(db, 'courses');

      // Use push() to get a new unique child location and its key
      const newCourseRef = push(coursesRef);
      const generatedCourseId = newCourseRef.key;

      // Set the data at that new location, including the generated ID
      await set(newCourseRef, {
        ...newCourseData,
        courseID: generatedCourseId, // Store the ID within the object
      });

      setMessage(`Course "${courseName}" added successfully!`);
      setCourseName(''); // Clear form fields
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
            required
          />
        </div>
        <div>
          <label htmlFor="courseNumber">Course Number:</label>
          <input
            type="number"
            id="courseNumber"
            value={courseNumber}
            onChange={(e) => setCourseNumber(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Course</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AddCourseForm;
