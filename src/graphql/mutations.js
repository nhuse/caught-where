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
      date_caught
      time_caught
      bait
      weather
      tide
      lat
      long
      public
      image
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
      date_caught
      time_caught
      bait
      weather
      tide
      lat
      long
      public
      image
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
      date_caught
      time_caught
      bait
      weather
      tide
      lat
      long
      public
      image
      createdAt
      updatedAt
    }
  }
`;
export const createUserDefaultLocation = /* GraphQL */ `
  mutation CreateUserDefaultLocation(
    $input: CreateUserDefaultLocationInput!
    $condition: ModelUserDefaultLocationConditionInput
  ) {
    createUserDefaultLocation(input: $input, condition: $condition) {
      id
      user_id
      lat
      long
      createdAt
      updatedAt
    }
  }
`;
export const updateUserDefaultLocation = /* GraphQL */ `
  mutation UpdateUserDefaultLocation(
    $input: UpdateUserDefaultLocationInput!
    $condition: ModelUserDefaultLocationConditionInput
  ) {
    updateUserDefaultLocation(input: $input, condition: $condition) {
      id
      user_id
      lat
      long
      createdAt
      updatedAt
    }
  }
`;
export const deleteUserDefaultLocation = /* GraphQL */ `
  mutation DeleteUserDefaultLocation(
    $input: DeleteUserDefaultLocationInput!
    $condition: ModelUserDefaultLocationConditionInput
  ) {
    deleteUserDefaultLocation(input: $input, condition: $condition) {
      id
      user_id
      lat
      long
      createdAt
      updatedAt
    }
  }
`;
