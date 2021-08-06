/* eslint-disable no-unused-expressions */
import React from 'react';
import { Redirect, Route } from 'react-router';
import { getConfig } from '../../utils/functions';

export default function UnAuthenticatedRoute({ children, component, ...rest }) {
  const config = getConfig();
  const { isLoggedIn, searchParams } = config;

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
          const path = (!fromState || isUnAuthenticatedPath(fromState)) ? '/' : fromState;

          // Alternate Option ---------------
          // const navigate = navigateFunc.bind(props)
          // navigate(path, data);
          // -------------------------------------

          return <Redirect
            push={true}
            to={{
              pathname: path,
              state: {
                from: location,
                goBack: "/"
              },
              search: searchParams,
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