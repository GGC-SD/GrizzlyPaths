import React, { useState } from "react";

const ROLES = [
  {
    id: "software_dev",
    name: "Software Development",
    hard: [
      "Java, JavaScript, React",
      "Web Frontend",
      "Web Backend / APIs",
      "Databases / SQL",
      "Data Structures & Algorithms",
      "Cloud / DevOps",
      "Testing & QA"
    ],
    soft: [
      "Requirements & user stories",
      "Code review & version control",
      "Estimating & prioritization",
      "Writing design docs",
      "Agile teamwork & demos"
    ]
  },
  {
    id: "systems_security",
    name: "Systems & Security",
    hard: [
      "Networks",
      "Operating Systems",
      "System Administration",
      "Cybersecurity Basics",
      "Advanced Security"
    ],
    soft: [
      "Incident comms & runbooks",
      "Threat modeling",
      "Policy & governance",
      "Stakeholder training"
    ]
  },
  {
    id: "data_analytics",
    name: "Data / Analytics",
    hard: ["Python", "SQL & NoSQL", "Analytics / BI", "AI / ML", "Cloud (pipelines)"],
    soft: ["Data storytelling", "Experiment design", "Stakeholder alignment", "Documentation"]
  },
  {
    id: "digital_media",
    name: "Digital Media / UX",
    hard: ["UX / UI / HCI", "JavaScript & React", "Graphics / 3D", "Mobile", "Web Frontend"],
    soft: ["User research", "Design critique", "Accessibility", "Presenting design rationale"]
  },
  {
    id: "enterprise",
    name: "Enterprise Systems",
    hard: ["Systems Analysis & Design", "Databases / SQL", "Enterprise / ERP", "Cloud / DevOps"],
    soft: ["Process modeling", "Change management", "Requirements traceability", "Release planning"]
  }
];

export default function App() {
  const [roleId, setRoleId] = useState(ROLES[0].id);
  const role = ROLES.find(r => r.id === roleId);

  return (
    <div style={{ padding: 16, fontFamily: "system-ui, Arial" }}>
      <h1 style={{ marginTop: 0 }}>Grizzly Paths — Roadmap </h1>

      <label style={{ display: "block", margin: "12px 0" }}>
        Role:
        <select
          value={roleId}
          onChange={(e) => setRoleId(e.target.value)}
          style={{ marginLeft: 8 }}
        >
          {ROLES.map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </label>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <h3 style={{ margin: "8px 0" }}>Hard Skills</h3>
          <ul>
            {role.hard.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
        <div>
          <h3 style={{ margin: "8px 0" }}>Soft Skills</h3>
          <ul>
            {role.soft.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}
