# covert slow api

covert slow api to a set of quick ones

## how 

old path

```
post /process {data:xx}
```

new path

```
post /start-process

get /is-it-done
get /is-it-done
get /is-it-done
...
```

## usage

server side

```
const express = require('express')
const getRouter = require('convert-slow-api/dist/get-router').default

const app = express()
app.use('/api',getRouter(async ({greeting})=>await fn(greeting)))

```

client side

```
const fetcher = require('convert-slow-api/dist/fetcher').default
  ;
(async () => {
  let result = await fetcher("http://localhost:3000/api", {
    greeting: 'hi josh',
  })
  console.log(result)
})()
```