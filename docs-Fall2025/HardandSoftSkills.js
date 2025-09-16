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

const roleDiv = document.getElementById("role");
ROLES.forEach(r => {
  const btn = document.createElement("button");
  btn.textContent = r.name;
  btn.addEventListener("click", () => {
    document.getElementById("course").innerHTML =
      "<li><b>Hard Skills:</b> " + r.hard.join(", ") + "</li>" +
      "<li><b>Soft Skills:</b> " + r.soft.join(", ") + "</li>";
  });
  roleDiv.appendChild(btn);
});

// Clear button
  document.getElementById("clearBtn1").addEventListener("click", () => {
  document.getElementById("course").innerHTML = "";
});
