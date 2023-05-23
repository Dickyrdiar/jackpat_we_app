/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import axios from 'axios'
import { useEffect, useState } from 'react';

axios.defaults.baseURL = "https://rickandmortyapi.com";
const initialHeaders = {
  "Content-type": "application/json",
}

const useFetch = ({ url, method, body: customBody = {}, headers: customHeaders = {}, params = {}, skip, refetchDelay = 0 }) => {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [headers, setHeaders] = useState(customHeaders)
  const [loading, setLoading] = useState(false)
  const [body, setBody] = useState({})
  const [isDirty, setIsDiryt] = useState(false)
  

  const refetch = ({ body: refetchBody = body, headers: refetchHeaders = initialHeaders } = {}) => {
    setBody(refetchBody);
    setHeaders({ ...initialHeaders, ...refetchHeaders })
  }

  useEffect(() => {
    let unmount = false
    let onRefetchDelay = null
    const source = axios.CancelToken.source()

    const request = async () => {
      try {
        if (!unmount) setLoading(true)
        const res = await axios.request({
          url,
          method,
          headers: { ...initialHeaders, ...headers },
          data: { ...customBody, ...body },
          params,
          cancelToken: source.token,
        })
        if (!unmount) setData(res.data);
      } catch (err) {
        if(!unmount) setError(err.response || err);
      } finally {
        if (!unmount) setLoading(false) 
        if (!unmount && !isDirty) setIsDiryt(true)
      }
    }

    if (!skip) {
      setError(null)
      setData(null)
      if (isDirty) onRefetchDelay = setTimeout(() => { request() }, refetchDelay)
      else request()
    }

    return () => {
      unmount = true;
      source.cancel(`cancel req ${url}`);
    }
  }, [skip, body, headers])

  return { data, error, loading, refetch }
}

export default useFetch