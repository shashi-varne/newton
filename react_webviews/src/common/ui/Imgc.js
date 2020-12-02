import React from 'react';

import "react-placeholder/lib/reactPlaceholder.css";
import './style.scss';
import {SkeltonRect} from './Skelton';
import SVG from 'react-inlinesvg';
export const Imgc = (props) => {
        return (
            <SVG
            src={props.src}
            className={props.className}
            alt={props.alt}
            style={props.style}
            loader={<SkeltonRect style={props.style} className={props.className} />}
            />
            // <SkeltonRect style={props.style} className={props.className} />
        );
};


