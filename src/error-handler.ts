export default (ignoreCount = 5) => {
  let errorCount = 0
  return (error: any) => {
    errorCount++
    if (errorCount <= ignoreCount) {
      console.log({ error })
      return
    }
    throw error
  }
}