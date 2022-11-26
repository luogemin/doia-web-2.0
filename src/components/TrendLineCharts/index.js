import React, {Fragment, useEffect, useMemo, useRef, forwardRef} from "react";
import {Button, EchartsLine, Form, Select, Tooltip} from "@chaoswise/ui";
import moment from 'moment';
import TooltipDiv from "../TooltipDiv";
import {IntlFormatMessage} from "@/utils/util";

const option = {
    legend: {
        show: false,
    },
    xAxis: {
        type: 'time',
        show: false,
        scale: true,
        boundaryGap: ['1%', '1%'],
    },
    yAxis: {
        type: 'value',
        show: false,
        scale: true,
    },
    grid: {
        top: 10,
        bottom: 0,
        left: '-20px',
        right: 10,
    }
};

const TrendLineCharts = (props, ref) => {
    const {
        data = [],
    } = props;

    return <EchartsLine
        style={{height: 50}}
        option={option}
        data={{
            sampling: 'lttb',
            seriesData: data
        }}
    />;
};
export default TrendLineCharts;