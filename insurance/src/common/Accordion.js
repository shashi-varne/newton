import React, { Component } from 'react';
import Api from '../service/api';

class Section extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      className: 'accordion-content accordion-close',
      headingClassName: 'accordion-heading'
    };
  }

  handleClick = (index) => {
    const { open } = this.state;
    if (open) {
      this.setState({
        open: false,
        className: "accordion-content accordion-close",
        headingClassName: "accordion-heading"
      });
    } else {
      this.setState({
        open: true,
        className: "accordion-content accordion-open",
        headingClassName: "accordion-heading clicked"
      });
    }
  }

  render() {
    const { className } = this.state;
    const { headingClassName } = this.state;

    return (
      <div className="parent-accordion">
        <div className={headingClassName} onClick={() => this.handleClick('0')}>
          {this.props.type.name}
        </div>
        <div className={className}>
          {this.props.type.body}
        </div>
      </div>
    );
  }
};

class Accordion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      types: [
        { name: 'Benefits', body: '&lt;h1&gt;Hi there!&lt;/h1&gt;' },
        { name: 'Personal details', body: '&lt;h1&gt;Hi there!&lt;/h1&gt;' },
        { name: 'Contact details', body: '&lt;h1&gt;Hi there!&lt;/h1&gt;' },
        { name: 'Nominee details', body: '&lt;h1&gt;Hi there!&lt;/h1&gt;' },
        { name: 'Professional details', body: '&lt;h1&gt;Hi there!&lt;/h1&gt;' }
      ]
    };
  }

  async componentDidMount() {
    const res = await Api.get('/api/insurance/all/summary');

    if (res.pfwresponse.status_code === 200) {
      console.log(res.pfwresponse.result);
    } else {
      console.log(res.pfwresponse.result.error);
    }
  }

  render() {
    return (
      <div className="accordion-container">
        {this.state.types.map((type, i) =>
          <Section type={type} key={i} />
        )}
      </div>
    );
  }
}

export default Accordion;
