import React, { useState } from 'react';
import { max, min, bisector } from 'd3-array';

import { Group } from '@visx/group';
import { Line } from '@visx/shape';
import { EventType } from '@visx/event/lib/types';

import { localPoint } from '@visx/event';
import isEmpty from 'lodash/isEmpty';


import './candleChart.css';
import { Candle, CandleChartProps, ToolTipData } from './candleChartTypes';

let toolTipRef: HTMLDivElement | null = null;


const CandleChart = (props: CandleChartProps) => {

  const [ tooltipData, setToolTipData ] = useState<ToolTipData>();

  const {
    currentGraphData,
    toolTipFormatter,
    paddingVert,
    paddingHorz,
    height,
    width,
    allowTooltip,
    showVolumeBars
  } = props;


  if (isEmpty(currentGraphData)) {
    return null;
  }

  const series = currentGraphData ?? [];


  const getIndex = (d: Candle) => d[0];


  const getHigh = (d: Candle) => d[2];


  const getLow = (d: Candle) => d[3];


  const getVol = (d: Candle) => d[5];
  let minY: number = Number.MAX_SAFE_INTEGER;
  let maxY:number = Number.MIN_SAFE_INTEGER;
  let minX = Number.MAX_SAFE_INTEGER;
  let maxX = Number.MIN_SAFE_INTEGER;
  let maxVol = Number.MIN_SAFE_INTEGER;
  let minVol = Number.MAX_SAFE_INTEGER;

  const tempMinY = min(currentGraphData, getLow);
  const tempMaxY = max(currentGraphData, getHigh);
  const tempMinX = min(currentGraphData, getIndex);
  const tempMaxX = max(currentGraphData, getIndex);
  const tempMinVol = min(currentGraphData, getVol);
  const tempMaxVol = max(currentGraphData, getVol);


  if (tempMinY !== undefined) { minY = Math.min(minY, tempMinY); }

  if (tempMaxY !== undefined) { maxY = Math.max(maxY, tempMaxY); }

  if (tempMinX !== undefined) { minX = Math.min(minX, tempMinX); }

  if (tempMaxX !== undefined) { maxX = Math.max(maxX, tempMaxX); }

  if (tempMinVol !== undefined) { minVol = Math.min(minVol, tempMinVol); }

  if (tempMaxVol !== undefined) { maxVol = Math.max(maxVol, tempMaxVol); }


  const scaleXData = {
    domain: [ minX, maxX ],
    range: [ 0 + paddingHorz, width - paddingHorz ]
  };


  const scaleYData = {
    domain: [ minY, maxY ],
    range: [ height - paddingVert, paddingVert ]
  };

  const scaleYVolumeData = {
    domain: [ minVol, maxVol ],
    range: [ height - paddingVert, height - paddingVert - 100 ] //100 as volume bar max height
  };


  const yScale = (yVal: number) => {
    return (
      scaleYData.range[0] +
          (yVal - scaleYData.domain[0]) * (scaleYData.range[1] - scaleYData.range[0]) / (scaleYData.domain[1] - scaleYData.domain[0])
    );
  };


  const yScaleVolume = (yVal: number) => {
    return (
      scaleYVolumeData.range[0] +
          (yVal - scaleYVolumeData.domain[0]) * (scaleYVolumeData.range[1] - scaleYVolumeData.range[0]) / (scaleYVolumeData.domain[1] - scaleYVolumeData.domain[0])
    );
  };


  const xScale = (xVal: number) : number => {
    return (
      scaleXData.range[0] +
          (xVal - scaleXData.domain[0]) * (scaleXData.range[1] - scaleXData.range[0]) / (scaleXData.domain[1] - scaleXData.domain[0])
    );
  };


  const invertX = (x: number): number => {
    return (
      scaleXData.domain[0] +
          ((x - scaleXData.range[0]) * (scaleXData.domain[1] - scaleXData.domain[0]) / (scaleXData.range[1] - scaleXData.range[0]))
    );
  };


  const getToolTipUI = () => {

    if (!tooltipData) {
      return null;
    }

    const contentWidth = toolTipRef?.offsetWidth ?? 0;
    const minVal = 0;
    const maxVal = width - contentWidth - 15;
    const finalToolTipLeft = Math.min(maxVal, Math.max(minVal, tooltipData?.tooltipLeft - (contentWidth / 2)));

    const tooltipStyle : React.CSSProperties = {
      top: 0,
      left: 0,
      boxShadow: 'none',
      padding: 0,
      backgroundColor: 'var(--constantTransparent)',
      position: 'absolute',
      borderRadius: '3px',
      transform: `translate(${finalToolTipLeft}px, -10px)`

    };

    return (
      <div ref={
        ref => {
          toolTipRef = ref;
        }
      }
      style={tooltipStyle}
      >
        {toolTipFormatter(tooltipData)}
      </div>
    );
  };


  const hideTooltip = () => {
    setToolTipData(undefined);
  };


  const handleTooltip = (e: EventType) => {

    const { x } = localPoint(e) || { x: 0 };
    const x0 = invertX(x);
    const bisectDate = bisector(getIndex).left;

    let index = bisectDate(series, x0, 0);

    if (index === series.length) {
      index = series.length - 1;
    }

    const indexData = series[index];

    setToolTipData({
      candle: indexData,
      tooltipLeft: xScale(getIndex(indexData)),
      tooltipTop: 0
    });

  };

  return (
    <>
      <svg
        width={width}
        height={height}
        onMouseMove={handleTooltip}
        onMouseLeave={hideTooltip }
      >
        <Group key={'linesxssedc'}>
          {
            tooltipData && allowTooltip && (

              <Line
                from={{ x: tooltipData.tooltipLeft, y: 0 }}
                to={{ x: tooltipData.tooltipLeft, y: height }}
                stroke='var(--border)'
                strokeWidth={1}
                pointerEvents="none"
              />
            )
          }
          {
            series.map((d, j) => {
              const [ ts, o, h, l, c, v ] = d;
              const xVal = xScale(ts);
              const clr = o > c ? 'var(--growwRed)' : 'var(--primaryClr)';


              const barY = yScaleVolume(v);

              const yo = yScale(o);
              const yh = yScale(h);
              const yl = yScale(l);
              const yc = o === c ? yo + 1 : yScale(c);


              return (
                <>
                  <Line
                    className='cc41Candle'
                    key={j}
                    from={{ x: xVal, y: yh }}
                    to={{ x: xVal, y: yl }}
                    stroke={clr}
                    strokeWidth={1}
                    pointerEvents="none"
                  />
                  <Line
                    className='cc41Candle'
                    key={'fad' + j}
                    from={{ x: xVal, y: yo }}
                    to={{ x: xVal, y: yc }}
                    stroke={clr}
                    strokeWidth={5}
                    pointerEvents="none"
                  />
                  {
                    showVolumeBars &&
                        <Line
                          className="cc41Opacity3"
                          key={'asd' + j}
                          from={{ x: xVal, y: height }}
                          to={{ x: xVal, y: barY }}
                          stroke={clr}
                          strokeWidth={4}
                        />
                  }
                </>
              );
            })
          }
        </Group>
      </svg>
      {
        tooltipData && allowTooltip && (
          getToolTipUI()
        )
      }
    </>
  );
};


export default CandleChart;
