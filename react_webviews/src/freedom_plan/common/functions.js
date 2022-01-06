export const getDefaultPlan = (plans) => {
  return plans.find((data) => data.is_default) || {};
};

export const getActivePlans = (plans) => {
  return plans.filter((data) => data.is_active) || {};
};
