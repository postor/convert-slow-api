const express = require('express')
const getRouter = require('../dist/get-router').default
const fn = require('./fn')

const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))
app.use('/api',getRouter(async ({greeting})=>await fn(greeting)))

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`))