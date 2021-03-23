import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import { nonRoundingToFixed } from '../../utils/validators';

const preProcessData = (data, colors = []) => (
  data.map((dataObj, idx) => {
    dataObj.value = nonRoundingToFixed(dataObj.value, 2);
    dataObj.color = colors[idx];
    return dataObj;
  })
);

export default function PieChart (props) {
  const { width = 0, height = 0, colors = [], ...otherProps } = props;
  let data = preProcessData(props.data, colors);
  
  return (
    // Require a container div since ResponsivePieChart fit to size of its contianer
    <div
      style={{ width: `${width}px`, height: `${height}px` }}
      className="animated animatedFadeInUp fadeInUp">
      <ResponsivePie
        data={data}
        // height={height}
        // width={width}
        isInteractive={false} // https://fisdom.atlassian.net/browse/SUP-710?focusedCommentId=24548
        innerRadius={0.6}
        enableRadialLabels={false}
        enableSliceLabels={false}
        animate={true}
        tooltip={customTooltip}
        colors={{ datum: 'data.color' }}
        theme={{
          tooltip: {
            container: {
              background: 'none',
              boxShadow: 'none',
              padding: '0',
            },
          }
        }}
        {...otherProps}
      />
    </div>
  );
}

function customTooltip({ label, color }) {
  return (
    <div className="wr-pie-tooltip">
      <div
        className="wr-pt-color-bubble"
        style={{ backgroundColor: color }}>
      </div>
      <span className="wr-pt-label">{label}</span>
    </div>
  );
}