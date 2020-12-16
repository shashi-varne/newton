import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import { linearGradientDef } from '@nivo/core';
import { formattedDate, formatAmountInr, numDifferentiationInr } from '../../utils/validators';
import { getConfig } from 'utils/functions';
import IwdCardLoader from './IwdCardLoader';


const isMobileView = getConfig().isMobileDevice;

const IwdGrowthGraph = ({
  params = {},
  data = [],
  width = 0,
  height = 0,
  isLoading = false
}) => {
  return (
    <div style={{ width, height, margin: '0 -20px' }}>
      {isLoading ?
        <IwdCardLoader />
        : 
        (<ResponsiveLine
          data = { data }
          animate = { true }
          margin = {{ top: 20, right: 20, bottom: 40, left: 70 }}
          yScale={{
            type: 'linear',
            min: params.min || 'auto',
            max: params.max || 'auto',
            stacked: false,
            reverse: false
          }}
          axisBottom={{
            format: value => formattedDate(value, params.dateFormat, true),
            tickValues: params.date_ticks,
            tickPadding: 20,
            tickSize: 0,
          }}
          axisLeft={{
            orient: 'left',
            tickValues: 6,
            format: value => value === 0 ? 0 : numDifferentiationInr(value, 2, value > 100000), //converts 40000 to 40K
            tickPadding: 15,
            tickSize: 0,
          }}
          curve="basis"
          enableGridX={false}
          colors={['#4F2DA6', '#4AD0C0']}
          enablePoints={false}
          enableSlices="x"
          enableCrosshair={true}
          crosshairType="x"
          useMesh={true}
          theme={{
            axis: {
              ticks: {
                text: Object.assign({
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  fontWeight: '600',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                }, !isMobileView ? {
                  fill: "rgb(118, 126, 134)",
                  fontSize: '11px',
                  lineHeight: '18px',
                } : {
                    fontSize: '9px',
                    lineHeight: '14px',
                    fill: "rgba(118, 126, 134, 0.4)",
                })
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
          sliceTooltip={IwdLineTooltip}
          enableArea={true}
          areaBaselineValue={params.min}
          defs={[
          linearGradientDef('gradientA', [
            { offset: 0, color: 'inherit' },
            { offset: 100, color: 'inherit', opacity: 0 },
          ]),
        ]}
        fill={[{ match: '*', id: 'gradientA' }]}
      />)}
    </div>
  );
};

export default IwdGrowthGraph;

const IwdLineTooltip = ({ slice }) => {
  // return '';
  const [date] = slice.points.map(point => point.data.x);
  console.log(date);
  return (
    <div className="iwd-growth-graph-legend">
      <div className="iwd-ggl-header">{formattedDate(date, 'd m, y')}</div>
      <div className="iwd-ggl-body">
        {slice.points.map((point, idx) => {
          const { data: {yFormatted: value}, serieId: label } = point;
          return (
            <div className="iwd-ggl-item" key={idx}>
              <div
                className="iwd-ggli-color-bubble"
                style={{ background: point.color }}
              >
              </div>
              <span
                className="iwd-ggli-label"
                style={{ color: point.color }}
              >
                {label.split('_')[0]}:
              </span>
              &nbsp;&nbsp;
              <span className="iwd-ggli-value">
                {value ? formatAmountInr(value) : '₹0'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}