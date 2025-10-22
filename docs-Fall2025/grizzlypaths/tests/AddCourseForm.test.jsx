import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, vi } from 'vitest';
import AddCourseForm from '../src/AddCourseForm';

// Mock Firebase functions with Vitest
vi.mock('firebase/database', () => {
  return {
    ref: vi.fn(),
    push: vi.fn(() => ({ key: 'mockedCourseId' })),
    set: vi.fn(() => Promise.resolve()),
  };
});

describe('AddCourseForm', () => {
  test('renders input fields and button', () => {
    render(<AddCourseForm />);
    expect(screen.getByLabelText(/course name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/course number/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add course/i })).toBeInTheDocument();
  });

  test('shows validation message if fields are empty', () => {
    render(<AddCourseForm />);
    fireEvent.click(screen.getByRole('button', { name: /add course/i }));
    expect(screen.getByText(/please enter both a course name and number/i)).toBeInTheDocument();
  });

  test('submits valid course and shows success message', async () => {
    const { set } = await import('firebase/database');

    render(<AddCourseForm />);
    fireEvent.change(screen.getByLabelText(/course name/i), { target: { value: 'Math' } });
    fireEvent.change(screen.getByLabelText(/course number/i), { target: { value: '101' } });
    fireEvent.click(screen.getByRole('button', { name: /add course/i }));

    await waitFor(() => {
      expect(set).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          CourseName: 'Math',
          CourseNumber: 101,
          courseID: 'mockedCourseId',
        })
      );
      expect(screen.getByText(/course "math" added successfully!/i)).toBeInTheDocument();
    });
  });

  test('handles Firebase error gracefully', async () => {
    const { set } = await import('firebase/database');
    set.mockImplementationOnce(() => Promise.reject(new Error('Permission denied')));

    render(<AddCourseForm />);
    fireEvent.change(screen.getByLabelText(/course name/i), { target: { value: 'History' } });
    fireEvent.change(screen.getByLabelText(/course number/i), { target: { value: '202' } });
    fireEvent.click(screen.getByRole('button', { name: /add course/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to add course: permission denied/i)).toBeInTheDocument();
    });
  });

  test('clears input fields after successful submission', async () => {
    render(<AddCourseForm />);
    fireEvent.change(screen.getByLabelText(/course name/i), { target: { value: 'Science' } });
    fireEvent.change(screen.getByLabelText(/course number/i), { target: { value: '303' } });
    fireEvent.click(screen.getByRole('button', { name: /add course/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/course name/i)).toHaveValue('');
      expect(screen.getByLabelText(/course number/i)).toHaveValue(''); // number inputs reset to empty string
    });
  });
});
