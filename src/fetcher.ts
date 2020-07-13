import Axios from "axios"
import getErrorHandle from './error-handler'

export const axios = Axios.create({
  headers: {
    "Content-Type": 'application/json'
  }
})

export default async (url: string, params: any, conf = {}) => {
  let config = {
    optimized: true,
    interval: 1000,
    getConfig: {
      timeout: 10 * 1000
    },
    postConfig: {},
    errorHandler: getErrorHandle(),
    ...conf,
  }
  if (!config.optimized) {
    let res = await axios.post(url, params, config.postConfig)
    return res.data
  }
  let { data: { id } } = await axios.post(url, params, {
    ...config.postConfig,
    params: { optimized: 'true' }
  })
  let resultError = undefined
  while (true) {
    await waitTime(config.interval)
    try {
      let { data: { result, error, finished } } = await axios.get(url, {
        ...config.getConfig,
        params: { id },
      })
      if (finished) {
        if (error) {
          resultError = error
          break
        }
        return result
      }
    } catch (e) {
      config.errorHandler(e)
    }
  }
  throw resultError
}

function waitTime(milis: number) {
  return new Promise(resolve => setTimeout(resolve, milis))
}