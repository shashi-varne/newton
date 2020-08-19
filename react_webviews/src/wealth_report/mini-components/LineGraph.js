import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import { convertToThousand } from 'utils/validators';
import { formattedDate } from '../../utils/validators';

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
      margin={{ top: 50, right: 20, bottom: 50, left: 50 }}
      xScale={{
        type: 'point',
      }}
      yScale={{
        type: 'linear',
        min: 'auto',
        max: 'auto',
        stacked: false,
        reverse: false
      }}
      axisBottom={{
        format: value => formattedDate(value, 'd m', true),
        tickValues: props.params.date_ticks || [],
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
      theme={{
        axis: {
          ticks: {
            text: {
              fill: "#b0bac9",
              fontSize: '10px',
            }
          }
        },
        grid: {
          line: {
            stroke: "rgba(80, 45, 168, 0.05)",
            strokeWidth: 0.5,
          }
        }
      }}
      layers={['grid', 'markers', 'areas', DashedLine, 'slices', 'points', 'axes', 'legends']}
    />
  );
};

export default MyResponsiveLine;