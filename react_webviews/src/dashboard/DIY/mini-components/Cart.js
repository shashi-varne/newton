import React from 'react'
import DiyDialog from './DiyDialog'
import Button from '@material-ui/core/Button'
import { storageService } from '../../../utils/validators'

import delete_new from '../../../assets/delete_new.png'
import { CART } from '../constants'
import { navigate as navigateFunc } from '../../Invest/common/commonFunction'

import "./mini-components.scss";

const Cart = ({ isOpen, setCartActive, cart, setCart, ...props }) => {
  const handleRemoveFromCart = (item) => () => {
    if (cart.length > 0) {
      const updatedCartItems = cart.filter(({ isin }) => isin !== item.isin)
      setCart(updatedCartItems)
      storageService().setObject(CART, updatedCartItems)
      if (cart.length === 1) {
        close()
      }
    }
  }

  const close = () => {
    setCartActive(false)
  }

  const handleCheckoutProceed = () => {
    const navigate = navigateFunc.bind(props)
    navigate('/diy/invest', null, true, props.location.search)
  }

  return (
    <DiyDialog close={close} open={isOpen}>
      <section className="diy-bottom-sheet">
        <header className="header">
          <div className="text">Fund Name</div>
          <div className="text">Remove</div>
        </header>
        <main>
          {cart.map((item) => (
            <div key={item.isin} className="cart-item">
              <div className="title">{item.legal_name}</div>
              <img
                src={delete_new}
                alt={`Delete ${item.isin} from cart`}
                className="delete-icon"
                role="button"
                onClick={handleRemoveFromCart(item)}
              />
            </div>
          ))}
        </main>
        <Button
          variant="contained"
          fullWidth
          disabled={cart.length === 0}
          color="secondary"
          onClick={handleCheckoutProceed}
        >
          Proceed to Checkout
        </Button>
      </section>
    </DiyDialog>
  )
}

export default Cart
