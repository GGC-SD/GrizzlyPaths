import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { getDatabase, ref, push, set } from 'firebase/database';
import { app } from '../firebase';

const csvData = "src\Component\HardSoftSkills.csv";
const db = getDatabase(app);

export default function MajorUploader(){

    useEffect(() =>{

        const hasUploaded = localStorage.getItem('skillsUploaded');

        if (hasUploaded) {
            console.log('Skills already uploaded. Skipping...');
            return;
        
        }
        const parsed = Papa.parse(csvData, 
            {
                header: true,
                skipEmptyLines: true
            });

            parsed.data.forEach((row) => {
                if (!row.id) return;

                const hardSkills = JSON.parse(row.hard_skills.replace(/""/g, '"'));
                const softSkills = JSON.parse(row.soft_skills.replace(/""/g, '"'));

                set(ref(db, 'skills/${row.id}'), {
                    name: row.name,
                    hard_skills: row.hardSkills,
                    soft_skills: row.softSkills,
                });
            });
            localStorage.setItem('skillsUploaded', 'true')
            
        }, 
    []);
    return  (
        <div>
        <h3>Upload Majors CSV</h3>
        <input type="file" accept=".csv" onChange={handleFileUpload} />
        {uploaded && <p>Upload complete!</p>}
        </div>
    )
}