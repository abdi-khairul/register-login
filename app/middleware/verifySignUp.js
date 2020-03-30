const db = require('../model')
const ROLES = db.ROLES
const User = db.user

// check if username or email is duplicate or not
checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  User.findOne({
    where: {
      username: req.body.username
    }
  }).then(user => {
    if (user) {
      req.session.message = {
        type: 'warning',
        intro: 'Failed',
        message: 'Username is already in use!'
      }
      res.redirect('/')
      return
    }

    // Email
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (user) {
        req.session.message = {
          type: 'warning',
          intro: 'Failed',
          message: 'Email is already in use!'
        }
        res.redirect('/')
        return
      }

      next()
    })
  })
}

// check if roles in the request is existed or not
checkRoleExisted = (req, res, next) => {
  if (!ROLES.includes(req.body.roles)) {
    res.status(400).send({
      message: `Failed! Role does not exist = ${req.body.roles}`
    })
  }


  next()
}

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRoleExisted
}

module.exports = verifySignUp