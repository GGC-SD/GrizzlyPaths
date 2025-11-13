import { useState } from 'react';
import Papa from 'papaparse';
import { getDatabase, ref, push } from 'firebase/database';
import { app } from "../Backend/firebase";

const EXPECTED_HEADERS = [
  'company_name',
  'job_title',
  'job_seniority_level',
  'job_function',
  'job_industries',
  'job_description',
  'company_industry',
  'company_sector',
  'job_type'
];

export default function Read() {
  const [loading, setLoading] = useState(false);
  const db = getDatabase(app);
  const csvUrl =
    'https://raw.githubusercontent.com/GGC-SD/GrizzlyPaths/refs/heads/main/docs-Spring2025/final_files/merged_jobs_cleaned%20(6).csv';

  function normalizeHeader(h) {
    return String(h)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');
  }

  async function importCSV() {
    setLoading(true);
    try {
      const res = await fetch(csvUrl);
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const text = await res.text();

      let headerValidated = false;

      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (h) => normalizeHeader(h),
        chunkSize: 1024 * 1024,
        chunk: async (results) => {
          if (!headerValidated) {
            const found = Object.keys(results.data[0] || {});
            const missing = EXPECTED_HEADERS.filter((h) => !found.includes(h));
            if (missing.length > 0) {
              console.error('Missing expected headers:', missing);
              setLoading(false);
              throw new Error(`CSV is missing headers: ${missing.join(', ')}`);
            }
            headerValidated = true;
          }

          const writes = results.data.map((row) => {
            // pick only expected fields and trim values
            const payload = {};
            EXPECTED_HEADERS.forEach((key) => {
              const val = row[key];
              payload[key] = typeof val === 'string' ? val.trim() : val ?? null;
            });
            return push(ref(db, 'jobs'), payload);
          });

          await Promise.all(writes);
        },
        complete: () => {
          setLoading(false);
          console.log('CSV import complete');
        },
        error: (err) => {
          console.error(err);
          setLoading(false);
        }
      });
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  return (
    <div>
      <button onClick={importCSV} disabled={loading}>
        {loading ? 'Importing...' : 'Import CSV to Firebase'}
      </button>
    </div>
  );
}