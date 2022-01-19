import React from 'react';
import { PieData } from './pieTypes';
import { Pie } from '@visx/shape';


const getValue = (d: PieData) => {
  return d.value;
};

class PieChart extends React.PureComponent<PieChartProps, State> {


  render() {
    const { data, height, width, donutThickness, hoveredPieThicknes, children, textClass, showArcsValue } = this.props;
    const { hoveredVal } = this.state;

    const radius = Math.min(height, width) / 2 - (hoveredPieThicknes);
    const center = radius + hoveredPieThicknes;

    return (
      <svg width={width}
        height={height}
      >
        <g transform={`translate(${center},${center})`}>
          <Pie
            data={data}
            pieValue={getValue}
            outerRadius={radius + hoveredPieThicknes}
            innerRadius={radius + 1}
            padAngle={0.005}
          >
            {
              (pie1) => {
                return (
                  <>
                    {
                      pie1.arcs.filter(arc => arc.data.title === hoveredVal).map(arc => {
                        return (
                          <g key={`letters-${arc.data.value}`}>
                            <path
                              d={pie1.path(arc) ?? undefined}
                              fill={arc.data.color}
                              fillOpacity={0.5}
                            />
                          </g>
                        );
                      })
                    }
                    <Pie
                      data={data}
                      pieValue={getValue}
                      outerRadius={radius}
                      innerRadius={radius - donutThickness}
                      padAngle={0}
                    >
                      {
                        (pie) => {
                          return pie.arcs.map((arc, i) => {
                            const [ centroidX, centroidY ] = pie.path.centroid(arc);

                            return (
                              <g key={`letters-${arc.data.value}-${i}`}>
                                <path
                                  d={pie.path(arc) ?? undefined}
                                  fill={arc.data.color}
                                  onMouseEnter={() => this.onMouseEnter(arc.data)}
                                  onMouseLeave={() => this.onMouseLeave()}
                                />
                                {
                                  showArcsValue && (
                                    <text
                                      fill="black"
                                      textAnchor="middle"
                                      x={centroidX}
                                      y={centroidY}
                                      dy=".33em"
                                      className={textClass}
                                    >
                                      {arc.data.value > 1 ? arc.data.value : ''}
                                    </text>
                                  )
                                }
                              </g>
                            );
                          });
                        }
                      }
                    </Pie>
                    <g>
                      {children}
                    </g>
                  </>
                );
              }
            }
          </Pie>
        </g>
      </svg>
    );
  }


  onMouseEnter = (d: PieData) => {
    const { onMouseEnter } = this.props;

    this.setState({
      hoveredVal: d.title
    },
    () => {
      if (onMouseEnter instanceof Function) {
        onMouseEnter(d);
      }
    });
  }


  onMouseLeave = () => {
    const { onMouseLeave } = this.props;

    this.setState({
      hoveredVal: ''
    },
    () => {
      if (onMouseLeave instanceof Function) {
        onMouseLeave();
      }
    }
    );

  }

}


type PieChartProps = {
  data: Array<PieData>;
  height: number;
  width: number;
  donutThickness: number;
  hoveredPieThicknes: number;
  children?: React.ReactNode;
  onMouseEnter: (d: PieData) => void;
  onMouseLeave: () => void;
  textClass: string;
  showArcsValue?: boolean;
}


type State = {
  hoveredVal: string;
}


export default PieChart;
export type { PieData };
