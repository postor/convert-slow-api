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
    errorHandler: getErrorHandle(),
    ...conf,
  }
  if (!config.optimized) {
    let res = await axios.post(url, params)
    return res.data
  }
  let { data: { id } } = await axios.post(url, params, {
    params: { optimized: 'true' }
  })
  while (true) {
    await waitTime(config.interval)
    try {
      let { data: { result, error, finished } } = await axios.get(url, {
        params: { id },
      })
      if (finished) {
        if (error) throw error
        return result
      }
    } catch (e) {
      config.errorHandler(e)
    }
  }
}

function waitTime(milis: number) {
  return new Promise(resolve => setTimeout(resolve, milis))
}