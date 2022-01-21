import React from 'react';
import { scaleBand } from '@visx/scale';
import { AxisBottom } from '@visx/axis';
import { isEmpty } from '../utils/helpers';


const BarGraph = (props: BarGraphProps) => {

  const {
    data,
    topMargin,
    bottomMargin,
    height,
    width,
    maxBarWidth,
    barColor,
    axisColor,
    axisLabelFontSize,
    axisLabelColor,
    getBarTopTextUI
  } = props;


  const getXValue = (d: BarData) => d[0];


  const getYValue = (d: BarData) => d[1];


  if (isEmpty(data)) return null;


  const bottomAxisHeight = 22;
  const graphHeight = height - bottomAxisHeight;
  const minValue = Math.min(...data.map(getYValue));

  const xMax = width;
  const yMin = topMargin;

  const yMax = graphHeight - topMargin - (minValue < 0 ? bottomMargin : 0);

  const xScale = scaleBand({
    range: [ 0, xMax ],
    round: true,
    domain: data.map(getXValue),
    padding: 0
  });

  const scaleYData = {
    domain: [ Math.min(0, Math.min(...data?.map(getYValue))), Math.max(0, ...data?.map(getYValue)) ],
    range: [ yMax, yMin ]
  };


  const yScale = (yVal: number) => {
    return (
      scaleYData.range[0] +
            (yVal - scaleYData.domain[0]) * (scaleYData.range[1] - scaleYData.range[0]) / (scaleYData.domain[1] - scaleYData.domain[0])
    );
  };

  const yScale0 = yScale(0);


  const getBottomAxisUI = () => {
    return (
      <AxisBottom
        top={yMax + (minValue < 0 ? bottomMargin : 0)}
        scale={xScale}
        tickFormat={(d) => d}
        stroke={axisColor}
        orientation='bottom'
        hideTicks
        tickLabelProps={
          () => ({
            fill: axisLabelColor,
            fontSize: axisLabelFontSize,
            textAnchor: 'middle'
          })
        }
      />
    );
  };


  return (
    <svg width={width}
      height={height}
    >
      <rect width={width}
        height={height}
        fill="var(--constantTransparent)"
        style={{ overflow: 'visible' }}
      />
      <g>
        {
          data.map(d => {
            const y = getYValue(d);
            const yScaleY = yScale(y);
            const isNegative = y < 0;
            const xval = getXValue(d);

            let barBandwidth = xScale.bandwidth();

            let barX = xScale(xval) ?? 0;

            if (maxBarWidth && barBandwidth > maxBarWidth) {
              barX = barX + (barBandwidth - maxBarWidth) / 2;
              barBandwidth = 20;
            }

            const barY = yScaleY;
            const barHeight = isNegative ? Math.abs(yScaleY - yScale0) : yScale0 - barY;
            const textX = barX + barBandwidth / 2;
            const textY = isNegative ? barY + 12 : barY - 5;


            return (
              <React.Fragment key={getXValue(d) + getYValue(d)}>
                {getBarTopTextUI(textX, textY, d)}
                <line
                  className='gahaha'
                  x1={textX}
                  x2={textX}
                  y1={yScale0}
                  y2={barY}
                  stroke-width={barBandwidth}
                  height={barHeight}
                  stroke={barColor}
                >
                </line>
              </React.Fragment>
            );
          })
        }
        <line
          x1={0}
          y1={yScale0 }
          x2= {xMax}
          y2= {yScale0 }
          stroke={axisColor}
          strokeWidth={1}
        />

      </g>

      {getBottomAxisUI()}
    </svg>
  );
};


export type BarData = [string, number]


type BarGraphProps = {
  data: BarData[];
  barColor: string;
  axisColor: string;
  topMargin: number;
  bottomMargin: number;
  width: number;
  height: number;
  maxBarWidth?: number;
  axisLabelFontSize?: number;
  axisLabelColor?: string;
  getBarTopTextUI: (textX : number, textY: number, barData: BarData) => SVGElement;
}

export default BarGraph;
