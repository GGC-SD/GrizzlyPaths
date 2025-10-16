import { useEffect } from 'react';
import Papa from 'papaparse';
import { getDatabase, ref, set } from 'firebase/database';
import { app } from '../firebase';

const db = getDatabase(app);
const csvURL = "https://raw.githubusercontent.com/GGC-SD/GrizzlyPaths/main/docs-Fall2025/grizzlypaths/src/Component/HardSoftSkills.csv";

export default function MajorUploader() {
  useEffect(() => {
    const hasUploaded = localStorage.getItem('skillsUploaded');
    if (hasUploaded) {
      console.log('Skills already uploaded. Skipping...');
      return;
    }

    Papa.parse(csvURL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        results.data.forEach((row) => {
          if (!row.id) return;

          const hardSkills = JSON.parse(row.hard_skills.replace(/""/g, '"'));
          const softSkills = JSON.parse(row.soft_skils.replace(/""/g, '"'));

          set(ref(db, `skills/${row.id}`), {
            name: row.name,
            hard_skills: hardSkills,
            soft_skills: softSkills,
          });
        });

        localStorage.setItem('skillsUploaded', 'true');
      },
    });
  }, []);

  return <div>Uploading majors to Firebase…</div>;
}
