export function navigate (pathname,data,redirect)  {
  if(redirect){
    this.history.push({
      pathname
    });
  } else{
    
      console.log("pathname is",pathname)
      this.history.push({
        pathname:`/invest/recommendations/${pathname}`,
        state:{graphData:data}
      });
    }
  };