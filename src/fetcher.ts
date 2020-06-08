import Axios from "axios"

export const axios = Axios.create({
  headers: {
    "Content-Type": 'application/json'
  }
})

export default async (url: string, params: any, conf = {}) => {
  let config = {
    optimized: true,
    interval: 1000,
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
    let { data: { result, error, finished } } = await axios.get(url, {
      params: { id },
    })
    if (finished) {
      if (error) throw error
      return result
    }
  }
}

function waitTime(milis:number) {
  return new Promise(resolve => setTimeout(resolve, milis))
}