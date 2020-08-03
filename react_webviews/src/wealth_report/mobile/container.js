import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { getConfig, setHeights } from 'utils/functions';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  // DialogTitle,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';


class Container extends Component {

  constructor(props) {
    super(props);
    this.state = {
        openDialog: false,
        openPopup: false,
    }
  }

  componentDidMount() {

  }

  handleClose = () => {
    this.setState({
      openPopup: false
    });
  }

  handlePopup = () => {
  
    this.setState({
      openPopup: false
    });

    

  }


  renderPopup = () => {
      console.log('hi')
    return (
      <Dialog
          fullScreen={false}
          open={this.state.openPopup}
          onClose={this.handleClose}
          aria-labelledby="responsive-dialog-title"
      >
          <DialogContent>
              <DialogContentText>gfhjvcghjbnvnhj</DialogContentText>
          </DialogContent>
          <DialogActions>
              <Button onClick={this.handleClose} color="default">
                  No
        </Button>
              <Button onClick={this.handlePopup} color="default" autoFocus>
                  Yes
        </Button>
          </DialogActions>
      </Dialog>
  );
  }



  render() {

    return (
      <div className={`ContainerWrapper`} >
            <div onClick={this.renderPopup} >
                huoijvjhiuhhgi
            </div>
      </div>
    );
  }
};

export default withRouter(Container);
