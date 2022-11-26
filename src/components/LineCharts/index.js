import React, {Fragment, useEffect, useMemo, useRef, forwardRef} from "react";
import {Button, EchartsLine, Form, Select, Tooltip} from "@chaoswise/ui";
import moment from 'moment';
import TooltipDiv from "../TooltipDiv";
import {IntlFormatMessage} from "@/utils/util";

const option = {
    animation: true,
    color: ['blue', 'red'],
    legend: {
        show: true,
        itemWidth: 13,
        itemHeight: 10,
        textStyle: {
            color: '#333',
            // fontFamily:'serif',
        },
        top: 10,
        selected: {
            // '时段新增异常': false,
            // '历史新增异常': false,
            // '时段突增异常': false,
            // '时段突降异常': false,
            // '日周同比异常': false,
            // 'Historical new': false,
            // 'Period new': false,
            // 'Period burst': false,
            // 'Period drop': false,
            // 'Period anomaly': false,
            [IntlFormatMessage('laboratory.anomaly.historicalNewTwo')]:false,
            [IntlFormatMessage('laboratory.anomaly.periodNewTwo')]:false,
            [IntlFormatMessage('laboratory.anomaly.periodBurstTwo')]:false,
            [IntlFormatMessage('laboratory.anomaly.periodDropTwo')]:false,
            [IntlFormatMessage('laboratory.anomaly.periodAnomaly')]:false,
        }
    },
    tooltip: {
        formatter(params) {
            let dom = (params || []).map((item, index) => {
                const {marker, seriesName, data, nameEn} = item;
                const dataResult = data[1] + (data[2] ? data[2] : '');
                return `<div key={index}>
                                <div>
                                    ${marker || ''}
                                    ${seriesName || ''}：
                                    ${(dataResult || [0].includes(dataResult)) ? dataResult : 'null'}<br/>
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
            return dom.join('');
        },
        padding: 8,
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            snap: true
        },
        textStyle: {
            fontSize: 12
        },
        extraCssText: 'box-shadow: 0 2px 4px 0 rgba(0,0,0,0.4)',
        enterable: true,
        appendToBody: true,
        animation: false,
        hideDelay: 50
        // confine: true
    },
    dataZoom: {
        type: "slider",
        show: true,
        realtime: false,
        zoomLock: false,
        start: 90,
        end: 100,
        // top: 250,
        bottom: 20,
        left: 100,
        right: 120,
        height: 20,
        labelFormatter: function (value) {
            const time = moment(Number(value)).format('YYYY/MM/DD HH:mm:ss');
            return time.split(' ').join('\n');
        },
        moveHandleStyle: {
            opacity: 0,
        }
    },
    toolbox: {
        tooltip: {
            show: true,
            formatter: function (param) {
                if (param.title) {
                    return `<div>${param.title}</div>`;
                }

            },
            padding: [6, 8, 6, 8],
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            textStyle: {
                fontSize: 14,
                color: '#fff',
                textBorderColor: 'rgba(0, 0, 0, 0.75)'
            },
            borderColor: 'rgba(0, 0, 0, 0.75)'
        },
        showTitle: false,
        right: 16,
        feature: {
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
        }
    },
    xAxis: {
        type: 'time',
        splitNumber: 3,
        axisLine: {
            show: false,
            color: "#AEB0B8",
        },
        boundaryGap: ['1%', '1%'],
        splitLine: {
            show: false,
            lineStyle: {
                color: 'rgba(174,176,184,0.20)'
            }
        },
        scale: true,
        axisTick: {
            show: false,
            color: 'rgba(0,0,0,0.45)'
        },
        axisLabel: {
            show: true,
            showMinLabel: true,
            showMaxLabel: true,
            // interval:99,
            color: 'rgba(0,0,0,0.45)',
            fontFamily: 'Helvetica',
            formatter: function (val) {
                return parseInt(val) ? moment(parseInt(val)).format(`YYYY-MM-DD HH:mm`).replace(' ', '\n') : "";
            }
        },
        axisPointer: {
            label: {
                show: false,
                formatter: function (params) {
                    return params.value
                        ? moment(params.value).format("YYYY-MM-DD HH:mm:ss").replace(' ', '\n')
                        : "";
                }
            }
        },
    },
    yAxis: {
        type: 'value',
        splitLine: {
            show: true,
            lineStyle: {
                color: 'rgba(174,176,184,0.20)'
            }
        },
        splitNumber: 3,
        axisTick: {
            show: false,
            length: 3,
        },
        axisLine: {
            show: false,
            color: "#AEB0B8",
        },
        axisLabel: {
            show: true,
            color: 'rgba(0,0,0,0.45)',
            fontFamily: 'Helvetica',
            formatter: (value) => {
                return value.toFixed(1);
            },
        },
        axisPointer: {
            label: {
                show: false,
                formatter: function (params) {
                    return params.value ? Math.floor(params.value * 100) / 100 : "";
                }
            }
        },
        scale: true,
        boundaryGap: ['0%', '15%']
    },
};

const LineChart = (props, ref) => {
    const lineRef = useRef();
    const {
        title,
        data = [],
        itemOnClick,
        LogAnalysisModel,
    } = props;
    const _option = Object.assign({}, option, title ? {
        title: {
            text: title,
            left: 16,
            top: 8,

        },
        grid: {
            top: 65,
            bottom: 40,
            left: LogAnalysisModel ? 75 : 20,
            right: LogAnalysisModel ? 98 : 40,
        },
    } : {
        grid: {
            top: 20,
            bottom: 10,
            left: LogAnalysisModel ? 75 : 20,
            right: LogAnalysisModel ? 98 : 40,
        },
    });

    if (LogAnalysisModel) {
        _option.dataZoom.start = 90;
    } else {
        _option.dataZoom.start = 0;
    }

    if (!!data[0] && !!data[0].data && data[0].data.length <= 10) {
        _option.dataZoom.zoomLock = true;
        _option.yAxis.boundaryGap = ['0%', '0%'];

        if (data[0].data.length === 1) {
            data[0].symbolSize = 5;
        }
    }

    useEffect(() => {
        if (lineRef.current && !!data[0] && !!data[0].data && data[0].data.length > 10) {
            const echart = lineRef.current.getEchartsInstance();
            echart.dispatchAction({
                type: 'takeGlobalCursor',
                key: 'dataZoomSelect',
                // 启动或关闭
                dataZoomSelectActive: true
            });
        }
    }, [_option]);

    return <EchartsLine
        option={_option}
        data={{
            sampling: 'lttb',
            seriesData: data
        }}
        ref={lineRef}
        onChartReady={(echarts) => {
            if (itemOnClick) {
                echarts.getZr().on('dblclick', (e) => {
                    let pointInPixel = [e.offsetX, e.offsetY];
                    let pointInGrid = echarts.convertFromPixel({
                        seriesIndex: 0
                    }, pointInPixel);
                    let xIndex = pointInGrid[0]; //索引
                    let handleIndex = Math.round(Number(xIndex)); //对应的x轴的值，也就是时间戳
                    !!itemOnClick && itemOnClick(handleIndex);
                });
            }
        }}
    />;
};
export default LineChart;