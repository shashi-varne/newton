import { useState } from "react";
import { storageService } from "../../utils/validators";

const storageKeyName = 'persistedRP';

const usePersistRouteParams = () => {
  const [routeParams, setRouteParams] = useState(
    storageService().getObject(storageKeyName) || {}
  );

  const persistRouteParams = (params) => {
    storageService().setObject(storageKeyName, params);
    setRouteParams(params);
  }

  const clearRouteParams = () => {
    storageService().setObject(storageKeyName, {});
    setRouteParams({});
  }

  return {
    routeParams,
    persistRouteParams,
    clearRouteParams
  }
};

export default usePersistRouteParams;