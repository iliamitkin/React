import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

it('переходит на лениво загружаемую страницу обзора недели', async () => {
  const user = userEvent.setup();
  render(<App/>);
  await user.click(screen.getByRole('link', { name: /обзор недели/i }));
  expect(await screen.findByRole('heading', { name: /обзор недели/i })).toBeInTheDocument();
});

it('открывает обзор напрямую по ссылке GitHub Pages после обновления', async () => {
  window.history.replaceState({}, '', '/React/#/insights');
  render(<App/>);
  expect(await screen.findByRole('heading', { name: /обзор недели/i })).toBeInTheDocument();
  const user = userEvent.setup();
  await user.click(screen.getByRole('link', { name: /мои привычки/i }));
  expect(window.location.hash).toBe('#/');
});
