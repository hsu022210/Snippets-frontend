import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider, useToast } from '../ToastContext';

// Test component that uses the toast context
const TestComponent: React.FC = () => {
  const { showToast, hideToast } = useToast();
  return (
    <div>
      <button onClick={() => showToast('Test message')}>Show Toast</button>
      <button onClick={() => showToast()}>Show Default Toast</button>
      <button onClick={hideToast}>Hide Toast</button>
    </div>
  );
};

describe('ToastContext', () => {
  it('shows toast with custom message', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    await user.click(screen.getByText('Show Toast'));
    
    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByText('Notification')).toBeInTheDocument();
  });

  it('shows toast with default message', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    await user.click(screen.getByText('Show Default Toast'));
    
    expect(screen.getByText('The site may be slow to respond after a certain time of inactivity.')).toBeInTheDocument();
    expect(screen.getByText('Notification')).toBeInTheDocument();
  });

  it('hides toast when hideToast is called', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    // Show toast first
    await user.click(screen.getByText('Show Toast'));
    expect(screen.getByText('Test message')).toBeInTheDocument();

    // Hide toast
    await user.click(screen.getByText('Hide Toast'));
    expect(screen.queryByText('Test message')).not.toBeInTheDocument();
  });

  it('hides toast when close button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    // Show toast first
    await user.click(screen.getByText('Show Toast'));
    expect(screen.getByText('Test message')).toBeInTheDocument();

    // Click close button
    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);
    expect(screen.queryByText('Test message')).not.toBeInTheDocument();
  });
}); 