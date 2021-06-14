import React from 'react'
import Button from '@material-ui/core/Button'

import add_cart_icon from '../../../assets/add_cart_icon.png'
import "./mini-components.scss";

const DiyCartButton = (props) => {
  return (
    <Button variant="raised" color="secondary" {...props} data-aid='cart-btn'>
      <img src={add_cart_icon} alt="Add to cart" />
      <div className="title" data-aid='cart-btn-text'>
        Cart{props.cartlength ? `(${props.cartlength})` : null}
      </div>
    </Button>
  )
}

export default DiyCartButton