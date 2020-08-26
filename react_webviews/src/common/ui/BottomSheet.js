import React, { Component } from 'react';
import './style.css';
import { getConfig } from 'utils/functions';
import Button from 'material-ui/Button';
import 'react-circular-progressbar/dist/styles.css';
import Dialog, {
    DialogContent,
    DialogActions
} from 'material-ui/Dialog';
import ReactHtmlParser from 'react-html-parser';

class BottomSheetClass extends Component {

    constructor(props) {
        super(props);
        this.state = {
            productName: getConfig().productName
        };
    }
    render() {
        let parent = this.props.parent || {};
        let data = this.props.data || {};
        return (
            <Dialog
                id="bottom-popup"
                open={parent.state[data.dialog_name] || false}
                onClose={parent.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <div className="generic-bottomsheet" id="alert-dialog-description">
                        <div className="top">
                            <div className="header_title">
                                {data.header_title}
                            </div>
                            {data.icon && <img className='image' src={require(`assets/${this.state.productName}/${data.icon}.svg`)} alt="" />}
                        </div>

                        <div className="content">
                            {ReactHtmlParser(data.content)}
                        </div>
                    </div>
                </DialogContent>
                <DialogActions className="content-button">
                    <Button
                        fullWidth={true}
                        variant="raised"
                        size="large"
                        color="secondary"
                        onClick={data.handleClick}
                        autoFocus>{data.cta_title || 'CONTINUE'}
                    </Button>
                </DialogActions>
            </Dialog >
        );
    }
};

const BottomSheet = (props) => (
    <BottomSheetClass
        {...props} />
);

export default BottomSheet;
