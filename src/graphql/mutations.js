/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createSpot = /* GraphQL */ `
  mutation CreateSpot(
    $input: CreateSpotInput!
    $condition: ModelSpotConditionInput
  ) {
    createSpot(input: $input, condition: $condition) {
      id
      user_id
      fish_type
      time_caught
      bait
      weather
      tide
      lat_long
      public
      createdAt
      updatedAt
    }
  }
`;
export const updateSpot = /* GraphQL */ `
  mutation UpdateSpot(
    $input: UpdateSpotInput!
    $condition: ModelSpotConditionInput
  ) {
    updateSpot(input: $input, condition: $condition) {
      id
      user_id
      fish_type
      time_caught
      bait
      weather
      tide
      lat_long
      public
      createdAt
      updatedAt
    }
  }
`;
export const deleteSpot = /* GraphQL */ `
  mutation DeleteSpot(
    $input: DeleteSpotInput!
    $condition: ModelSpotConditionInput
  ) {
    deleteSpot(input: $input, condition: $condition) {
      id
      user_id
      fish_type
      time_caught
      bait
      weather
      tide
      lat_long
      public
      createdAt
      updatedAt
    }
  }
`;
