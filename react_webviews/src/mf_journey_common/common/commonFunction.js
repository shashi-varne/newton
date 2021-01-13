export function navigate (pathname,data)  {
  this.history.push({
    pathname:`/invest/buildwealth/${pathname}`,
    state:{graphData:data}
  });
};
