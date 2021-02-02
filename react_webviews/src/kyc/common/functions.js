export const navigate = (pathname, data, replace) => {
  if (!replace) {
    props.history.push({
      pathname: pathname,
      search: data?.searchParams || getConfig().searchParams,
      params: data.params,
      stata: data.state,
    });
  } else {
    props.history.replace({
      pathname: pathname,
      search: data?.searchParams || getConfig().searchParams,
      params: data.params,
      stata: data.state,
    });
  }
};
