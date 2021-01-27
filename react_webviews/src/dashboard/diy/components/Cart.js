import React from 'react'

const Cart = () => {
  return (
    <DiyDialog>
      <section>
        <div className="diy-cart-container">
          <div className="diy-cart-item">
            <div className="item">
              item
            </div>
            <div className="remove" role="button">
              delete
            </div>
          </div>
        </div>
      </section>
    </DiyDialog>
  )
}

export default Cart