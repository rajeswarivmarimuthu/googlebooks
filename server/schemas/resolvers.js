const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { findOneAndUpdate } = require('../models/User');
const { signToken } = require('../utils/auth');


const resolvers = {
    Query : {
    founduser: async (parent,args, context) => {
        if (context.user) {
            const user = await User.findOne({$or: [{ _id: context.user._id}, { username: context.user.username}],})
                                    .populate('Book');
            return {user};
        }
        throw new AuthenticationError('Cannot find a user with this id/username');
    
       }
    },
        
    Mutation: {
        //login credentials validation
        login: async(parent,{email, password}) => {
            const user = await User.findOne({email});
            if (!user) {
                throw new AuthenticationError ('Incorrect Credentials');
            }

            const correctPw = await User.isCorrectPassword(password);
            if(!correctPw) {
                throw new AuthenticationError ('Incorrect Credentials');
            }
            
            const token = signToken (user);
            return {user, token} ;
        },

        //add user to the system
        createUser: async (parent, {username, email, password}) => {
            const user = await User.create ({username, email, password});
            const token = signToken(user);
            return {token, user};
        },

        //code to save book to user profile
        saveBook: async (parent, args, context) => {
            console.log(args, context);
            if (context.user) {
            const newBook = await findOneAndUpdate (
                {_id: context.user._id },
                {
                    $addToSet: {
                        savedBooks: {
                                description: args.description,
                                authors: args.authors,
                                bookId: args.bookId,
                                title: args.title,
                                image: args.image
                            },
                        },
                    },
                    {new: true},   
            );
            return (newBook);
            }
            throw new AuthenticationError ('User not found');
        }, 

        //function to delete book from user profile
        deleteBook: async (parent, {bookId},context) => {
            console.log(args, context);
            if (context.user) {
                const removedBook = await findOneAndUpdate (
                    {id:context.user._id},
                    {$pull: {savedBooks:{bookId}}},
                    {new: true}
                )
                return(removedBook);
            }
            throw new AuthenticationError ('User not found');
        },

    }   

};

module.exports = resolvers;