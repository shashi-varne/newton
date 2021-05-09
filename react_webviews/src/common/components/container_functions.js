
import { getConfig, setHeights, isIframe } from 'utils/functions';
// import { nativeCallback } from "utils/native_callback";
import Banner from 'common/ui/Banner';
import UiSkelton from 'common/ui/Skelton';
import Footer from 'common/components/footer';
import Header from 'common/components/Header';
import IframeHeader from 'common/components/Iframe/Header';
import React from "react";

import Button from "material-ui/Button";
import Dialog, {
    DialogActions,
    DialogTitle,
    DialogContent,
    DialogContentText
} from 'material-ui/Dialog';
import '../../utils/native_listener';
import { Imgc } from '../../common/ui/Imgc';
import BottomSheet from '../../common/ui/BottomSheet';
import { disableBodyTouch } from 'utils/validators';
import { isFunction } from 'lodash';

let start_time = '';
const iframe = isIframe();
const isMobileDevice = getConfig().isMobileDevice;

export function didMount() {
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
    this.commonRender = commonRender.bind(this);
    this.headerGoBack = headerGoBack.bind(this);
    this.renderGenericError = renderGenericError.bind(this);

    this.setState({
        productName: getConfig().productName,
        mounted: true,
        force_show_inpage_title: true,
        inPageTitle: true
    }, () => {
        if(!iframe || isMobileDevice){
            this.onScroll();
        }
    })

    setHeights({ 'header': true, 'container': false });

    let that = this;
    window.callbackWeb.add_listener({
        type: 'back_pressed',
        go_back: function () {
            that.historyGoBack();
        }
    });
    if(!iframe || isMobileDevice){   
        window.addEventListener("scroll", this.onScroll, true);
        this.check_hide_header_title();
    }
}

export function headerGoBack() {
    this.historyGoBack({ fromHeader: true });
}

function addContainerClass (props_base){
    const containerClass = !iframe || isMobileDevice ? 'ContainerWrapper' : 'iframeContainerWrapper';
    return `${containerClass} ${this.props.background || ''} ${props_base &&  props_base.classOverRide ? props_base.classOverRide : ''} ${this.props.classOverRide || ''} ${this.props.noPadding ? "no-padding" : ""}`;
}

export function commonRender(props_base) {

    this.addContainerClass = addContainerClass.bind(this);

    let steps = [];
    for (var i = 0; i < this.props.total; i++) {
        if (this.props.current > i) {
            steps.push(<span className='active'
                style={{ background: getConfig().styles.primaryColor, marginRight: 0 }} key={i}></span>);
        } else {
            steps.push(<span key={i} style={{ marginRight: 0 }}></span>);
        }
    }

    const renderPageLoader2 = (data) => {
        if (this.props.showLoader) {
          return (
            <div
              className={`Loader ${this.props.loaderData ? this.props.loaderData.loaderClass : ""
                }`}
            >
              <div className="LoaderOverlay">
                <div className="LoaderOverlay-title">
                  {data.title}
                </div>
                <img src={require(`assets/${this.state.productName}/loader_gif.gif`)} alt="" />
                <div className="LoaderOverlay-subtitle" >{data.subtitle}</div>
              </div>
            </div>
          );
        } else {
          return null;
        }
    };

    if (this.state.mounted) {
        return (

   <div className={this.addContainerClass(props_base)}>
                {/* Header Block */}
                {(!this.props.noHeader && !getConfig().hide_header) && this.props.showLoader !== true
                && !this.props.showLoaderModal && !iframe  && !this.props.loaderWithData && <Header
                    disableBack={this.props.disableBack}
                    title={this.props.title}
                    smallTitle={this.props.smallTitle}
                    provider={this.props.provider}
                    count={this.props.count}
                    total={this.props.total}
                    current={this.props.current}
                    edit={this.props.edit}
                    noBack={this.props.noBack}
                    type={getConfig().productName}
                    resetpage={this.props.resetpage}
                    handleReset={this.props.handleReset}
                    topIcon={this.props.topIcon || this.props.rightIcon}
                    handleTopIcon={this.handleTopIcon}
                    inPageTitle={this.state.inPageTitle}
                    force_hide_inpage_title={this.state.force_hide_inpage_title}
                    style={this.props.styleHeader}
                    className={this.props.classHeader}
                    headerData={this.props.headerData}
                    new_header={this.state.new_header || this.state.project === 'help'}
                    goBack={this.headerGoBack || this.historyGoBack}
                    filterPage={this.props.filterPage}
                    handleFilter={this.props.handleFilter} 
                    hideBack={this.props.hideBack}
                    logo={this.props.logo}
                    notification={this.props.notification}
                    handleNotification={this.props.handleNotification}          
                />
                }
                {
                    iframe &&
                    <IframeHeader
                        disableBack={this.props.disableBack}
                        title={this.props.title}
                        smallTitle={this.props.smallTitle}
                        provider={this.props.provider}
                        count={this.props.count}
                        total={this.props.total}
                        current={this.props.current}
                        edit={this.props.edit}
                        noBack={this.props.noBack}
                        type={getConfig().productName}
                        resetpage={this.props.resetpage}
                        handleReset={this.props.handleReset}
                        topIcon={this.props.topIcon || this.props.rightIcon}
                        handleTopIcon={this.handleTopIcon}
                        inPageTitle={this.state.inPageTitle}
                        force_hide_inpage_title={this.state.force_hide_inpage_title}
                        style={this.props.styleHeader}
                        className={this.props.classHeader}
                        headerData={this.props.headerData}
                        new_header={this.state.new_header || this.state.project === 'help'}
                        goBack={this.headerGoBack || this.historyGoBack}
                        filterPage={this.props.filterPage}
                        handleFilter={this.props.handleFilter} 
                        hideBack={this.props.hideBack}
                    />
                }
                {/* Below Header Block */}
                <div id="HeaderHeight" style={{ top: 56 }}>

                    {/* Loader Block covering entire screen*/}
                    {/* {this.renderPageLoader()} */}
                    {this.props.loaderWithData
                        ? renderPageLoader2(this.props.loaderData)
                        : this.renderPageLoader()}

                    {/* Error Block */}
                    {this.renderGenericError()}

                    {!this.props.showLoader && !this.props.showLoaderModal && steps && <div className={`Step ${(this.props.type !== 'fisdom') ? 'blue' : ''}`}>
                        {steps}
                    </div>}

                    {/* Banner Block */}
                    {!this.props.showLoader && !this.props.showLoaderModal && this.props.banner && <Banner text={this.props.bannerText} />}



                </div>

                {!this.state.force_hide_inpage_title && !this.props.noHeader &&
                !this.props.force_hide_inpage_title && this.state.new_header &&
                    this.new_header_scroll()
                }

                { this.props.skelton &&
                    <UiSkelton
                        type={this.props.skelton}
                    />
                }

                {/* Children Block */}
                <div
                    style={{ ...this.props.styleContainer, backgroundColor: this.props.skelton ? '#fff' : 'initial' }}
                    className={`${!iframe || isMobileDevice ? 'Container' : 'IframeContainer'}  ${this.props.background || ''} 
                    ${props_base && props_base.classOverRideContainer ? props_base.classOverRideContainer : ''} 
                    ${this.props.classOverRideContainer || '' } 
                    ${this.props.noPadding ? "no-padding" : ""}
                    ${!this.props.noFooter ? "iframe-bottom-padding": ''}`}
                    >
                    <div
                        className={`${!this.props.skelton ? 'fadein-animation' : ''}`}
                        style={{ display: this.props.skelton ? 'none' : '' }}
                    >
                        {this.props.children}
                    </div>
                    {
                        this.props.iframeRightContent &&  iframe && !isMobileDevice &&
                        <div className='iframe-right-content'>
                            <img src={this.props.iframeRightContent} alt="right_img" />
                        </div>
                    }
                </div>

                {/* Footer Block */}
                {!this.props.noFooter && !this.props.skelton &&
                    <Footer
                        buttonTitle={this.props.buttonTitle}
                        handleClick={this.props.handleClick}
                        handleReset={this.props.handleReset}
                        onlyButton={this.props.onlyButton}
                        noFooter={this.props.noFooter}
                        showLoader={this.props.showLoader}
                        fullWidthButton={this.props.fullWidthButton}
                        logo={this.props.logo}
                        provider={this.props.provider}
                        premium={this.props.premium}
                        paymentFrequency={this.props.paymentFrequency}
                        edit={this.props.edit}
                        resetpage={this.props.resetpage}
                        handleClick2={this.props.handleClick2}
                        disable={this.props.disable || this.props.isDisabled
                            || this.props.buttonDisabled}
                        withProvider={this.props.withProvider}
                        buttonData={this.props.buttonData}
                        project={this.props.project || this.state.project}
                        dualbuttonwithouticon={this.props.dualbuttonwithouticon}
                        twoButton={this.props.twoButton}
                        buttonOneTitle={this.props.buttonOneTitle}
                        buttonTwoTitle={this.props.buttonTwoTitle}
                        handleClickOne={this.props.handleClickOne}
                        handleClickTwo={this.props.handleClickTwo}
                        showDotDot={this.props.showDotDot}
                        {...this.props}
                    />
                }
                {/* No Internet */}
                {this.renderDialog()}
                {this.renderPopup()}
            </div>
        )
    }

    return null;
}

export function unmount() {
    window.callbackWeb.remove_listener({});
    if(!iframe || isMobileDevice){
        window.removeEventListener("scroll", this.onScroll, false);
    }

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
    let restrict_in_page_titles = ['provider-filter', 'insurance-advisory-start'];
    if (restrict_in_page_titles.indexOf(this.props.headerType) !== -1 || this.state.force_hide_inpage_title) {
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
    const Container = !iframe || isMobileDevice ? 'Container' : 'IframeContainer';
    console.log("container is", Container);
    var el = document.getElementsByClassName(Container)[0];
    console.log("el is", el);
    var height = el.getBoundingClientRect().top;
    console.log("height is", height);
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
            open={this.state.openPopup || false}
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
    let { title1, title2, button_text1, button_text2,
        handleClick2, handleClick1 } = errorData;

    let type = errorData.type || 'generic';
    let mapper = {
        'generic': {
            'title1': 'Error',
            'button_text2': 'DISMISS',
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

    if(!title1) {
        title1 = map_data.title1;
    }

    if(title2 === true) {
        title2 = 'Sorry, we could not process your request'; // default text
    }

    // let two_button  = handleClick2 ? true: false;

    button_text2 = button_text2 || map_data.button_text2 || 'CLOSE';
    button_text1 = button_text1 || map_data.button_text1 || 'RETRY';

    function genericErrorActionsPage() {
        return (
            <div className="actions-page">
                <div
                    className={`page-button button`}
                    onClick={() => {
                        handleClick1();
                    }}>
                    {button_text1}
                </div>
            </div>
        )
    }

    this.navigate = navigate.bind(this);
    function redirectToHelp() {
        let path = '/help';
        this.navigate(path);
    }

    this.redirectToHelp = redirectToHelp.bind(this);


    let generic_error2_icon = 'data:image/png;base64,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';

    if (this.props.showError === true) {


        return (

            <BottomSheet
                open={this.props.showError || false}
                data={{
                    'header_title': title1 || 'Error',
                    'content': title2 || '',
                    'src': generic_error2_icon,
                    'button_text1': button_text1,
                    'handleClick1': handleClick1,
                    'button_text2': button_text2,
                    'handleClick2': handleClick2,
                    'handleClose': this.props.errorData.setErrorData,
                    'helpClick': this.redirectToHelp
                }}
            />


            //             <div className="help" onClick={() => this.redirectToHelp()}>GET HELP</div>
            //             {genericErrorActions()}
            //         </div>

        );
    } if (this.props.showError === 'page') {


        return (
            <div className={`generic-error-dialog generic-error-dialog-page fadein-animation ${errorData ? errorData.errorClass : ''}`}>
                <div id="error-dialog-parent" className="overlay ovarlay-page">
                    <Imgc className="top-image top-image-page" src={generic_error2_icon} alt="" />
                    <div className="title1 title1-page">{title1 || 'Error'}</div>

                    <div className="title2 title2-page">{title2 || 'Sorry, we could not process your request'}</div>

                    {getConfig().project !== 'loan' && <div className="help help-page" onClick={() => this.redirectToHelp()}>GET HELP</div>}
                    {genericErrorActionsPage()}
                </div>
            </div>
        );
    } else {
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

    // let quotes_data_insurance = [
    //     'Life insurance will protect your family’s financial future.',
    //     'If there’s anyone dependent on you - you need insurance.',
    //     'Did you know insurance is good investment?',
    //     'Insurance is a combination of care, commitment and common sense.',
    //     'Think future, think insurance.',
    //     'You’re future-proof when insured!',
    //     'How do you ensure your loved ones are safe after you? Insure!',
    //     'Insurance is sound planning for life.',
    //     'It’s OK to prepare now for tomorrow.',
    //     'Secure your loved ones that depend on you.',
    // ]

    
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
        disableBodyTouch();
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
        disableBodyTouch(true);
        return null;
    }
}

export function handleClose() {
    if (isFunction(this.handleCloseCallback)) {
        this.handleCloseCallback();
    }

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
                    className={`header-title-page-count-text ${this.state.inPageTitle ? 'slide-fade-show' : 'slide-fade'}`}>
                    <span style={{ fontWeight: 600 }}>{this.props.current}</span>/<span>{this.props.total}</span>
                </span>}
        </div>

    )
}