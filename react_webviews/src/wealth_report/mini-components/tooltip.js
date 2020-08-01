import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

const styles = theme => ({
  lightTooltip: {
    backgroundColor:'#ffffff',
    border:'0.5px solid rgba(151, 151, 151, 0.1)',
    boxShadow: '0px 2px rgba(0, 0, 0, 0.05)',
    fontSize: 11,
    borderRadius: '10px',
    padding: '30px 24px 30px 20px'
  },
    arrowArrow: {
      position:'absolute',
      bottom:'100%',
      left: '47%',
      borderWidth: '10px',
      borderStyle: 'solid',
      borderColor: 'transparent transparent #ffffff transparent',
      
    },
});

class CustomizedTooltips extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }


    state = {
        arrowRef: null,
      }
    
      handleArrowRef = node => {
        console.log(node)
        this.setState({
          arrowRef: node,
        })
        return node;
      }

  render() {
    const { classes } = this.props;

    const overview = (
      <React.Fragment>
        <span className={classes.arrowArrow} ref={this.handleArrowRef} />
        <div style={{width:'300px'}}>
          <div style={{fontSize:'15px', color:'#432088', fontWeight:'500', marginBottom:'4px'}}>XIRR ( Extended Internal Return Rate)</div>
          <div style={{color:'#a9a9a9', fontSize:'15px', lineHeight:'20px'}}>
              XIRR or extended internal return rate is the standard return metricis for measuring the annual performance of the mutual funds
          </div>
        </div>
      </React.Fragment>
    )
    return (
        <Tooltip title={overview}
          classes={{ tooltip: classes.lightTooltip }}
          PopperProps={{
            popperOptions: {
              modifiers: {
                arrow: {
                  enabled: Boolean(this.state.arrowRef),
                  element: this.state.arrowRef,
                },
              },
            },
          }}
        >
        <img
          src={require(`assets/fisdom/ic-info-xirr-overview.svg`)}
          style={{marginLeft:'300px', marginTop:'0px'}}
          alt=""
        />
        </Tooltip>
    );
  }
}

CustomizedTooltips.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CustomizedTooltips);