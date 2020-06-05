const fetcher = require('../dist/fetcher').default
  ;
(async () => {
  {
    let result = await fetcher("http://localhost:3000/api", {
      greeting: 'hi josh',
    })
    console.log(result)
  }
  {
    let result = await fetcher("http://localhost:3000/api", {
      greeting: 'hi josh',
    }, { optimized: false })
    console.log(result)
  }
})()