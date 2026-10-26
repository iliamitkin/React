import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Link } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import ProtectedRoute from '../../components/ProtectedRoute';

// Тестовые компоненты
function HomePage() {
  return <h1 data-testid="home-title">Home Page</h1>;
}

function LoginPage() {
  return (
    <div>
      <h1 data-testid="login-title">Login Page</h1>
      <Link to="/dashboard" data-testid="login-link">
        Go to Dashboard
      </Link>
    </div>
  );
}

function DashboardPage() {
  return <h1 data-testid="dashboard-title">Dashboard</h1>;
}

function NotFoundPage() {
  return <h1 data-testid="not-found-title">404 - Page Not Found</h1>;
}

// Тесты
describe('React Router v6 integration', () => {
  const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    
    return render(
      <MemoryRouter initialEntries={[route]}>
        {ui}
      </MemoryRouter>
    );
  };

  test('navigates between pages using links', async () => {
    const App = () => (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    );
    
    renderWithRouter(<App />, { route: '/' });
    expect(screen.getByTestId('home-title')).toBeInTheDocument();
    
    // Навигация через изменение URL
    renderWithRouter(<App />, { route: '/login' });
    expect(screen.getByTestId('login-title')).toBeInTheDocument();
    
    renderWithRouter(<App />, { route: '/dashboard' });
    expect(screen.getByTestId('dashboard-title')).toBeInTheDocument();
  });

  test('ProtectedRoute redirects unauthenticated users', () => {
    const App = ({ isAuthenticated }) => (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    );
    
    // Неавторизованный пользователь
    renderWithRouter(<App isAuthenticated={false} />, { route: '/dashboard' });
    expect(screen.getByTestId('login-title')).toBeInTheDocument();
    
    // Авторизованный пользователь
    renderWithRouter(<App isAuthenticated={true} />, { route: '/dashboard' });
    expect(screen.getByTestId('dashboard-title')).toBeInTheDocument();
  });

  test('link navigation works correctly', async () => {
    const App = () => (
      <div>
        <nav>
          <Link to="/" data-testid="home-link">Home</Link>
          <Link to="/login" data-testid="login-link">Login</Link>
        </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    );
    
    renderWithRouter(<App />);
    const user = userEvent.setup();
    
    expect(screen.getByTestId('home-title')).toBeInTheDocument();
    
    // Кликаем по ссылке Login
    await user.click(screen.getByTestId('login-link'));
    expect(screen.getByTestId('login-title')).toBeInTheDocument();
    
    // Возвращаемся на Home
    await user.click(screen.getByTestId('home-link'));
    expect(screen.getByTestId('home-title')).toBeInTheDocument();
  });

  test('handles 404 routes', () => {
    const App = () => (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    );
    
    renderWithRouter(<App />, { route: '/non-existent-route' });
    expect(screen.getByTestId('not-found-title')).toBeInTheDocument();
  });
});
