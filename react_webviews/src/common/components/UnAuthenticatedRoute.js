/* eslint-disable no-unused-expressions */
import React from 'react';
import { Redirect, Route } from 'react-router';
import { getConfig, navigate as navigateFunc } from '../../utils/functions';
import { storageService } from '../../utils/validators';

// const data = {
//   state: {
//     goBack: '/'
//   }
// };

export default function UnAuthenticatedRoute({ children, component, ...rest }) {
  const isLoggedIn = storageService().get("currentUser");
  console.log('INSIDE UAR', isLoggedIn);

  const isUnAuthenticatedPath = (path) => {
    const unAuthenticatedPaths = [
      "/login",
      "/forgot-pin",
      "/logout",
      "/prepare",
      "/partner-authentication"
    ];
    const pathname = unAuthenticatedPaths.find(el => path.includes(el));
    return !!pathname;
  }

  if (isLoggedIn) {
    return (
      <Route
        {...rest}
        render={({ location }) => {
          const fromState = location?.state?.fromState
          const path = (!fromState || isUnAuthenticatedPath(fromState)) ? '/invest' : fromState;

          // Alternate Option ---------------
          // const navigate = navigateFunc.bind(props)
          // navigate(path, data);
          // -------------------------------------

          return <Redirect
            to={{
              pathname: path,
              state: {
                from: location,
                goBack: "/"
              },
              search: getConfig().searchParams,
            }}
          />
        }}
      />
    );
  }

  return (
    <Route {...rest} component={component}>
      {children}
    </Route>
  );
}