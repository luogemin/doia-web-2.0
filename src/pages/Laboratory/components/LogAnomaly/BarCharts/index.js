import React, {forwardRef} from 'react';
import {EchartsLine,} from '@chaoswise/ui';
import Lodash from 'lodash';
import ChartOption from './config';

const BarChart = forwardRef((props, ref) => {
    const {data = [], ...rest} = props;
    let option = Object.assign({}, ChartOption(), rest);
    option.series[0].data = data;
    option.xAxis.data = Lodash.map(data, 'name') || []; // x轴数据处理
    return (
        <EchartsLine
            option={option}
            isMergeOption={false}
            ref={ref}
            {...rest}
        />
    );
});
export default BarChart;
