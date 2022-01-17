import React from 'react';
import { PieData } from './pieTypes';
declare class PieChart extends React.PureComponent<PieChartProps, State> {
    render(): JSX.Element;
    onMouseEnter: (d: PieData) => void;
    onMouseLeave: () => void;
}
declare type PieChartProps = {
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
};
declare type State = {
    hoveredVal: string;
};
export default PieChart;
