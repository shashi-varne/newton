/*
  example for font family support is added in the hbl config.
  uncomment the code to test it.

  NOTE:
    - Any partner, which has action color, should also has a property of disableHoverEffect as true.
      Reason => this will avoid overiding the background color of current partner with product hover background button color.
      Example product(fisdom) hover backgroundColor => #119A4B(green)
              alb => backgroundColor => #00aeef, so onHover this color will change to product hover color.
              So, to avoid this, we are adding disableHoverEffect property.
*/

const obc = {
  colors: {
    primary: {
      brand: '#4DB848',
    },
  },
};

const lvb = {
  colors: {
    primary: {
      brand: '#CC0E00',
    },
  },
};

const svc = {
  colors: {
    primary: {
      brand: '#213B68',
    },
  },
};

const alb = {
  colors: {
    primary: {
      brand: '#2E3192',
    },
    action: {
      brand: '#00aeef',
    },
  },
  header: {
    notificationsColor: '#00aeef',
    backButtonColor: '#2E3192',
    backgroundColor: '#E8FD00',
    titleColor: '#2E3192',
  },
  button: {
    disableHoverEffect : true
  }
};

const tvscredit = {
  colors: {
    primary: {
      brand: '#2d2851',
    },
  },
};

const ktb = {
  colors: {
    primary: {
      brand: '#8C0094',
    },
  },
};

const cub = {
  colors: {
    primary: {
      brand: '#000180',
    },
  },
};

const fpg = {
  colors: {
    primary: {
      brand: '#EB6024',
    },
    action: {
      brand: '#EB6024',
    },
  },
  button: {
    borderRadius: 25,
    disabledBackgroundColor: '#F1D5C9',
    disableHoverEffect : true
  },
};

const hbl = {
  colors: {
    primary: {
      brand: '#0066B3',
    },
  },
  // uncomment below code and add the font family as an array,
  // also add the font link in index.html file.
  // fontFamily: ['The Nautigal', 'cursive']
};

const subh = {
  colors: {
    primary: {
      brand: '#F5821F',
    },
    action: {
      brand: '#F5821F',
    },
  },
  button: {
    disableHoverEffect: true,
  }
};

const sbm = {
  colors: {
    primary: {
      brand: '#1e3769',
    },
  },
};

const indb = {
  colors: {
    primary: {
      brand: '#173883',
    },
    action: {
      brand: '#173883',
    },
  },
  button: {
    disableHoverEffect: true,
  }
};

const finshell = {
  colors: {
    primary: {
      brand: '#007AFF',
    },
    action: {
      brand: '#007AFF',
    },
  },
  button: {
    disableHoverEffect: true,
  }
};

const ippb = {
  colors: {
    primary: {
      brand: '#3F1027',
    },
  },
};

const sahaj = {
  colors: {
    primary: {
      brand: '#e5322d',
    },
  },
};

const mspl = {
  colors: {
    primary: {
      brand: '#252B69',
    },
  },
};

const ucomb = {
  colors: {
    primary: {
      brand: '#002759',
    },
    action: {
      brand: '#002759',
    },
  },
  header: {
    backButtonColor: '#002759',
    notificationsColor: '#002759',
    backgroundColor: '#FFF500',
  },
  button: {
    disableHoverEffect: true,
  }
};

export default {
  ucomb,
  obc,
  lvb,
  svc,
  alb,
  tvscredit,
  ktb,
  hbl,
  subh,
  cub,
  fpg,
  sbm,
  indb,
  finshell,
  ippb,
  sahaj,
  mspl,
};
