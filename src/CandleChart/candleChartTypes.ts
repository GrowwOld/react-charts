export type Candle = [number, number, number, number, number, number, any];


export type CandleChartProps= {
  currentGraphData: Array<Candle>;
  toolTipFormatter: (toolTipData: CandleToolTipData) => React.ReactNode;
  maxCandles: number;
  key: string;
  paddingVert: number;
  paddingHorz: number;
  height: number;
  width: number;
  allowTooltip: boolean;
  showVolumeBars: boolean;
  candleWidth: [number, number, number]; // candle width for body, tail and volume part respectively
  candleColor: [string, string]; // candle colors for positive and negative change resp
  volumeBarMaxHeight: number;
}


export type CandleToolTipData = {
  candle: Candle;
  tooltipLeft: number;
  tooltipTop: number;
}
