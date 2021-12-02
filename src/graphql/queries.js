/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getSpot = /* GraphQL */ `
  query GetSpot($id: ID!) {
    getSpot(id: $id) {
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
export const listSpots = /* GraphQL */ `
  query ListSpots(
    $filter: ModelSpotFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSpots(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getUserDefaultLocation = /* GraphQL */ `
  query GetUserDefaultLocation($id: ID!) {
    getUserDefaultLocation(id: $id) {
      id
      user_id
      lat
      long
      createdAt
      updatedAt
    }
  }
`;
export const listUserDefaultLocations = /* GraphQL */ `
  query ListUserDefaultLocations(
    $filter: ModelUserDefaultLocationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserDefaultLocations(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        user_id
        lat
        long
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
