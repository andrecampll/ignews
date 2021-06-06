import { render, screen, fireEvent } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import { signIn, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { SubscribeButton } from '.';
import { getStripeJs } from '../../services/stripe-js';
import { api } from '../../services/api';

jest.mock('next/router');
jest.mock('next-auth/client');
jest.mock('../../services/api');
jest.mock('../../services/stripe-js');

describe('SubscribeButton component', () => {
  it('should render correctly', () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false]);

    render(
      <SubscribeButton />
    );
  
    expect(screen.getByText('Subscribe now')).toBeInTheDocument();
  });

  it('redirects user to sign in when it is not authenticated', () => {
    const mockedSignIn = mocked(signIn);

    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false]);

    render(
      <SubscribeButton />
    );

    const subscribeButton = screen.getByText('Subscribe now');

    fireEvent.click(subscribeButton);

    expect(mockedSignIn).toHaveBeenCalled();
  });

  it('redirects user to posts when user has already a subscription', () => {
    const mockedUseRouter = mocked(useRouter);
    const mockedUseSession = mocked(useSession);

    const pushMock = jest.fn();

    mockedUseSession.mockReturnValueOnce([
      {
        user: {
          name: 'John Doe',
          email: 'johndoe@johndoe.com',
        },
        activeSubscription: 'fake-subscription',
        expires: '7d',
      },
      true
    ]);

    mockedUseRouter.mockReturnValueOnce({
      push: pushMock,
    } as any);

    render(
      <SubscribeButton />
    );

    const subscribeButton = screen.getByText('Subscribe now');

    fireEvent.click(subscribeButton);

    expect(pushMock).toHaveBeenCalledWith('/posts');
  });  
});
