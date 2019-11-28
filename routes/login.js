let User = require('../models/user')

exports.form = function(req,res) {
  res.render('login', { title: 'Login'})
}

exports.submit = function(req,res,next) {
  let data = req.body.user
  User.authenticate(data.name,data.pass,(err,user) => {
    if(err) return next(err)
    if(user) {
      req.session.uid = user.id
      res.redirect('/')
    }else {
      res.error('Sorry! invalid credentials')
      res.redirect('back')
    }
  })
}

exports.logout = function(req,res) {
  req.session.destroy((err) => {
    if(err) throw err
    res.redirect('/')
  })
}

exports.formVerification = function(req, res, next) {
  let mt = req.method
  if(mt === 'GET') next()
  else {
    let data = req.body.user
    if(!data.name) {
      next(new Error('name is required'))
    }
    if(data.pass.length < 6) {
      next(new Error('pass must be longer than 6 chartacters'))
    }
    next()
  }
}