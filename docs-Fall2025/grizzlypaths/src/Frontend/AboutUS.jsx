export default function AboutUS({ onBack }) {
  return (
    <div id="background" className="d-flex flex-column min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mx-auto mb-0 text-center">ABOUT US</h1>
        <button onClick={onBack} className="btn btn-outline-primary">← </button>
      </div>

      <p className="ms-1">
        This project introduces a web/mobile application designed to help
        GGC IT students align their coursework with the skills demanded by
        current job roles in the tech industry. By entering a desired
        professional role, students can view a visual roadmap linking
        employer-requested IT skills—sourced from platforms like LinkedIn
        and Indeed—to recommended GGC courses across majors such as
        Software Development, Digital Media, Systems and Security, and
        Enterprise Systems. The goal is to guide upper-level students in
        selecting courses that strategically support their career
        aspirations.
      </p>

      <p className="ms-1">Team Contribution</p>
      <ul>
        <li>Sidibaba Simpara - Team Manager, UI/UX lead</li>
        <li>William Chokbengboune - Client Liaison, Data Modeler</li>
        <li>Charles Sarpong - Testing Lead, Programmer</li>
        <li>Hieu Do - Code, Documentation Lead</li>
      </ul>

      <footer className="mt-auto">
        <div className="footer-row">
          <p><b>© 2025 Georgia Gwinnett College Grizzly Path</b></p>
        </div>
      </footer>
    </div>
  );
}

