import { Router } from 'express'
import { json } from 'body-parser'
import getId from './get-id'
import cache from './cache'

const CACHE_PREFIX = 'CON_SLOW_API_'

export default function (asyncFn: CallableFunction) {
  const router = Router()
  router.use(json({
    limit: '50mb',
  }))

  router.post('/', async (req, res) => {
    let param = req.body, { optimized } = req.query
    if (!optimized) {
      try {
        let result = await asyncFn(param)
        return res.json(result)
      } catch (e) {
        return res.json({
          error: e.toString()
        })
      }
    }
    let id = getId()
    let cacheKey = `${CACHE_PREFIX}${id}`
    let cached: any = {
      finished: false,
      id,
    }
    //@ts-ignore
    await cache.set(cacheKey, cached)
    res.json(cached)
    try {
      let result = await asyncFn(param)
      cached = {
        ...cached,
        result,
        finished: true
      }
      //@ts-ignore
      await cache.set(cacheKey, cached)
    } catch (error) {
      cached = {
        ...cached,
        error,
        finished: true
      }
      //@ts-ignore
      await cache.set(cacheKey, cached)
    }
  })

  router.get('/', async (req, res) => {
    let { id } = req.query
    if (!id) return res.json({ error: 'need id query param' })
    //@ts-ignore
    id = parseInt(id)
    let cacheKey = `${CACHE_PREFIX}${id}`
    let cached = await cache.get(cacheKey)

    if (!cached) return res.json({
      error: `id=${id} job not found`,
    })

    res.json(cached)

    const { finished } = cached
    if (finished) {
      await cache.del(cacheKey)
    }
  })

  return router
}


