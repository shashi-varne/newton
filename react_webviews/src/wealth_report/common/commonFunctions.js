export function getHeightFromTop() {
  var el = document.getElementsByClassName('Container')[0];
  var height = el.getBoundingClientRect().top;
  return height;
}

export const onScroll = () => {
  let inPageTitle = this.state.inPageTitle;
  if (getHeightFromTop() >= 56) {}
};