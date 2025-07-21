const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
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

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
