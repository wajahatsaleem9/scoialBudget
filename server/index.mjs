// imports
import express from 'express';
import morgan from 'morgan'; //login middleware
import cors from 'cors';// cors middleware

import bodyParser from 'body-parser';

//import Dao function
import UserDao from './models/user-Dao.mjs';

const userDao = new UserDao();


// init express
const app = new express();
app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.json({limit:'50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}))
app.use(express.static('public'));

//setup CORS
const corsOptions = {
  origin: 'http://localhost:5173',
  Credential: true
};
app.use(cors(corsOptions));


//passport for authentication 

import passport from 'passport';
import LocalStrategy from 'passport-local';

//search in db username and password via hash and salt

passport.use(new LocalStrategy(async function verify(username, password, callback){
  const user = await userDao.getUserByCredentials(username, password)
  if(!user){
    return callback(null, false, 'Incorrect Credentials')
  }
  else{
    return callback(null, user) //user info session will be return by userDao i.e. id, username ....
  }
}

));


//serializing in the session in the user Object given from LocalStrategy(verify).

passport.serializeUser(function (user, callback) {
  callback(null, user);
})

//starting from the data in session we extract current (logged-in) user 

passport.deserializeUser(function(user, callback) {
  return callback(null, user); //this will be available in req.user
});



//creating the session

import session from 'express-session';

app.use(session({
  secret: "This is a very secret information used to initialize the session!",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.authenticate('session'));



//Defining authentication verification middleware 

const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) return next();
  
  return res.status(401).json({error: 'Not Authorized'});
}



// API calls from here on ******************

// Users APIs

//login 

app.post('/api/login', function(req, res, next) {
  passport.authenticate('local', (err, user, info) =>{
    if(err)
      return next(err);
    if(!user){
      //display no use found
      return res.status(401).json({success: false, error: 'User Not Found'});
    }
    // success login 
    req.login(user, (err) =>{
      if(err) return next(err);
      return res.json(req.user);
    });
  })(req,res,next);
});

//register
app.post('/api/register', function(req, res){
  let username = req.body.username;
  let password = req.body.password;
  let role = req.body.role;

  if(username && password && role){
    userDao.registerUser(username, password, role)
    .then((newUser) =>{
      res.json({message: "User Registered", user: newUser});
    })
    .catch((err)=>{
      console.error('Error user register:', err);
      res.status(500).json({error: 'Internal server error'})
    })

  }
  else{
    res.status(400).json({ error: 'Missing username, password, or role' });
  }
  

});

//logout

app.post('/api/logout', function(req, res, next) {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie('This is a very secret information used to initialize the session!'); // Assuming 'connect.sid' is the session cookie name
      res.status(200).json({ success: true, message: 'Logged out successfully' });
    });
  });
});

//get role

app.get('/api/:user_id/getRole', async(req, res) =>{
  const user_id = req.params.user_id;
  const response = await userDao.getRole(user_id)
  res.json(response)

})

//get phase

app.get('/api/getPhase', async (req, res) =>{
  const response = await userDao.getPhase();
  res.json(response)
})


//change phase
app.post('/api/changePhase', async (req, res) => {
  const { current_phase } = req.body;

 try {
    
    await userDao.changePhase(current_phase);
    res.status(200).json({ message: 'Phase updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
//set budget
app.post('/api/setBudget', async (req, res) => {
  const { budget } = req.body;

 try {
    
    await userDao.setBudget(budget);
    res.status(200).json({ message: 'Budget updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//get budget

app.get('/api/getBudget', async (req, res) =>{
  const response = await userDao.getBudget();
  res.json(response)
})

//add proposal
app.post('/api/addProposal', async (req, res) => {
  const { user_id, description, cost } = req.body;

 try {
    
    await userDao.addProposal(user_id, description, cost);
    res.status(200).json({message: 'Proposal updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//delete proposal
app.post('/api/deleteProposal', async (req, res) => {
  const {cost, description} = req.body;

 try {
    
    await userDao.deleteProposal(cost, description);
    res.status(200).json({message: 'Proposal updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//get proposal

app.get('/api/getProposal/:user_id', async (req, res) =>{
  try {
    const user_id = req.params.user_id;
    const response = await userDao.getProposal(user_id);
    if (response.error) {
      res.status(404).json(response);
    } else {
      res.json(response);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

//get user by user_id
app.post('/api/getUser', async (req, res) => {
  const {user_id} = req.body;

 try {
    
    await userDao.getUser(user_id);
    res.status(200).json({message: 'error' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//insert proposal scres/vote
app.post('/api/updateScore', async (req, res) => {
  const {user_id, proposal_id, score} = req.body;

 try {
    
    await userDao.updateScore(user_id, proposal_id, score);
    res.status(200).json({message: 'sucess' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//get all proposal in the final stage
app.post('/api/finalProposals', async (req, res) => {
  //const { budget } = req.body;

  try {
    const result = await userDao.finalProposals();
    console.log('Final Proposals Result:', result); // Log the result to the terminal

    res.status(200).json({result});
  } catch (error) {
    console.error('Error fetching final proposals:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//clear db except users table
app.post('/api/resetDb', async (req, res) => {
  //const { buphasedget } = req.body;

  try {
    const result = await userDao.resetDb();
    console.log('Data from table votes and Proposal have been deleted:'); 

    res.status(200).json({result});
  } catch (error) {
    console.error('Error fetching final proposals:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});































// activate the server
const port = 3001;
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

