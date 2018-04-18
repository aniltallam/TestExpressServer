const async = require('async')
var Express = require('express')
var bodyParser = require('body-parser')
let multer = require('multer')
let upload = multer({ storage: multer.memoryStorage() })
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
    {key1: 'val1', id: 1, Name: 'anil', 'Display Name': 'hello'}
    // {key1: 'val2'},
    // {key1: 'val3'}
  ]
  console.log('h=/samplejson, sendingData=', JSON.stringify(data))
  // return server.close(function () {})
  res.json(data)
})

app.get('/largeData', function (req, res) {
  var data = []
  for (let i = 0; i < 2900; i++) {
    let record = {
      k: i,
      v: 'v' + i
    }
    data.push(record)
  }
  console.log('h=/largeData, sendingData=', JSON.stringify(data))
  res.json(data)
})

app.get('/invalidXml', function (req, res) {
  // var data = '<?xml version="1.0" encoding="utf-8"?><customer><name>1</name></customer>'
  var data = '<?xml version="1.0" encoding="utf-8"?>'
  console.log('h=/invalidXml, sendingData=', data)
  res.set('Content-Type', 'text/xml')
  res.send(data)
})

app.get('/redirectMe', function (req, res) {
  console.log('h=/redirectMe')
  // res.redirect('/samplejson')
  // res.redirect('http://ab06cfa8.ngrok.io/samplejson')
  res.redirect('/redirectMe')
})

app.post('/mirror', function (req, res) {
  console.log('h=/mirror, m=post, body=' + JSON.stringify(req.body))
  res.json(req.body)
})

app.post('/print', function (req, res) {
  console.log('h=/print, m=post, body=', JSON.stringify(req.body))
  // res.status(204)
  res.status(204).end()
})

app.post('/v1/products/:name', function (req, res) {
  console.log('h=/v1/products/, m=post, body=', JSON.stringify(req.body))
  // res.status(204)
  res.status(204).end()
})

app.put('/v1/products/:name', function (req, res) {
  console.log('h=/v1/products/, m=put, body=', JSON.stringify(req.body))
  // res.status(204)
  res.status(204).end()
})

app.post('/printm', upload.array('somefile'), function (req, res) {
  // console.log('h=/print, m=post, body=', JSON.stringify(req.body))
  // res.status(204)
  console.log(req.body)
  console.log(req.files)
  req.files.forEach((f) => {
    console.log(f.buffer.toString())
  })
  // res.send()
  res.json('ended fine')
})

app.post('/raw', (req, res) => {
  // output the headers
  console.log(req.headers)

  // capture the encoded form data
  req.on('data', (data) => {
    console.log(data.toString())
  })

  // send a response when finished reading
  // the encoded form data
  req.on('end', () => {
    res.send('ok')
  })
})

app.post('/largeText', function (req, res) {
  var sizeInMb = req.query.sizeinmb || 1
  sizeInMb = 256

  let str1mb = 'a'
  // generate 1mb string
  for (let j = 0; j < 20; j++) {
    str1mb += str1mb
  }

  res.set('Content-Type', 'text/plain')
  res.status(200)

  let i = 0
  async.whilst(() => { return i < sizeInMb }, (cb) => {
    res.write(str1mb)
    i++
    process.stdout.write('sent size (mb)' + i + '\r')
    // setImmediate(cb)
    setTimeout(() => {
      cb()
    }, 100)
  }, () => {
    process.stdout.write('Done sending 256 mb text.')
    res.end()
  })
})

app.get('/healthCheck', function (req, res) {
  return res.json({message: 'all good...'})
})

// app.get('*', function (req, res) {
//   console.log('h=/Undefined Route=>', req.url, 'headers=', req.headers)
//   res.status(404).json({ errors: [new Error('SERVER_RESOURCE_NOT_FOUND ' + req.url)] })
// })

app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!" + req.url + req.method)
})

const server = app.listen(80, function (err) {
  if (err) return console.log('!!!!!!!!!!!! Server was down with Error =======>', err)
  else console.log('Server started on port =', 80)
})
