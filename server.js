const express = require("express");
const bcrypt = require('bcrypt');


const app = express();
app.use(express.json());


let users = [];

// GET all users
app.get('/users', (req, res) => {
  res.json(users);
});

// GET a specific user
app.get('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.findIndex(user => user.id === id);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({
       error: 'User not found' 
      });
  }
});
// Signup
app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  //hash the password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      res.status(500).json({ error: 'Error hashing password' });
    } else {
      const newUser = { id: users.length + 1, name, email, password: hashedPassword };
      users.push(newUser);
      res.status(201).json({
         message: 'Signup successful',
          user: newUser 
        });
    }
  });
});

// Login

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.findIndex(user => user.email === email);
  if (user) {
    //check if the password match
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Error comparing passwords' });
      } else if (result) {
        res.json({ message: 'Login successful' });
      } else {
        res.status(401).json({ error: 'Passwords do not match' });
      }
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// UPDATE a user
app.put('/users/:id', (req, res) => {
  const {id} = req.params;
  const { name, email } = req.body;
  const user = users.findIndex(user => user.id === Number(id));

  if (user) {
    user.name = name;
    user.email = email;
    res.json({
      message:"user updated successfully",
      results:user});
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// DELETE a user
app.delete('/users/:id', (req, res) => {
  const {id} = req.params;
  const index = users.findIndex(user => user.id === Number(id));

  if (index !== -1) {
    const deletedUser = users.splice(index, 1);
    res.json({
      message:"Use deleted successfully",
      results:deletedUser
    }
      
      );
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});



app.listen(8000,()=>console.log('server is running'));