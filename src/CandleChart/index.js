import React from 'react';
import { max, min, bisector } from 'd3-array';

import { Group } from '@visx/group';
import { Line } from '@visx/shape';

import { scaleLinear } from '@visx/scale';
import { localPoint } from '@visx/event';
import { withTooltip, TooltipWithBounds, defaultStyles } from '@visx/tooltip';
import { checkIsEmpty } from 'utils/helpers';

import PropTypes from 'prop-types';

import './candleChart.css';

class CandleChart extends React.PureComponent {

  render() {
    return this.getVisxChart();
  }


  getVisxChart = () => {
    const { currentGraphData } = this.props;
    const {
      hideTooltip,
      tooltipData,
      tooltipLeft = 0,
      toolTipFormatter,
      paddingVert,
      paddingHorz,
      height,
      width,
      allowTooltip,
      maxCandles,
      showVolumeBars
    } = this.props;


    if (checkIsEmpty(currentGraphData)) {
      return null;
    }

    const series = currentGraphData ?? [];


    const getIndex = (d) => d[0];


    const getYaxisValue = (d) => d[1];


    const getHigh = (d) => d[2];


    const getLow = (d) => d[3];


    const getVol = (d) => d[5];


    const xScale = scaleLinear({
      domain: [ 0, Math.max(series.length, maxCandles) ],
      range: [ 0 + paddingHorz, width - paddingHorz ]
    });

    const yScale = scaleLinear({
      domain: [ min(series, getLow), max(series, getHigh) ],
      range: [ height - paddingVert, paddingVert ]
    });

    const yVolumeScale = scaleLinear({
      domain: [ min(series, getVol), max(series, getVol) ]
    });


    const handleTooltip = (e) => {
      const { showTooltip } = this.props;

      const { x } = localPoint(e) || { x: 0 };
      const x0 = xScale.invert(x);
      const bisectDate = bisector(getIndex).left;

      let index = bisectDate(series, x0, 0);

      if (index === series.length) {
        index = series.length - 1;
      }

      const indexData = series[index];

      showTooltip({
        tooltipData: indexData,

        tooltipLeft: xScale(getIndex(indexData)),

        tooltipTop: yScale(getYaxisValue(indexData))
      });
    };


    const tooltipStyle = {
      ...defaultStyles,
      boxShadow: 'none',
      padding: 0,
      backgroundColor: 'var(--constantTransparent)'
    };

    const contentWidth = this.toolTipRef?.offsetWidth ?? 0;
    const minVal = 0;
    const maxVal = width - contentWidth - 15;
    const finalToolTipLeft = Math.min(maxVal, Math.max(minVal, tooltipLeft - (contentWidth / 2)));

    return (
      <>
        <svg width={width}
          height={height}
          onMouseMove={allowTooltip ? handleTooltip : null}
          onMouseLeave={allowTooltip ? hideTooltip : null}
        >
          <Group key={'linesxssedc'}>
            {
              tooltipData && allowTooltip && (

                <Line
                  from={{ x: tooltipLeft, y: 0 }}
                  to={{ x: tooltipLeft, y: height }}
                  stroke={'var(--border)'}
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


                const yMax = 100;
                const barHeight = yMax * (yVolumeScale(v) ?? 0);
                const barY = height - barHeight;

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
            <div>
              <TooltipWithBounds
                key={'Tooltip' + finalToolTipLeft}
                top={-10}
                left={finalToolTipLeft}
                offsetTop={0}
                offsetLeft={0}
                style={
                  { ...tooltipStyle }
                }
              >
                <div ref={
                  ref => {
                    if (ref) {
                      this.toolTipRef = ref;
                    }
                  }
                }
                >
                  {toolTipFormatter(tooltipData)}
                </div>
              </TooltipWithBounds>
            </div>
          )
        }
      </>
    );
  }

}

CandleChart.propTypes = {
  currentGraphData: PropTypes.object
};

CandleChart.defaultProps = {

};

export default withTooltip(CandleChart);
