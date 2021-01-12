export function navigate(pathname) {
  this.history.push({
    pathname: `/partner-landing/${pathname}`,
  });
}
