import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import React from 'react';
import Papa from 'papaparse';
// 1. FIX: Import from the correct location
import Roadmap from '../src/Frontend/Roadmap'; 

// --- MOCKS ---

// 2. FIX: Mock the Chart at its ACTUAL location so Vitest intercepts it.
// If your Roadmap is in src/Frontend/, then Chart is likely there too.
vi.mock('../src/Frontend/Chart', () => ({
  default: ({ title, onSliceClick, labels }) => (
    <div data-testid="mock-chart">
      <h3>{title}</h3>
      <ul>
        {labels.map((label, index) => (
          <li 
            key={label} 
            data-testid={`chart-slice-${index}`}
            onClick={() => onSliceClick(index)}
          >
            {label}
          </li>
        ))}
      </ul>
    </div>
  )
}));

// Mock Papaparse
vi.mock('papaparse', () => ({
  default: {
    parse: vi.fn()
  }
}));

// --- TEST DATA ---

const MOCK_JOBS_DATA = [
  {
    job_title: 'Software Engineer',
    job_description: 'Develop web apps using React and Node.',
    company_name: 'Tech Co',
    skills: 'React, Node, JavaScript'
  },
  {
    job_title: 'Data Scientist',
    job_description: 'Analyze data using Python and Pandas.',
    company_name: 'Data Inc',
    skills: 'Python, Pandas, Machine Learning'
  }
];

const MOCK_COURSE_CSV = `
COURSE_NUMBER, COURSE_NAME, COURSE_SKILLS
ITEC 1000, Intro to Programming, "[Python, Java]"
ITEC 2000, Web Development, "[HTML, CSS, JavaScript, React]"
`;

// --- TESTS ---

describe('Roadmap Component', () => {
  const globalFetch = global.fetch;

  beforeEach(() => {
    vi.clearAllMocks();

    // 3. FIX: Mock scrollIntoView to prevent the "not a function" crash
    window.HTMLElement.prototype.scrollIntoView = vi.fn();

    // Mock global fetch
    global.fetch = vi.fn((url) => {
      if (url.includes('merged_jobs_cleaned')) {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve('dummy_jobs_csv_content'),
        });
      }
      if (url.includes('Course.csv')) {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve(MOCK_COURSE_CSV),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    // Mock Papa.parse behavior
    Papa.parse.mockImplementation((csvText, config) => {
      if (config.complete) {
        config.complete({ data: MOCK_JOBS_DATA });
      }
    });
  });

  afterEach(() => {
    cleanup();
    global.fetch = globalFetch;
  });

  it('renders the initial Major selection view', async () => {
    render(<Roadmap onBack={vi.fn()} />);
    expect(screen.getByText(/Information Technology Roadmap/i)).toBeInTheDocument();
    expect(screen.getByText('Software Development')).toBeInTheDocument();
  });

  it('handles flow: Select Major -> View Job Types', async () => {
    render(<Roadmap onBack={vi.fn()} />);
    
    // Click on "Software Development" major
    const majorCard = screen.getByLabelText('Software Development');
    fireEvent.click(majorCard);

    // Wait for the MOCK Chart to appear
    await waitFor(() => {
      expect(screen.getByTestId('mock-chart')).toBeInTheDocument();
    });

    // Check text inside the mock chart
    expect(screen.getByText(/Job Postings in Software Development/i)).toBeInTheDocument();
  });

  it('handles flow: Select Job Type -> View Skills', async () => {
    render(<Roadmap onBack={vi.fn()} />);
    
    // 1. Select Major
    fireEvent.click(screen.getByLabelText('Software Development'));

    // 2. Select Job Type (Slice 0)
    const jobSlice = await screen.findByTestId('chart-slice-0');
    fireEvent.click(jobSlice);

    // 3. Expect Chart to switch to Skills view
    await waitFor(() => {
      expect(screen.getByText(/Top Hard Skills/i)).toBeInTheDocument();
    });
  });

  it('allows navigation back from Skills view to Jobs view', async () => {
    render(<Roadmap onBack={vi.fn()} />);
    
    // Navigate to Skills view
    fireEvent.click(screen.getByLabelText('Software Development'));
    fireEvent.click(await screen.findByTestId('chart-slice-0'));

    expect(screen.getByText(/Top Hard Skills/i)).toBeInTheDocument();

    // Find and click "Back to Job Postings" button
    const backButton = screen.getByText(/Back to Job Postings/i);
    fireEvent.click(backButton);

    // Verify return to Job Postings
    expect(screen.getByText(/Job Postings in Software Development/i)).toBeInTheDocument();
  });
});