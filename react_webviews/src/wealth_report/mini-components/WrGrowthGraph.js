import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import { formattedDate, formatAmountInr, numDifferentiationInr } from '../../utils/validators';

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

const WrGrowthGraph = (props) => {
  const { params = {}, data = [], width = 0, height = 0 } = props;
  return (
    <div style={{ width, height }}>
      <ResponsiveLine
        data={data}
        margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
        xScale={{
          type: 'point',
        }}
        yScale={{
          type: 'linear',
          min: params.min || 'auto',
          max: params.max || 'auto',
          stacked: false,
          reverse: false
        }}
        axisBottom={{
          format: value => formattedDate(value, 'd m', true),
          tickValues: params.date_ticks || [],
          tickPadding: 20,
          tickSize: 0,
        }}
        axisLeft={{
          orient: 'left',
          tickValues: 6,
          format: value => numDifferentiationInr(value), //converts 40000 to 40K
          tickPadding: 10,
          tickSize: 0,
        }}
        curve="natural"
        enableGridX={false}
        colors={['#b9abdd', '#502da8']}
        enablePoints={false}
        enableSlices="x"
        enableCrosshair={true}
        crosshairType="x"
        useMesh={true}
        theme={{
          axis: {
            ticks: {
              text: {
                fill: "rgba(135, 135, 135, 0.85)",
                fontSize: '10px',
              }
            }
          },
          grid: {
            line: {
              stroke: "rgba(80, 45, 168, 0.05)",
              strokeWidth: 0.5,
            }
          },
          crosshair: {
            line: {
              stroke: '#150731',
              strokeWidth: 0.9,
              strokeOpacity: 0.1,
            },
          }
        }}
        sliceTooltip={WrLineTooltip}
        layers={['grid', 'markers', 'areas', 'crosshair', DashedLine, 'slices', 'points', 'axes', 'legends']}
      />
    </div>
  );
};

export default WrGrowthGraph;

const WrLineTooltip = ({ slice }) => {
  const [date] = slice.points.map(point => point.data.x);
  return (
    <div className="wr-growth-graph-legend">
      <div className="wr-ggl-header">{formattedDate(date, 'd m, y')}</div>
      {slice.points.map((point, idx) => {
        const { data: {yFormatted: value}, serieId: label } = point;
        return (
          <div className="wr-ggl-item" key={idx}>
            <div className="wr-ggli-color-bubble" style={{ background: point.color }}></div>
            <span className="wr-ggli-label">{label.split('_')[0]}:</span>
            &nbsp;&nbsp;<span className="wr-ggli-value">{formatAmountInr(value)}</span>
          </div>
        );
      })}
    </div>
  );
}