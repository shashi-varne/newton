export function getHeightFromTop() {
  var el = document.getElementsByClassName('Container')[0];
  var height = el.getBoundingClientRect().top;
  return height;
}

export const onScroll = () => {
  let inPageTitle = this.state.inPageTitle;
  if (getHeightFromTop() >= 56) {}
};

export const getImageFile = (e) => {
  e.preventDefault();

  let file = e.target.files[0];

  let acceptedType = ["image/jpeg", "image/jpg", "image/png", "image/bmp"];

  if (acceptedType.indexOf(file.type) === -1) {
    console.log("please select image file only");
    return;
  }

  file.doc_type = file.type;
  
  return file;
};