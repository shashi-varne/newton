import React from 'react';
export const Checked = (props) => {
  return (
    <svg
      width={props.size}
      height={props.size}
      viewBox='0 0 14 14'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <rect
        x='0.5'
        y='0.5'
        width='13'
        height='13'
        rx='2.5'
        fill='white'
        stroke={props.borderColor}
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M10.4937 4.25628C10.8383 3.91457 11.397 3.91457 11.7416 4.25628C12.0861 4.59799 12.0861 5.15201 11.7416 5.49372L6.44745 10.7437C6.10287 11.0854 5.54419 11.0854 5.19961 10.7437L2.25844 7.82705C1.91385 7.48534 1.91385 6.93132 2.25844 6.58961C2.60302 6.24791 3.16169 6.24791 3.50627 6.58961L5.82353 8.88756L10.4937 4.25628Z'
        fill={props.color}
      />
    </svg>
  );
};
Checked.defaultProps = {
  color: '#3792FC',
  size: '14px',
  borderColor: '#767E86',
};

export const UnChecked = (props) => {
  return (
    <svg
      width={props.size}
      height={props.size}
      viewBox='0 0 14 14'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <rect
        x='0.5'
        y='0.5'
        width='13'
        height='13'
        rx='2.5'
        fill='white'
        stroke={props.borderColor}
      />
    </svg>
  );
};
UnChecked.defaultProps = {
  size: '14px',
  borderColor: '#767E86',
};
