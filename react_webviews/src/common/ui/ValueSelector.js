import React, { Component } from 'react'

class ValueSelector extends Component {

    renderPlans = (props, index) => {
        return (
            <div onClick={() => this.props.handleSelect(index, props)}
                className={`tile ${index === this.props.selectedIndex ? 'tile-selected' : ''}`} key={index}>
                <div className="select-tile">
                    <div className="name">
                        {props.value}
                    </div>
                    {index === this.props.selectedIndex && <img className="completed-icon" src={require(`assets/completed_step.svg`)} alt="" />}
                </div>
            </div >
        )
    }

    render() {
        return (
            <div className="value-selector-container">
                {this.props.optionsList && this.props.optionsList.map(this.renderPlans)}
            </div>
        )
    }
}

export default ValueSelector;
