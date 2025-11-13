import { useEffect } from 'react';
import Papa from 'papaparse';
import { getDatabase, ref, set } from 'firebase/database';
import { app } from "../Backend/firebase";

const db = getDatabase(app);
const csvURL = "https://raw.githubusercontent.com/GGC-SD/GrizzlyPaths/refs/heads/main/docs-Fall2025/grizzlypaths/src/Component/Course.csv";

export default function ReadCourses() {
    Papa.parse(csvURL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        results.data.forEach((row) => {
          if (!row.COURSE_NUMBER) return;

          // Clean up triple quotes
          const courseNumber = row.COURSE_NUMBER.replace(/"""/g, '').trim();
          const courseName = row.COURSE_NAME?.trim() || "";

          // Parse COURSE_SKILLS safely
          let courseSkills = [];
          if (row.COURSE_SKILLS) {
            try {
              const cleaned = row.COURSE_SKILLS.replace(/""/g, '"').replace(/\n/g, '').replace(/,\s*\]$/, ']');
              courseSkills = JSON.parse(cleaned);
            } catch (err) {
              console.warn(`Failed to parse skills for ${courseNumber}:`, err);
            }
          }

          // Upload to Firebase
          set(ref(db, `courses/${courseNumber}`), {
            courseNumber,
            courseName,
            courseSkills
          });
        });
        alert("Courses uploaded to firebase!")
      }
    });
  
}