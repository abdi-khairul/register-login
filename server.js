const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const flash = require('req-flash');
const session = require('express-session');

const app = express()

const corsOptions = {
  origin: "http://localhost:8080"
}

app.use(cors(corsOptions))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// parse request of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// session
app.use(
  session({
    secret: 'express bcrypt',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 1000 * 30
    }
  })
)

app.use(flash());

// view engine setup
app.set('views', path.join(__dirname, 'app/view'))
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'app/public')))

//flash message middleware
app.use((req, res, next) => {
  res.locals.message = req.session.message
  delete req.session.message
  next()
})

// database
const db = require('./app/model')
const Role = db.role


db.sequelize.sync()
// force: true will drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log('Drop and Resync Database with { force: true }')
//   initial()
// })

// simple route
// app.get('/', (req, res) => {
//   res.json({ message: "Welcome to jwt-auth application" })
//   // res.redirect('./app/view/index.html')
// })
app.get('/', (req, res) => {
  res.render('page/index')
})

// routes
require('./app/route/auth.route')(app)
require('./app/route/user.route')(app)

// errors : page not found 404
app.use((req, res, next) => {
  const err = new Error(`
  <div style="text-align:center; 
              margin-top:70px;">
  <h1>Page not found</h1>
  <h1>404</h1>
  </div>`)
  err.status = 404
  next(err)
})

// Handling errors
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send(err.message)
})

// set port, listen for requests
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

function initial() {
  Role.create({
    id: 1,
    name: "user"
  })

  Role.create({
    id: 2,
    name: "moderator"
  })

  Role.create({
    id: 3,
    name: "admin"
  })
}