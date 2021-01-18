export function navigate (pathname,redirect)  {
  console.log("pathname is",pathname)
  if(redirect){
    this.history.push({
      pathname,
    });
  } else{

    this.history.push({
      pathname:`/savegoal/${pathname}`,
    });
  }
  };
  