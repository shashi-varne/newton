import React, { Component } from 'react';

import Dialog, {
    DialogContent
} from 'material-ui/Dialog';
import { WithProviderLayout } from '../../../common/footer/layout';
import ReactHtmlParser from 'react-html-parser';
import { numDifferentiationInr } from 'utils/validators';

class ConfirmDialogClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    renderContent1(props, index) {
        return (
            <div key={index}>
                {props.heading && <div className="content2-points-inside-heading">
                    {props.heading}
                </div>}
                <div  className="content-points">

                    <div className="content-points-inside-text">
                        {ReactHtmlParser(props.name)}
                    </div>
                    <div className="content-points-inside-text">
                        {props.value}
                    </div>
                </div>
            </div>
        )
    }

    renderContent2(props, index) {
        return (
            <div key={index} className="content2-points">
                <div className="content2-points-inside-text">
                    {props.name}
                </div>
                <div className="content2-points-inside-text">
                    {props.value}
                </div>
            </div>
        )
    }

    renderConfirmDialog = () => {

        let parent = this.props.parent || {};
        let confirmDialogData = parent.state.confirmDialogData || {};

        return (
            <Dialog
                id="bottom-popup"
                open={parent.state.openConfirmDialog || false}
                onClose={parent.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                <div style={{padding: '0px 5px 0px 10px',fontSize:'14px'}} >
                    <div className="gold-dialog" id="alert-dialog-description">
                        <div className="mid-buttons">
                            <WithProviderLayout type="default"
                                handleClick2={parent.handleClose}
                                handleClick={parent.handleClose}
                                buttonTitle={confirmDialogData.buttonTitle}
                                buttonData={confirmDialogData.buttonData}
                            />
                        </div>
                       <div style={{ marginRight: '15px'}}>  
                        <div className="content-top flex-between" style={{ margin: '0 0 20px 0' }}>
                            <div className='ct-left'>
                                <span style={{ fontWeight: 600 }}>Sum assured:</span> {numDifferentiationInr(confirmDialogData.title_left)}
                            </div>
                            <div className='ct-right'>
                                <span style={{ fontWeight: 600 }}>Cover period:</span> {confirmDialogData.title_right}
                    </div>
                        </div>

                        <div className="hr"></div>

                        <div className="content">
                            {confirmDialogData.content1.map(this.renderContent1)}
                        </div>

                        <div className="hr"></div>

                        <div className="content2">
                            {confirmDialogData.content2.map(this.renderContent2)}
                        </div>

                        <div className="hr"></div>

                         </div>                     
                    </div>
                </div>    
                </DialogContent>
            </Dialog >
        );

    }

    render() {
        return (
            <div>
                {this.props.parent.state.confirmDialogData && this.renderConfirmDialog()}
            </div>
        );
    }
}

const ConfirmDialog = (props) => (
    <ConfirmDialogClass
        {...props} />
);

export default ConfirmDialog;