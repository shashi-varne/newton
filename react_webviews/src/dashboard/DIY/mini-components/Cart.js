import React from 'react'
import DiyDialog from './DiyDialog'
import Button from 'common/ui/Button'
import { storageService } from '../../../utils/validators'

import delete_new from '../../../assets/delete_new.png'
import { CART } from '../constants'
import { navigate as navigateFunc } from 'utils/functions'

import "./mini-components.scss";

const Cart = ({ isOpen, setCartActive, cart, setCart, sendEvents, ...props }) => {
  const handleRemoveFromCart = (item) => () => {
    if (cart.length > 0) {
      const updatedCartItems = cart.filter(({ isin }) => isin !== item.isin)
      sendEvents('delete', 'card_bottom_sheet', updatedCartItems.length, item.legal_name)
      setCart(updatedCartItems)
      storageService().setObject(CART, updatedCartItems)
      if (cart.length === 1) {
        close()
      }
    }
  }

  const close = () => {
    sendEvents('back')
    setCartActive(false)
  }

  const handleCheckoutProceed = () => {
    sendEvents('next', 'card_bottom_sheet', cart.length, "")
    const navigate = navigateFunc.bind(props)
    navigate('/diy/invest')
  }

  return (
    <DiyDialog close={close} open={isOpen}>
      <section className="diy-bottom-sheet" data-aid='diy-bottom-sheet'>
        <header className="header" data-aid='diy-cart-header'>
          <b className="text ">Fund Name</b>
          <div className="text">Remove</div>
        </header>
        <main data-aid='diy-bottom-main'>
          {cart.map((item, idx) => (
            <div key={item.isin} className="cart-item" data-aid={`cart-item-${idx}`}>
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
          dataAid='checkout-btn'
          fullWidth
          disable={cart.length === 0}
          onClick={handleCheckoutProceed}
          buttonTitle="Proceed to Checkout"
          style={{
            height: "45px",
            marginTop: "15px",
            width: "100%",
          }}
        />
      </section>
    </DiyDialog>
  )
}

export default Cart
