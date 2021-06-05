import { render, screen } from '@testing-library/react';
import { getSession } from 'next-auth/client';
import { mocked } from 'ts-jest/utils';
import Post, { getServerSideProps } from '../../pages/posts/[slug]';
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

describe('Posts page', () => {
  it('renders correctly', () => {
    render(
      <Post
        post={post}
      />
    );

    expect(screen.getByText('My Post')).toBeInTheDocument();
    expect(screen.getByText('Post content')).toBeInTheDocument();
  });

  it('redirects user if no subscription is found', async () => {
    const getSessionMocked = mocked(getSession);
    
    getSessionMocked.mockResolvedValueOnce(null);
    

    const response = await getServerSideProps({
      params: {
        slug: 'new-post'
      }
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/',
        }),
      }),
    );
  });

  it('loads initial data', async () => {
    const getSessionMocked = mocked(getSession);

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

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription'
    } as any);

    const response = await getServerSideProps({
      params: {
        slug: 'my-post'
      }
    } as any);

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
