import axios from 'axios'
import qs from 'qs'
import Vue from 'vue'

const API_ROOT = process.env.API_ROOT_URI

export var objRequests = {}
export var routeName = null

export const axiosInstance = axios.create({
  baseURL: API_ROOT,
  withCredentials: false, // This is the default
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  // timeout: 20000,
})

const Requests = {
  del: (url, body) => {
    return axiosInstance.delete(url, body)
  },
  get: (url, params = {}) =>
    axiosInstance.get(url, {
      params,
    }),
  post: (url, body) => axiosInstance.post(url, body),
  put: (url, body) => axiosInstance.put(url, body),
}

axiosInstance.interceptors.request.use(
  function(config) {
    if (!routeName || config.method.toLocaleLowerCase() !== 'get') {
      return config
    }

    let axiosSource = createAxiosCancelSource()
    config.cancelToken = axiosSource.token

    let pageIndex = (config.params && config.params.page) || 0
    let oldParams = null

    if (objRequests[config.url]) {
      if (
        objRequests[config.url][pageIndex] &&
        objRequests[config.url][pageIndex].params
      ) {
        oldParams = objRequests[config.url][pageIndex].params
      } else {
        for (let page in objRequests[config.url]) {
          if (objRequests[config.url][page].params) {
            oldParams = objRequests[config.url][page].params
            break
          }
        }
      }
      if (oldParams !== null) {
        let blnIsSameRequest = isEqualObject(config.params || {}, oldParams)

        if (blnIsSameRequest) {
          if (
            objRequests[config.url][pageIndex] &&
            objRequests[config.url][pageIndex].cancel
          ) {
            objRequests[config.url][pageIndex].cancel()
          }
        } else {
          for (let page in objRequests[config.url]) {
            if (objRequests[config.url][page].cancel) {
              oldParams = objRequests[config.url][page].cancel()
              delete objRequests[config.url][page]
            }
          }
        }
      }
    }

    if (!objRequests[config.url]) {
      objRequests[config.url] = {}
    }

    objRequests[config.url][pageIndex] = {
      cancel: axiosSource.cancel,
      params: config.params || {},
    }

    return config
  },
  function(error) {}
)

axiosInstance.interceptors.response.use(
  (response) => {
    if (response && response.config) {
      clearRequest(response.config)
    }
    return response
  },
  (error) => {
    if (isCancelRequest(error)) {
      if (error.response && error.response.config) {
        clearRequest(error.response.config)
      }
      return null
    }
  }
)

export const clearRequest = (config) => {
  if (config && config.url && objRequests[config.url]) {
    let pageIndex = (config.params && config.params.page) || 0
    delete objRequests[config.url][pageIndex]
  }
}

export const setRouteName = (name) => {
  routeName = name
}

export const resetObjRequests = () => {
  objRequests = Object.assign({})
}

export const isEqualObject = (object1, object2) => {
  let arrKeys = Object.keys(object1)
  let excludeKeys = ['page', 'pageSize']

  if (arrKeys.length !== Object.keys(object2).length) {
    return false
  }

  if (!arrKeys.length) {
    return true
  }

  for (let key of excludeKeys) {
    let searchIndex = arrKeys.indexOf(key)

    if (searchIndex >= 0) {
      arrKeys.splice(searchIndex, 1)
    }
  }

  for (let key of arrKeys) {
    if (typeof object1[key] === 'object') {
      if (object2[key] && typeof object2[key] === 'object') {
        let isSame = isEqualObject(object1[key], object2[key])
        if (!isSame) {
          return false
        }
      } else {
        return false
      }
    } else if (object1[key] !== object2[key]) {
      return false
    }
  }

  return true
}

export const createAxiosCancelSource = () => axios.CancelToken.source()

export const isCancelRequest = (error) => axios.isCancel(error)

export const LeaderBoard = {
  getScores: (params) => Requests.get('/ninja/leader-board', params),
}
