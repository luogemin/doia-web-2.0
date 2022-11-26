import React, {Fragment, useEffect, useMemo, useRef, forwardRef} from 'react';
import {Button, EchartsLine, Form, Select, Tooltip} from '@chaoswise/ui';
import lodash from 'lodash';
import ChartOption from './config';
import {isIEFun} from "@/utils/common";

const PieChart = forwardRef((props, ref) => {
    const {data = [], onEchartReady, ...rest} = props;
    const option = Object.assign({}, ChartOption(), rest);
    option.series[0].data = data;
    option.legend.formatter = function (name) {
        const result = lodash.find(data, (item) => {
            return item.name === name;
        });
        if (result) {
            return `${name}: ${result.value}`;
        }
    };
    //图例动态置灰
    option.legend.selected = (data || []).reduce((prev, cent) => {
        const {name, value} = cent;
        return Object.assign({}, prev, {
            [name]: !['未见异常数量', 'Normal'].includes(name) && !!value,
        });
    }, {});
    //tooltip动态截取
    option.legend.tooltip.formatter = (params) => {
        const {name} = params;
        let split = [];
        for (let i = 0; i < name.length; i + 65) {
            if (isIEFun()) {
                split.push(name.slice(i, i + 65).replace(`<token>`, '< token>'));
            } else {
                split.push(name.slice(i, i + 65).replaceAll(`<token>`, '< token>'));
            }
            i += 65;
        }
        const result = lodash.find(data, (item) => {
            return item.name === name;
        });
        return split.join("<br/>") + '：' + result.value + "<br/>" + (result.tootipTexts ? result.tootipTexts : '');
    };

    return (
        <EchartsLine
            option={option}
            isMergeOption={false}
            ref={ref}
            onChartReady={(echarts) => {
                onEchartReady && onEchartReady(echarts);
            }}
            {...rest}
        />
    );
});
export default PieChart;
