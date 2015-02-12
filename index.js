var express = require('express')
var app = express()

app.use(express.static('build'))
app.use('/vendor', express.static('vendor'))
app.use('/assets', express.static('assets'))

app.get('/', function (req, res, params){
  res.redirect('/perspective')
})

app.get('/:name', function (req, res, params) {
  res.sendFile(__dirname + '/build/' + req.params.name + '/' + req.params.name + '.html')
})

app.listen(3000)