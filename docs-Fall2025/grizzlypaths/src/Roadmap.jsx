import { useMemo, useState, useEffect } from "react";
import { app } from "./firebase";
import { getDatabase, ref, onValue, off } from "firebase/database";

// --- COURSE DATA ---
const COURSE_NAME = {
  "ITEC 1001": "Intro to Computing",
  "ITEC 2110": "Digital Media",
  "ITEC 2120": "Intro to Programming",
  "ITEC 2130": "Web Technologies",
  "ITEC 2135": "Engineering Graphics/Design",
  "ITEC 2140": "Programming Fundamentals",
  "ITEC 2150": "OOP and Data Structures",
  "ITEC 2201": "Intro to Information Systems",
  "ITEC 3100": "Introduction to Networks",
  "ITEC 3110": "Digital Design",
  "ITEC 3130": "Web Programming and Design",
  "ITEC 3150": "Algorithms",
  "ITEC 3160": "Prog for Data Analysis",
  "ITEC 3170": "Data Intensive Fundamentals",
  "ITEC 3200": "Intro to Databases",
  "ITEC 3300": "Information Security",
  "ITEC 3350": "Digital Commerce",
  "ITEC 3450": "Computer Graphics and Multimedia",
  "ITEC 3500": "IT Research",
  "ITEC 3550": "User Centered Design",
  "ITEC 3600": "Operating Systems",
  "ITEC 3700": "Systems Analysis & Design",
  "ITEC 3860": "Software Development I",
  "ITEC 3870": "Software Development II",
  "ITEC 3900": "Professional Pract and Ethics",
  "ITEC 4000": "Cloud Computing Technologies",
  "ITEC 4100": "Advanced Networks",
  "ITEC 4110": "Digital Media Capstone Project",
  "ITEC 4130": "Human Computer Interaction",
  "ITEC 4150": "Enterprise Process Integration",
  "ITEC 4170": "International Studies in IT",
  "ITEC 4200": "Advanced Databases",
  "ITEC 4210": "Information Analytics",
  "ITEC 4220": "Advanced Data Analytics",
  "ITEC 4230": "Data Science and Analytics Proj",
  "ITEC 4260": "Software Testing and QA",
  "ITEC 4310": "Operating Systems Security",
  "ITEC 4320": "Internet Security",
  "ITEC 4330": "System Administration",
  "ITEC 4340": "Ethical Hacking",
  "ITEC 4400": "Special Topics in Infor. Tech",
  "ITEC 4450": "Web Development",
  "ITEC 4550": "Mobile Application Development",
  "ITEC 4650": "Game Development",
  "ITEC 4700": "Artificial Intelligence",
  "ITEC 4750": "Enterprise Architecture Design",
  "ITEC 4810": "Info Technology Project I",
  "ITEC 4820": "Info Technology Project II",
  "ITEC 4850": "3D Modeling and Animation",
  "ITEC 4860": "Software Development Project",
  "ITEC 4900": "Info Technology Internship",
};

const COURSE_SKILLS = {
  "ITEC 2110": ["Digital Media", "UX / UI / HCI"],
  "ITEC 2120": ["Java", "Data Structures", "Algorithms"],
  "ITEC 2130": ["JavaScript", "Web Frontend", "Digital Media"],
  "ITEC 2135": ["Digital Media"],
  "ITEC 2140": ["Java", "Data Structures", "Algorithms"],
  "ITEC 2150": ["Java", "Data Structures", "Algorithms"],
  "ITEC 2201": ["Systems Analysis & Design"],
  "ITEC 3100": ["Networks", "Cybersecurity Basics"],
  "ITEC 3300": ["Cybersecurity Basics", "Advanced Security"],
  "ITEC 4310": ["Advanced Security", "Operating Systems"],
  "ITEC 4320": ["Advanced Security", "Networks"],
  "ITEC 4330": ["System Administration", "Operating Systems"],
  "ITEC 4340": ["Advanced Security", "Networks"],
  "ITEC 3130": ["JavaScript", "React", "Web Frontend", "Web Backend / APIs", "UX / UI / HCI"],
  "ITEC 3150": ["Algorithms", "Data Structures", "Java"],
  "ITEC 3160": ["Python", "Analytics / BI", "Data Structures", "Algorithms"],
  "ITEC 3860": ["Systems Analysis & Design", "Web Backend / APIs", "Project / Capstone"],
  "ITEC 3870": ["Systems Analysis & Design", "Project / Capstone"],
  "ITEC 4260": ["Project / Capstone"],
  "ITEC 3170": ["Analytics / BI", "NoSQL", "Cloud / DevOps"],
  "ITEC 3200": ["Databases / SQL", "Web Backend / APIs"],
  "ITEC 4200": ["Databases / SQL", "NoSQL"],
  "ITEC 4210": ["Analytics / BI", "Databases / SQL"],
  "ITEC 4220": ["AI / ML", "Analytics / BI", "Python"],
  "ITEC 4230": ["Analytics / BI", "Project / Capstone"],
  "ITEC 4000": ["Cloud / DevOps", "Databases / SQL"],
  "ITEC 3110": ["Digital Media", "UX / UI / HCI"],
  "ITEC 3450": ["Graphics / 3D", "Digital Media"],
  "ITEC 4130": ["UX / UI / HCI"],
  "ITEC 4450": ["Web Frontend", "Web Backend / APIs", "Databases / SQL", "React"],
  "ITEC 4550": ["Mobile", "Web Backend / APIs", "UX / UI / HCI"],
  "ITEC 4850": ["Graphics / 3D", "Digital Media"],
  "ITEC 3600": ["Operating Systems"],
  "ITEC 3700": ["Systems Analysis & Design"],
  "ITEC 4150": ["Enterprise / ERP", "Systems Analysis & Design"],
  "ITEC 4750": ["Enterprise / ERP", "Systems Analysis & Design"],
  "ITEC 4100": ["Networks"],
  "ITEC 4170": ["Professional Practice / Ethics"],
  "ITEC 4700": ["AI / ML"],
  "ITEC 3350": ["Systems Analysis & Design", "Web Frontend"],
  "ITEC 3900": ["Professional Practice / Ethics"],
  "ITEC 4400": ["Internship / Research"],
  "ITEC 4810": ["Project / Capstone"],
  "ITEC 4820": ["Project / Capstone"],
  "ITEC 4860": ["Project / Capstone"],
  "ITEC 4900": ["Internship / Research", "Professional Practice / Ethics"],
};

const MAJORS = [
  { id: "sd", name: "Software Development", skills: ["Java", "Data Structures", "Algorithms", "JavaScript", "Web Frontend", "Web Backend / APIs", "React", "Mobile", "Systems Analysis & Design", "Project / Capstone", "Databases / SQL"] },
  { id: "dsa", name: "Data Science and Analytics", skills: ["Python", "Analytics / BI", "Databases / SQL", "NoSQL", "AI / ML", "Cloud / DevOps", "Data Structures", "Algorithms", "Project / Capstone"] },
  { id: "dm", name: "Digital Media", skills: ["Digital Media", "UX / UI / HCI", "Web Frontend", "Graphics / 3D", "React", "Mobile"] },
  { id: "sec", name: "Cyber Security", skills: ["Networks", "Cybersecurity Basics", "Advanced Security", "Operating Systems", "System Administration"] },
  { id: "ent", name: "Enterprise Systems", skills: ["Systems Analysis & Design", "Enterprise / ERP", "Cloud / DevOps", "Professional Practice / Ethics", "Internship / Research"] },
];

// --- UTILITY ---
const buildSkillToCourses = () => {
  const map = {};
  Object.entries(COURSE_SKILLS).forEach(([course, skills]) => {
    skills.forEach(skill => {
      if (!map[skill]) map[skill] = [];
      map[skill].push(course);
    });
  });
  Object.values(map).forEach(arr => arr.sort());
  return map;
};

// --- CARD COMPONENT ---
const Card = ({ title, info, backText }) => {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="card" onClick={() => setFlipped(f => !f)}>
      <div className={`inner ${flipped ? "flip" : ""}`}>
        <div className="face front">
          <div className="title">{title}</div>
          {info && <div className="sub">{info}</div>}
          <div className="pill">click to flip</div>
        </div>
        <div className="face back">{backText}</div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function ITRoadmap({ onBack }) {
  const [majorId, setMajorId] = useState("");
  const [selectedJob, setSelectedJob] = useState("");
  const [jobData, setJobData] = useState({});
  const skillToCourses = useMemo(buildSkillToCourses, []);
  const db = getDatabase(app);

  // Fetch job data
  useEffect(() => {
    const jobRef = ref(db, "job");
    const unsubscribe = onValue(
      jobRef,
      snapshot => setJobData(snapshot.val() || {}),
      err => console.error(err)
    );
    return () => off(jobRef, "value", unsubscribe);
  }, [db]);

  const selectedMajor = MAJORS.find(m => m.id === majorId);
  const jobs = selectedMajor && jobData[selectedMajor.name] ? Object.keys(jobData[selectedMajor.name]) : [];
  const selectedJobInfo = selectedMajor && selectedJob && jobData[selectedMajor.name] ? jobData[selectedMajor.name][selectedJob] : null;

  // Courses for selected job
  const jobCourses = selectedJobInfo?.course
    ? Array.isArray(selectedJobInfo.course)
      ? selectedJobInfo.course.map(c => c.trim())
      : selectedJobInfo.course.split(",").map(c => c.trim())
    : [];

  // Render skill cards
  const renderSkills = () =>
    selectedMajor?.skills.map(skill => {
      const list = skillToCourses[skill] || [];
      if (!list.length) return null;
      return <Card key={skill} title={skill} info={`${list.length} course${list.length > 1 ? "s" : ""}`} backText="Click to view related courses" />;
    });

  // Render job course cards
  const renderJobCourses = () =>
    jobCourses.map(code => {
      const courseName = COURSE_NAME[code] || "No Name";
      const skillsDesc = (COURSE_SKILLS[code] || []).join(" • ") || "No description";
      return <Card key={code} title={`${code} — ${courseName}`} backText={skillsDesc} />;
    });

  return (
    <div className="roadmap">
      <style>{globalCSS}</style>
      <header className="mb-4 position-relative">
        <h1 className="position-absolute top-50 start-50 translate-middle m-0">Information Technology Roadmap</h1>
        <div className="d-flex justify-content-end">
          <button onClick={onBack} className="btn btn-outline-primary">← Dashboard</button>
        </div>
      </header>

      <div className="wrap">
        <section className="stage">
          <div className="controls">
            <div className="field">
              <label>Concentration</label>
              <select
                value={majorId}
                onChange={e => {
                  setMajorId(e.target.value);
                  setSelectedJob("");
                }}
              >
                <option value="">Select a concentration…</option>
                {MAJORS.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Job Role</label>
              <select
                value={selectedJob}
                onChange={e => setSelectedJob(e.target.value)}
                disabled={!selectedMajor}
              >
                <option value="">{selectedMajor ? "Select a job…" : "Select a major first"}</option>
                {jobs.map(j => (
                  <option key={j} value={j}>{j}</option>
                ))}
              </select>
            </div>
          </div>

          {selectedJobInfo && (
            <div className="mt-3">
              <p><strong>Soft Skills:</strong> {Array.isArray(selectedJobInfo.soft) ? selectedJobInfo.soft.join(", ") : selectedJobInfo.soft || "N/A"}</p>
              <p><strong>Hard Skills:</strong> {Array.isArray(selectedJobInfo.hard) ? selectedJobInfo.hard.join(", ") : selectedJobInfo.hard || "N/A"}</p>
              <p><strong>Courses:</strong>{" "}
                {selectedJobInfo.course
                  ? Array.isArray(selectedJobInfo.course)
                    ? selectedJobInfo.course.map(c => c.trim()).join(", ")
                    : selectedJobInfo.course.split(",").map(c => c.trim()).join(", ")
                  : "N/A"}
              </p>
            </div>
          )}

          <h2>{selectedMajor ? selectedMajor.name : "Select a Concentration"}</h2>
          <div className="grid">
            {selectedJobInfo ? renderJobCourses() : renderSkills()}
          </div>
        </section>
      </div>
    </div>
  );
}

const globalCSS = `
:root{--primaryButtonColor:#FF0000;--primaryButtonRadius:12px;--primaryButtonHover:darkred;--primaryButtonText:white}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Arial, sans-serif;background:linear-gradient(to right,#36d352,#ace5bc);min-height:100vh;color:#163b20}
header{padding:18px 20px;text-align:center}
h1{margin:0;font-size:22px}
.wrap{max-width:1100px;margin:0 auto;padding:0 16px 28px}
.stage{background:#fff;border:1px solid #000;border-radius:12px;box-shadow:0 5px 20px rgba(0,0,0,.08);padding:16px}
.controls{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:12px}
.field{display:flex;flex-direction:column;gap:6px;padding:8px 10px;background:#fff;border:1px solid #000;border-radius:12px}
.field label{font-weight:600;font-size:13px}
select.form-select{width:150px;margin-left:10px;border-width:1px;border-color:black;border-style:solid;border-radius:8px;padding:6px 8px;font-weight:600;background:#fff}
.hint{font-size:12px;color:#2b6a41;margin:4px 2px 12px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px}
.card{perspective:1000px;cursor:pointer}
.inner{position:relative;width:100%;height:140px;transform-style:preserve-3d;transition:transform .5s}
.inner.flip{transform:rotateY(180deg)}
.face{position:absolute;inset:0;background:#fff;border:1px solid #000;border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:12px;backface-visibility:hidden;box-shadow:0 5px 15px rgba(0,0,0,.05)}
.front:hover{box-shadow:0 0 0 3px rgba(0,0,0,.10)}
.back{transform:rotateY(180deg);font-size:13px;color:#2b6a41}
.title{font-weight:700;line-height:1.25}
.sub{font-size:12px;color:#2b6a41;margin-top:6px}
.pill{margin-top:8px;font-size:11px;padding:3px 8px;border-radius:999px;border:1px solid #000;color:#2b6a41}
h2{margin:0 0 6px;font-size:18px}
h3{margin:14px 0 8px;font-size:16px}
@media (max-width:600px){select.form-select{width:100%;margin-left:0}.controls{gap:8px}}
`;



