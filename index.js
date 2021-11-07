import { useEffect, useState } from 'react';

export default function useResponse(request, options) {
  const [response, setResponse] = useState({
    status: null,
    content: null,
    error: null,
  });

  useEffect(() => {
    fetch(request, options)
      .then((res) => {
        return res?.headers?.['content-type'] === 'application/json'
          ? res.json().then((json) => ({ status: res.status, body: json }))
          : res.text().then((text) => ({ status: res.status, body: text }));
      })
      .then((res) => {
        setResponse({ status: res.status, body: res.body, error: null });
      })
      .catch((error) => {
        setResponse({ status: 'failed', body: null, error: error.message });
      });
  }, [request, options]);

  return [response];
}
