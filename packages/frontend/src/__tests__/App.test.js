import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../App';

// Create a test query client
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

// Mock fetch for tests
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
);

test('renders TODO App heading', async () => {
  const testQueryClient = createTestQueryClient();

  render(
    <QueryClientProvider client={testQueryClient}>
      <App />
    </QueryClientProvider>
  );

  const headingElement = await screen.findByText(/TODO App/i);
  expect(headingElement).toBeInTheDocument();
});

describe('Delete functionality', () => {
  test('should call DELETE endpoint when delete button is clicked', async () => {
    const mockTodos = [
      { id: 1, title: 'Test Todo 1', completed: false },
      { id: 2, title: 'Test Todo 2', completed: true },
    ];

    global.fetch = jest.fn((url, options) => {
      // Initial fetch for todos
      if (!options || options.method !== 'DELETE') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockTodos),
        });
      }
      // DELETE request
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });

    const testQueryClient = createTestQueryClient();
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={testQueryClient}>
        <App />
      </QueryClientProvider>
    );

    // Wait for todos to load
    await screen.findByText('Test Todo 1');

    // Find all IconButtons with colorError (delete buttons are red)
    const deleteButtons = screen.getAllByRole('button').filter(
      button => button.className.includes('MuiIconButton-colorError')
    );
    expect(deleteButtons.length).toBe(2);
    
    await user.click(deleteButtons[0]);

    // Verify DELETE request was made
    await waitFor(() => {
      const deleteCalls = global.fetch.mock.calls.filter(
        call => call[1]?.method === 'DELETE'
      );
      expect(deleteCalls.length).toBeGreaterThan(0);
    });
    
    const deleteCalls = global.fetch.mock.calls.filter(
      call => call[1]?.method === 'DELETE'
    );
    expect(deleteCalls[0][0]).toContain('/api/todos/1');
  });
});

describe('Stats calculation', () => {
  test('should display correct incomplete and completed counts', async () => {
    const mockTodos = [
      { id: 1, title: 'Todo 1', completed: false },
      { id: 2, title: 'Todo 2', completed: true },
      { id: 3, title: 'Todo 3', completed: false },
      { id: 4, title: 'Todo 4', completed: true },
      { id: 5, title: 'Todo 5', completed: true },
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTodos),
      })
    );

    const testQueryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={testQueryClient}>
        <App />
      </QueryClientProvider>
    );

    // Wait for todos to load
    await screen.findByText('Todo 1');

    // Check stats
    expect(screen.getByText('2 items left')).toBeInTheDocument();
    expect(screen.getByText('3 completed')).toBeInTheDocument();
  });

  test('should update stats when all todos are complete', async () => {
    const mockTodos = [
      { id: 1, title: 'Todo 1', completed: true },
      { id: 2, title: 'Todo 2', completed: true },
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTodos),
      })
    );

    const testQueryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={testQueryClient}>
        <App />
      </QueryClientProvider>
    );

    await screen.findByText('Todo 1');

    expect(screen.getByText('0 items left')).toBeInTheDocument();
    expect(screen.getByText('2 completed')).toBeInTheDocument();
  });
});

describe('Empty state', () => {
  test('should display empty state message when no todos', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    const testQueryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={testQueryClient}>
        <App />
      </QueryClientProvider>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Check for empty state message
    expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();
  });

  test('should not display empty state when todos exist', async () => {
    const mockTodos = [
      { id: 1, title: 'Test Todo', completed: false },
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTodos),
      })
    );

    const testQueryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={testQueryClient}>
        <App />
      </QueryClientProvider>
    );

    await screen.findByText('Test Todo');

    expect(screen.queryByText(/no todos yet/i)).not.toBeInTheDocument();
  });
});

describe('Error handling', () => {
  test('should display error message when fetch fails', async () => {
    // Mock fetch to reject with an error
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Network error'))
    );

    const testQueryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={testQueryClient}>
        <App />
      </QueryClientProvider>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Check for error message
    expect(screen.getByText(/error loading todos/i)).toBeInTheDocument();
  });

  test('should display error message when response is not ok', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error('Server error')),
      })
    );

    const testQueryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={testQueryClient}>
        <App />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    expect(screen.getByText(/error loading todos/i)).toBeInTheDocument();
  });
});

afterEach(() => {
  jest.clearAllMocks();
});
