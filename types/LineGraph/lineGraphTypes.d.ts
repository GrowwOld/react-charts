/// <reference types="react" />
export declare type Point = [number, number, any];
export declare type LinePathData = {
    series: Array<Point>;
    color: string;
    strokeWidth: number;
    key: string;
    style?: React.CSSProperties;
    showLastPointBlinking?: boolean;
    strokeOpacity: number;
    isSeriesToScale: boolean;
    allowToolTip: boolean;
};
export declare type LineGraphProps = {
    linePaths: Array<LinePathData>;
    width: number;
    height: number;
    paddingVert: number;
    paddingHorz: number;
    onMouseEnter?: (td: Array<ToolTipData>) => void;
    onMouseLeave?: () => void;
    toolTipLeftUpdated?: number;
    toolTipTopUpdated?: number;
    getTooltipUI?: (toolTipData: Array<ToolTipData>) => JSX.Element;
    maxX?: number;
    minX?: number;
    maxY?: number;
    minY?: number;
};
export declare type ToolTipData = {
    point: Point;
    tooltipLeft: number;
    tooltipTop: number;
};
