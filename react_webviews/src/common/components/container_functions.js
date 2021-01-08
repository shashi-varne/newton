
import { getConfig, setHeights } from 'utils/functions';
// import { nativeCallback } from "utils/native_callback";

import React from "react";

import Button from "material-ui/Button";
import Dialog, {
    DialogActions,
    DialogTitle,
    DialogContent,
    DialogContentText
} from 'material-ui/Dialog';
import '../../utils/native_listner';
import { disableBodyOverflow } from 'utils/validators';
import {Imgc} from '../../common/ui/Imgc';

let start_time = '';

export function didmount() {
    start_time = new Date();

    this.getHeightFromTop = getHeightFromTop.bind(this);
    this.onScroll = onScroll.bind(this);
    this.getEvents = getEvents.bind(this);
    this.renderDialog = renderDialog.bind(this);
    this.renderPopup = renderPopup.bind(this);
    this.renderPageLoader = renderPageLoader.bind(this);
    this.check_hide_header_title = check_hide_header_title.bind(this);
    this.unmount = unmount.bind(this);
    this.navigate = navigate.bind(this);
    this.handleClose = handleClose.bind(this);
    this.didupdate = didupdate.bind(this);
    this.new_header_scroll = new_header_scroll.bind(this);

    this.setState({
        productName: getConfig().productName,
        mounted: true,
        force_show_inpage_title: true,
        inPageTitle: true
    }, () => {
        this.onScroll();
    })

    setHeights({ 'header': true, 'container': false });

    let that = this;
    if (getConfig().generic_callback || this.state.project === 'help') {
        window.callbackWeb.add_listener({
            type: 'back_pressed',
            go_back: function () {
                that.historyGoBack();
            }
        });
    } else {
        window.PlutusSdk.add_listener({
            type: 'back_pressed',
            go_back: function () {
                that.historyGoBack();
            }
        });
    }

    window.addEventListener("scroll", this.onScroll, false);

    this.check_hide_header_title();
}

export function unmount() {
    if (getConfig().generic_callback || this.state.project === 'help') {
        window.callbackWeb.remove_listener({});
    } else {
        window.PlutusSdk.remove_listener({});
    }

    window.removeEventListener("scroll", this.onScroll, false);

    this.setState({
        mounted: false
    })
}

export function didupdate() {
    setHeights({ 'header': true, 'container': false });
}

export function navigate(pathname) {
    this.props.history.push({
        pathname: pathname,
        search: this.props.location.search
    });
};

export function check_hide_header_title() {
    let force_hide_inpage_title;
    let restrict_in_page_titles = ['provider-filter'];
    if (restrict_in_page_titles.indexOf(this.props.headerType) !== -1) {
        force_hide_inpage_title = true;
    }

    this.setState({
        force_hide_inpage_title: force_hide_inpage_title || false
    })

    if (this.props.updateChild) {
        this.props.updateChild('inPageTitle', force_hide_inpage_title);
    }

}

export function getHeightFromTop() {
    var el = document.getElementsByClassName('Container')[0];
    var height = el.getBoundingClientRect().top;
    return height;
}

export function onScroll() {

    if (!this.state.new_header) {
        this.setState({
            inPageTitle: false
        })
        return;
    }
    let inPageTitle = this.state.inPageTitle;
    if (this.getHeightFromTop() >= 56) {
        //show up
        inPageTitle = true;

    } else {
        //show down
        inPageTitle = false;
    }

    if (this.state.force_show_inpage_title) {
        inPageTitle = true;
        let that = this;
        setTimeout(function () {
            that.setState({
                force_show_inpage_title: false
            })
        }, 100);

    }

    this.setState({
        inPageTitle: inPageTitle
    })

    if (this.props.updateChild) {
        this.props.updateChild('inPageTitle', inPageTitle);
    }

};

export function getEvents(user_action) {
    if (!this || !this.props || !this.props.events) {
        return;
    }
    let events = this.props.events;
    events.properties.user_action = user_action;
    if (this.state.project === 'help') {
        events.properties.time_spent = calcReadtime(new Date());
    }
    return events;
}


export function renderDialog() {
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
                <Button
                    className="DialogButtonFullWidth"
                    onClick={this.handleClose}
                    color="default"
                    autoFocus
                >
                    OK
          </Button>
            </DialogActions>
        </Dialog>
    );
};


export function renderPopup() {
    return (
        <Dialog
            fullScreen={false}
            open={this.state.openPopup}
            onClose={this.handleClose}
            aria-labelledby="responsive-dialog-title"
        >
            {/* <DialogTitle id="form-dialog-title">No Internet Found</DialogTitle> */}
            <DialogContent>
                <DialogContentText>{this.state.popupText}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={this.handlePopup} color="default" autoFocus>
                    Yes
                </Button>
                <Button onClick={this.handleClose} color="default">
                    No
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export function renderGenericError() {

    let errorData = this.props.errorData || {};
    let { title1, title2 , button_text1, button_text2, 
        handleClick2, handleClick1} = errorData;

    let two_button  = handleClick2 ? true: false
    if (this.props.showError === true) {

        
        disableBodyOverflow(); //touch disabled
        return (
            <div className={`generic-error-dialog fadein-animation ${errorData ? errorData.errorClass : ''}`}>
                <div className="overlay">

                    <div className="top-part">
                        <div className="title1">{title1 || 'Something went wrong'}</div>
                        <Imgc className="top-image" src={require(`assets/generic_error.svg`)} alt="" />
                    </div>
                    
                    <div className="title2">{title2 || 'Sorry, we could not process your request'}</div>

                    <div className="actions">
                      {two_button &&    
                      <div  
                      className={`generic-page-button-large button`}
                        style={{margin: '0 20px 0 0'}}
                        onClick={() => {
                            disableBodyOverflow(true); //touch enabled
                            handleClick2();
                        }}>
                            {button_text2 || 'Close'}
                        </div>}
                        <div 
                        className={`generic-page-button-small-with-green button ${(!two_button ? 'single-button' : '')}`}
                        onClick={() => {
                            disableBodyOverflow(true); //touch enabled
                            handleClick1();
                        }}>
                            {button_text1 || 'Retry'}
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        disableBodyOverflow(true); //touch enabled
        return null;
    }
}


export function renderPageLoader() {
    let quotes_data = [
        'Risk comes from not knowing what you are doing.',
        'Money is a terrible master but an excellent servant.',
        'Wealth is the ability to fully experience life.',
        'I’d like to live as a poor man with lots of money.',
        'Don’t stay in bed, unless you can make money in bed.',
        'It takes as much energy to wish as it does to plan.',
        'The best thing money can buy is financial freedom.'
    ]
    var quote = quotes_data[Math.floor(Math.random() * quotes_data.length)];

    let loaderData = this.props.loaderData || {};
    let loadingText = loaderData.loadingText;

    if (this.props.showLoader === true) {
        return (
            <div className={`Loader ${loaderData ? loaderData.loaderClass : ''}`}>
                <div className="LoaderOverlay">
                    <img src={require(`assets/${this.state.productName}/loader_gif.gif`)} alt="" />
                    {loadingText &&
                        <div className="LoaderOverlayText">{loadingText}</div>
                    }
                </div>
            </div>
        );
    } else if (this.props.showLoader === 'page') {
        return (
            <div className={`generic-page-loader ${loaderData ? loaderData.loaderClass : ''}`}>
                <div className="LoaderOverlay">
                    
                    {/* <img src={require(`assets/${this.state.productName}/loader_gif.gif`)} alt="" /> */}
                    <div className="generic-circle-loader-component"></div>
                    <div className="LoaderOverlayText">{loadingText || quote}</div>
                </div>
            </div>
        );
    } else {
        return null;
    }
}

export function handleClose() {
    this.setState({
        openDialog: false,
        openPopup: false
    });
};


export function calcReadtime(endtime) {
    var new_date = new Date(endtime - start_time);
    return new_date.getUTCMinutes() + '.' + new_date.getUTCSeconds();
}


export function new_header_scroll() {
    return (

        <div id="header-title-page"
            style={this.props.styleHeader}
            className={`header-title-page  ${this.props.classHeader}`}>
            <div className={`header-title-page-text ${this.state.inPageTitle ? 'slide-fade-show' : 'slide-fade'}`} style={{ width: this.props.count ? '75%' : '' }}>
                {this.props.title}
            </div>

            {this.state.inPageTitle && this.props.count &&
                <span color="inherit"
                    className={`${this.state.inPageTitle ? 'slide-fade-show' : 'slide-fade'}`}
                    style={{ fontSize: 10 }}>
                    <span style={{ fontWeight: 600 }}>{this.props.current}</span>/<span>{this.props.total}</span>
                </span>}
        </div>

    )
}