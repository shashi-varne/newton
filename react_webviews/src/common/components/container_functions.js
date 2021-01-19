
import { getConfig, setHeights } from 'utils/functions';
// import { nativeCallback } from "utils/native_callback";
import $ from  'jquery';


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

    let type = errorData.type || 'generic';
    let mapper = {
        'generic': {
            'title1': 'Error',
            'button_text2': 'CANCEL',
            'button_text1': 'RETRY'
        },
        'form': {
            'title1': 'Error',
            'button_text2': 'EDIT',
            'button_text1': 'RETRY'
        },
        'internet': {
            'title1': 'We aren’t currently available. Check back in some time.',
            'button_text1': 'RETRY'
        },
        'crash': {
            'title1': 'Something went wrong',
            'button_text1': 'OKAY'
        }
    }
    let map_data = mapper[type] || mapper['generic'];

    let two_button  = handleClick2 ? true: false;

    button_text2 = button_text2 || map_data.button_text2 || 'CLOSE';
    button_text1 = button_text1 || map_data.button_text1 || 'RETRY';



    if(this.props.showError !== false || this.props.showError) {
        var that = this;

        function clickfunction(e) {
            if (e.target.id === "error-dialog-parent" || $(e.target).parents("#error-dialog-parent").length) {
                // alert("Inside div");
                } else {
                    disableBodyOverflow(true); //touch enabled
                    that.props.errorData && that.props.errorData.setErrorData ? that.props.errorData.setErrorData(''): () => {};
                    document.removeEventListener('click', clickfunction, false);
        
                }
        }

        document.addEventListener('click',clickfunction, false);
    }
  

    function genericErrorActions() {
        return(
                        <div className="actions">
                          {two_button &&    
                          <div  
                          className={`generic-page-button-large button`}
                            style={{margin: '0 20px 0 0'}}
                            onClick={() => {
                                disableBodyOverflow(true); //touch enabled
                                handleClick2();
                            }}>
                                {button_text2}
                            </div>}
                            <div 
                            className={`generic-page-button-small-with-green button ${(!two_button ? 'single-button' : '')}`}
                            onClick={() => {
                                disableBodyOverflow(true); //touch enabled
                                handleClick1();
                            }}>
                                {button_text1}
                            </div>
                        </div>
        )
    }

    this.navigate = navigate.bind(this);
    function redirectToHelp() {
        // let path = '/help/writetous';
        let path = '/help';
        this.navigate(path);
    }

    this.redirectToHelp = redirectToHelp.bind(this);

   
    let generic_error2_icon = 'data:image/png;base64,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';

    if (this.props.showError === true) {

        
        disableBodyOverflow(); //touch disabled
        return (
            <div  className={`generic-error-dialog fadein-animation ${errorData ? errorData.errorClass : ''}`}>
                <div id="error-dialog-parent" className="overlay">

                    <div className="top-part">
                        <div className="t-left">
                            <div className="title1">{title1 || 'Error'}</div>
                            {title2 && 
                            <div className="title2">{title2}</div>}
                        </div>
                        <div className="t-right">
                            <Imgc className="top-image" src={generic_error2_icon} alt="" />
                        </div>
                    </div>
                    
                    

                    <div className="help" onClick={() => this.redirectToHelp()}>GET HELP</div>
                    {genericErrorActions()}
                </div>
            </div>
        );
    }  if (this.props.showError === 'page') {

        
        disableBodyOverflow(); //touch disabled
        return (
            <div  className={`generic-error-dialog generic-error-dialog-page fadein-animation ${errorData ? errorData.errorClass : ''}`}>
                <div id="error-dialog-parent" className="overlay ovarlay-page">
                    <Imgc className="top-image top-image-page" src={generic_error2_icon} alt="" />
                    <div className="title1 title1-page">{title1 || 'Something went wrong'}</div>

                    <div className="title2 title2-page">{title2 || 'Sorry, we could not process your request'}</div>

                    <div className="help help-page" onClick={() => this.redirectToHelp()}>GET HELP</div>
                    {genericErrorActions()}
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