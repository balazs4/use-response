import { useEffect, useState } from 'react';

/**
 * useResponse react hook
 * @params {String|Request} request
 * @params {undefined|Request} options
 * @params {Object[]} deps
 * @returns {Response}
 */
export default function useResponse(request, options, deps = []) {
  const [response, setResponse] = useState({
    status: null,
    content: null,
    error: null,
  });

  useEffect(() => {
    let shouldSetResponse = true;
    fetch(request, options)
      .then((res) => {
        return /application\/json/.test(res?.headers?.get('content-type')) ===
          true
          ? res.json().then((json) => ({ status: res.status, body: json }))
          : res.text().then((text) => ({ status: res.status, body: text }));
      })
      .then((res) => {
        if (shouldSetResponse === true)
          setResponse({ status: res.status, body: res.body, error: null });
      })
      .catch((error) => {
        if (shouldSetResponse === true)
          setResponse({ status: 'failed', body: null, error: error.message });
      });
    return () => {
      shouldSetResponse = false;
    };
  }, deps);

  return response;
}

/**
 * Return type of useResponse function
 * @typedef {Object} Response
 * @property {'pending'|'failed'|Number|null} status
 * @property {Object|String|null} content
 * @property {String|null} error
 */
