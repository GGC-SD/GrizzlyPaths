import { useEffect, useState } from "react";
import { getDatabase, ref, onValue, off } from "firebase/database";
import { app } from "../firebase";

export default function JobSelect({ nodePath = "jobs", onChange }) {
  const [titles, setTitles] = useState([]);
  const [loading, setLoading] = useState(true);
  const db = getDatabase(app);

  useEffect(() => {
    const jobsRef = ref(db, nodePath);

    const handleSnapshot = (snap) => {
      const data = snap.val();
      if (!data) {
        setTitles([]);
        setLoading(false);
        return;
      }

      const rows = Object.values(data);

      const extracted = rows
        .map((r) =>
          r?.job_title ?? r?.["job title"] ?? r?.jobTitle ?? r?.title ?? null
        )
        .filter(Boolean)
        .map((t) => String(t).trim())
        .filter(Boolean);

      const unique = Array.from(new Set(extracted)).sort((a, b) =>
        a.localeCompare(b)
      );

      setTitles(unique);
      setLoading(false);
    };

    const handleError = (err) => {
      console.error("Realtime DB error:", err);
      setTitles([]);
      setLoading(false);
    };

    onValue(jobsRef, handleSnapshot, handleError);

    return () => {
      off(jobsRef, "value", handleSnapshot);
    };
  }, [db, nodePath]);

  return (
    <div className="field">
      <label htmlFor="jobSelect">Job Role</label>
      <select
        id="jobSelect"
        className="form-select"
        defaultValue=""
        onChange={(e) => onChange?.(e.target.value)}
      >
        <option value="">Browse by job…</option>
        {loading ? (
          <option value="" disabled>
            Loading…
          </option>
        ) : (
          titles.map((title) => (
            <option key={title} value={title}>
              {title}
            </option>
          ))
        )}
      </select>
    </div>
  );
}