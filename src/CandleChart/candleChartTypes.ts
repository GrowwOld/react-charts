export type Candle = [number, number, number, number, number, number, any];


export type CandleChartProps= {
  currentGraphData: Array<Candle>;
  color: string;
  toolTipFormatter: (toolTipData: CandleToolTipData) => React.ReactNode;
  maxCandles: number;
  key: string;
  paddingVert: number;
  paddingHorz: number;
  height: number;
  width: number;
  allowTooltip: boolean;
  showVolumeBars: boolean;
}


export type CandleToolTipData = {
  candle: Candle;
  tooltipLeft: number;
  tooltipTop: number;
}
