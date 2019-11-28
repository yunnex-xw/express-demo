let User = require('../models/user')

exports.form = function(req,res) {
  res.render('register', { title: 'Register'})
}

exports.submit = function(req,res,next) {
  let data = req.body.user
  User.getByName(data.name, (err,user) => {
    if(user.id) {
      res.error(`Username already taken！`)
      res.redirect('back')
    }else {
      user = new User({
        name: data.name,
        pass: data.pass
      })
      user.save((err) => {
        if(err) return next(err)
        req.session.uid = user.id
        res.redirect('/')
      })
    } 
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