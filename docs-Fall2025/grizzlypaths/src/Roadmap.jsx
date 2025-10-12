import { useMemo, useState } from "react";

const COURSE_NAME = {
  "ITEC 2110": "Digital Media",
  "ITEC 2120": "Intro to Programming",
  "ITEC 2130": "Web Technologies",
  "ITEC 2135": "Engineering Graphics/Design",
  "ITEC 2140": "Programming Fundamentals",
  "ITEC 2150": "OOP and Data Structures",
  "ITEC 2201": "Intro to Information Systems",
  "ITEC 3100": "Introduction to Networks",
  "ITEC 3300": "Information Security",
  "ITEC 4310": "Operating Systems Security",
  "ITEC 4320": "Internet Security",
  "ITEC 4330": "System Administration",
  "ITEC 4340": "Ethical Hacking",
  "ITEC 3130": "Web Programming & Design",
  "ITEC 3150": "Algorithms",
  "ITEC 3160": "Programming for Data Analysis",
  "ITEC 3860": "Software Development I",
  "ITEC 3870": "Software Development II",
  "ITEC 4260": "Software Testing & QA",
  "ITEC 3170": "Data Intensive Fundamentals",
  "ITEC 3200": "Intro to Databases",
  "ITEC 4200": "Advanced Databases",
  "ITEC 4210": "Information Analytics",
  "ITEC 4220": "Advanced Data Analytics",
  "ITEC 4230": "Data Science & Analytics Project",
  "ITEC 4000": "Cloud Computing Technologies",
  "ITEC 3110": "Digital Design",
  "ITEC 3450": "Computer Graphics & Multimedia",
  "ITEC 4130": "Human-Computer Interaction",
  "ITEC 4450": "Web Development",
  "ITEC 4550": "Mobile Application Development",
  "ITEC 4850": "3D Modeling and Animation",
  "ITEC 3600": "Operating Systems",
  "ITEC 3700": "Systems Analysis & Design",
  "ITEC 4150": "Enterprise Process Integration",
  "ITEC 4750": "Enterprise Architecture Design",
  "ITEC 4100": "Advanced Networks",
  "ITEC 4170": "International Studies in IT",
  "ITEC 4700": "Artificial Intelligence",
  "ITEC 3350": "Digital Commerce",
  "ITEC 3900": "Professional Practice & Ethics",
  "ITEC 4400": "Special Topics in IT",
  "ITEC 4810": "IT Project I (Capstone)",
  "ITEC 4820": "IT Project II (Capstone)",
  "ITEC 4860": "Software Development Project",
  "ITEC 4900": "IT Internship",
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
  "ITEC 3130": [
    "JavaScript",
    "React",
    "Web Frontend",
    "Web Backend / APIs",
    "UX / UI / HCI",
  ],
  "ITEC 3150": ["Algorithms", "Data Structures", "Java"],
  "ITEC 3160": ["Python", "Analytics / BI", "Data Structures", "Algorithms"],
  "ITEC 3860": [
    "Systems Analysis & Design",
    "Web Backend / APIs",
    "Project / Capstone",
  ],
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
  {
    id: "sd",
    name: "Software Development",
    skills: [
      "Java",
      "Data Structures",
      "Algorithms",
      "JavaScript",
      "Web Frontend",
      "Web Backend / APIs",
      "React",
      "Mobile",
      "Systems Analysis & Design",
      "Project / Capstone",
      "Databases / SQL",
    ],
  },
  {
    id: "dsa",
    name: "Data Science and Analytics",
    skills: [
      "Python",
      "Analytics / BI",
      "Databases / SQL",
      "NoSQL",
      "AI / ML",
      "Cloud / DevOps",
      "Data Structures",
      "Algorithms",
      "Project / Capstone",
    ],
  },
  {
    id: "dm",
    name: "Digital Media",
    skills: [
      "Digital Media",
      "UX / UI / HCI",
      "Web Frontend",
      "Graphics / 3D",
      "React",
      "Mobile",
    ],
  },
  {
    id: "sec",
    name: "Systems and Security",
    skills: [
      "Networks",
      "Cybersecurity Basics",
      "Advanced Security",
      "Operating Systems",
      "System Administration",
    ],
  },
  {
    id: "ent",
    name: "Enterprise Systems",
    skills: [
      "Systems Analysis & Design",
      "Enterprise / ERP",
      "Cloud / DevOps",
      "Professional Practice / Ethics",
      "Internship / Research",
    ],
  },
];

function buildSkillToCourses() {
  const map = {};
  Object.entries(COURSE_SKILLS).forEach(([course, skills]) => {
    skills.forEach((s) => {
      if (!map[s]) map[s] = [];
      map[s].push(course);
    });
  });
  Object.values(map).forEach((arr) => arr.sort());
  return map;
}

function Card({ title, info, backText, onClick }) {
  const [flipped, setFlipped] = useState(false);
  const toggle = () => {
    setFlipped((f) => !f);
    if (onClick) onClick();
  };
  return (
    <div className="card" onClick={toggle}>
      <div className={`inner ${flipped ? "flip" : ""}`}>
        <div className="face front">
          <div className="title">{title}</div>
          {info ? <div className="sub">{info}</div> : null}
          <div className="pill">click to flip</div>
        </div>
        <div className="face back">{backText || ""}</div>
      </div>
    </div>
  );
}

export default function ITRoadmap({ onBack }) {
  const [majorId, setMajorId] = useState("");
  const [coursesFor, setCoursesFor] = useState(null);
  const skillToCourses = useMemo(buildSkillToCourses, []);
  const selectedMajor = useMemo(
    () => MAJORS.find((m) => m.id === majorId),
    [majorId]
  );

  const renderSkills = () =>
    selectedMajor?.skills.map((skill) => {
      const list = (skillToCourses[skill] || []).slice();
      if (!list.length) return null;
      return (
        <Card
          key={skill}
          title={skill}
          info={`${list.length} course${list.length > 1 ? "s" : ""}`}
          backText="Click to view related courses"
          onClick={() => setCoursesFor({ skill, codes: list })}
        />
      );
    });

  const renderCourses = () =>
    coursesFor?.codes.map((code) => {
      const name = COURSE_NAME[code] || "Course";
      const desc = (COURSE_SKILLS[code] || []).join(" • ");
      const label = `${code} — ${name}`;
      return <Card key={code} title={label} backText={desc} />;
    });

  return (
    <div>
      <style>{globalCSS}</style>

      {/* Back to Dashboard button (added) */}
      <div className="container mt-4">
        <div className="d-flex justify-content-end">
          <button onClick={onBack} className="btn btn-secondary mb-4">
            ← Back to Dashboard
          </button>
        </div>
      </div>

      <header>
        <h1>Information Technology Roadmap</h1>
      </header>

      <div className="wrap">
        <section className="stage">
          <div className="controls">
            <div className="field">
              <label htmlFor="majorSelect">Concentration</label>
              <select
                id="majorSelect"
                className="form-select"
                value={majorId}
                onChange={(e) => {
                  setMajorId(e.target.value);
                  setCoursesFor(null);
                }}
              >
                <option value="">Choose a concentration…</option>
                {MAJORS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="jobSelect">Job Role</label>
              <select id="jobSelect" className="form-select" defaultValue="">
                <option value="">Browse by job…</option>
              </select>
            </div>
          </div>

          <div className="hint">
            Pick a concentration. Click a skill to see its courses. Click any card to flip for details.
          </div>

          <h2 id="stageTitle">
            {selectedMajor ? selectedMajor.name : "Select a Concentration"}
          </h2>
          <div className="grid" id="skillsGrid">
            {renderSkills()}
          </div>

          {coursesFor && (
            <>
              <h3 id="coursesTitle">Courses — {coursesFor.skill}</h3>
              <div className="grid" id="coursesGrid">
                {renderCourses()}
              </div>
            </>
          )}
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
