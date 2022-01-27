import { APP_ID } from '../constants/globals.js'

const LocalStorage = {
  initializeByKeys(keys, value = []) {
    keys.forEach((key) => {
      const existingData = getLocalStorage(key)
      if (!existingData) {
        this.clearByKeys([key], value)
      }
    })
  },

  clearByKeys(keys, value = []) {
    keys.forEach((key) => setLocalStorage(key, value))
  },

  overwrite(key, value) {
    setLocalStorage(key, value)
  },

  get(key) {
    return getLocalStorage(key)
  },
}

function setLocalStorage(item, data) {
  const json = JSON.stringify(data)
  localStorage.setItem(transformItem(item), json)
}

function getLocalStorage(item) {
  return JSON.parse(localStorage.getItem(transformItem(item)))
}

function transformItem(item) {
  return `${APP_ID}-${item}`
}

export default LocalStorage
