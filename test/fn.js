// a long time process
module.exports = function (greeting = 'hello') {
  return new Promise(resolve =>
    setTimeout(() => resolve(`${greeting}, after 10s`), 1000 * 10))
}