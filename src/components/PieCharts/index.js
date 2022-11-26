import React, {Fragment, useEffect, useMemo, useRef, forwardRef} from "react";
import {Button, EchartsLine, Form, Select, Tooltip} from "@chaoswise/ui";
import _option from './common/chart.option';
import moment from 'moment';
import TooltipDiv from "../TooltipDiv";
import {IntlFormatMessage} from "@/utils/util";
import lodash from "lodash";
import {isIEFun} from "@/utils/common";

const PieChart = forwardRef((props, ref) => {
    const {
        data = {},
        id = '',
        onEchartReady,
        ...rest
    } = props;

    let option = Object.assign({}, _option());
    option.legend.formatter = function (name) {
        const result = lodash.find(data, (item) => {
            return item.name === name;
        });
        if (result) {
            return name + '：' + result.value;
        }
    };
    option.legend.tooltip.formatter = (params) => {
        const {name} = params;
        let split = [];
        for (let i = 0; i < name.length; i + 65) {
            if (isIEFun()) {
                split.push(name.slice(i, i + 65).replace(`<token>`, '< token>'));
            } else {
                split.push(name.slice(i, i + 65).replaceAll(`<token>`, '< token>'));
            } i += 65;
        }
        const result = lodash.find(data, (item) => {
            return item.name === name;
        });
        return split.join("<br/>") + '：' + result.value;
    };
    option.tooltip.formatter = (params) => {
        const {name} = params;
        let split = [];
        for (let i = 0; i < name.length; i + 65) {
            if (isIEFun()) {
                split.push(name.slice(i, i + 65).replace(`<token>`, '< token>'));
            } else {
                split.push(name.slice(i, i + 65).replaceAll(`<token>`, '< token>'));
            } i += 65;
        }
        const result = lodash.find(data, (item) => {
            return item.name === name;
        });
        return split.join("<br/>") + '：' + result.value;
    };

    option.series[0].data = data;

    return <EchartsLine
        option={option}
        isMergeOption={false}
        ref={ref}
        onChartReady={(echarts) => {
            onEchartReady && onEchartReady(echarts);
        }}
        {...rest}
    />;
});
export default PieChart;