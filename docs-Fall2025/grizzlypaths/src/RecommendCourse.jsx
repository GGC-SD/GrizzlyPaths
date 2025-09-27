// Single Course Card
const CourseCard = ({ title, description, skill }) => (
  <div className="col">
    <div className="card shadow-sm">
      <div className="card-body text-center">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">
          {description}
          <br />
          <strong>Skill:</strong> {skill}
        </p>
      </div>
    </div>
  </div>
);

// Section containing multiple courses
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
          { title: "ITEC 2140", description: "Programming Fundamental", skill: "Java" },
          { title: "ITEC 2150", description: "Intermediate Programming", skill: "Java" },
          { title: "ITEC 3150", description: "Advanced Programming", skill: "Java" },
          { title: "ITEC 3860", description: "Software Development 1", skill: "Java, SQL" },
        ]}
      />

      <Section
        id="cy"
        title="System and Cybersecurity"
        courses={[
          { title: "ITEC 3100", description: "Introduction to Network", skill: "Hardware and Networking" },
          { title: "ITEC 3300", description: "Information Security", skill: "Core Security Principles" },
          { title: "ITEC 3600", description: "Operation System", skill: "OS Architecture" },
        ]}
      />

      <Section
        id="dm"
        title="Digital Media"
        courses={[
          { title: "ITEC 2110", description: "Digital Media", skill: "Adobe, HTML" },
          { title: "ITEC 2130", description: "Web Technology", skill: "HTML, CSS, Javascript, Jquery" },
          { title: "ITEC 4450", description: "Web Development", skill: "HTML, CSS, PHP" },
        ]}
      />

      <Section
        id="ds"
        title="Data Science and Analytics"
        courses={[
          { title: "MATH 2050", description: "Introduction to Statistic", skill: "Statistic, R" },
          { title: "ITEC 4210", description: "Information Analytics", skill: "Data Structure, Microsoft Azure" },
        ]}
      />
      
      <Section
        id="es"
        title="Enterprise System"
        courses={[
          { title: "ITEC 2201", description: "Information Systems", skill: "Strategic Application" },
          { title: "ITEC 3350", description: "Digital Commerce", skill: "E-commerce and Marketing" },
        ]}
      />
      
      <footer>
        <p>
          &copy; <b>2025 Georgia Gwinnett College GrizzlyPath</b>
        </p>
      </footer>
    </div>
  );
}