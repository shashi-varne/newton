/*
Currently we have only two elevation variation => [0,1]. => 0 means no elevation.
     NOTE: 1. here the number does not represent the depth of the elevation,
              but it tells the version of elevation that design team provides to us.
              Currently, only a single version is there, which will be represented by 1.
*/

export const customShadows = () => {
  return {
    0: 'none',
    1: '0px 6px 12px -6px rgba(0, 0, 0, 0.04), 0px 0px 1px rgba(0, 0, 0, 0.2)',
  };
};
