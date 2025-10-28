import { useState } from "react";

/* ========== SKILLS & COURSES ========== */
const SKILLS = [
  "Java", "Python", "JavaScript", "React",
  "Web Frontend", "Web Backend / APIs",
  "Databases / SQL", "NoSQL",
  "Data Structures", "Algorithms",
  "Networks", "Operating Systems", "System Administration",
  "Cybersecurity Basics", "Advanced Security",
  "Cloud / DevOps", "UX / UI / HCI", "Digital Media", "Mobile",
  "Graphics / 3D", "AI / ML", "Analytics / BI",
  "Enterprise / ERP", "Systems Analysis & Design",
  "Professional Practice / Ethics", "Project / Capstone", "Internship / Research"
];

const COURSES = [
  { code: "ITEC 2110", title: "Digital Media", skills: ["Digital Media", "UX / UI / HCI"] },
  { code: "ITEC 2120", title: "Intro to Programming", skills: ["Java", "Data Structures", "Algorithms"] },
  { code: "ITEC 2130", title: "Web Technologies", skills: ["JavaScript", "Web Frontend", "Digital Media"] },
  { code: "ITEC 2135", title: "Engineering Graphics/Design", skills: ["Digital Media"] },
  { code: "ITEC 2140", title: "Programming Fundamentals", skills: ["Java", "Data Structures", "Algorithms"] },
  { code: "ITEC 2150", title: "OOP and Data Structures", skills: ["Java", "Data Structures", "Algorithms"] },
  { code: "ITEC 2201", title: "Intro to Information Systems", skills: ["Systems Analysis & Design"] },
  { code: "ITEC 3100", title: "Introduction to Networks", skills: ["Networks", "Cybersecurity Basics"] },
  { code: "ITEC 3300", title: "Information Security", skills: ["Cybersecurity Basics", "Advanced Security"] },
  { code: "ITEC 4310", title: "Operating Systems Security", skills: ["Advanced Security", "Operating Systems"] },
  { code: "ITEC 4320", title: "Internet Security", skills: ["Advanced Security", "Networks"] },
  { code: "ITEC 4330", title: "System Administration", skills: ["System Administration", "Operating Systems"] },
  { code: "ITEC 4340", title: "Ethical Hacking", skills: ["Advanced Security", "Networks"] },
  { code: "ITEC 3130", title: "Web Programming & Design", skills: ["JavaScript", "React", "Web Frontend", "Web Backend / APIs", "UX / UI / HCI"] },
  { code: "ITEC 3150", title: "Algorithms", skills: ["Algorithms", "Data Structures", "Java"] },
  { code: "ITEC 3160", title: "Programming for Data Analysis", skills: ["Python", "Analytics / BI", "Data Structures", "Algorithms"] },
  { code: "ITEC 3860", title: "Software Development I", skills: ["Systems Analysis & Design", "Web Backend / APIs", "Project / Capstone"] },
  { code: "ITEC 3870", title: "Software Development II", skills: ["Systems Analysis & Design", "Project / Capstone"] },
  { code: "ITEC 4260", title: "Software Testing & QA", skills: ["Project / Capstone"] },
  { code: "ITEC 3170", title: "Data Intensive Fundamentals", skills: ["Analytics / BI", "NoSQL", "Cloud / DevOps"] },
  { code: "ITEC 3200", title: "Intro to Databases", skills: ["Databases / SQL", "Web Backend / APIs"] },
  { code: "ITEC 4200", title: "Advanced Databases", skills: ["Databases / SQL", "NoSQL"] },
  { code: "ITEC 4210", title: "Information Analytics", skills: ["Analytics / BI", "Databases / SQL"] },
  { code: "ITEC 4220", title: "Advanced Data Analytics", skills: ["AI / ML", "Analytics / BI", "Python"] },
  { code: "ITEC 4230", title: "Data Science & Analytics Project", skills: ["Analytics / BI", "Project / Capstone"] },
  { code: "ITEC 4000", title: "Cloud Computing Technologies", skills: ["Cloud / DevOps", "Databases / SQL"] },
  { code: "ITEC 3110", title: "Digital Design", skills: ["Digital Media", "UX / UI / HCI"] },
  { code: "ITEC 3450", title: "Computer Graphics & Multimedia", skills: ["Graphics / 3D", "Digital Media"] },
  { code: "ITEC 4130", title: "Human‑Computer Interaction", skills: ["UX / UI / HCI"] },
  { code: "ITEC 4450", title: "Web Development", skills: ["Web Frontend", "Web Backend / APIs", "Databases / SQL", "React"] },
  { code: "ITEC 4550", title: "Mobile Application Development", skills: ["Mobile", "Web Backend / APIs", "UX / UI / HCI"] },
  { code: "ITEC 4850", title: "3D Modeling and Animation", skills: ["Graphics / 3D", "Digital Media"] },
  { code: "ITEC 3600", title: "Operating Systems", skills: ["Operating Systems"] },
  { code: "ITEC 3700", title: "Systems Analysis & Design", skills: ["Systems Analysis & Design"] },
  { code: "ITEC 4150", title: "Enterprise Process Integration", skills: ["Enterprise / ERP", "Systems Analysis & Design"] },
  { code: "ITEC 4750", title: "Enterprise Architecture Design", skills: ["Enterprise / ERP", "Systems Analysis & Design"] },
  { code: "ITEC 4100", title: "Advanced Networks", skills: ["Networks"] },
  { code: "ITEC 4170", title: "International Studies in IT", skills: ["Professional Practice / Ethics"] },
  { code: "ITEC 4700", title: "Artificial Intelligence", skills: ["AI / ML"] },
  { code: "ITEC 3350", title: "Digital Commerce", skills: ["Systems Analysis & Design", "Web Frontend"] },
  { code: "ITEC 3900", title: "Professional Practice & Ethics", skills: ["Professional Practice / Ethics"] },
  { code: "ITEC 4400", title: "Special Topics in IT", skills: ["Internship / Research"] },
  { code: "ITEC 4810", title: "IT Project I (Capstone)", skills: ["Project / Capstone"] },
  { code: "ITEC 4820", title: "IT Project II (Capstone)", skills: ["Project / Capstone"] },
  { code: "ITEC 4860", title: "Software Development Project", skills: ["Project / Capstone"] },
  { code: "ITEC 4900", title: "IT Internship", skills: ["Internship / Research", "Professional Practice / Ethics"] },
];

export default function SkillCourses() {
  const [selected, setSelected] = useState([]);

  const toggleSkill = (skill) => {
    setSelected((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  const clearSkills = () => setSelected([]);

  // Only show courses when at least one skill is selected
  const filteredCourses = selected.length === 0
    ? []
    : COURSES.filter((c) => c.skills.some((s) => selected.includes(s)));

  return (
    <div>
      <h3>Pick Skill to see ITEC courses</h3>

      {/* Skill Buttons */}
      <div className="mb-3">
        {SKILLS.map((skill) => (
          <button
            key={skill}
            className={`btn me-2 mb-2 ${selected.includes(skill) ? "btn-success" : "btn-outline-primary"}`}
            onClick={() => toggleSkill(skill)}
          >
            {selected.includes(skill) ? "✓ " : "+ "} {skill}
          </button>
        ))}
      </div>

      {/* Clear Button */}
      <button className="btn btn-secondary mb-3" onClick={clearSkills}>
        Clear
      </button>

      {/* Courses List */}
      {filteredCourses.length > 0 && (
        <div>
          <b>Courses Found: {filteredCourses.length}</b>
          <ul className="list-group mt-2">
            {filteredCourses.map((course) => (
              <li key={course.code} className="list-group-item">
                <b>{course.code}</b> — {course.title} <br />
                <span style={{ fontSize: "12px", color: "#555" }}>
                  Skills: {course.skills.join(", ")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
