import { useState, useEffect } from "react";
import axios from "axios";

axios.defaults.baseURL = "https://rickandmortyapi.com";
const initHeaders = {
  "Content-type": "application/json",
};

const useMutationFetch = ({ url, method, body: customBody = {}, headers: customHeaders = {}, skip }) => {
  const [data, setData] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [error, setError] = useState(null);
  const [headers, setHeaders] = useState(customHeaders);
  const [params, setParams] = useState({});
  const [body, setBody] = useState({});
  const [startMutation, setStartMutation] = useState(false);
  const [loading, setLoading] = useState(false);

  const mutation = ({ body: refetchBody = body, headers: refetchHeaders = {}, params = {} } = {}) => {
    setBody(refetchBody)
    setParams(params)
    setHeaders({ ...initHeaders, ...refetchHeaders })
    setStartMutation(true)
  };

  useEffect(() => {
    let unmount = false;
    const source = axios.CancelToken.source();

    const request = async () => {
      try {
        if (!unmount) setLoading(true);
        const res = await axios.request({
          url,
          method,
          headers: { ...initHeaders, ...headers },
          data: { ...customBody, ...body },
          params,
          cancelToken: source.token,
        });
        if (!unmount) setData(res.data);
      } catch (err) {
        if (!unmount) setError(err);
      } finally {
        if (!unmount) {
          setLoading(false)
          setStartMutation(false)
        }
        if (!unmount && !isDirty) setIsDirty(true);
      }
    };
    if (!skip && startMutation) {
      setError(null);
      setData(null);
      request();
    };
    return () => {
      unmount = true;
      source.cancel(`cancel req ${url}`);
    };
  }, [skip, body, headers]);

  return { data, error, loading, mutation };
};

export default useMutationFetch