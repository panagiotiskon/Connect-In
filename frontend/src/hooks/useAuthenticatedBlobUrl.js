import { useEffect, useState } from 'react';
import api from '../api/axiosInstance';

const useAuthenticatedBlobUrl = (url) => {
  const [objectUrl, setObjectUrl] = useState(null);

  useEffect(() => {
    if (!url) {
      setObjectUrl(null);
      return undefined;
    }

    let cancelled = false;
    let createdUrl = null;

    api
      .get(url, { responseType: 'blob' })
      .then((response) => {
        if (cancelled) return;
        createdUrl = URL.createObjectURL(response.data);
        setObjectUrl(createdUrl);
      })
      .catch(() => {
        if (!cancelled) setObjectUrl(null);
      });

    return () => {
      cancelled = true;
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
  }, [url]);

  return objectUrl;
};

export default useAuthenticatedBlobUrl;
