import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import Posts, { getStaticProps } from '../../pages/posts';
import { getPrismicClient } from '../../services/prismic'

jest.mock('../../services/prismic');

const posts = [
  {
    slug: 'my-post',
    title: 'My Post',
    excerpt: 'Post excerpt',
    updatedAt: '4th April',
  },
];

describe('Posts page', () => {
  it('renders correctly', () => {
    render(
      <Posts
        posts={posts}
      />
    );

    expect(screen.getByText('My Post')).toBeInTheDocument();
  });

  it('loads initial data', async () => {
    const mockedGetPrismicClient = mocked(getPrismicClient);

    mockedGetPrismicClient.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'new-post',
            data: {
              title: [
                { type: 'heading', text: 'New post' },
              ],
              content: [
                { type: 'paragraph', text: 'Post excerpt' }
              ],
            },
            last_publication_date: '04-04-2021',
          }
        ]
      })
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [{
            slug: 'new-post',
            title: 'New post',
            excerpt: 'Post excerpt',
            updatedAt: '2021 M04 04'
          }]
        },
      }),
    );
  });
});
