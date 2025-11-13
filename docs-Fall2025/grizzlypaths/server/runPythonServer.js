const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/run-python', (req, res) => {
  // adjust path to your script
  const scriptPath = path.resolve(__dirname, '..', 'docs-Spring2025', 'final_files', 'Final_Copy_of_Master_Notebook.ipnyb');
  const py = spawn('python', [scriptPath]);

  let stdout = '';
  let stderr = '';

  py.stdout.on('data', (data) => { stdout += data.toString(); });
  py.stderr.on('data', (data) => { stderr += data.toString(); });

  py.on('close', (code) => {
    res.json({ exitCode: code, stdout, stderr });
  });

  py.on('error', (err) => {
    res.status(500).json({ error: err.message });
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`run-python server listening on http://localhost:${PORT}`));