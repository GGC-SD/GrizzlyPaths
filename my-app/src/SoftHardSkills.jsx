import { useState } from "react";

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
    hard: ["Networks", "Operating Systems", "System Administration", "Cybersecurity Basics", "Advanced Security"],
    soft: ["Incident comms & runbooks", "Threat modeling", "Policy & governance", "Stakeholder training"]
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

export default function RoleSkills() {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleClear = () => setSelectedRole(null);

  return (
    <div>
      <h3>Pick Major To Show the Skills</h3>

      {/* Role Buttons */}
      <div id="role" className="mb-3">
        {ROLES.map((role) => (
          <button
            key={role.id}
            className="btn btn-outline-primary me-2 mb-2"
            onClick={() => setSelectedRole(role)}
          >
            {role.name}
          </button>
        ))}
      </div>

      {/* Clear Button */}
      <button className="btn btn-secondary mb-3" onClick={handleClear}>
        Clear
      </button>

      {/* Skills List */}
      {selectedRole && (
        <ul id="course" className="list-group">
          <li className="list-group-item">
            <b>Hard Skills:</b> {selectedRole.hard.join(", ")}
          </li>
          <li className="list-group-item">
            <b>Soft Skills:</b> {selectedRole.soft.join(", ")}
          </li>
        </ul>
      )}
    </div>
  );
}