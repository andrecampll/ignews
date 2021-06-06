import { render, screen, fireEvent } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import { useSession, signIn, signOut } from 'next-auth/client';
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

  it('should be able to sign in when is not authenticated', () => {
    const mockedSignIn = mocked(signIn);
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false]);

    render(
      <Button />
    );

    const buttonElement = screen.getByText('Sign in with GitHub');

    fireEvent.click(buttonElement);
  
    expect(mockedSignIn).toHaveBeenCalled();
  });

  it('should be able to sign out when is authenticated', () => {
    const mockedSignOut = mocked(signOut);
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

    const buttonElement = screen.getByText('John Doe');

    fireEvent.click(buttonElement);
  
    expect(mockedSignOut).toHaveBeenCalled();
  });
});
