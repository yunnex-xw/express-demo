function pareseField(field) {
  return field.split(/\[|\]/).filter(s => s)
}

function getField(req,field) {
  let val = req.body;
  field.forEach(prop => {
    if(val[prop]) {
      val = val[prop]
    }
  })
  return val
}

exports.required = function(field) {
  field = pareseField(field)
  return (req, res, next) => {
    if(getField(req,field)) {
      next()
    }else {
      next( new Error(`${field.join('')} is required`))
    }
  }
}

exports.lengthAbove = function(field,len) {
  field = pareseField(field)
  return (req, res, next) => {
    if(getField(req,field).length > len) {
      next()
    }else {
      next( new Error(`${field} must have more than ${len} characters`))
    }
  }
}