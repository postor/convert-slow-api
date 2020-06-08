let it = gen()

export default () => it.next().value

function* gen() {
  let i = 0
  while (true) {
    if (i === Number.MAX_SAFE_INTEGER) i = 0
    i++
    yield i
  }
}