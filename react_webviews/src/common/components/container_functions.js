
import { getConfig, setHeights } from 'utils/functions';
import loader_fisdom from 'assets/loader_gif_fisdom.gif';
import loader_myway from 'assets/loader_gif_myway.gif';
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
        loaderMain: getConfig().productName !== 'fisdom' ? loader_myway : loader_fisdom,
        mounted: true,
        force_show_inpage_title : true,
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

    if(!this.state.new_header) {
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

    if(this.state.force_show_inpage_title) {
        inPageTitle = true;
        let that = this;
        setTimeout(function(){ 
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
                <Button onClick={this.handleClose} color="default">
                    No
          </Button>
                <Button onClick={this.handlePopup} color="default" autoFocus>
                    Yes
          </Button>
            </DialogActions>
        </Dialog>
    );
};

export function renderPageLoader() {
    if (this.props.showLoader) {
        return (
            <div className={`Loader ${this.props.loaderData ? this.props.loaderData.loaderClass : ''}`}>
                <div className="LoaderOverlay">
                    <img src={this.state.loaderMain} alt="" />
                    {this.props.loaderData && this.props.loaderData.loadingText &&
                        <div className="LoaderOverlayText">{this.props.loaderData.loadingText}</div>
                    }
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
            <div className={`header-title-page-text ${this.state.inPageTitle ? 'slide-fade-show' : 'slide-fade'}`} style={{width: this.props.count ? '75%': ''}}>
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