import React from 'react';

const IwdBarChart = ({ data, classes = {} }) => {
  const {
    container: containerClass,
    child: childClass,
  } = classes;
  // const onElemHover = (item, idx) => {
  //   console.log('hovered', idx);
  //   let liBars = document.getElementsByClassName('li-wr');
  //   // console.log(liBars);
  //   // for (const liBar of liBars) {
  //   //   liBar.classList.add("li-wr-hovered")
  //   // }
  //   // liBars.map(liBar => );
  //   liBars[idx].style.flexBasis = `${item.value + 15}%`;
  //   liBars[idx].style.transform = `scaleY(1.6)`;
  // };

  // const onElemLeave = () => {
  //   let liBars = document.getElementsByClassName('li-wr');
  //   for (let i = 0; i < data.length; i++) {
  //     liBars[i].style.flexBasis = `${data[i].value}%`;
  //     liBars[i].style.transform = `scaleY(1)`;
  //   }
  // };

  return (
    <div>
      <ul id="iwd-bars" className={containerClass}>
        {Object.entries(data).map(([key, value], idx) => (
          <li
            key={idx}
            className={`iwd-bars-li ${childClass}`}
            style={{ flexBasis: `${value}%` }}
            // onMouseEnter={() => onElemHover(item, idx)}
            // onMouseLeave={() => onElemLeave()}
          >
            <div>{key}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IwdBarChart;