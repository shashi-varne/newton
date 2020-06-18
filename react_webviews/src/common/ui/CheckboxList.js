import React, { Component } from 'react';
import './style.css';
import { getConfig } from 'utils/functions';
import 'react-circular-progressbar/dist/styles.css';

import Checkbox from 'material-ui/Checkbox';
import Grid from 'material-ui/Grid';
import SVG from 'react-inlinesvg';
import plus_icon from 'assets/plus_icon.svg';
import minus_icon from 'assets/minus_icon.svg';

class CheckboxListClass extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: this.props.name
        };

    }

    updateParent = (key, value) => {
        this.props.parent.updateParent(key, value);
    }

    handleClick = (name, type) => {


        let state = this.props.parent.state;

        if (state[name + '_disabled']) {
            return;
        }

            
        if(type === 'plus' && state[name + '_ismax']) {
            return;
        }

        if (type === 'checked') {
            let checked = !state[name + '_checked']

            this.updateParent([name + '_checked'], checked);

            let total = '';
            if (checked) {
                total = 1;
            }

            this.updateParent([name + '_total'], total);
        }


        

    }


    render() {
        let name = this.props.name;
        let parentState = this.props.parent.state;
        return (
            <div>
                <div className="CheckBlock2 plus-minus-input"
                    style={{ opacity: parentState[name + '_disabled'] ? 0.4 : 1 }}>
                    <Grid container spacing={16} alignItems="center">
                        <Grid item xs={1} className="TextCenter">
                            <Checkbox
                                defaultChecked
                                checked={parentState[name + '_checked'] || false}
                                color="default"
                                value="checked"
                                name="checked"
                                onChange={() => this.handleClick(name, 'checked')}
                                className="Checkbox" />
                        </Grid>
                        
                            <Grid item xs={11}>
                                <div className="right-data">
                                    <div className="content" style={{textTransform: 'capitalize'}}>{name}</div>
                                </div>
                            </Grid>
                        
                    </Grid>
                </div>
            </div>
        );
    }
};

const CheckboxList = (props) => (
    <CheckboxListClass
        {...props} />
);

export default CheckboxList;
