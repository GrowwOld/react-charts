/// <reference types="react" />
export declare type Candle = [number, number, number, number, number, number, any];
export declare type CandleChartProps = {
    currentGraphData: Array<Candle>;
    color: string;
    toolTipFormatter: (toolTipData: ToolTipData) => React.ReactNode;
    maxCandles: number;
    key: string;
    paddingVert: number;
    paddingHorz: number;
    height: number;
    width: number;
    allowTooltip: boolean;
    showVolumeBars: boolean;
};
export declare type ToolTipData = {
    candle: Candle;
    tooltipLeft: number;
    tooltipTop: number;
};
