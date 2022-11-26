import React, {Fragment, useEffect, useMemo, useRef, forwardRef} from "react";
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
import {ClearSomLocalStorage, guid, IntlFormatMessage} from "@/utils/util";
import {useFetchState} from "@/components/HooksState";
import {connect} from "@chaoswise/cw-mobx";

let timer = null;

const Charts = forwardRef((props, ref) => {
    const {
        data = {},
        id = '',
        dataZoomTop = 280,
        splitNumber = 5,
        seriesDataShow = true,
        myToolCollFunc,
        myToolCancFunc,
        upValue,
        lowValue,
        ifRowDataSampling = false,
        ifSetAnalysis = false,
        ifShowLegend = true,
        myTool4Func,
        myTool8Func,
        lineFeed = false,
        onChartReady = null,
        ...rest
    } = props;

    const dataZoomCharts = localStorage.getItem(`dataZoomCharts_${id}`) ? JSON.parse(localStorage.getItem(`dataZoomCharts_${id}`)) : {};
    useEffect(() => {
        return () => {
            localStorage.removeItem(`dataZoomCharts_${id}`);
        };
    }, []);
    let {
        title = '',
        seriesData = [], processedData = [], anomaly = [], upper = [], lower = [], baseline = [],
        fitBaseline = [], fitLower = [], fitUpper = [],
        forecastBaseline = [], forecastLower = [], forecastUpper = [],
        upperThreshold = '', lowerThreshold = '', minValue = 0, maxValue = 0,
    } = data;

    let option = Object.assign({}, _option());
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
            const {coord = []} = item;
            const value = (coord[1] || coord[1] === 0) ? (coord[1] - minValue) : coord[1];
            return Object.assign({}, item, {
                coord: [item.coord[0], value],
                minValue,
            });
        });
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
    // if (start === undefined) {
    if (!Object.keys(startTimeObj).length || !Object.keys(endTimeObj).length) {
        option.dataZoom[0].start = (!!dataZoomCharts.start || dataZoomCharts.start === 0) ? dataZoomCharts.start : 90;
    } else {
        const endTime = Object.values(endTimeObj).sort()[Object.values(endTimeObj).length - 1];
        const startTime = Object.values(startTimeObj).sort()[0];
        option.dataZoom[0].start = (!!dataZoomCharts.start || dataZoomCharts.start === 0) ? dataZoomCharts.start : (100 - (6 * 60 * 60 * 1000) / (endTime - startTime) * 100);
    }
    option.dataZoom[0].end = (!!dataZoomCharts.end || dataZoomCharts.end === 0) ? dataZoomCharts.end : 100;
    // }
    /**********************取时间，默认展示最后6小时数据******************************/

    option.title.text = title;
    // option.dataZoom[0].top = dataZoomTop;
    option.series[0].data = processedData.length ? processedData : seriesData; //原始数据
    if (ifRowDataSampling || !anomaly.length) {
        option.series[0].sampling = 'lttb'; //原始数据是否过滤
    }

    option.series[0].markPoint.data = anomaly; //异常点

    /*****************新建的上下阈值界限*****************************/

    /*****************新建的上下阈值界限*****************************/

    /******************如果有预测值，在原始和预测之间加竖线**************/
    if (forecastBaseline.length) {
        const process = processedData.length ? processedData[processedData.length - 1] : seriesData[seriesData.length - 1];
        option.series[1].data = forecastBaseline; //预测值
        option.series[1].markLine.data[0] = {
            xAxis: (process[0] + forecastBaseline[0][0]) / 2,
            minNum: 0,//minNum < 0 ? minNum : '',
        };//[forecastBaseline[0]]; //预测值
    }
    /******************如果有预测值，在原始和预测之间加竖线**************/

    /******检测的上下界，有无预测值，上下界名称不一样******/
    if (forecastUpper.length) {
        option.series[3].name = IntlFormatMessage('laboratory.anomaly.confidenceIntervalFit');
        option.series[6].name = IntlFormatMessage('common.fittedvalueBtn');
    }
    option.series[3].data = upper.length ? upper.map((item, index) => {
        let data = [...item];
        if (!!item[1] || item[1] === 0) {
            if (minValue >= 0) {
                data[2] = 0;
            }
            data[1] = item[1] - lower[index][1];
            data[3] = lower[index][1];
        }
        return data;
    }) : fitUpper.map((item, index) => {
        let data = [...item];
        if (!!item[1] || item[1] === 0) {
            if (minValue >= 0) {
                data[2] = 0;
            }
            data[1] = item[1] - fitLower[index][1];
            data[3] = fitLower[index][1];
        }
        return data;
        // return item.concat(fitLower[index][1]);
    });

    if (forecastLower.length) {
        option.series[2].name = IntlFormatMessage('laboratory.anomaly.confidenceIntervalFit');
    }
    option.series[2].data = lower.length ? lower : fitLower;

    /******************有无预测值，上下界名称不一样********************/

    option.series[4].data = forecastUpper; //预测的上下界
    option.series[5].data = forecastLower;
    option.series[6].data = baseline.length ? baseline : fitBaseline; //拟合值

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
            name: IntlFormatMessage('datasource.create.forecastValue'),
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
        legengData.push({
            name: IntlFormatMessage('laboratory.anomaly.confidenceIntervalForecast'),
            icon: 'image://' + lightGreen,
        });
        if (!!baseline.length || !!fitBaseline.length) {
            legengData.push({
                name: IntlFormatMessage('common.fittedvalueBtn'),
                icon: 'image://' + yellow,
            });
        }
    } else if (!!upper.length || !!fitUpper.length) {
        legengData.push({
            name: IntlFormatMessage('common.upperboundary'),
            icon: 'image://' + lightBlue,
        });
        if (!!lower.length || !!fitLower.length) {
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
            [IntlFormatMessage('common.fittedvalue')]: false,
        });
    }
    /*****************没有预测值时，默认隐藏基线***********/

    option.legend.selected = legengSelected;
    option.legend.show = ifShowLegend;
    if (!ifShowLegend) {
        option.toolbox.feature = {
            dataZoom: {
                show: true,
                yAxisIndex: false,
                iconStyle: {
                    opacity: 0
                },
                title: {
                    zoom: '',
                    back: ''
                }
            },
        };
    }
    if (props.title) {
        option.title.text = props.title;
    }

    option.xAxis.splitNumber = splitNumber;

    if (lineFeed) {
        option.xAxis.axisLabel.formatter = function (val) {
            const params = parseInt(val) ? moment(parseInt(val)).format(`YYYY-MM-DD HH:mm`) : "";
            if (!params) {
                return '';
            }
            var newParamsName = "";
            var paramsNameNumber = params.length;
            var provideNumber = 11;
            var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
            if (paramsNameNumber > provideNumber) {
                for (var p = 0; p < rowNumber; p++) {
                    var tempStr = "";
                    var start = p * provideNumber;
                    var end = start + provideNumber;
                    if (p == rowNumber - 1) {
                        tempStr = params.substring(start, paramsNameNumber);
                    } else {
                        tempStr = params.substring(start, end) + "\n";
                    }
                    newParamsName += tempStr;
                }
            } else {
                newParamsName = params;
            }
            return newParamsName;
        };
    }
    if (myToolCollFunc) {
        option.toolbox.feature.myTool6.show = true;
        option.toolbox.feature.myTool6.onclick = myToolCollFunc;
    }
    if (myToolCancFunc) {
        option.toolbox.feature.myTool7.show = true;
        option.toolbox.feature.myTool7.onclick = myToolCancFunc;
    }
    if (myTool4Func) {
        option.toolbox.feature.myTool4.show = true;
        option.toolbox.feature.myTool4.onclick = myTool4Func;
    }
    if (myTool8Func) {
        option.toolbox.feature.myTool8.show = true;
        option.toolbox.feature.myTool8.onclick = myTool8Func;
    }
    let lowerLine = 0;
    if (!!upValue || [0, '0'].includes(upValue)) {
        const up = (!!upValue || [0, '0'].includes(upValue)) ? upValue : upperThreshold;
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
    if (!!lowValue || [0, '0'].includes(lowValue)) {
        const down = (!!lowValue || [0, '0'].includes(lowValue)) ? lowValue : lowerThreshold;
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

    //是否 根因分析
    if (ifSetAnalysis) {
        // option.toolbox.feature.dataView.show = false;
        option.series.forEach((itemSeries, index) => {
            option.series[index].sampling = 'lttb';
        });
        option.grid.top = 75;
        option.yAxis.boundaryGap = ['15%', '10%'];
        option.series[0].markPoint.label.formatter = param => {
            const {value = {}, data = {}} = param;
            const {minValue = 0, coord = [], sig = 0} = data;
            return [
                `{con|${IntlFormatMessage('laboratory.anomaly.anomaly')}：}`,
                `{con|${moment(Number(coord[0]) || '').format('YYYY/MM/DD HH:mm:ss')}}`,
                `{con|${IntlFormatMessage('common.truevalue')}: ${(coord[1] || coord[1] === 0) ? (coord[1] + minValue).toFixed(2) : ''}}`,
                `{btn|${IntlFormatMessage('laboratory.anomaly.clickTrigger')}}`,
            ].join('\n');
        };
        option.tooltip.formatter = (params) => {
            let dom = (params || []).map((item, index) => {
                const {marker, seriesName, data, nameEn} = item;
                let dataResult = null;
                for (let i = 1; i < data.length; i++) {
                    if ((data[i] || data[i] === 0)) {
                        dataResult += data[i];
                    }
                }
                return `<div key={index}>
                            <div>
                                ${marker || ''}
                                ${seriesName || ''}：
                                ${(dataResult || dataResult === 0) ? dataResult : 'null'}<br/>
                            </div>
                        </div>
                       `;
            });
            if (!!params && !!params[0]) {
                dom.unshift(`
                        <div>
                        ${params[0].axisValue ? moment(Number(params[0].axisValue)).format('YYYY/MM/DD HH:mm:ss') : ''}
                        </div>
                    `);
            }
            dom.push(`
                    <div style="margin:8px auto;text-align: center;">
                    ${IntlFormatMessage('laboratory.anomaly.clickTrigger')}
                    </div>
                `);
            return dom.join('');
        };
    }

    useEffect(() => {
        if (ref?.current) {
            const echart = ref.current.getEchartsInstance();
            echart.dispatchAction({
                type: 'takeGlobalCursor',
                key: 'dataZoomSelect',
                // 启动或关闭
                dataZoomSelectActive: true
            });
        }
    }, [option]);

    return <EchartsLine
        option={option} isMergeOption={false}
        //全局绑定滚轮，获取dataZoom最新的位置
        onChartReady={(echart) => {
            echart.on('dataZoom', function (event) {
                const {start, end} = event;
                localStorage.setItem(`dataZoomCharts_${id}`, JSON.stringify({start, end}));
            });
            echart.on('restore', (e) => {
                ClearSomLocalStorage();
                echart.setOption(echart.getOption(), false);
                echart.dispatchAction({
                    type: 'takeGlobalCursor',
                    key: 'dataZoomSelect',
                    // 启动或关闭
                    dataZoomSelectActive: true
                });
            });
            echart.on('legendselectchanged', (value) => {
                const {selected = {}} = value;
                const fitUp = selected['下界'];
                const fitLow = selected['上界'];
                if (selected['下界'] !== undefined) {
                    const option = echart.getOption();
                    if (fitUp) {
                        option.series[3].areaStyle.opacity = 1;
                        option.series[3].lineStyle.opacity = 0;
                        option.series[3].data = upper.length ? upper.map((item, index) => {
                            let data = [...item];
                            if (!!item[1] || item[1] === 0) {
                                if (minValue >= 0) {
                                    data[2] = 0;
                                }
                                data[1] = item[1] - lower[index][1];
                                data[3] = lower[index][1];
                            }
                            return data;
                        }) : fitUpper.map((item, index) => {
                            let data = [...item];
                            if (!!item[1] || item[1] === 0) {
                                if (minValue >= 0) {
                                    data[2] = 0;
                                }
                                data[1] = item[1] - fitLower[index][1];
                                data[3] = fitLower[index][1];
                            }
                            return data;
                            // return item.concat(fitLower[index][1]);
                        });
                        if (fitLow) {
                            option.series[2].lineStyle.opacity = 0;
                        } else {
                            option.series[2].lineStyle.opacity = 1;
                        }
                    } else {
                        option.series[3].areaStyle.opacity = 0;
                        option.series[3].lineStyle.opacity = 1;
                        option.series[3].data = upper.length ? upper.map((item, index) => {
                            let data = [...item];
                            if (!!item[1] || item[1] === 0) {
                                if (minValue >= 0) {
                                    data[2] = 0;
                                }
                                // data[3] = lower[index][1];
                            }
                            return data;
                        }) : fitUpper.map((item, index) => {
                            let data = [...item];
                            if (!!item[1] || item[1] === 0) {
                                if (minValue >= 0) {
                                    data[2] = 0;
                                }
                                // data[3] = fitLower[index][1];
                            }
                            return data;
                            // return item.concat(fitLower[index][1]);
                        });
                    }
                    echart.setOption(option);
                }
            });
            !!onChartReady && onChartReady(echart);
        }}
            ref={ref} {...rest} />;
        }
);
export default Charts;