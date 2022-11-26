import React, {Fragment, useEffect, useMemo, forwardRef} from "react";
import {Button, EchartsLine, Form, Select, Tooltip} from "@chaoswise/ui";
import _option from './common/chart.option';
import blue from "@/components/Charts/common/images/blue.png";
import lightBlue from "@/components/Charts/common/images/lightBlue.png";
import yellow from "@/components/Charts/common/images/yellow.png";
import green from "@/components/Charts/common/images/green.png";
import lightGreen from "@/components/Charts/common/images/lightGreen.png";
import purple from "@/components/Charts/common/images/purple.png";
import moment from 'moment';
import TooltipDiv from "../TooltipDiv";
import {useFetchState} from "@/components/HooksState";
import {IntlFormatMessage} from "@/utils/util";


const Charts = forwardRef((props, ref) => {
    const {
        data = {},
        id = '',
        dataZoomTop = 280,
        splitNumber = 5,
        seriesDataShow = true,
        myToolTrigerFunc,
        myToolSaveFunc,
        myToolEditFunc,
        muToolDelFunc,
        upValue,
        lowValue,
        zoomValue = {},
        ...rest
    } = props;

    const [renderOption, setRenderOption] = useFetchState({});
    const {start, end} = zoomValue;

    const _data = useMemo(() => {
        const option = _option();
        let {
            title = '',
            seriesData = [], processedData = [], anomaly = [], upper = [], lower = [], baseline = [],
            fitBaseline = [], fitLower = [], fitUpper = [],
            forecastBaseline = [], forecastLower = [], forecastUpper = [],
            upperThreshold = '', lowerThreshold = '', minValue = 0,
        } = data;

        /******************为了加上下界之间的底色，如果最小值小于0，把整个图向上平移***********************************/
        if (minValue < 0) {
            seriesData = seriesData.map(item => {
                return (item[1] || item[1] === 0) ?
                    [item[0], item[1] - minValue, minValue]
                    : [item[0], item[1]];
            });
            processedData = processedData.map(item => {
                return (item[1] || item[1] === 0) ?
                    [item[0], item[1] - minValue, minValue]
                    : [item[0], item[1]];
            });
            upper = upper.map(item => {
                return (item[1] || item[1] === 0) ?
                    [item[0], item[1] - minValue, minValue]
                    : [item[0], item[1]];
            });
            lower = lower.map(item => {
                return (item[1] || item[1] === 0) ?
                    [item[0], item[1] - minValue, minValue]
                    : [item[0], item[1]];
            });
            baseline = baseline.map(item => {
                return (item[1] || item[1] === 0) ?
                    [item[0], item[1] - minValue, minValue]
                    : [item[0], item[1]];
            });
            fitBaseline = fitBaseline.map(item => {
                return (item[1] || item[1] === 0) ?
                    [item[0], item[1] - minValue, minValue]
                    : [item[0], item[1]];
            });
            fitLower = fitLower.map(item => {
                return (item[1] || item[1] === 0) ?
                    [item[0], item[1] - minValue, minValue]
                    : [item[0], item[1]];
            });
            fitUpper = fitUpper.map(item => {
                return (item[1] || item[1] === 0) ?
                    [item[0], item[1] - minValue, minValue]
                    : [item[0], item[1]];
            });
            forecastBaseline = forecastBaseline.map(item => {
                return (item[1] || item[1] === 0) ?
                    [item[0], item[1] - minValue, minValue]
                    : [item[0], item[1]];
            });
            forecastLower = forecastLower.map(item => {
                return (item[1] || item[1] === 0) ?
                    [item[0], item[1] - minValue, minValue]
                    : [item[0], item[1]];
            });
            forecastUpper = forecastUpper.map(item => {
                return (item[1] || item[1] === 0) ?
                    [item[0], item[1] - minValue, minValue]
                    : [item[0], item[1]];
            });
            anomaly = anomaly.map(item => {
                return Object.assign({}, item, {
                    coord: [item.coord[0], item.coord[1] ? (item.coord[1] - minValue) : item.coord[1]],
                    minValue,
                });
            });
            // if (upperThreshold || [0, '0'].includes(upperThreshold)) {
            //     upperThreshold = upperThreshold - minValue;
            // }
            // if (lowerThreshold || [0, '0'].includes(lowerThreshold)) {
            //     lowerThreshold = lowerThreshold - minValue;
            // }
            option.yAxis.axisLabel.formatter = (val) => {
                return (val - Math.abs(minValue)).toFixed(2);
            };
        }
        /******************为了加上下界之间的底色，如果最小值小于0，把整个图向上平移***********************************/

        /**********************取时间，默认展示最后6小时数据******************************/
        let endTimeObj = {};
        let startTimeObj = {};
        if (seriesData.length > 0) {
            endTimeObj.seriesData = seriesData[seriesData.length - 1][0];
            startTimeObj.seriesData = seriesData[0][0];
        }
        if (lower.length > 0) {
            endTimeObj.lower = lower[lower.length - 1][0];
            startTimeObj.lower = lower[0][0];
        }
        if (baseline.length > 0) {
            endTimeObj.baseline = baseline[baseline.length - 1][0];
            startTimeObj.baseline = baseline[0][0];
        }
        if (processedData.length > 0) {
            endTimeObj.processedData = processedData[processedData.length - 1][0];
            startTimeObj.processedData = processedData[0][0];
        }
        if (fitBaseline.length > 0) {
            endTimeObj.fitBaseline = fitBaseline[fitBaseline.length - 1][0];
            startTimeObj.fitBaseline = fitBaseline[0][0];
        }
        if (fitLower.length > 0) {
            endTimeObj.fitLower = fitLower[fitLower.length - 1][0];
            startTimeObj.fitLower = fitLower[0][0];
        }
        if (forecastBaseline.length > 0) {
            endTimeObj.forecastBaseline = forecastBaseline[forecastBaseline.length - 1][0];
            startTimeObj.forecastBaseline = forecastBaseline[0][0];
        }
        if (forecastLower.length > 0) {
            endTimeObj.forecastLower = forecastLower[forecastLower.length - 1][0];
            startTimeObj.forecastLower = forecastLower[0][0];
        }
        if (start === undefined) {
            if (!Object.keys(startTimeObj).length || !Object.keys(endTimeObj).length) {
                option.dataZoom[0].start = 90;
            } else {
                const endTime = Object.values(endTimeObj).sort()[Object.values(endTimeObj).length - 1];
                const startTime = Object.values(startTimeObj).sort()[0];
                option.dataZoom[0].start = 100 - (6 * 60 * 60 * 1000) / (endTime - startTime) * 100;
            }
        }
        /**********************取时间，默认展示最后6小时数据******************************/

        option.title.text = title;
        // option.dataZoom[0].top = dataZoomTop;
        option.series[0].data = processedData.length ? processedData : seriesData; //原始数据
        option.series[0].markPoint.data = anomaly; //异常点
        /*****************新建的上下阈值界限*****************************/

        /*****************新建的上下阈值界限*****************************/

        /******************如果有预测值，在原始和预测之间加竖线**************/
        if (forecastBaseline.length) {
            const process = processedData.length ? processedData[processedData.length - 1] : seriesData[seriesData.length - 1];
            option.series[1].data = forecastBaseline; //预测值
            option.series[1].markLine.data[0] = {
                xAxis: (process[0] + forecastBaseline[0][0]) / 2,//minNum < 0 ? (upperThreshold - minNum) : upperThreshold,
                minNum: 0,//minNum < 0 ? minNum : '',
            };//[forecastBaseline[0]]; //预测值
        }
        /******************如果有预测值，在原始和预测之间加竖线**************/

        /******检测的上下界，有无预测值，上下界名称不一样******/
        if (forecastUpper.length) {
            option.series[2].name = IntlFormatMessage('laboratory.anomaly.confidenceIntervalFit');
        }
        option.series[2].data = upper.length ? upper : fitUpper;

        if (forecastLower.length) {
            option.series[3].name = IntlFormatMessage('laboratory.anomaly.confidenceIntervalFit');
        }
        option.series[3].data = lower.length ? lower : fitLower;

        /******************有无预测值，上下界名称不一样********************/

        option.series[4].data = forecastUpper; //预测的上下界
        option.series[5].data = forecastLower;
        option.series[6].data = baseline.length ? baseline : fitBaseline; //基线

        /******************* 动态加载图例 ********************/
        let legengData = [];
        if (!!processedData.length || !!seriesData.length) {
            if (seriesDataShow) {
                //是否显示原始数据按钮
                legengData.push({
                    name: IntlFormatMessage('common.rawdata'),
                    icon: 'image://' + blue,
                });
            }
        }
        if (forecastBaseline.length) {
            legengData.push({
                name: '预测基线',
                icon: 'image://' + green,
            });
        }
        //有无预测值，上下界名称不一样
        if (forecastUpper.length) {
            if (!!upper.length || !!fitUpper.length) {
                legengData.push({
                    name: IntlFormatMessage('laboratory.anomaly.confidenceIntervalFit'),
                    icon: 'image://' + lightBlue,
                });
            }
            // if (!!lower.length || !!fitLower.length) {
            //     legengData.push({
            //         name: '拟合下界',
            //         icon: 'image://' + lightBlue,
            //     });
            // }
            legengData.push({
                name: IntlFormatMessage('laboratory.anomaly.confidenceIntervalForecast'),
                icon: 'image://' + lightGreen,
            });
        } else if (!!upper.length || !!fitUpper.length) {
            legengData.push({
                name: IntlFormatMessage('common.upperboundary'),
                icon: 'image://' + lightBlue,
            });
        }
        if (forecastLower.length) {
            // legengData.push({
            //     name: '预测下界',
            //     icon: 'image://' + lightGreen,
            // });
        } else if (!!lower.length || !!fitLower.length) {
            legengData.push({
                name: IntlFormatMessage('common.lowerboundary'),
                icon: 'image://' + lightBlue,
            });
        }

        if (!!baseline.length || !!fitBaseline.length) {
            legengData.push({
                name: IntlFormatMessage('common.fittedvalue'),
                icon: 'image://' + yellow,
            });
        }
        option.legend.data = legengData;
        /******************* 动态加载图例 ********************/

        /**********************默认展示/隐藏哪几条线*************/
        let legengSelected = {
            [IntlFormatMessage('laboratory.anomaly.confidenceIntervalFit')]: false,
            [IntlFormatMessage('laboratory.anomaly.confidenceIntervalForecast')]: false,
            '上界': !forecastUpper.length,
            '下界': !forecastLower.length,
        };
        /**********************默认展示/隐藏哪几条线*************/

        /*****************没有预测值时，默认隐藏基线***********/
        if (!forecastBaseline.length) {
            legengSelected = Object.assign({}, legengSelected, {
                [IntlFormatMessage('common.fittedvalue')] : false,
            });
        }
        /*****************没有预测值时，默认隐藏基线***********/

        option.legend.selected = legengSelected;
        option.xAxis.splitNumber = splitNumber;
        if (myToolTrigerFunc) {
            option.toolbox.feature.myTool2.show = true;
            option.toolbox.feature.myTool2.onclick = myToolTrigerFunc;
        }
        if (myToolSaveFunc) {
            option.toolbox.feature.myTool3.show = true;
            option.toolbox.feature.myTool3.onclick = myToolSaveFunc;
        }
        if (myToolEditFunc) {
            option.toolbox.feature.myTool4.show = true;
            option.toolbox.feature.myTool4.onclick = myToolEditFunc;
        }
        if (muToolDelFunc) {
            option.toolbox.feature.myTool5.show = true;
            option.toolbox.feature.myTool5.onclick = muToolDelFunc;
        }

        setRenderOption(option);
        return option;
    }, [data, dataZoomTop, splitNumber, seriesDataShow, myToolEditFunc, muToolDelFunc, myToolSaveFunc, myToolTrigerFunc, start]);

    useEffect(() => {
        const option = Object.assign({}, renderOption);
        let {
            title = '',
            seriesData = [], processedData = [], anomaly = [], upper = [], lower = [], baseline = [],
            fitBaseline = [], fitLower = [], fitUpper = [],
            forecastBaseline = [], forecastLower = [], forecastUpper = [],
            upperThreshold = '', lowerThreshold = '', minValue = 0,
        } = data;

        let lowerLine = 0;
        if (upValue || [0, '0'].includes(upValue)) {
            const up = upValue ? upValue : upperThreshold;
            option.series[0].markLine.data[0] = {
                name: IntlFormatMessage('datasource.create.UpperBoundary'),
                yAxis: minValue < 0 ? (up - minValue) : up,
                minValue: minValue < 0 ? minValue : 0,
                // type: "median",
                lineStyle: {
                    color: '#FF3E3E',
                },
            };
            lowerLine = 1;
        }
        if (lowValue || [0, '0'].includes(lowValue)) {
            const down = lowValue ? lowValue : lowerThreshold;
            option.series[0].markLine.data[lowerLine] = {
                name: IntlFormatMessage('datasource.create.lowerBoundary'),
                yAxis: minValue < 0 ? (down - minValue) : down,
                minValue: minValue < 0 ? minValue : 0,
                // type: "median",
                lineStyle: {
                    color: '#FFB100',
                },
            };
        }
        setRenderOption(option);
        if (start !== undefined) {
            option.dataZoom[0].start = start;
        }
        if (end !== undefined) {
            option.dataZoom[0].end = end;

        }
    }, [upValue, lowValue, start, end]);

    return <EchartsLine option={renderOption} isMergeOption={false} ref={ref} {...rest}/>;
});

export default Charts;