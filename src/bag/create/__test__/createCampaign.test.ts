import { client } from '../../../shared/gqlClient';
import { createCampaign } from '../createCampaign';
import { CreateCampaignGQL } from '../gql/createCampaignMutation';

const setUpQueryMock = (errors = [] as Error[]) => {
  return jest.spyOn(client, 'query').mockResolvedValueOnce({
    data: { __typename: 'CreatedCampaign', id: '1234' },
    errors,
  } as any);
};

const expectedQuery = (name: string) => ({
  query: CreateCampaignGQL,
  variables: {
    name,
  },
});

describe('createCampaign', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('executes a GQL query', async () => {
    const name = 'Test Campaign';

    const clientSpy = setUpQueryMock();

    await createCampaign(name);

    expect(clientSpy).toHaveBeenCalledWith(expectedQuery(name));
  });

  it('returns the created campaign details', async () => {
    const name = 'Test Campaign';

    setUpQueryMock();

    const result = await createCampaign(name);

    expect(result).toStrictEqual({ __typename: 'CreatedCampaign', id: '1234' });
  });

  it('throws an error if creation fails', async () => {
    const name = 'Test Campaign';

    setUpQueryMock([new Error('Something went wrong')]);

    try {
      await createCampaign(name);
    } catch (error) {
      expect((error as Error).message).toStrictEqual(
        'Failed to create campaign.'
      );
    }
  });
});
