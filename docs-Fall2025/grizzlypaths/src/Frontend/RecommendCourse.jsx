/**
 * RecommendCourse Component
 * -------------------------
 * This module displays recommended ITEC courses grouped by major categories.
 * It includes reusable UI components for course cards and section headers.
 *
 * Components:
 * 
 * 1. CourseCard
 *    - Renders an individual course card
 *    - Displays: course title, description, skill focus, and prerequisites
 *
 *    Props:
 *    - title (string): Name of the course (e.g., "ITEC 3150")
 *    - description (string): Short course summary
 *    - skill (string): Primary skill the course teaches
 *    - prerequisite (string): Required courses before taking this course
 *
 * 2. Section
 *    - Renders a course section (e.g., “Software Development”, “Cybersecurity”)
 *    - Displays a section heading and a grid of CourseCard components
 *
 *    Props:
 *    - id (string): HTML anchor ID for navigation
 *    - title (string): Section heading
 *    - courses (array): List of course objects, each containing:
 *          { title, description, skill, prerequisite }
 *
 * 3. RecommendCourse
 *    - Parent component that renders all ITEC major categories
 *    - Provides a "Back to Dashboard" button
 *    - Passes course data into each Section component
 *
 *    Props:
 *    - onBack (function): Callback triggered when user clicks "Back"
 *
 * Notes:
 * - Uses Bootstrap card & grid layout classes.
 * - Sections include Software Development, Cybersecurity, Digital Media,
 *   Data Science & Analytics, and Enterprise Systems.
 * - All course information is static and stored in arrays inside this component.
 */

//create the course card
//course title, description, skill focus, and prerequisites
const CourseCard = ({ title, description, skill, prerequisite }) => (
  <div className="col">
    <div className="card h-100 shadow-sm border-0">
      <div className="card-body d-flex flex-column justify-content-center text-center">
        <h5 className="card-title">{title}</h5>
        <p className="card-text mb-0">{description}</p>
        <p className="mb-0">
          <strong>Skill:</strong> {skill}
        </p>
        <p className="mb-0">
          <strong>Prerequisite:</strong> {prerequisite}
        </p>
      </div>
    </div>
  </div>
);

//Renders a course section
//Displays a section heading and a grid of CourseCard components
const Section = ({ id, title, courses }) => (
  <>
    <br/>
    <div id={id} className="container-fluid bg-dark text-light py-2">
      <h2 className="text-center">{title}</h2>
    </div>
    <div className="container mt-5">
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {courses.map((course, idx) => (
          <CourseCard
            key={idx}
            title={course.title}
            description={course.description}
            skill={course.skill}
            prerequisite= {course.prerequisite}
          />
        ))}
      </div>
    </div>
  </>
);
          
// Main RecommendCourse component
export default function RecommendCourse({ onBack }) {
  return (
    <div className="container mt-4">
      {/* Back Button */}
      <div className="d-flex justify-content-end">
      <button onClick={onBack} className="btn btn-secondary mb-4">
        ← Back to Dashboard
      </button>
      </div>

      {/* Course Sections */}
      <Section
        id="sd"
        title="Software Development"
        courses={[
          { title: "ITEC 3150", description: "Advanced Programming", skill: "Java", prerequisite: "ITEC2150"},
          { title: "ITEC 3200", description: "Intro to Database", skill: "SQL", prerequisite: "(ITEC2140 or ITEC2120) and (ITEC2201 or BUSA3100)"},
          { title: "ITEC 3450", description: "Comp Graphics and Multimedia", skill: "GDI", prerequisite: "Math1113 and ITEC2110 and ITEC2140"},
          { title: "ITEC 3860", description: "Software Development 1", skill: "Java, SQL",  prerequisite: "ITEC2150, ITEC2201"},
          { title: "ITEC 3870", description: "Software Development 2", skill: "Front-end, Back-end", prerequisite: "ITEC3860, ITEC3150"},
          { title: "ITEC 4450", description: "Web Development", skill: "PHP, SQL", prerequisite: "ITEC2130, ITEC2150, ITEC3200"},
          { title: "ITEC 4550", description: "Mobile Aplication Development", skill: "Android, IOS application", prerequisite: "ITEC2110, ITEC2150"},
          { title: "ITEC 4650", description: "Game Development", skill: "Computer Gaming", prerequisite: "ITEC2150, ITEC3450"},
          { title: "ITEC 4700", description: "Artificial Intelligence", skill: "AI", prerequisite: "ITEC2150 or ITEC3160"},
        ]}
      />

      <Section
        id="cy"
        title="System and Cybersecurity"
        courses={[
          { title: "ITEC 3100", description: "Introduction to Network", skill: "Hardware and Networking", prerequisite: "ITEC1001, ITEC2140, ENGL 1101" },
          { title: "ITEC 3300", description: "Information Security", skill: "Core Security Principles", prerequisite: "(ITEC2201 or MIS3100) and (ITEC or ITEC2140)" },
          { title: "ITEC 3600", description: "Operation System", skill: "OS Architecture", prerequisite: "ITEC2150, ITEC2201" },
          { title: "ITEC 4000", description: "Cloud Computing", skill: "AWS", prerequisite: "ITEC3100" },
          { title: "ITEC 4100", description: "Advanced Networking", skill: "Hardware and Networking", prerequisite: "ITEC3100" },
          { title: "ITEC 4310", description: "Operating Systems Security", skill: "OS security", prerequisite: "ITEC3300" },
          { title: "ITEC 4320", description: "Internet Security", skill: "Networking Security", prerequisite: "ITEC2150, ITEC3100, ITEC3300" },
          { title: "ITEC 4330", description: "System Administration", skill: "System Administration", prerequisite: "ITEC3100, ITEC3600" },
          { title: "ITEC 4340", description: "Ethical Hacking", skill: "Ethical Hacker/ Security Specialist", prerequisite: "ITEC2140, ITEC3100, ITEC3300" },
        ]}
      />

      <Section
        id="dm"
        title="Digital Media"
        courses={[
          { title: "ITEC 3110", description: "Digital Design", skill: "Design Process", prerequisite: "ITEC2110" },
          { title: "ITEC 3550", description: "User Centered Design", skill: "GUI", prerequisite: "ITEC2110, ITEC2150, ITEC2201" },
          { title: "ITEC 4110", description: "Digital Media Capstone Project", skill: "Digital Media realm", prerequisite: "2 courses from ITEC4450, ITEC4550, ITEC4650, ITEC4130" },
          { title: "ITEC 4450", description: "Web Development", skill: "PHP, SQL", prerequisite: "ITEC2130, ITEC2150, ITEC3200"},
          { title: "ITEC 4850", description: "3D Modeling and Animation", skill: "3D model generation and animation", prerequisite: "ITEC2110" },
        ]}
      />

      <Section
        id="ds"
        title="Data Science and Analytics"
        courses={[
          { title: "ITEC 3160", description: "Prog for Data Analysis", skill: "Python", prerequisite: "ITEC2120 or ITEC2140" },
          { title: "ITEC 3170", description: "Data Intensive Fundamentals", skill: "Statistics and Mathematics", prerequisite: "ITEC2150 or ITEC3160" },
          { title: "ITEC 4210", description: "Information Analytics", skill: "Data Structure, Microsoft Azure", prerequisite: "ITEC3200 and (ITEC3160 or ITEC2150)" },
          { title: "ITEC 4220", description: "Advanced Data Analytics", skill: "Data Visualization", prerequisite: "MATH2450, MATH 2050, ITEC4210" },
          { title: "ITEC 4230", description: "Data Science & Analytics Proj", skill: "Programming, Statistic, SQL", prerequisite: "ITEC4210, ITEC4220" },
        ]}
      />
      
      <Section
        id="es"
        title="Enterprise System"
        courses={[
          { title: "ITEC 3350", description: "Digital Commerce", skill: "E-commerce and Marketing", prerequisite: "ITEC2201 or MIS3100" },
          { title: "ITEC 3700", description: "Systems Analysis and Design", skill:"SQL, Project Libre, Visual Paradigm", prerequisite: "ITEC2201, ITEC2150" },
          { title: "ITEC 4150", description: "Enterprise Process Integration", skill: "ESB", prerequisite: "ITEC2150, ITEC3200, ITEC3700" },
          { title: "ITEC 4750", description: "Enterprise Architecture Design", skill: "Data Architecture, Data Architecture", prerequisite: "ITEC2201, ITEC4150" },
          { title: "ITEC 4810", description: "Info Technology Project 1", skill: "Technical Awareness", prerequisite: "ITEC3100, ITEC3200, ITEC3300, ITEC3700" },
          { title: "ITEC 4820", description: "Info Technology Project 2", skill: "Technical Awareness", prerequisite: "ITEC4810" },
        ]}
      />
      <br></br>
    </div>
  );
}