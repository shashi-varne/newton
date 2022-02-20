export const scrollIntoView = (element, topOffset=0) => {
  const wrapperElement = document.getElementsByClassName('container-wrapper')[0];
  const headerOffset = 56;
  const wrapperPosition = wrapperElement?.getBoundingClientRect().top;
  const targetElementPosition = element?.getBoundingClientRect().top;
  const elementPosition = targetElementPosition - wrapperPosition;
  const offsetPosition = elementPosition - headerOffset + topOffset;
  wrapperElement.scrollTo({
    top: offsetPosition,
    behavior: 'smooth',
  });
};
