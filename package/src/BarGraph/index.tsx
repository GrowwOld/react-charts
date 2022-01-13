import React from 'react';
import { Group } from '@visx/group';
import { Bar, Line } from '@visx/shape';
import { scaleLinear, scaleBand } from '@visx/scale';
import { AxisBottom } from '@visx/axis';

import {isEmpty} from '../utils/helpers';



class BarGraph extends React.PureComponent<BarGraphProps, State> {

  render() {
    return this.getGraphUI();
  }


  getXValue = (d: BarData) => d[0];


  getYValue = (d: BarData) => d[1];


  getFormattedText = (textX : number, textY: number, yVal: number) => {

    return (
      <text
        x={textX}
        y={textY}
        textAnchor="middle"
        className="fs12 clrText"
      >
        <tspan style={{ fill: 'var(--text)' }}>{yVal}</tspan>
      </text>
    );
  }


  getGraphUI = () => {
    const { data, topMargin, bottomMargin, height, width } = this.props;


    if (isEmpty(data)) return null;


    const bottomAxisHeight = 22;
    const graphHeight = height - bottomAxisHeight;
    const minValue = Math.min(...data.map(this.getYValue));

    const events = false;
    const xMax = width;
    const yMin = topMargin;

    const yMax = graphHeight - topMargin - (minValue < 0 ? bottomMargin : 0);

    const xScale = scaleBand({
      range: [ 0, xMax ],
      round: true,
      domain: data.map(this.getXValue),
      padding: 0

    });
    const yScale = scaleLinear({
      range: [ yMax, yMin ],
      round: true,
      domain: [ Math.min(0, Math.min(...data?.map(this.getYValue))), Math.max(...data?.map(this.getYValue)) ]
    });

    const yScale0 = yScale(0);

    if (width < 10) {
      return null;
    }

    return (
      <svg width={width}
        height={height}
      >
        <rect width={width}
          height={height}
          fill="var(--primaryBg)"
          rx={14}
          style={{ overflow: 'visible' }}
        />
        <Group>
          {
            data.map(d => {
              const y = this.getYValue(d);
              const yScaleY = yScale(y);
              const isNegative = y < 0;
              const xval = this.getXValue(d);
              let barBandwidth = xScale.bandwidth();
              let barX = xScale(xval) ?? 0;

              if (barBandwidth > 20) {
                barX = barX + (barBandwidth - 20) / 2;
                barBandwidth = 20;
              }

              const barY = isNegative ? yScale0 : yScaleY;
              const barHeight = isNegative ? Math.abs(yScaleY - yScale0) : yScale0 - barY;
              const textX = barX + barBandwidth / 2;
              const textY = isNegative ? barY + barHeight + 12 : barY - 5;

              return (
                <React.Fragment>
                  {this.getFormattedText(textX, textY, y)}
                  <Bar
                    key={`bar-${xval}`}
                    x={barX}
                    y={barY}
                    width={barBandwidth}
                    height={barHeight}
                    fill="var(--primaryClr)"
                    onClick={
                      () => {
                        if (events) alert(`clicked: ${JSON.stringify(Object.values(d))}`);
                      }
                    }
                  />
                </React.Fragment>
              );
            })
          }
          <Line
            from={{ x: 0, y: yScale0 }}
            to={{ x: xMax, y: yScale0 }}
            stroke={'var(--border)'}
            strokeWidth={1}
          />

        </Group>

        <AxisBottom
          top={yMax + (minValue < 0 ? bottomMargin : 0)}
          scale={xScale}
          tickFormat={(d) => d}
          stroke='var(--border)'
          orientation='bottom'
          hideTicks
          tickLabelProps={
            () => ({
              fill: 'var(--subText)',
              fontSize: 11,
              textAnchor: 'middle'
            })
          }
        />
      </svg>
    );

  }


}


type State = {}

export type BarData = [string, number]


type BarGraphProps = {
  data: BarData[];
  topMargin: number;
  bottomMargin: number;
  width: number;
  height: number;
}

export default BarGraph;
