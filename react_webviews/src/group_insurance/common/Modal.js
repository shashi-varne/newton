import React from 'react';
import Modal from 'material-ui/Modal';
import Typography from 'material-ui/Typography';
import { getConfig } from 'utils/functions';

function LoaderModal(props) {
    const productName = getConfig().productName;
    return (
        <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={props.open}
            id="loaderModal"
        >
            <div className="loader-in-dialog-content">
                <div className="loader-container">
                    <img src={require(`assets/${productName}/loader_gif.gif`)} alt="" />
                </div>
                <Typography variant="subheading" id="simple-modal-description" className="message">
                    {props.message}
                </Typography>
            </div>
        </Modal>
    )
}

export default LoaderModal;
