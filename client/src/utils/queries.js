import {gql} from '@apollo/client'; 

export const QUERY_USER = gql`
  query getUser($userId: ID, $username: String, $email: String) {
    getUser(userId:$userID, username: $username, email:$email ) {
      _id
      username
      email
      savedBooks {
        bookId
        title
        description
        link
        authors
      }
    }
  }
`;