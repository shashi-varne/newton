export function formatDate(event) {
  var key = event.keyCode || event.charCode;

  var thisVal;

  let slash = 0;
  for (var i = 0; i < event.target.value.length; i++) {
    if (event.target.value[i] === '/') {
      slash += 1;
    }
  }

  if (slash <= 1 && key !== 8 && key !== 46) {
    var strokes = event.target.value.length;

    if (strokes === 2 || strokes === 5) {
      thisVal = event.target.value;
      thisVal += '/';
      event.target.value = thisVal;
    }
    // if someone deletes the first slash and then types a number this handles it
    if (strokes >= 3 && strokes < 5) {
      thisVal = event.target.value;
      if (thisVal.charAt(2) !== '/') {
        var txt1 = thisVal.slice(0, 2) + "/" + thisVal.slice(2);
        event.target.value = txt1;
      }
    }
    // if someone deletes the second slash and then types a number this handles it
    if (strokes >= 6) {
      thisVal = event.target.value;

      if (thisVal.charAt(5) !== '/') {
        var txt2 = thisVal.slice(0, 5) + "/" + thisVal.slice(5);
        event.target.value = txt2;
      }
    }
  }
}