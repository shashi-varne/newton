import React from "react";
import Dialog, { DialogContent, DialogActions } from "material-ui/Dialog";
import delete_new from "assets/delete_new.png";
import Button from "@material-ui/core/Button";

const CartDialog = ({
  close,
  open,
  cart,
  handleRemoveFromCart,
  handleClick,
}) => {
  return (
    <Dialog
      onClose={() => close()}
      open={open}
      aria-labelledby="fund-detail-dialog"
      keepMounted
      aria-describedby="fund-detail-dialog-slide-selection"
      id="fund-detail-dialog"
    >
      <DialogContent className="fund-detail-dilaog-content">
        <section className="fund-detail-bottom-sheet">
          <header className="header">
            <div className="text">Fund Name</div>
            <div className="text remove">Remove</div>
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
        </section>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          fullWidth
          disabled={cart.length === 0}
          color="secondary"
          onClick={() => handleClick()}
        >
          Enter Amount
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CartDialog;
