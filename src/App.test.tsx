/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-07-22 15:32:33
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2021-07-22 22:15:03
 * @FilePath: \mindmap\src\App.test.tsx
 */
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
