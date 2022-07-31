import React, { useState, useEffect } from 'react';
import {useMutation} from '@apollo/client';
import {useQuery} from '@apollo/client';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';

import {DELETE_BOOK } from '../utils/mutations';
import {QUERY_USER} from '../utils/queries';
import { removeBookId } from '../utils/localStorage';

import Auth from '../utils/auth';

const SavedBooks = () => {
  const [userData, setUserData] = useState({});

  const [deleteBook, { error }] = useMutation(DELETE_BOOK, {
		update(cache, { data: { deleteBook } }) {
			try {
        const { foundUser } = cache.readQuery({ query: QUERY_USER });

				cache.writeQuery({
					query: QUERY_USER,
					data: { user: foundUser },
				});
			} catch (e) {
				console.error(e);
			}
		},
	});

  // use this to determine if `useEffect()` hook needs to run again
  const userDataLength = Object.keys(userData).length;

  useEffect(() => {
    const getUserData = async () => {
      try {
        const {loading, data} = await useQuery(QUERY_USER);
        if (data) {
          setUserData(data);
        }
        else {
          throw new Error('something went wrong!');
        }
      } catch (err) {
        console.error(err);
      }
    };
    getUserData();
  }, [userDataLength]);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {


    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      
      const { loading, data } = await deleteBook(bookId); 

      if (!data) {
        throw new Error('something went wrong!');
      }

      setUserData(data);
      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (!userDataLength) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
