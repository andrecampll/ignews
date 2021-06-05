import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import { useSession } from 'next-auth/client';
import { Button } from '.';

jest.mock('next-auth/client');

describe('Button component', () => {
  it('should render correctly when user is not authenticated', () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false]);

    render(
      <Button />
    );
  
    expect(screen.getByText('Sign in with GitHub')).toBeInTheDocument();
  });

  it('should render correctly when user is authenticated', () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([
      {
        user: {
          name: 'John Doe',
          email: 'johndoe@johndoe.com',
        },
        expires: '7d',
      },
      true
    ]);

    render(
      <Button />
    );
  
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
