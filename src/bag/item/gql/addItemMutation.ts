import gql from 'graphql-tag';

export const AddItemGQL = gql`
  mutation AddItem($id: ID!, $input: AddItemInput!) {
    addItem(id: $id, input: $input) {
      __typename
      ... on Campaign {
        id
        items {
          name
          description
        }
      }
      ... on CampaignNotFound {
        message
      }
    }
  }
`;
