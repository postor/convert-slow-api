import cacheManager from 'cache-manager'

const instance = cacheManager.caching({
  store: 'memory',
  max: 1000,
  ttl: 60 * 60 /*seconds*/
})

export default instance