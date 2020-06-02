import Axios from "axios"

export const axios = Axios.create({
  headers: {
    "Content-Type": 'application/json'
  }
})

export default async (url, params, config = { interval: 1000 }) => {
  let { data: { id } } = await axios.post(url, params)
  while (true) {
    let { data: { result, error, finished } } = await axios.get(url, {
      params: { id },
    })
    if (finished) {
      if (error) throw error
      return result
    }
    await waitTime(config.interval)
  }
}

function waitTime(milis) {
  return new Promise(resolve => setTimeout(resolve, milis))
}