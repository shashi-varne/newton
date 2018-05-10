import React, { Component } from 'react';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import arrow from '../assets/next_arrow.png';
import Dialog, {
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';

class CustomButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false
    };
  }

  clickHandler = () => {
    if (navigator.onLine) {
      this.props.handleClick();
    } else {
      this.setState({
        openDialog: true
      });
    }
  }

  handleClose = () => {
    this.setState({
      openDialog: false
    });
  }

  renderDialog = () => {
    return (
      <Dialog
          fullScreen={false}
          open={this.state.openDialog}
          onClose={this.handleClose}
          aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="form-dialog-title">No Internet Found</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Check your connection and try again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button className="DialogButtonFullWidth" onClick={this.handleClose} color="secondary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  render() {
    const props = this.props;
    return (
      <div>
        <Button
          fullWidth={(props.reset || props.type === 'summary') ? true : false}
          variant="raised"
          size="large"
          color="secondary"
          className={props.classes.button}
          onClick={this.clickHandler} >
          {props.buttonTitle}
          {
            props.arrow &&
            <img alt="" src={arrow} width={20} className="FooterButtonArrow"/>
          }
        </Button>
        {this.renderDialog()}
      </div>
    );
  }
}

const styles = {
  button: {
    padding: '16px 24px',
    borderRadius: 0,
    textTransform: 'capitalize',
    fontSize: '16px',
    boxShadow: 'none',
    width: '100%'
  }
}

export default withStyles(styles)(CustomButton);
