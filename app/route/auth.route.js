const { verifySignUp } = require('../middleware')
const controller = require('../controller/auth.controller')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    )
    next()
  })

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRoleExisted
    ],
    controller.signup
  )

  app.post("/api/auth/signin", controller.signin)

  app.get('/loggout', (req, res, next) => {
    if (req.session) {
      req.session.destroy(() => {
        res.redirect('/')
      })
    }
  })
}


