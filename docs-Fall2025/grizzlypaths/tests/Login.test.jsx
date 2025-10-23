//This emulates the environment
import Login from "../src/Login";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, vi, beforeEach, expect } from 'vitest';

vi.mock('firebase/auth', async(importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        getAuth: vi.fn(() => ({})),
        signInWithEmailAndPassword: vi.fn(),
    };
});

vi.mock('firebase/database', async(importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        getDatabase: vi.fn(() => ({})),
        ref: vi.fn(),
        get: vi.fn(),
    };
});

//import statements as if this is the actual page
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";

describe('Login component', () => {
  let onLoginMock;

  beforeEach(() => {
    onLoginMock = vi.fn();
    localStorage.clear();
    vi.clearAllMocks();
  });

  test('renders email and password inputs and login button', () => {
    render(<Login onLogin={onLoginMock} />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('successful login stores student data and calls onLogin', async () => {
    // Mock Firebase Auth success
    signInWithEmailAndPassword.mockResolvedValueOnce({
      user: { uid: 'mockedUID' },
    });

    // Mock Database snapshot
    get.mockResolvedValueOnce({
      exists: () => true,
      val: () => ({
        name: 'Alice',
        studentID: '12345',
        major: 'CS',
      }),
    });

    render(<Login onLogin={onLoginMock} />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(localStorage.getItem('studentName')).toBe('Alice');
      expect(localStorage.getItem('studentID')).toBe('12345');
      expect(localStorage.getItem('studentMajor')).toBe('CS');
      expect(onLoginMock).toHaveBeenCalled();
    });
  });

  test('shows error if student data not found', async () => {
    signInWithEmailAndPassword.mockResolvedValueOnce({
      user: { uid: 'mockedUID' },
    });

    get.mockResolvedValueOnce({
      exists: () => false,
    });

    render(<Login onLogin={onLoginMock} />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/student data not found in database/i)
      ).toBeInTheDocument();
    });
  });

  test('shows error message on login failure', async () => {
    signInWithEmailAndPassword.mockRejectedValueOnce(
      new Error('Invalid credentials')
    );

    render(<Login onLogin={onLoginMock} />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'badpass' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/login failed: invalid credentials/i)
      ).toBeInTheDocument();
    });
  });
});