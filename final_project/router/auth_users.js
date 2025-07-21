const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
  return usernameRegex.test(username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let matches = users.filter((user)=>{
      return (username === user.username && password === user.password);
    });

    if(matches.length > 0){
      return true;
    }
    else{
      return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
      const username = req.body.username;
      const password = req.body.password;

      // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    //Authentice User
    if(authenticatedUser(username,password)) {
        let accessToken = jwt.sign(
          {data:password},
          'access',
          {expiresIn: 60 * 60}
        );
        
        req.session.authorization = {
          accessToken, username
        }

        return res.status(200).json({message:"User has logged in"});
    }
    else{
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }

});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session?.authorization?.username;

  // Check if book exists
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  // Check if review text is provided
  if (!review) {
    return res.status(400).json({ message: "Review text is required." });
  }

  // Add or update the user's review
  book.reviews[username] = review;

  return res.status(200).json({ message: "Review added/updated successfully." });
});


// regd_users.delete("/auth/review/:isbn", (req, res) => {
//   const isbn = req.params.isbn;
//   if(isbn){
//     const bookTitle = books[isbn].title;
//     delete books[isbn];
//     return res.status(200).json({message : `${bookTitle} with the ISBN : `})
//   }
// });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
