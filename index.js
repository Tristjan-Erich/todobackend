const express = require('express')
const app = express()
const port = 3000

//express suport for multy part form data
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const tasks = [
  {
    "id": 1,
    "title": "Task 1 User 1",
    "description": "Task 1 description",
    "status": "pending",
    "user_id": 1
  },
  {
    "id": 2,
    "title": "Task 1 User 2",
    "description": "Task 1 description",
    "status": "pending",
    "user_id": 2
  },
  {
    "id": 3,
    "title": "Task 1 User 3",
    "description": "Task 1 description",
    "status": "pending",
    "user_id": 3
  },
  {
    "id": 4,
    "title": "Task 2 User 1",
    "description": "Task 2 description",
    "status": "pending",
    "user_id": 1
  },
  {
    "id": 5,
    "title": "Task 2 User 2",
    "description": "Task 2 description",
    "status": "pending",
    "user_id": 2
  },
  {
    "id": 6,
    "title": "Task 2 User 3",
    "description": "Task 2 description",
    "status": "pending",
    "user_id": 3
  }
]

// default users array
const users = [
  {
    "id": 1,
    "name": "User 1",
    "email": "user1@gmail.com",
    "password": "user1"
  },
  {
    "id": 2,
    "name": "User 2",
    "email": "user2@gmail.com",
    "password": "user2"
  },
  {
    "id": 3,
    "name": "User 3",
    "email": "user3@gmail.com",
    "password": "user3"
  }
]

const sessions = {
  "testtoken": {
    "id": 3,
    "name": "User 3",
    "email": "user3@gmail.com",
    "password": "user3"
  }
}

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// auth middleware check bearer token
function auth(req, res, next) {
  if (req.url == "/login" || req.url == "/register") {
    next()
    return;
  }

  const bearerHeader = req.headers['authorization']
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ')
    const bearerToken = bearer[1]
    req.token = bearerToken
    req.session = sessions[req.token]
    next()
  } else {
    res.sendStatus(403)
  }
}

//crud api endpoints for users and check if user is authenticated or not 
app.get('/users', (req, res) => {
  const userId = req.session.id
  if (userId) {
   res.send(users)
  } else {
    res.send(loginForm())
  }
})

app.post('/users', (req, res) => {
  const userId = req.session.id
  if (userId) {
    users.push(req.body)
    res.send(users)
  } else {
    res.send(loginForm())
  }
})

app.get('/users/:id', (req, res) => {
  const userId = req.session.id
  if (userId) {
   res.send(users[req.params.id])
  } else {
    res.send(loginForm())
  }
})

app.put('/users/:id', (req, res) => {
  const userId = req.session.id
  if (userId) {
    users[req.params.id] = req.body
    res.send(users)
  } else {
    res.send(loginForm())
  }
})

app.delete('/users/:id', (req, res) => {
  const userId = req.session.id
  if (userId) {
    users.splice(req.params.id, 1)
    res.send(users)
  } else {
    res.send(loginForm())
  }
})

//crud api endpoints for tasks and check if user is authenticated or not
app.get('/tasks', (req, res) => {
  const userId = req.session.id
  if (userId) {
    res.send(tasks)
  } else {
    res.send(loginForm())
  }
})

app.post('/tasks', (req, res) => {
  const userId = req.session.id
  if (userId) {
    tasks.push(req.body)
    res.send(tasks)
  } else {
    res.send(loginForm())
  }
})

app.get('/tasks/:id', (req, res) => {
  const userId = req.session.id
  if (userId) {
    res.send(tasks[req.params.id])
  } else {
    res.send(loginForm())
  }
})

app.put('/tasks/:id', (req, res) => {
  const userId = req.session.id
  if (userId) {
    tasks[req.params.id] = req.body
    res.send(tasks)
  } else {
    res.send(loginForm())
  }
})

app.delete('/tasks/:id', (req, res) => {
  const userId = req.session.id
  if (userId) {
    tasks.splice(req.params.id, 1)
    res.send(tasks)
  } else {
    res.send(loginForm())
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



//login api endpoint for users
app.post('/login', (req, res) => {
  const user = users.find(user => user.email === req.body.email)
  if (user && user.password === req.body.password) {
    const token = Math.random().toString(36).substring(7)
    sessions[token] = user
    res.send({ token })
  } else {
    res.send('Invalid credentials')
  }
})


//login form template
function loginForm() {
  return `
    <form action="/login" method="post">
      <input type="text" name="email" placeholder="email" />
      <input type="password" name="password" placeholder="password" />
      <input type="submit" value="Login" />
    </form>
  `
}
app.get ('/login', (req, res) => {
  res.send(loginForm())
})

//register api endpoint for users check if user already exists
app.post('/register', (req, res) => {
  const user = users.find(user => user.email === req.body.email)
  if (user) {
    res.send('User already exists')
  } else {
    users.push(req.body)
    const token = Math.random().toString(36).substring(7)
    sessions[token] = user
    res.send({ token })
  }
})

//register form template
function registerForm() {
  return `
    <form action="/register" method="post">
      <input type="text" name="name" placeholder="name" />
      <input type="text" name="email" placeholder="email" />
      <input type="password" name="password" placeholder="password" />
      <input type="submit" value="Register" />
    </form>
  `
}
app.get ('/register', (req, res) => {
  res.send(registerForm())
})

//get tasks by user id
app.get('/tasks/:id', (req, res) => {
  res.send(tasks.filter(task => task.user_id === req.params.id))
})




