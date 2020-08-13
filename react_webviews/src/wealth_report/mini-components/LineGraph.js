import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import { convertToThousand } from 'utils/validators';

const styleById = {
  'current_amount': {
    strokeDasharray: '6, 6',
    strokeWidth: 2,
  },
  default: {
    strokeWidth: 2,
  },
};

const DashedLine = ({ series, lineGenerator, xScale, yScale }) => {
  return series.map(({ id, data, color }) => (
    <path
      key={id}
      d={lineGenerator(
        data.map(d => ({
          x: xScale(d.data.x),
          y: yScale(d.data.y),
        }))
      )}
      fill="none"
      stroke={color}
      style={styleById[id] || styleById.default}
    />
  ))
};

const MyResponsiveLine = (props) => {
  return (
    <ResponsiveLine
      data={props.data}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{
        type: 'time',
        format: '%Y-%m-%d',
        useUTC: false,
        // precision: 'month',
      }}
      xFormat="time:%Y-%m-%d"
      yScale={{
        type: 'linear',
        // base: 2,
        min: 400000,
        max: 'auto',
        stacked: false,
        reverse: false
      }}
      axisBottom={{
        format: props.params.tickFormat,
        tickValues: props.params.tickInterval,
        tickPadding: 20,
        tickSize: 0,
      }}
      axisLeft={{
        orient: 'left',
        tickValues: 6,
        format: value => convertToThousand(value), //converts 40000 to 40K
        tickPadding: 10,
        tickSize: 0,
      }}
      enableGridX={false}
      colors={{ scheme: 'nivo' }}
      enablePoints={false}
      enableSlices="x"
      crosshairType="x"
      useMesh={true}
      layers={['grid', 'markers', 'areas', DashedLine, 'slices', 'points', 'axes', 'legends']}
    />
  );
};

export default MyResponsiveLine;