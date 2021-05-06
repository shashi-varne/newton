import React from 'react';
import { ResponsivePie } from '@nivo/pie';


export default function PieChart (props) {
  const { width = 0, height = 0, ...otherProps } = props;
  
  return (
    // Require a container div since ResponsivePieChart fit to size of its contianer
    <div style={{ width: `${width}px`, height: `${height}px` }}>
      <ResponsivePie
        data={props.data}
        innerRadius={0.6}
        enableRadialLabels={false}
        enableSliceLabels={false}
        padAngle={1}
        animate={true}
        colors={{ datum: 'data.color' }}
        {...otherProps}
      />
    </div>
  );
}