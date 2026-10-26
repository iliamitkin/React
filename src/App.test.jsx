import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

it('переходит на лениво загружаемую страницу обзора недели', async () => {
  const user = userEvent.setup();
  render(<App/>);
  await user.click(screen.getByRole('link', { name: /обзор недели/i }));
  expect(await screen.findByRole('heading', { name: /обзор недели/i })).toBeInTheDocument();
});
