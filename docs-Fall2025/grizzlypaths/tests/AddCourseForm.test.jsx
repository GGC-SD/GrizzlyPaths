import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, vi, expect, beforeEach } from 'vitest';
import React from 'react';
// Adjust this path to point to your actual component file
import AddCourseForm from '../src/Frontend/AddCourseForm'; 

// 1. Mock the local Firebase config (Backend/firebase.js)
// This is required because AddCourseForm imports 'db' from here
vi.mock('../src/Backend/firebase', () => ({
  db: {}, // We just need a dummy object here
}));

// 2. Mock the Firebase Database SDK methods
vi.mock('firebase/database', () => {
  return {
    ref: vi.fn(),
    push: vi.fn(() => ({ key: 'mockedCourseId' })), // Mock push returning a key
    set: vi.fn(() => Promise.resolve()), // Mock set returning a resolved promise
  };
});

describe('AddCourseForm', () => {
  
  // Clear mocks before each test to ensure clean state
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders input fields and button', () => {
    render(<AddCourseForm />);
    expect(screen.getByLabelText(/course name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/course number/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add course/i })).toBeInTheDocument();
  });

  test('shows validation message if fields are empty', () => {
    render(<AddCourseForm />);
    
    // Note: The HTML 'required' attribute might stop submission in a real browser,
    // but in JSDOM/React Testing Library, fireEvent can bypass it or trigger the React handler.
    fireEvent.click(screen.getByRole('button', { name: /add course/i }));
    
    // Your component manually checks: if (!courseName.trim() || !courseNumber)
    expect(screen.getByText(/please enter both a course name and number/i)).toBeInTheDocument();
  });

  test('submits valid course and shows success message', async () => {
    // Import the mocked 'set' to check if it was called
    const { set } = await import('firebase/database');

    render(<AddCourseForm />);
    
    // Simulate user input
    fireEvent.change(screen.getByLabelText(/course name/i), { target: { value: 'Math' } });
    fireEvent.change(screen.getByLabelText(/course number/i), { target: { value: '101' } });
    
    // Submit
    fireEvent.click(screen.getByRole('button', { name: /add course/i }));

    await waitFor(() => {
      // Expect 'set' to be called with the correct data structure
      expect(set).toHaveBeenCalledWith(
        expect.any(Object), // The ref object (we don't care about exact details here)
        expect.objectContaining({
          CourseName: 'Math',
          CourseNumber: 101, // Component calls parseInt(), so we expect a number, not string '101'
          courseID: 'mockedCourseId', // Matches the mocked 'push' return value
        })
      );
      
      // Expect success message
      expect(screen.getByText(/course "Math" added successfully!/i)).toBeInTheDocument();
    });
  });

  test('handles Firebase error gracefully', async () => {
    const { set } = await import('firebase/database');
    // Force 'set' to fail once
    set.mockImplementationOnce(() => Promise.reject(new Error('Permission denied')));

    render(<AddCourseForm />);
    
    fireEvent.change(screen.getByLabelText(/course name/i), { target: { value: 'History' } });
    fireEvent.change(screen.getByLabelText(/course number/i), { target: { value: '202' } });
    fireEvent.click(screen.getByRole('button', { name: /add course/i }));

    await waitFor(() => {
      // Check error message from catch block
      expect(screen.getByText(/failed to add course: Permission denied/i)).toBeInTheDocument();
    });
  });

  test('clears input fields after successful submission', async () => {
    render(<AddCourseForm />);
    
    fireEvent.change(screen.getByLabelText(/course name/i), { target: { value: 'Science' } });
    fireEvent.change(screen.getByLabelText(/course number/i), { target: { value: '303' } });
    fireEvent.click(screen.getByRole('button', { name: /add course/i }));

    await waitFor(() => {
      // Inputs should be reset to empty strings
      expect(screen.getByLabelText(/course name/i).value).toBe('');
      expect(screen.getByLabelText(/course number/i).value).toBe(''); 
      // Note: .toHaveValue('') also works, checking .value explicitly is just extra specific
    });
  });
});