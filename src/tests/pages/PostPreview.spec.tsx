import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { mocked } from 'ts-jest/utils';
import Post, { getStaticProps, getStaticPaths } from '../../pages/posts/preview/[slug]';
import { getPrismicClient } from '../../services/prismic'

jest.mock('../../services/prismic');
jest.mock('next/router');
jest.mock('next-auth/client');

const post = {
  slug: 'my-post',
  title: 'My Post',
  content: '<p>Post content</p>',
  updatedAt: '4th April',
};

describe('Posts preview page', () => {
  it('renders correctly', () => {
    const mockedUseSession = mocked(useSession);

    mockedUseSession.mockReturnValueOnce([null, false]);

    render(
      <Post
        post={post}
      />
    );

    expect(screen.getByText('My Post')).toBeInTheDocument();
    expect(screen.getByText('Post content')).toBeInTheDocument();
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument();
  });

  it('redirects user to full post when user is subscribed', async () => {
    const mockedUseSession = mocked(useSession);
    const mockedUseRouter = mocked(useRouter);
    const mockedPush = jest.fn();

    mockedUseSession.mockReturnValueOnce([
      {
        activeSubscription: 'fake-subscription'
      },
      false
    ] as any);
    
    mockedUseRouter.mockReturnValueOnce({
      push: mockedPush,
    } as any);

    render(
      <Post
        post={post}
      />
    );

    expect(mockedPush).toHaveBeenCalledWith('posts/my-post');
  });

  it('loads initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            { type: 'heading', text: 'My post' },
          ],
          content: [
            { type: 'paragraph', text: 'Post Content' }
          ],
        },
        last_publication_date: '04-04-2021',
      }),
    } as any);

    await getStaticPaths();

    const response = await getStaticProps({
      params: {
        slug: 'my-post',
      },
    });

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-post',
            title: 'My post',
            content: '<p>Post Content</p>',
            updatedAt: '2021 M04 04',
          }
        }
      }),
    );
  });
});
