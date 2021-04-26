import React, { Component } from 'react';
import './style.css';
import { getConfig } from 'utils/functions';
// import Button from 'material-ui/Button';
import Button from './Button';
import { Imgc } from './Imgc';
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
                open={parent && parent.state && data.dialog_name ? parent.state[data.dialog_name] : this.props.open || false}
                onClose={parent.handleClose || data.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <div className="generic-bottomsheet" id="alert-dialog-description">
                        <div className="top">
                            <div className="t-left">
                                <div className="header_title">{data.header_title}</div>
                                {data.content ?
                                    <div className="content">{ReactHtmlParser(data.content)}</div> :
                                    this.props.children || ''
                                }
                            </div>
                            {(data.icon || data.src) &&
                                <div className="t-right">
                                    <Imgc className='top-right-image'
                                        src={data.src ? data.src : require(`assets/${data.icon}`)} alt="" />
                                </div>}

                        </div>
                        {data.helpClick && getConfig().project !== 'loan' && 
                        <div className="help">
                            <Button
                                fullWidth={true}
                                variant="raised"
                                size="large"
                                color="secondary"
                                onClick={data.helpClick}
                                autoFocus
                                type={'textonly'}
                                buttonTitle={'GET HELP'}
                            />
                        </div>}

                    </div>
                </DialogContent>
                <DialogActions className="content-button">

                    {data.handleClick2 &&
                        <Button
                            fullWidth={true}
                            variant="raised"
                            size="large"
                            style={{ margin: '0 20px 0 0' }}
                            color="secondary"
                            onClick={data.handleClick2}
                            autoFocus
                            type={'outlined'}
                            buttonTitle={data.button_text2}
                        />
                    }
                    <Button
                        fullWidth={true}
                        variant="raised"
                        size="large"
                        color="secondary"
                        onClick={data.handleClick1}
                        autoFocus
                        // type={'textonly'}
                        buttonTitle={data.button_text1}
                    />
                </DialogActions>
            </Dialog>
        );
    }
};

const BottomSheet = (props) => (
    <BottomSheetClass
        {...props} />
);

export default BottomSheet;
