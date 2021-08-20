import { useEffect, useState } from 'react';

const useScript = (scriptSrc, unmountOnExit) => {
  if (!scriptSrc) return {};

  const [scriptLoaded, setScriptLoaded] = useState(false);

  const checkIsScriptPreloaded = () => {
    const scriptElems = document.getElementsByTagName('script');
    for (let i = scriptElems.length; i--; i > 0) {
      if (scriptElems[i].src === scriptSrc) return true;
    }
  }

  useEffect(() => {
    const isScriptPreLoaded = checkIsScriptPreloaded();

    if (isScriptPreLoaded) {
      setScriptLoaded(true);
    } else {
      const script = document.createElement('script');
  
      script.src = scriptSrc;
      script.async = true;
      script.onload = () => {
        setScriptLoaded(true);
      }
      
      document.body.appendChild(script);
      
      if (unmountOnExit) {
        return () => {
          document.body.removeChild(script);
        }
      }
    }
  }, []);

  return { scriptLoaded };
};

export default useScript;