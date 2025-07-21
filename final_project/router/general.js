const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });

  if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;

  if(username && password){
    if(!doesExist(username)){
      users.push({"username" : username, "password" : password});
      return res.status(200).json({message: "Users Created Successfully!"});
    }
    else{
      return res.status(404).json({message: "Username Already Exists"});
    }
  }
  else{
    return res.status(404).json({message : "Re-enter the username and password."})
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(booksdb, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "No such ISBN number." });
  }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author.toLowerCase();

  try {
    const booksByAuthor = [];
    for(const key in books){
      if(books[key].author.toLowerCase() === author){
        booksByAuthor.push({ isbn: key, ...books[key] });
      }
    }

    if(booksByAuthor.length > 0){
      res.status(200).json(booksByAuthor);
    }
    else{
      res.status(404).json({message : "No Books for this author."})
    }

  }
  catch(error){
    res.status(500).json({ message: "Server error" });
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title.toLowerCase();
  try{
    const booksByTitle = [];

    for(const key in books){
      if(books[key].title.toLowerCase === title){
        booksByTitle.push({isbn : key, ...books[key] });
      }
    }
    if(booksByTitle.length > 0){
      return res.status(200).json(booksByTitle);
    }
    else{
      return res.status(404).json({message : "No Books with that title"});
    }
  }
  catch(error){
    res.status(500).json({message : "Server error"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "No such ISBN number." });
  }
});

module.exports.general = public_users;
