export default function AboutUS({onBack}) {
  return (
    <body id="background">
      <div id = "wrapper">
        <div className="d-flex justify-content-end">
            <button onClick={onBack} className="btn btn-secondary mb-4">
            ← Back to Dashboard
            </button>
        </div>
        <h1>About Us</h1>
      </div>
    </body>
    );
}
