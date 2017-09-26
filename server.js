var Express = require('express')
var bodyParser = require('body-parser')

var app = new Express()
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})) // for parsing application/x-www-form-urlencoded


app.get('/test', function (req, res) {
  var data = {
    key1: 'dummy'
  }
  console.log('h=/test GET')
  res.json(data)
})

app.get('/samplejson', function (req, res) {
  var data = [
    {key1: 'val1'},
    {key1: 'val2'},
    {key1: 'val3'}
  ]
  console.log('h=/samplejson, sendingData=', JSON.stringify(data))
  res.json(data)
})

app.post('/mirror', function (req, res) {
  console.log('h=/mirror, m=post, body=' + JSON.stringify(req.body))
  res.json(req.body)
})

app.post('/print', function (req, res) {
  console.log('h=/print, m=post, body=', JSON.stringify(req.body))
  res.status(204)
})

app.get('*', function (req, res) {
  console.log('h=/Undefined Route=>', req.url, 'headers=', req.headers)
  res.status(404).json({ errors: [new Error('SERVER_RESOURCE_NOT_FOUND ' + req.url)] })
})

app.listen(5050, function (err) {
  if (err) return console.log('!!!!!!!!!!!! Server was down with Error =======>', err)
  else console.log('Server started on port =', 5050)
})
