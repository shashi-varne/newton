export function navigate(pathname, params) {
      this.history.push({
        pathname: `/partner-landing/${pathname}`,
        params,
      });
  }