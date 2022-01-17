import React from 'react';
declare class BarGraph extends React.PureComponent<BarGraphProps, State> {
    render(): JSX.Element | null;
    getXValue: (d: BarData) => string;
    getYValue: (d: BarData) => number;
    getFormattedText: (textX: number, textY: number, yVal: number) => JSX.Element;
    getGraphUI: () => JSX.Element | null;
}
declare type State = {};
export declare type BarData = [string, number];
declare type BarGraphProps = {
    data: BarData[];
    topMargin: number;
    bottomMargin: number;
    width: number;
    height: number;
};
export default BarGraph;
