import { useEffect, useState } from 'react';

export default function useResponse(request, options, deps = []) {
  const [response, setResponse] = useState({
    status: null,
    content: null,
    error: null,
  });

  useEffect(() => {
    fetch(request, options)
      .then((res) => {
        console.log(res.headers)
        return /application\/json/.test(res?.headers?.get('content-type')) === true
          ? res.json().then((json) => ({ url: res.url, status: res.status, body: json }))
          : res.text().then((text) => ({ url: res.url,status: res.status, body: text }));
      })
      .then((res) => {
        setResponse({ status: res.status, body: res.body, error: null });
      })
      .catch((error) => {
        setResponse({ status: 'failed', body: null, error: error.message });
      });
  }, deps);

  return response;
}
