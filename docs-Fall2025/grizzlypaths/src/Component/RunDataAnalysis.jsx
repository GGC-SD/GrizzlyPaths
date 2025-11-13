import React, { useState } from 'react';

export default function RunCompiler() {
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);

  async function runPython() {
    setRunning(true);
    setOutput(null);
    try {
      const resp = await fetch('http://localhost:5000/run-python', { method: 'POST' });
      const data = await resp.json();
      setOutput(data);
    } catch (err) {
      setOutput({ error: err.message });
    } finally {
      setRunning(false);
    }
  }

  return (
    <div>
      <button onClick={runPython} disabled={running}>
        {running ? 'Running...' : 'Run Python'}
      </button>
      <pre style={{ whiteSpace: 'pre-wrap' }}>
        {output ? JSON.stringify(output, null, 2) : 'No output yet.'}
      </pre>
    </div>
  );
}