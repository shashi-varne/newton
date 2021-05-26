import { useEffect, useState } from 'react';

const useScript = (scriptSrc) => {
  if (!scriptSrc) return;

  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');

    script.src = scriptSrc;
    script.async = true;

    document.body.appendChild(script);

    setScriptLoaded(true);

    return () => {
      document.body.removeChild(script);
    }
  }, []);

  return { scriptLoaded };
};

export default useScript;