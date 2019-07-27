export const filterArr = (arr, prop, value) => {
  return arr.filter(v => {
    return v[prop] === value
  })
}

export const uniqueId = () => {
  return Date.now().toString() + Number(Math.random().toString().substr(2)).toString(36)
}
