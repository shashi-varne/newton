import { useEffect, useState } from 'react';

const useScript = (scriptSrc) => {
  if (!scriptSrc) return;

  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');

    script.src = scriptSrc;
    script.async = true;
    script.onload = () => {
      setScriptLoaded(true);
    }
    
    document.body.appendChild(script);
    

    return () => {
      document.body.removeChild(script);
    }
  }, []);

  return { scriptLoaded };
};

export default useScript;