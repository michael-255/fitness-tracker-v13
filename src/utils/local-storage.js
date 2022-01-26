export const LocalStorage = {
  init(key, value) {
    const existingData = getLocalStorage(key)
    if (!existingData) {
      this.clear(key, value)
    }
  },

  overwrite(key, value) {
    setLocalStorage(key, value)
  },

  clear(key, value) {
    setLocalStorage(key, value)
  },

  get(key) {
    return getLocalStorage(key)
  },
}

function setLocalStorage(item, data) {
  const json = JSON.stringify(data)
  localStorage.setItem(item, json)
}

function getLocalStorage(item) {
  return JSON.parse(localStorage.getItem(item))
}
