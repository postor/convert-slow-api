import { Router } from 'express'
import { json } from 'body-parser'
import getId from './get-id'
import cache from './cache'

const CACHE_PREFIX = 'CON_SLOW_API_'

export default function (asyncFn) {
  const router = new Router()
  router.use(json({
    limit: '50mb',
  }))

  router.post('/', async (req, res) => {
    let param = req.body
    let id = getId()
    let cacheKey = `${CACHE_PREFIX}${id}`
    let cached = {
      finished: false,
      id,
    }
    await cache.set(cacheKey, cached)
    res.json(cached)
    try {
      let result = await asyncFn(param)
      cached = {
        ...cached,
        result,
        finished: true
      }
      await cache.set(cacheKey, cached)
    } catch (error) {
      cached = {
        ...cached,
        error,
        finished: true
      }
      await cache.set(cacheKey, cached)
    }
  })

  router.get('/', async (req, res) => {
    let { id } = req.query
    if (!id) return res.json({ error: 'need id query param' })

    id = parseInt(id)
    let cacheKey = `${CACHE_PREFIX}${id}`
    let cached = await cache.get(cacheKey)
    if (!cached) return res.json({
      error: `id=${id} job not found`,
    })
    res.json(cached)
    await cache.del(cacheKey)
  })

  return router
}


