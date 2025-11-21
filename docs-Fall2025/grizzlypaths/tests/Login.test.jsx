import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import React from 'react';
// 1. Ensure this path is correct for your project structure
import Login from '../src/Frontend/Login'; 

// =================================================
// 2. Mock Firebase SDK functions
// =================================================
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';

// 3. FIX: Import auth from the EXACT same path you use in vi.mock below
import { auth } from '../src/Backend/firebase';

// Mock firebase/app (Prevents crash if real file loads)
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(),
}));

// Mock firebase/auth
vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
  getAuth: vi.fn(() => ({})), // Return object so it doesn't crash if real file loads
}));

// Mock firebase/database
vi.mock('firebase/database', () => ({
  getDatabase: vi.fn(),
  ref: vi.fn(),
  get: vi.fn(),
}));

// 4. FIX: Mock the local file using the EXACT path including 'src'
// This replaces the real file entirely with our custom 'auth' object
vi.mock('../src/Backend/firebase', () => ({
  auth: {
    currentUser: {
      getIdToken: vi.fn(),
    },
  },
}));

// =================================================
// 3. The Test Suite
// =================================================
describe('Login Component', () => {
  
  const mockOnLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    
    // Default behavior for getIdToken
    if (auth.currentUser) {
        auth.currentUser.getIdToken.mockResolvedValue('mock-token');
    }
    
    // Default behavior for database
    getDatabase.mockReturnValue({}); 
    ref.mockReturnValue({});
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the login form correctly', () => {
    render(<Login onLogin={mockOnLogin} />);

    expect(screen.getByRole('heading', { name: /Grizzly Path Login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  it('updates input fields when user types', () => {
    render(<Login onLogin={mockOnLogin} />);

    const emailInput = screen.getByLabelText(/Email/i);
    const passInput = screen.getByLabelText(/Password/i);

    fireEvent.change(emailInput, { target: { value: 'test@ggc.edu' } });
    fireEvent.change(passInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@ggc.edu');
    expect(passInput.value).toBe('password123');
  });

  it('handles SUCCESSFUL login', async () => {
    // Setup Mocks for Success
    const mockUid = 'user-123';
    
    signInWithEmailAndPassword.mockResolvedValue({
      user: { uid: mockUid }
    });

    get.mockResolvedValue({
      exists: () => true,
      val: () => ({
        name: 'John Doe',
        studentID: '900123456',
        major: 'Software Development'
      })
    });

    render(<Login onLogin={mockOnLogin} />);

    // Simulate User Action
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@ggc.edu' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'secret' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    // Assertions
    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.any(Object), 'john@ggc.edu', 'secret');
      expect(ref).toHaveBeenCalledWith(expect.any(Object), `student/${mockUid}`);
      expect(localStorage.getItem('studentName')).toBe('John Doe');
      expect(localStorage.getItem('studentID')).toBe('900123456');
      expect(mockOnLogin).toHaveBeenCalled();
    });
  });

  it('displays error when Auth fails (Wrong Password/Email)', async () => {
    signInWithEmailAndPassword.mockRejectedValue(new Error('Firebase: Error (auth/wrong-password).'));

    render(<Login onLogin={mockOnLogin} />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'wrong@ggc.edu' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(screen.getByText(/Login failed: Firebase: Error \(auth\/wrong-password\)/i)).toBeInTheDocument();
      expect(mockOnLogin).not.toHaveBeenCalled();
    });
  });

  it('displays error when User authenticates but has NO Database Record', async () => {
    signInWithEmailAndPassword.mockResolvedValue({
      user: { uid: 'ghost-user' }
    });

    get.mockResolvedValue({
      exists: () => false,
      val: () => null
    });

    render(<Login onLogin={mockOnLogin} />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'ghost@ggc.edu' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(screen.getByText(/Student data not found in database/i)).toBeInTheDocument();
      expect(mockOnLogin).not.toHaveBeenCalled();
    });
  });
});