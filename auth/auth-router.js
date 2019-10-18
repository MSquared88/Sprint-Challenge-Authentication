const router = require('express').Router();

const authModel = require('./auth-model')

//auth
const bcrypt = require('bcryptjs')
const createToken = require('./utils/createToken')

router.post('/register', (req, res) => {
  // implement registration
  const user = req.body

  if(!user.username || !user.password){
    res.status(400).json({message: 'username and password are required fields'})
  }
  else {
    const hash = bcrypt.hashSync(user.password, 10);
    
    user.password = hash
    console.log(user)
    authModel.add(user)
    .then(user => {
      res.status(201).json(user)
    })
    .catch(err => {
      res.status(500).json({message: "user could not be added to the database", err})
    })
  }
});

router.post('/login', (req, res) => {
  // implement login

	const {username, password} = req.body

	authModel.getBy( {username} )
	.then(user => {
		if (user && bcrypt.compareSync(password, user.password)) {
			const token = createToken(user)
			res.status(200).json({
				message: `Welcome ${user.username}!`,
				token
			});
		} else {
			res.status(401).json({ message: 'You shall not pass!!' });
		}
	})
	.catch(error => {
		res.status(500).json({message: "could not login user", error});
	});
});

module.exports = router;
