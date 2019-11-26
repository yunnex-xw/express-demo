let express = require('express')
let router = express.Router()
let Entry = require('../models/entry')

exports.form = function(req, res) {
  res.render('post', { title: 'Post'})
}
exports.submit = function(req, res, next) {
  const data = req.body.entry
  const user = res.locals.user
  const username = user ? user.name : null
  const entry = new Entry({
    username: username,
    title: data.title,
    body: data.body
  })
  entry.save((err) => {
    if(err) return next(err)
    res.redirect('/')
  })
}

exports.list = function(req, res, next) {
  Entry.getRange(0,-1,(err,entries) => {
    if(err) return next(err)
    res.render('entries', {
      title: 'Entries',
      entries: entries
    })
  })
}

exports.formVerification = function(req, res, next) {
  let mt = req.method
  if(mt === 'GET') next()
  else {
    let data = req.body.entry
    if(!data.title) {
      next(new Error('Title is required'))
    }
    if(data.body.length < 4) {
      next(new Error('body must be longer than 4 chartacters'))
    }
    next()
  }
}