import moment from "moment";
import {IntlFormatMessage} from "@/utils/util";

const ChartOption = () => {
    let sampling = 'lttb'; ////average,max,min,sum/折线图在数据量远大于像素点时候的降采样策略，开启后可以有效的优化图表的绘制效率，默认关闭，也就是全部绘制不过滤数据点。
    return {
        animation: true,
        backgroundColor: '#fff',
        title: {
            show: true,
            text: IntlFormatMessage('common.rawdata'),
            textStyle: {
                fontFamily: "Helvetica",
                color: "rgba(0,0,0,0.85)",
                fontSize: 14,
                fontWeight: 600,
            },
            left: "left",
            // top: 6
        },
        tooltip: {
            formatter(params) {
                // // console.log(params)
                let upDownLine = params.filter(i => i.seriesName === '上界').length ?
                    params.filter(i => i.seriesName === '上界')[0]
                    : params.filter(i => i.seriesName === IntlFormatMessage('laboratory.anomaly.confidenceIntervalFit'))[1];
                let dom = [];
                if (params.filter(i => i.seriesName === IntlFormatMessage('common.rawdata')).length) {
                    const {marker, seriesName, data, nameEn} = params.filter(i => i.seriesName === IntlFormatMessage('common.rawdata'))[0];
                    let dataResult = null;
                    for (let i = 1; i < data.length; i++) {
                        if ((data[i] || data[i] === 0)) {
                            dataResult += data[i];
                        }
                    }
                    dom[0] = `<div key={index}>
                                    <div>
                                        ${marker || ''}
                                        ${seriesName || ''}：
                                        ${(dataResult || dataResult === 0) ? dataResult : 'null'}<br/>
                                    </div>
                                </div>
                               `;
                } else {
                    dom[0] = '';
                }
                if (params.filter(i => i.seriesName === IntlFormatMessage('datasource.create.forecastValue')).length) {
                    const {marker, seriesName, data, nameEn} = params.filter(i => i.seriesName === IntlFormatMessage('datasource.create.forecastValue'))[0];
                    let dataResult = null;
                    for (let i = 1; i < data.length; i++) {
                        if ((data[i] || data[i] === 0)) {
                            dataResult += data[i];
                        }
                    }
                    dom[1] = `<div key={index}>
                                    <div>
                                        ${marker || ''}
                                        ${seriesName || ''}：
                                        ${(dataResult || dataResult === 0) ? dataResult : 'null'}<br/>
                                    </div>
                                </div>
                               `;
                } else {
                    dom[1] = '';
                }
                if (params.filter(i => [IntlFormatMessage('common.upperboundary'), IntlFormatMessage('laboratory.anomaly.confidenceIntervalFit')].includes(i.seriesName)).length) {
                    const {marker, seriesName, data, nameEn} = params.filter(i => i.seriesName === IntlFormatMessage('common.upperboundary'))[0] || params.filter(i => i.seriesName === IntlFormatMessage('laboratory.anomaly.confidenceIntervalFit'))[1] || {};
                    let dataResult = null;
                    for (let i = 1; i < data.length; i++) {
                        if ((data[i] || data[i] === 0)) {
                            dataResult += data[i];
                        }
                    }
                    dom[2] = `<div key={index}>
                                    <div>
                                        ${marker || ''}
                                        ${seriesName || ''}：
                                        ${(dataResult || dataResult === 0) ? dataResult : 'null'}<br/>
                                    </div>
                                </div>
                               `;
                } else {
                    dom[2] = '';
                }
                if (params.filter(i => [IntlFormatMessage('common.lowerboundary'), IntlFormatMessage('laboratory.anomaly.confidenceIntervalFit')].includes(i.seriesName)).length) {
                    const {marker, seriesName, data, nameEn} = params.filter(i => [IntlFormatMessage('common.lowerboundary'), IntlFormatMessage('laboratory.anomaly.confidenceIntervalFit')].includes(i.seriesName))[0];
                    let dataResult = null;
                    for (let i = 1; i < data.length; i++) {
                        if ((data[i] || data[i] === 0)) {
                            dataResult += data[i];
                        }
                    }
                    dom[3] = `<div key={index}>
                                    <div>
                                        ${marker || ''}
                                        ${seriesName || ''}：
                                        ${(dataResult || dataResult === 0) ? dataResult : 'null'}<br/>
                                    </div>
                                </div>
                               `;
                } else {
                    dom[3] = '';
                }
                if (params.filter(i => i.seriesName === IntlFormatMessage('laboratory.anomaly.confidenceIntervalForecast')).length) {
                    const {marker, seriesName, data, nameEn} = params.filter(i => i.seriesName === IntlFormatMessage('laboratory.anomaly.confidenceIntervalForecast'))[0];
                    let dataResult = null;
                    for (let i = 1; i < data.length; i++) {
                        if ((data[i] || data[i] === 0)) {
                            dataResult += data[i];
                        }
                    }
                    dom[4] = `<div key={index}>
                                    <div>
                                        ${marker || ''}
                                        ${seriesName || ''}：
                                        ${(dataResult || dataResult === 0) ? dataResult : 'null'}<br/>
                                    </div>
                                </div>
                               `;
                } else {
                    dom[4] = '';
                }
                if (params.filter(i => i.seriesName === IntlFormatMessage('laboratory.anomaly.confidenceIntervalForecast')).length) {
                    const {marker, seriesName, data, nameEn} = params.filter(i => i.seriesName === IntlFormatMessage('laboratory.anomaly.confidenceIntervalForecast'))[1];
                    let dataResult = null;
                    for (let i = 1; i < data.length; i++) {
                        if ((data[i] || data[i] === 0)) {
                            dataResult += data[i];
                        }
                    }
                    dom[5] = `<div key={index}>
                                    <div>
                                        ${marker || ''}
                                        ${seriesName || ''}：
                                        ${(dataResult || dataResult === 0) ? dataResult : 'null'}<br/>
                                    </div>
                                </div>
                               `;
                } else {
                    dom[5] = '';
                }
                if (params.filter(i => i.seriesName === IntlFormatMessage('common.fittedvalue')).length) {
                    const {marker, seriesName, data, nameEn} = params.filter(i => i.seriesName === IntlFormatMessage('common.fittedvalue'))[0];
                    let dataResult = null;
                    for (let i = 1; i < data.length; i++) {
                        if ((data[i] || data[i] === 0)) {
                            dataResult += data[i];
                        }
                    }
                    dom[6] = `<div key={index}>
                                    <div>
                                        ${marker || ''}
                                        ${seriesName || ''}：
                                        ${(dataResult || dataResult === 0) ? dataResult : 'null'}<br/>
                                    </div>
                                </div>
                               `;
                } else {
                    dom[6] = '';
                }

                if (!!params && !!params[0]) {
                    dom.unshift(`
                                <div>
                                ${params[0].axisValue ? moment(Number(params[0].axisValue)).format('YYYY/MM/DD HH:mm:ss') : ''}
                                </div>
                            `);
                }
                return dom.filter(Boolean).join('');
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
            // position: function (pos, params, el, elRect, size) {
            //     const [width, height] = size.contentSize;
            //     const x = (pos[0] < size.viewSize[0] / 2) ? pos[0] : pos[0] - width;
            //     return [pos[0], pos[1] - height];
            // },
            // position: function (point, params, dom, rect, size) {
            //     const [width, height] = size.contentSize
            //     return [point[0] / 2, point[1] - height - 8]
            // },
            extraCssText: 'box-shadow: 0 2px 4px 0 rgba(0,0,0,0.4)',
            enterable: true,
            appendToBody: true,
            animation: false,
            hideDelay: 50
            // confine: true
        },
        grid: {
            left: 30,
            right: 50,
            top: 40,
            bottom: 30,
            containLabel: true,
        },
        legend: {
            show: true,
            itemWidth: 13,
            itemHeight: 3,
            textStyle: {
                color: '#333',
                // fontFamily:'serif',
            },
            top: 0,
            data: [],
        },
        dataZoom: [{
            type: "slider",
            show: true,
            realtime: false,
            start: 90,
            end: 100,
            // top: 250,
            bottom: 10,
            left: 100,
            right: 120,
            height: 20,
            labelFormatter: function (value) {
                const time = moment(Number(value)).format('YYYY/MM/DD HH:mm:ss');
                return time.split(' ').join('\n');
            },
            showDetai: false,
            moveHandleStyle: {
                opacity: 0,
            }
        }],
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
                myTool8: {
                    show: false,
                    title: IntlFormatMessage('laboratory.anomaly.calculate'),
                    icon: 'image://data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+6aKE6KeIPC90aXRsZT4KICAgIDxnIGlkPSLpobXpnaItMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IuWNleaMh+agh+mihOa1i+WxleekuiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEyOTUuMDAwMDAwLCAtMTczLjAwMDAwMCkiIGZpbGwtcnVsZT0ibm9uemVybyI+CiAgICAgICAgICAgIDxnIGlkPSLnvJbnu4QtMzQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEyMjIuMDAwMDAwLCAxNzMuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0i6aKE6KeIIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg3My4wMDAwMDAsIDAuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPHJlY3QgaWQ9IuefqeW9oiIgb3BhY2l0eT0iMCIgeD0iMCIgeT0iMCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2Ij48L3JlY3Q+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTE1Ljc0OTAxNTcsMTAuMzI5MzQxNyBDMTUuOTAzNzA2NiwxMC40MTg2NTI1IDE1Ljk5OTAwMDEsMTAuNTgzNzA1NyAxNS45OTkwMDAxLDEwLjc2MjMyNzQgTDE1Ljk5OTAwMDEsMTMuOTIwMTMgQzE1Ljk5OTAwMDEsMTUuMDY5MDU4MiAxNS4wNjkwNTgyLDE1Ljk5OTAwMDEgMTMuOTIwMTMsMTUuOTk5MDAwMSBMMTEuOTQ2MjUzNCwxNS45OTkwMDAxIEMxMS43Njc2MzE3LDE1Ljk5OTAwMDEgMTEuNjAyNTc4NSwxNS45MDM3MDY2IDExLjUxMzI2NzcsMTUuNzQ5MDE1NyBDMTEuNDIzOTU2OSwxNS41OTQzMjQ4IDExLjQyMzk1NjksMTUuNDAzNzM3OCAxMS41MTMyNjc3LDE1LjI0OTA0NjkgQzExLjYwMjU3ODUsMTUuMDk0MzU2MSAxMS43Njc2MzE3LDE0Ljk5OTA2MjYgMTEuOTQ2MjUzNCwxNC45OTkwNjI2IEwxMy45MjAxMywxNC45OTkwNjI2IEMxNC41MTYwOTI3LDE0Ljk5OTA2MjYgMTQuOTk5MDYyNSwxNC41MTYwOTI4IDE0Ljk5OTA2MjYsMTMuOTIwMTMgTDE0Ljk5OTA2MjYsMTAuNzYyMzI3NCBDMTQuOTk5MDYyNiwxMC41ODM3MDU3IDE1LjA5NDM1NjEsMTAuNDE4NjUyNSAxNS4yNDkwNDY5LDEwLjMyOTM0MTcgQzE1LjQwMzczNzgsMTAuMjQwMDMwOSAxNS41OTQzMjQ4LDEwLjI0MDAzMDkgMTUuNzQ5MDE1NywxMC4zMjkzNDE3IFogTTAuNDk5OTY4NzUsMTAuNDk5MzQzOCBDMC43NzYwOTM4NjYsMTAuNDk5MzQzOCAwLjk5OTkzNzUsMTAuNzIzMTg3NCAwLjk5OTkzNzUsMTAuOTk5MzEyNSBMMC45OTk5Mzc1LDEzLjkyMDEzIEMwLjk5OTkzNzUsMTQuNTE2MDkyOCAxLjQ4MjkwNzMxLDE0Ljk5OTA2MjYgMi4wNzg4NzAwOCwxNC45OTkwNjI2IEw1LjIzNjY3MjcsMTQuOTk5MDYyNiBDNS40MTUyOTQzNCwxNC45OTkwNjI2IDUuNTgwMzQ3NTQsMTUuMDk0MzU2MSA1LjY2OTY1ODM3LDE1LjI0OTA0NjkgQzUuNzU4OTY5MTksMTUuNDAzNzM3OCA1Ljc1ODk2OTE5LDE1LjU5NDMyNDggNS42Njk2NTgzNywxNS43NDkwMTU3IEM1LjU4MDM0NzU0LDE1LjkwMzcwNjYgNS40MTUyOTQzNCwxNS45OTkwMDAxIDUuMjM2NjcyNywxNS45OTkwMDAxIEwyLjA3ODg3MDA4LDE1Ljk5OTAwMDEgQzAuOTMwNzQxODM3LDE1Ljk5OTAwMDEgMi4yMjA0NDYwNWUtMTQsMTUuMDY4MjU4MiAyLjIyMDQ0NjA1ZS0xNCwxMy45MjAxMyBMMi4yMjA0NDYwNWUtMTQsMTAuOTk5MzEyNSBDMi4yMjA0NDYwNWUtMTQsMTAuNzIzMTg3NCAwLjIyMzg0MzYzNCwxMC40OTkzNDM4IDAuNDk5OTY4NzUsMTAuNDk5MzQzOCBaIE03Ljk5OTUwMDAzLDMuOTk5NzUwMDIgQzEwLjA0MDM3MjUsMy45OTk3NTAwMiAxMS45MDUyNTU5LDUuMDM5Njg1MDIgMTMuNTkzMTUwNCw3LjExOTU1NTAzIEMxMy44OTEwMDUsNy40ODY3MTc1NSAxMy44OTEwMDUsOC4wMTIzMTM3NiAxMy41OTMxNTA0LDguMzc5NDc2MjggQzExLjkwNTI1NTksMTAuNDU5MzQ2MyAxMC4wNDAzNzI1LDExLjQ5OTI4MTMgNy45OTk1MDAwMywxMS40OTkyODEzIEM1Ljk1ODYyNzU4LDExLjQ5OTI4MTMgNC4wOTM3NDQxNCwxMC40NTkzNDYzIDIuNDA1ODQ5NjQsOC4zNzk0NzYyOCBDMi4xMDc5OTUxLDguMDEyMzEzNzYgMi4xMDc5OTUxLDcuNDg2NzE3NTUgMi40MDU4NDk2NCw3LjExOTU1NTAzIEM0LjA5Mzc0NDE0LDUuMDM5Njg1MDIgNS45NTg2Mjc1OCwzLjk5OTc1MDAyIDcuOTk5NTAwMDMsMy45OTk3NTAwMiBaIE03Ljk5OTUwMDAzLDQuOTk5Njg3NTIgQzYuMjg2NjA3MDksNC45OTk2ODc1MiA0LjY5MjcwNjcsNS44ODg2MzE5NSAzLjE4MTgwMTE0LDcuNzQ5NTE1NjYgQzQuNjkyNzA2Nyw5LjYxMDM5OTM0IDYuMjg2NjA3MDksMTAuNDk5MzQzOCA3Ljk5OTUwMDAzLDEwLjQ5OTM0MzggQzkuNzEyMzkyOTcsMTAuNDk5MzQzOCAxMS4zMDYyOTM0LDkuNjEwMzk5MzYgMTIuODE3MTk4OSw3Ljc0OTUxNTY2IEMxMS4zMDYyOTM0LDUuODg4NjMxOTUgOS43MTIzOTI5Nyw0Ljk5OTY4NzUyIDcuOTk5NTAwMDMsNC45OTk2ODc1MiBaIE03Ljk5OTUwMDAzLDUuNDk5NjU2MjcgQzkuMjQxOTg5ODQsNS40OTk3NTk4MSAxMC4yNDkxNzE5LDYuNTA3MDI1ODQgMTAuMjQ5MTcxOSw3Ljc0OTUxNTY1IEMxMC4yNDkxNzE5LDguOTkyMDA1NDYgOS4yNDE5ODk4NCw5Ljk5OTI3MTQ5IDcuOTk5NTAwMDMsOS45OTkzNzUwMyBDNy4xOTU2NTgwMyw5Ljk5OTQ0MjAyIDYuNDUyODQ4NzQsOS41NzA2MzU5IDYuMDUwOTA4NCw4Ljg3NDQ5OTQ3IEM1LjY0ODk2ODA2LDguMTc4MzYzMDQgNS42NDg5NjgwNiw3LjMyMDY2ODI2IDYuMDUwOTA4NCw2LjYyNDUzMTgzIEM2LjQ1Mjg0ODc0LDUuOTI4Mzk1NCA3LjE5NTY1ODAzLDUuNDk5NTg5MjggNy45OTk1MDAwMyw1LjQ5OTY1NjI3IFogTTcuOTk5NTAwMDMsNi40OTk1OTM3OCBDNy4zMDkxODcyNCw2LjQ5OTU5Mzc4IDYuNzQ5NTc4MTYsNy4wNTkyMDI4NyA2Ljc0OTU3ODE2LDcuNzQ5NTE1NjYgQzYuNzQ5NTc4MTYsOC40Mzk4Mjg0NSA3LjMwOTE4NzI0LDguOTk5NDM3NTMgNy45OTk1MDAwMyw4Ljk5OTQzNzUzIEM4LjY4OTgxMjgyLDguOTk5NDM3NTMgOS4yNDk0MjE5MSw4LjQzOTgyODQ1IDkuMjQ5NDIxOTEsNy43NDk1MTU2NiBDOS4yNDk0MjE5MSw3LjA1OTIwMjg3IDguNjg5ODEyODIsNi40OTk1OTM3OCA3Ljk5OTUwMDAzLDYuNDk5NTkzNzggWiBNMTMuOTIwMTMsMi4yMjA0NDYwNWUtMTQgQzE1LjA2OTA1ODIsMi4yMjA0NDYwNWUtMTQgMTUuOTk5MDAwMSwwLjkyOTk0MTg3NSAxNS45OTkwMDAxLDIuMDc4ODcwMDggTDE1Ljk5OTAwMDEsNC45OTk2ODc1MiBDMTUuOTk5MDAwMSw1LjE3ODMwOTE1IDE1LjkwMzcwNjYsNS4zNDMzNjIzNiAxNS43NDkwMTU3LDUuNDMyNjczMTggQzE1LjU5NDMyNDgsNS41MjE5ODQgMTUuNDAzNzM3OCw1LjUyMTk4NCAxNS4yNDkwNDY5LDUuNDMyNjczMTggQzE1LjA5NDM1NjEsNS4zNDMzNjIzNiAxNC45OTkwNjI2LDUuMTc4MzA5MTUgMTQuOTk5MDYyNiw0Ljk5OTY4NzUyIEwxNC45OTkwNjI2LDIuMDc4ODcwMDggQzE0Ljk5OTA2MjYsMS40ODI5MDczMSAxNC41MTYwOTI4LDAuOTk5OTM3NSAxMy45MjAxMywwLjk5OTkzNzUgTDEwLjk5OTMxMjUsMC45OTk5Mzc1IEMxMC43MjMxODc0LDAuOTk5OTM3NSAxMC40OTkzNDM4LDAuNzc2MDkzODY2IDEwLjQ5OTM0MzgsMC40OTk5Njg3NSBDMTAuNDk5MzQzOCwwLjIyMzg0MzYzNCAxMC43MjMxODc0LDIuMjIwNDQ2MDVlLTE0IDEwLjk5OTMxMjUsMi4yMjA0NDYwNWUtMTQgTDEzLjkyMDEzLDIuMjIwNDQ2MDVlLTE0IFogTTQuOTk5Njg3NTIsMi4yMjA0NDYwNWUtMTQgQzUuMjc1ODEyNjMsMi4yMjA0NDYwNWUtMTQgNS40OTk2NTYyNywwLjIyMzg0MzYzNCA1LjQ5OTY1NjI3LDAuNDk5OTY4NzUgQzUuNDk5NjU2MjcsMC43NzYwOTM4NjYgNS4yNzU4MTI2MywwLjk5OTkzNzUgNC45OTk2ODc1MiwwLjk5OTkzNzUgTDIuMDc4ODcwMDgsMC45OTk5Mzc1IEMxLjQ4MjkwNzMxLDAuOTk5OTM3NSAwLjk5OTkzNzUsMS40ODI5MDczMSAwLjk5OTkzNzUsMi4wNzg4NzAwOCBMMC45OTk5Mzc1LDQuOTk5Njg3NTIgQzAuOTk5OTM3NSw1LjI3NTgxMjYzIDAuNzc2MDkzODY2LDUuNDk5NjU2MjcgMC40OTk5Njg3NSw1LjQ5OTY1NjI3IEMwLjIyMzg0MzYzNCw1LjQ5OTY1NjI3IDIuMjIwNDQ2MDVlLTE0LDUuMjc1ODEyNjMgMi4yMjA0NDYwNWUtMTQsNC45OTk2ODc1MiBMMi4yMjA0NDYwNWUtMTQsMi4wNzg4NzAwOCBDMi4yMjA0NDYwNWUtMTQsMC45Mjk5NDE4NzUgMC45Mjk5NDE4NzUsMi4yMjA0NDYwNWUtMTQgMi4wNzg4NzAwOCwyLjIyMDQ0NjA1ZS0xNCBMNC45OTk2ODc1MiwyLjIyMDQ0NjA1ZS0xNCBaIiBpZD0i5b2i54q257uT5ZCIIiBmaWxsPSIjMDAwMDAwIiBvcGFjaXR5PSIwLjQ0OTk5OTk4OCI+PC9wYXRoPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=',
                    onclick: function () {
                        // alert('111');
                    }
                },
                myTool4: {
                    show: false,
                    title: IntlFormatMessage('laboratory.detail.editgenericity'),
                    icon: 'image://data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+57yW6L6RPC90aXRsZT4KICAgIDxnIGlkPSLpobXpnaItMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IuWNleaMh+agh+mihOa1i+WxleekuiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTY1MS4wMDAwMDAsIC0xNzQuMDAwMDAwKSIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGcgaWQ9Iue8lue7hC0zNCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTMxLjAwMDAwMCwgMTc0LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9Iue8lui+kSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTIwLjAwMDAwMCwgMC4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICA8cmVjdCBpZD0i55+p5b2iIiBvcGFjaXR5PSIwIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiPjwvcmVjdD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNy44OTc3Njk4OSwwLjE5MzUxNjU0IEw3Ljg5Nzc2OTg5LDEuMTgxNDIxNzYgTDAuOTg3MjIxMjM3LDEuMTgxNDIxNzYgTDAuOTg3MjIxMjM3LDE1LjAxMjA5NDggTDE0LjgwODMxODYsMTUuMDEyMDk0OCBMMTQuODA4MzE4Niw4LjU5MDcxMDg4IEwxNS43OTU1Mzk4LDguNTkwNzEwODggTDE1Ljc5NTUzOTgsMTYgTDAsMTYgTDAsMC4xOTM1MTY1NCBMNy44OTc3Njk4OSwwLjE5MzUxNjU0IFogTTEzLjMzODU2NDMsLTEuNDIxMDg1NDdlLTE0IEwxNiwyLjY2MzI3OTU4IEw4LjEwMjIzMDExLDEwLjU2NjUyMTMgTDQuOTM2MTA2MTgsMTAuNTY2NTIxMyBMNC45MzYxMDYxOCw3Ljg4Mjc2MjE5IEwxMy4zMzg1NjQzLC0xLjQyMTA4NTQ3ZS0xNCBaIE0xMy4zMTU2NCwxLjM3NDA2MzI3IEw1LjkyMzMyNzQyLDguMzA5MTU3ODkgTDUuOTIzMzI3NDIsOS41Nzg2MTYwOSBMNy42OTI0Mjc4OCw5LjU3ODYxNjA5IEwxNC42MDM5NjM4LDIuNjYzMjc5NTggTDEzLjMxNTY0LDEuMzc0MDYzMjcgWiIgaWQ9IuW9oueKtue7k+WQiCIgZmlsbD0iIzAwMDAwMCIgb3BhY2l0eT0iMC40NDk5OTk5ODgiPjwvcGF0aD4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+',
                    onclick: function () {
                        // alert('111');
                    }
                },
                myTool2: {
                    show: false,
                    title: IntlFormatMessage('common.preview'),
                    icon: 'image://data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+6aKE6KeIPC90aXRsZT4KICAgIDxnIGlkPSLpobXpnaItMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IuWNleaMh+agh+mihOa1i+WxleekuiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEyOTUuMDAwMDAwLCAtMTczLjAwMDAwMCkiIGZpbGwtcnVsZT0ibm9uemVybyI+CiAgICAgICAgICAgIDxnIGlkPSLnvJbnu4QtMzQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEyMjIuMDAwMDAwLCAxNzMuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0i6aKE6KeIIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg3My4wMDAwMDAsIDAuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPHJlY3QgaWQ9IuefqeW9oiIgb3BhY2l0eT0iMCIgeD0iMCIgeT0iMCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2Ij48L3JlY3Q+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTE1Ljc0OTAxNTcsMTAuMzI5MzQxNyBDMTUuOTAzNzA2NiwxMC40MTg2NTI1IDE1Ljk5OTAwMDEsMTAuNTgzNzA1NyAxNS45OTkwMDAxLDEwLjc2MjMyNzQgTDE1Ljk5OTAwMDEsMTMuOTIwMTMgQzE1Ljk5OTAwMDEsMTUuMDY5MDU4MiAxNS4wNjkwNTgyLDE1Ljk5OTAwMDEgMTMuOTIwMTMsMTUuOTk5MDAwMSBMMTEuOTQ2MjUzNCwxNS45OTkwMDAxIEMxMS43Njc2MzE3LDE1Ljk5OTAwMDEgMTEuNjAyNTc4NSwxNS45MDM3MDY2IDExLjUxMzI2NzcsMTUuNzQ5MDE1NyBDMTEuNDIzOTU2OSwxNS41OTQzMjQ4IDExLjQyMzk1NjksMTUuNDAzNzM3OCAxMS41MTMyNjc3LDE1LjI0OTA0NjkgQzExLjYwMjU3ODUsMTUuMDk0MzU2MSAxMS43Njc2MzE3LDE0Ljk5OTA2MjYgMTEuOTQ2MjUzNCwxNC45OTkwNjI2IEwxMy45MjAxMywxNC45OTkwNjI2IEMxNC41MTYwOTI3LDE0Ljk5OTA2MjYgMTQuOTk5MDYyNSwxNC41MTYwOTI4IDE0Ljk5OTA2MjYsMTMuOTIwMTMgTDE0Ljk5OTA2MjYsMTAuNzYyMzI3NCBDMTQuOTk5MDYyNiwxMC41ODM3MDU3IDE1LjA5NDM1NjEsMTAuNDE4NjUyNSAxNS4yNDkwNDY5LDEwLjMyOTM0MTcgQzE1LjQwMzczNzgsMTAuMjQwMDMwOSAxNS41OTQzMjQ4LDEwLjI0MDAzMDkgMTUuNzQ5MDE1NywxMC4zMjkzNDE3IFogTTAuNDk5OTY4NzUsMTAuNDk5MzQzOCBDMC43NzYwOTM4NjYsMTAuNDk5MzQzOCAwLjk5OTkzNzUsMTAuNzIzMTg3NCAwLjk5OTkzNzUsMTAuOTk5MzEyNSBMMC45OTk5Mzc1LDEzLjkyMDEzIEMwLjk5OTkzNzUsMTQuNTE2MDkyOCAxLjQ4MjkwNzMxLDE0Ljk5OTA2MjYgMi4wNzg4NzAwOCwxNC45OTkwNjI2IEw1LjIzNjY3MjcsMTQuOTk5MDYyNiBDNS40MTUyOTQzNCwxNC45OTkwNjI2IDUuNTgwMzQ3NTQsMTUuMDk0MzU2MSA1LjY2OTY1ODM3LDE1LjI0OTA0NjkgQzUuNzU4OTY5MTksMTUuNDAzNzM3OCA1Ljc1ODk2OTE5LDE1LjU5NDMyNDggNS42Njk2NTgzNywxNS43NDkwMTU3IEM1LjU4MDM0NzU0LDE1LjkwMzcwNjYgNS40MTUyOTQzNCwxNS45OTkwMDAxIDUuMjM2NjcyNywxNS45OTkwMDAxIEwyLjA3ODg3MDA4LDE1Ljk5OTAwMDEgQzAuOTMwNzQxODM3LDE1Ljk5OTAwMDEgMi4yMjA0NDYwNWUtMTQsMTUuMDY4MjU4MiAyLjIyMDQ0NjA1ZS0xNCwxMy45MjAxMyBMMi4yMjA0NDYwNWUtMTQsMTAuOTk5MzEyNSBDMi4yMjA0NDYwNWUtMTQsMTAuNzIzMTg3NCAwLjIyMzg0MzYzNCwxMC40OTkzNDM4IDAuNDk5OTY4NzUsMTAuNDk5MzQzOCBaIE03Ljk5OTUwMDAzLDMuOTk5NzUwMDIgQzEwLjA0MDM3MjUsMy45OTk3NTAwMiAxMS45MDUyNTU5LDUuMDM5Njg1MDIgMTMuNTkzMTUwNCw3LjExOTU1NTAzIEMxMy44OTEwMDUsNy40ODY3MTc1NSAxMy44OTEwMDUsOC4wMTIzMTM3NiAxMy41OTMxNTA0LDguMzc5NDc2MjggQzExLjkwNTI1NTksMTAuNDU5MzQ2MyAxMC4wNDAzNzI1LDExLjQ5OTI4MTMgNy45OTk1MDAwMywxMS40OTkyODEzIEM1Ljk1ODYyNzU4LDExLjQ5OTI4MTMgNC4wOTM3NDQxNCwxMC40NTkzNDYzIDIuNDA1ODQ5NjQsOC4zNzk0NzYyOCBDMi4xMDc5OTUxLDguMDEyMzEzNzYgMi4xMDc5OTUxLDcuNDg2NzE3NTUgMi40MDU4NDk2NCw3LjExOTU1NTAzIEM0LjA5Mzc0NDE0LDUuMDM5Njg1MDIgNS45NTg2Mjc1OCwzLjk5OTc1MDAyIDcuOTk5NTAwMDMsMy45OTk3NTAwMiBaIE03Ljk5OTUwMDAzLDQuOTk5Njg3NTIgQzYuMjg2NjA3MDksNC45OTk2ODc1MiA0LjY5MjcwNjcsNS44ODg2MzE5NSAzLjE4MTgwMTE0LDcuNzQ5NTE1NjYgQzQuNjkyNzA2Nyw5LjYxMDM5OTM0IDYuMjg2NjA3MDksMTAuNDk5MzQzOCA3Ljk5OTUwMDAzLDEwLjQ5OTM0MzggQzkuNzEyMzkyOTcsMTAuNDk5MzQzOCAxMS4zMDYyOTM0LDkuNjEwMzk5MzYgMTIuODE3MTk4OSw3Ljc0OTUxNTY2IEMxMS4zMDYyOTM0LDUuODg4NjMxOTUgOS43MTIzOTI5Nyw0Ljk5OTY4NzUyIDcuOTk5NTAwMDMsNC45OTk2ODc1MiBaIE03Ljk5OTUwMDAzLDUuNDk5NjU2MjcgQzkuMjQxOTg5ODQsNS40OTk3NTk4MSAxMC4yNDkxNzE5LDYuNTA3MDI1ODQgMTAuMjQ5MTcxOSw3Ljc0OTUxNTY1IEMxMC4yNDkxNzE5LDguOTkyMDA1NDYgOS4yNDE5ODk4NCw5Ljk5OTI3MTQ5IDcuOTk5NTAwMDMsOS45OTkzNzUwMyBDNy4xOTU2NTgwMyw5Ljk5OTQ0MjAyIDYuNDUyODQ4NzQsOS41NzA2MzU5IDYuMDUwOTA4NCw4Ljg3NDQ5OTQ3IEM1LjY0ODk2ODA2LDguMTc4MzYzMDQgNS42NDg5NjgwNiw3LjMyMDY2ODI2IDYuMDUwOTA4NCw2LjYyNDUzMTgzIEM2LjQ1Mjg0ODc0LDUuOTI4Mzk1NCA3LjE5NTY1ODAzLDUuNDk5NTg5MjggNy45OTk1MDAwMyw1LjQ5OTY1NjI3IFogTTcuOTk5NTAwMDMsNi40OTk1OTM3OCBDNy4zMDkxODcyNCw2LjQ5OTU5Mzc4IDYuNzQ5NTc4MTYsNy4wNTkyMDI4NyA2Ljc0OTU3ODE2LDcuNzQ5NTE1NjYgQzYuNzQ5NTc4MTYsOC40Mzk4Mjg0NSA3LjMwOTE4NzI0LDguOTk5NDM3NTMgNy45OTk1MDAwMyw4Ljk5OTQzNzUzIEM4LjY4OTgxMjgyLDguOTk5NDM3NTMgOS4yNDk0MjE5MSw4LjQzOTgyODQ1IDkuMjQ5NDIxOTEsNy43NDk1MTU2NiBDOS4yNDk0MjE5MSw3LjA1OTIwMjg3IDguNjg5ODEyODIsNi40OTk1OTM3OCA3Ljk5OTUwMDAzLDYuNDk5NTkzNzggWiBNMTMuOTIwMTMsMi4yMjA0NDYwNWUtMTQgQzE1LjA2OTA1ODIsMi4yMjA0NDYwNWUtMTQgMTUuOTk5MDAwMSwwLjkyOTk0MTg3NSAxNS45OTkwMDAxLDIuMDc4ODcwMDggTDE1Ljk5OTAwMDEsNC45OTk2ODc1MiBDMTUuOTk5MDAwMSw1LjE3ODMwOTE1IDE1LjkwMzcwNjYsNS4zNDMzNjIzNiAxNS43NDkwMTU3LDUuNDMyNjczMTggQzE1LjU5NDMyNDgsNS41MjE5ODQgMTUuNDAzNzM3OCw1LjUyMTk4NCAxNS4yNDkwNDY5LDUuNDMyNjczMTggQzE1LjA5NDM1NjEsNS4zNDMzNjIzNiAxNC45OTkwNjI2LDUuMTc4MzA5MTUgMTQuOTk5MDYyNiw0Ljk5OTY4NzUyIEwxNC45OTkwNjI2LDIuMDc4ODcwMDggQzE0Ljk5OTA2MjYsMS40ODI5MDczMSAxNC41MTYwOTI4LDAuOTk5OTM3NSAxMy45MjAxMywwLjk5OTkzNzUgTDEwLjk5OTMxMjUsMC45OTk5Mzc1IEMxMC43MjMxODc0LDAuOTk5OTM3NSAxMC40OTkzNDM4LDAuNzc2MDkzODY2IDEwLjQ5OTM0MzgsMC40OTk5Njg3NSBDMTAuNDk5MzQzOCwwLjIyMzg0MzYzNCAxMC43MjMxODc0LDIuMjIwNDQ2MDVlLTE0IDEwLjk5OTMxMjUsMi4yMjA0NDYwNWUtMTQgTDEzLjkyMDEzLDIuMjIwNDQ2MDVlLTE0IFogTTQuOTk5Njg3NTIsMi4yMjA0NDYwNWUtMTQgQzUuMjc1ODEyNjMsMi4yMjA0NDYwNWUtMTQgNS40OTk2NTYyNywwLjIyMzg0MzYzNCA1LjQ5OTY1NjI3LDAuNDk5OTY4NzUgQzUuNDk5NjU2MjcsMC43NzYwOTM4NjYgNS4yNzU4MTI2MywwLjk5OTkzNzUgNC45OTk2ODc1MiwwLjk5OTkzNzUgTDIuMDc4ODcwMDgsMC45OTk5Mzc1IEMxLjQ4MjkwNzMxLDAuOTk5OTM3NSAwLjk5OTkzNzUsMS40ODI5MDczMSAwLjk5OTkzNzUsMi4wNzg4NzAwOCBMMC45OTk5Mzc1LDQuOTk5Njg3NTIgQzAuOTk5OTM3NSw1LjI3NTgxMjYzIDAuNzc2MDkzODY2LDUuNDk5NjU2MjcgMC40OTk5Njg3NSw1LjQ5OTY1NjI3IEMwLjIyMzg0MzYzNCw1LjQ5OTY1NjI3IDIuMjIwNDQ2MDVlLTE0LDUuMjc1ODEyNjMgMi4yMjA0NDYwNWUtMTQsNC45OTk2ODc1MiBMMi4yMjA0NDYwNWUtMTQsMi4wNzg4NzAwOCBDMi4yMjA0NDYwNWUtMTQsMC45Mjk5NDE4NzUgMC45Mjk5NDE4NzUsMi4yMjA0NDYwNWUtMTQgMi4wNzg4NzAwOCwyLjIyMDQ0NjA1ZS0xNCBMNC45OTk2ODc1MiwyLjIyMDQ0NjA1ZS0xNCBaIiBpZD0i5b2i54q257uT5ZCIIiBmaWxsPSIjMDAwMDAwIiBvcGFjaXR5PSIwLjQ0OTk5OTk4OCI+PC9wYXRoPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=',
                    onclick: function () {
                        // alert('111');
                    }
                },
                myTool6: {
                    show: false,
                    title: IntlFormatMessage('laboratory.detail.favorites'),
                    icon: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAANCAYAAACZ3F9/AAABYWlDQ1BrQ0dDb2xvclNwYWNlRGlzcGxheVAzAAAokWNgYFJJLCjIYWFgYMjNKykKcndSiIiMUmB/yMAOhLwMYgwKicnFBY4BAT5AJQwwGhV8u8bACKIv64LMOiU1tUm1XsDXYqbw1YuvRJsw1aMArpTU4mQg/QeIU5MLikoYGBhTgGzl8pICELsDyBYpAjoKyJ4DYqdD2BtA7CQI+whYTUiQM5B9A8hWSM5IBJrB+API1klCEk9HYkPtBQFul8zigpzESoUAYwKuJQOUpFaUgGjn/ILKosz0jBIFR2AopSp45iXr6SgYGRiaMzCAwhyi+nMgOCwZxc4gxJrvMzDY7v////9uhJjXfgaGjUCdXDsRYhoWDAyC3AwMJ3YWJBYlgoWYgZgpLY2B4dNyBgbeSAYG4QtAPdHFacZGYHlGHicGBtZ7//9/VmNgYJ/MwPB3wv//vxf9//93MVDzHQaGA3kAFSFl7jXH0fsAAAA4ZVhJZk1NACoAAAAIAAGHaQAEAAAAAQAAABoAAAAAAAKgAgAEAAAAAQAAAA6gAwAEAAAAAQAAAA0AAAAA2ZhhEAAAAchJREFUKBVtksFLVFEUxs+57406SqXkjCJaScrAOK4iCtxUqxRCRheCKwkLSkR0oYIIBv4BumktudVxtGgTVKv+gVo0lKXgQh2ZhS6yeffdr3OH3sOpdzf3vu+c3/nOOTyiiINP7fFyrvkr8i29EeGKpKIC3tHvpwRKaWMWo+JW+w/E265aBmaJaUbgR9hp7YmCq0B8uOfq89NJEJdi2eIKCK+09pds6//C7OWSL4hwC0Td4tRpE5h41B0ubmCr9YY2/mdiNEj8gIm+Majg1NYvuFK1Q4CHiumZo9R7akzv8/2PulIge7gH4DK96WjTfjlDPtYNUZPjx7WKZSfGpbU1A56nGkcHUNAas3hcpZJA0+L8M6YaHvBg4UzcpVGA/a3ESwPqj8Xd2zxwWAxAe3ubze9kgHo3fqWfB76fWq2yHFvVqWuck+/r5JmqhdkkMHeyouUAslqY5P06S0uBEx48PsJ26lJ5M/kcr9uu2SQmfJFx0vYdnBBU5Gek5135Y6a1X/oh80zpslfwcolVkDqGQSaA7B2CUNwjK78jfY2xUo9rhoopl/mu5NwkmCfiWgWGRXQ+MaLzLaN2UaH49+FtJ/vEef6i/gc29rXu3aS0CwAAAABJRU5ErkJggg==',
                    onclick: function () {
                        // alert('111');
                    }
                },
                myTool7: {
                    show: false,
                    title: IntlFormatMessage('laboratory.detail.removefromvorites'),
                    icon: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAANCAYAAACZ3F9/AAABYWlDQ1BrQ0dDb2xvclNwYWNlRGlzcGxheVAzAAAokWNgYFJJLCjIYWFgYMjNKykKcndSiIiMUmB/yMAOhLwMYgwKicnFBY4BAT5AJQwwGhV8u8bACKIv64LMOiU1tUm1XsDXYqbw1YuvRJsw1aMArpTU4mQg/QeIU5MLikoYGBhTgGzl8pICELsDyBYpAjoKyJ4DYqdD2BtA7CQI+whYTUiQM5B9A8hWSM5IBJrB+API1klCEk9HYkPtBQFul8zigpzESoUAYwKuJQOUpFaUgGjn/ILKosz0jBIFR2AopSp45iXr6SgYGRiaMzCAwhyi+nMgOCwZxc4gxJrvMzDY7v////9uhJjXfgaGjUCdXDsRYhoWDAyC3AwMJ3YWJBYlgoWYgZgpLY2B4dNyBgbeSAYG4QtAPdHFacZGYHlGHicGBtZ7//9/VmNgYJ/MwPB3wv//vxf9//93MVDzHQaGA3kAFSFl7jXH0fsAAAA4ZVhJZk1NACoAAAAIAAGHaQAEAAAAAQAAABoAAAAAAAKgAgAEAAAAAQAAAA6gAwAEAAAAAQAAAA0AAAAA2ZhhEAAAAVVJREFUKBV1Ub1Lw0AUf+9ysUYHFUwLYgdBKagdxNFF3FSo6CI4iwjirCCIgn+Dm/9CrINd3To4CoJVcXJQXKQdrOaS57vYhHwZCPfu93Hvfu8Acj5qjls/zugD1UvVHDqARB7hvn/vAEFF+f5xHq8xTBPUmCyo7ucLEYwhAkkpq1h7u0/rEh3pZlGqbntfm7SQV1TKO9FXTxvRdYqnLJkngCkkmuDVzIi4M+OvfL0nJGgZhYEjSUBlhleDDmlHb687c1lmM/84YniWEub63jZHvfjHk4A5860pBpdwrdUJhkNE6F3a5z7BbkIZ2yBgU1pDy7jy3NZwMBxEJKN/+CCmy5Qo4Cw0RUZduF+d6Yw6BnC2BB89hwBvNqbj2Pio3zHEyKcEHxlJ4MyfCO+EYdT6Nj4qEsQcx7jWOJ+RMIYHgqrbm6pe2tKDisBe4V4VF1zHPozjv98CcaGucreWAAAAAElFTkSuQmCC',
                    onclick: function () {
                        // alert('111');
                    }
                },
                myTool1: {
                    show: false,
                    title: IntlFormatMessage('common.threshold'),
                    icon: 'image://data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+57yW57uEIDM2PC90aXRsZT4KICAgIDxnIGlkPSLpobXpnaItMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgb3BhY2l0eT0iMC40NDk5OTk5ODgiPgogICAgICAgIDxnIGlkPSLljZXmjIfmoIfpooTmtYvlsZXnpLoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC01MzEuMDAwMDAwLCAtMTc0LjAwMDAwMCkiIGZpbGw9IiMwMDAwMDAiIGZpbGwtcnVsZT0ibm9uemVybyI+CiAgICAgICAgICAgIDxnIGlkPSLnvJbnu4QtMzQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDUzMS4wMDAwMDAsIDE3NC4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSLnvJbnu4QtMzYiPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik03LjE5OTc1MTczLDIuNjY2OTQyNTIgTDYuODQzOTAxOTMsMi43NDQ3MzI5NCBDNi4yMzM0NjEsMi44NzgzODAxOCA1LjY1MTIxOTYsMy4xMTgxNDg2MSA1LjEyMzY4NTM5LDMuNDUzMTIyMzEgTDQuODAxNDg5NiwzLjY1NzI1MzIgTDMuNTM4MDg0ODksMi43MDgzMjA0IEwyLjc2ODQ1NjI2LDMuNDc3OTQ5MDQgTDMuNjYzMzIxOTUsNC43OTU0MjA4NSBMMy40NjY5MTQ5Myw1LjEwMTYxNzE5IEMzLjEyOTQ5MzIzLDUuNjI3NjIyMzMgMi44ODY5MzEwNCw2LjIwODcyNTkxIDIuNzUwMjQ5OTksNi44MTg1MjM1IEwyLjY2NzQ5NDIyLDcuMTkwOTI0NDUgTDEuMTAzNDEwMjMsNy40MTMyNjE2MSBMMS4xMDM0MTAyMyw4LjUwMTIyNDEgTDIuNjY2OTQyNTIsOC43OTk2OTY1NiBMMi43NDQ3MzI5NCw5LjE1NTU0NjM2IEMyLjg3ODQ3ODU5LDkuNzY1OTU2NTIgMy4xMTgyNDAxNSwxMC4zNDgxODEzIDMuNDUzMTIyMzEsMTAuODc1NzYyOSBMMy42NTcyNTMyLDExLjE5Nzk1ODcgTDIuNzA4MzIwNCwxMi40NjEzNjM0IEwzLjQ3Nzk0OTA0LDEzLjIzMDk5MiBMNC43OTU0MjA4NSwxMi4zMzYxMjYzIEw1LjEwMTYxNzE5LDEyLjUzMjUzMzQgQzUuNjI3NjIyMzMsMTIuODY5OTU1MSA2LjIwODcyNTkxLDEzLjExMjUxNzMgNi44MTg1MjM1LDEzLjI0OTE5ODMgTDcuMTkwOTI0NDUsMTMuMzMxOTU0MSBMNy40MTMyNjE2MSwxNC44OTYwMzgxIEw4LjUwMTIyNDEsMTQuODk2MDM4MSBMOC43OTk2OTY1NiwxMy4zMzI1MDU4IEw5LjE1NTU0NjM2LDEzLjI1NDcxNTQgQzkuNzY1OTU2NTIsMTMuMTIwOTY5NyAxMC4zNDgxODEzLDEyLjg4MTIwODEgMTAuODc1NzYyOSwxMi41NDYzMjYgTDExLjE5Nzk1ODcsMTIuMzQyMTk1MSBMMTIuNDYxMzYzNCwxMy4yOTExMjc5IEwxMy4yMzA5OTIsMTIuNTIxNDk5MyBMMTIuMzM2MTI2MywxMS4yMDQwMjc0IEwxMi41MzI1MzM0LDEwLjg5NzgzMTEgQzEyLjg2OTk1NTEsMTAuMzcxODI2IDEzLjExMjUxNzMsOS43OTA3MjIzOSAxMy4yNDkxOTgzLDkuMTgwOTI0OCBMMTMuMzMxOTU0MSw4LjgwODUyMzg0IEwxNC44OTYwMzgxLDguNTg2MTg2NjggTDE0Ljg5NjAzODEsNy40OTc2NzI0OSBMMTMuMzMyNTA1OCw3LjE5OTIwMDAzIEwxMy4yNTQ3MTU0LDYuODQzMzUwMjMgQzEzLjEyMDk2OTcsNi4yMzI5NDAwNyAxMi44ODEyMDgxLDUuNjUwNzE1MzQgMTIuNTQ2MzI2LDUuMTIzMTMzNjkgTDEyLjM0MjE5NTEsNC44MDA5Mzc5IEwxMy4yOTExMjc5LDMuNTM3NTMzMTkgTDEyLjUyMTQ5OTMsMi43Njc5MDQ1NiBMMTEuMjA0MDI3NCwzLjY2Mjc3MDI1IEwxMC44OTc4MzExLDMuNDY2MzYzMjMgQzEwLjM3MTgwNDcsMy4xMjg5ODIwNSA5Ljc5MDcwODUyLDIuODg2NDIyOTQgOS4xODA5MjQ4LDIuNzQ5Njk4MjkgTDguODA4NTIzODQsMi42NjY5NDI1MiBMOC41ODYxODY2OCwxLjEwMjg1ODUyIEw3LjQ5NzY3MjQ5LDEuMTAyODU4NTIgTDcuMTk5NzUxNzMsMi42NjY5NDI1MiBaIE02LjU4NTcwMzk0LDAgTDkuNTQzOTQ2NzYsMCBMOS43OTYwNzYsMS43NjkzMTgzIEMxMC4yNzg4MTgsMS45MDgzNDc5OSAxMC43NDE2OTg2LDIuMTAyNTQ4MTkgMTEuMTc3NTQ1NiwyLjM0ODA1Njk2IEwxMi42NTY2NjcsMS4zNDI4NTAyNSBMMTQuNzQ4NzMyOCwzLjQzNDkxNjA0IEwxMy42NzUxMTQ3LDQuODYzODMyMjggQzEzLjkxNzg2NDksNS4zMDE4ODYxNCAxNC4xMDg3NTQ5LDUuNzY2NDIxODUgMTQuMjQzMzcwOSw2LjI1MDI2NzIzIEwxNiw2LjU4NTE1MjI0IEwxNiw5LjU0MzM5NTA2IEwxNC4yMzA2ODE3LDkuNzk1NTI0MjkgQzE0LjA5MjEwMDEsMTAuMjc2OTM2NSAxMy44OTc4NzY2LDEwLjc0MDU1NDcgMTMuNjUxOTQzLDExLjE3Njk5MzkgTDE0LjY1NzE0OTgsMTIuNjU2MTE1MyBMMTIuNTY1MDg0LDE0Ljc0ODE4MTEgTDExLjEzNjE2NzcsMTMuNjc0NTYyOSBDMTAuNjk4MTEzOSwxMy45MTczMTMyIDEwLjIzMzU3ODIsMTQuMTA4MjAzMiA5Ljc0OTczMjc3LDE0LjI0MjgxOTIgTDkuNDE0ODQ3NzYsMTUuOTk5NDQ4MyBMNi40NTY2MDQ5NCwxNS45OTk0NDgzIEw2LjIwNDQ3NTcxLDE0LjIzMDEzIEM1LjcyMzA2MzUzLDE0LjA5MTU0ODQgNS4yNTk0NDUzNSwxMy44OTczMjQ5IDQuODIzMDA2MSwxMy42NTEzOTEzIEwzLjM0MzMzMjk5LDE0LjY1NjU5OCBMMS4yNTEyNjcyLDEyLjU2NDUzMjMgTDIuMzI0ODg1MzUsMTEuMTM1NjE2IEMyLjA4MjIwNzE4LDEwLjY5NzEzNjIgMS44OTE0OTk5NiwxMC4yMzE4NDc3IDEuNzU2NjI5MDgsOS43NDkxODEwNiBMMCw5LjQxNDI5NjA2IEwwLDYuNDU2MDUzMjQgTDEuNzY5MzE4Myw2LjIwMzkyNCBDMS45MDgzNDc5OSw1LjcyMTczMzczIDIuMTAyNTQ4MTksNS4yNTgzMDE0NCAyLjM0ODA1Njk2LDQuODIyNDU0NCBMMS4zNDI4NTAyNSwzLjM0MzMzMjk5IEwzLjQzNDkxNjA0LDEuMjUxMjY3MiBMNC44NjM4MzIyOCwyLjMyNDg4NTM1IEM1LjMwMjMxNDIyLDIuMDgyMjExNzIgNS43Njc2MDIyNywxLjg5MTUwNDcyIDYuMjUwMjY3MjMsMS43NTY2MjkwOCBMNi41ODU3MDM5NCwwIFogTTcuOTk5NzI0MTUsMTEuMzA5OTU0OCBDNi4xNzE1MzQyMiwxMS4zMDk5NTQ4IDQuNjg5NDkzNDcsOS44Mjc5MTQwNyA0LjY4OTQ5MzQ3LDcuOTk5NzI0MTUgQzQuNjg5NDkzNDcsNi4xNzE1MzQyMiA2LjE3MTUzNDIyLDQuNjg5NDkzNDcgNy45OTk3MjQxNSw0LjY4OTQ5MzQ3IEM5LjgyNzkxNDA3LDQuNjg5NDkzNDcgMTEuMzA5OTU0OCw2LjE3MTUzNDIyIDExLjMwOTk1NDgsNy45OTk3MjQxNSBDMTEuMzA5OTU0OCw5LjgyNzkxNDA3IDkuODI3OTE0MDcsMTEuMzA5OTU0OCA3Ljk5OTcyNDE1LDExLjMwOTk1NDggWiBNNy45OTk3MjQxNSwxMC4yMDY1NDQ2IEM5LjIxODUxNzQzLDEwLjIwNjU0NDYgMTAuMjA2NTQ0Niw5LjIxODUxNzQzIDEwLjIwNjU0NDYsNy45OTk3MjQxNSBDMTAuMjA2NTQ0Niw2Ljc4MDkzMDg2IDkuMjE4NTE3NDMsNS43OTI5MDM2OSA3Ljk5OTcyNDE1LDUuNzkyOTAzNjkgQzYuNzgwOTMwODYsNS43OTI5MDM2OSA1Ljc5MjkwMzY5LDYuNzgwOTMwODYgNS43OTI5MDM2OSw3Ljk5OTcyNDE1IEM1Ljc5MjkwMzY5LDkuMjE4NTE3NDMgNi43ODA5MzA4NiwxMC4yMDY1NDQ2IDcuOTk5NzI0MTUsMTAuMjA2NTQ0NiBaIiBpZD0i5b2i54q2Ij48L3BhdGg+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==',
                    onclick: function () {
                        // alert('111');
                    }
                },
                myTool3: {
                    show: false,
                    title: IntlFormatMessage('common.savegenericity'),
                    icon: 'image://data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+5L+d5a2YPC90aXRsZT4KICAgIDxnIGlkPSLpobXpnaItMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IuWNleaMh+agh+mihOa1i+WxleekuiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTYyNy4wMDAwMDAsIC0xNzQuMDAwMDAwKSIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGcgaWQ9Iue8lue7hC0zNCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTMxLjAwMDAwMCwgMTc0LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9IuS/neWtmCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoOTYuMDAwMDAwLCAwLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgIDxyZWN0IGlkPSLnn6nlvaIiIG9wYWNpdHk9IjAiIHg9IjAiIHk9IjAiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PC9yZWN0PgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMS43MzMzMzMzLDAgTDE2LDQuMjY2NjY2NjcgTDE2LDE2IEwwLDE2IEwwLDAgTDExLjczMzMzMzMsMCBaIE0zLjUsMSBMMSwxIEwxLDE1IEwxNSwxNSBMMTUsNC42ODEgTDExLjUsMS4xODIgTDExLjUsNS41IEwzLjUsNS41IEwzLjUsMSBaIE04LDYuNSBDOS42NTY4NTQyNSw2LjUgMTEsNy44NDMxNDU3NSAxMSw5LjUgQzExLDExLjE1Njg1NDIgOS42NTY4NTQyNSwxMi41IDgsMTIuNSBDNi4zNDMxNDU3NSwxMi41IDUsMTEuMTU2ODU0MiA1LDkuNSBDNSw3Ljg0MzE0NTc1IDYuMzQzMTQ1NzUsNi41IDgsNi41IFogTTgsNy41IEM2Ljg5NTQzMDUsNy41IDYsOC4zOTU0MzA1IDYsOS41IEM2LDEwLjYwNDU2OTUgNi44OTU0MzA1LDExLjUgOCwxMS41IEM5LjEwNDU2OTUsMTEuNSAxMCwxMC42MDQ1Njk1IDEwLDkuNSBDMTAsOC4zOTU0MzA1IDkuMTA0NTY5NSw3LjUgOCw3LjUgWiBNMTAuNSwxLjUgTDQuNSwxLjUgTDQuNSw0LjUgTDEwLjUsNC41IEwxMC41LDEuNSBaIiBpZD0i5b2i54q257uT5ZCIIiBmaWxsPSIjMDAwMDAwIiBvcGFjaXR5PSIwLjQ0OTk5OTk4OCI+PC9wYXRoPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=',
                    onclick: function () {
                        // alert('111');
                    }
                },
                dataView: {
                    show: true,
                    readOnly: true,
                    title: IntlFormatMessage('common.dataview'),
                    lang: [IntlFormatMessage('common.dataview'), IntlFormatMessage('common.close'), IntlFormatMessage('task.common.refresh')],
                    optionToContent: function (opt) {
                        const series = opt.series; //折线图数据
                        let result = '<div style="border: 1px solid #666;height:100%;overflow: scroll;user-select: text;">';
                        series.forEach(seris => {
                            if (seris.data?.length) {
                                let tdHeads = `<table><tbody><td style="padding: 8px 16px;">${IntlFormatMessage('laboratory.anomaly.timeBtn')}</td>`; //表头
                                tdHeads += `<td style="padding: 8px 16px;">${seris.name}</td>`;
                                result += `<tr>${tdHeads}</tr>`;
                                let tdBodys = ''; //数据
                                seris.data.forEach(item => {
                                    tdBodys += `<tr><td style="padding: 8px 16px;">${item[0]}</td><td style="padding: 8px 16px;">${item[1]}</td></tr>`;
                                });
                                result += `${tdBodys}</tbody></table><br/><br/>------------------------------------------------<br/><br/>`;
                            }
                        });
                        return result+'</div>';
                    }
                },
                // magicType: {type: ['line', 'bar']},
                restore: {
                    show: true,
                    title: IntlFormatMessage('common.reset'),
                },
                saveAsImage: {
                    show: true,
                    title: IntlFormatMessage('common.saveAsimage'),
                },
                myTool5: {
                    show: false,
                    title: IntlFormatMessage('laboratory.anomaly.genericityDelete'),
                    icon: 'image://data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+5Yig6ZmkPC90aXRsZT4KICAgIDxnIGlkPSLpobXpnaItMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IuWNleaMh+agh+mihOa1i+WxleekuiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTY3NS4wMDAwMDAsIC0xNzQuMDAwMDAwKSIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGcgaWQ9Iue8lue7hC0zNCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTMxLjAwMDAwMCwgMTc0LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9IuWIoOmZpCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTQ0LjAwMDAwMCwgMC4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICA8cmVjdCBpZD0i55+p5b2iIiBvcGFjaXR5PSIwIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiPjwvcmVjdD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTIuNDg3NSwxMy43OTY2MzczIEMxMi40ODc1LDE0LjM0NzQ3OCAxMi4wNSwxNC43OTU4MzY3IDExLjUxMywxNC43OTU4MzY3IEw0LjQ4NzUsMTQuNzk1ODM2NyBDMy45NDkzNjQ4OCwxNC43OTQ5OTAyIDMuNTEzMzI2LDE0LjM0ODEyODkgMy41MTI1LDEzLjc5NjYzNzMgTDMuNTEyNSwzLjE4OTc1MTggTDEyLjQ4NzUsMy4xODk3NTE4IEwxMi40ODc1LDEzLjc5NjYzNzMgTDEyLjQ4NzUsMTMuNzk2NjM3MyBaIE01LjQ2MjUsMS4zOTYzMTcwNSBDNS40NjI1LDEuMjgxMDI0ODIgNS41NSwxLjE5MTM1MzA4IDUuNjYyNSwxLjE5MTM1MzA4IEwxMC4zNSwxLjE5MTM1MzA4IEMxMC40NjI1LDEuMTkxMzUzMDggMTAuNTQ5NSwxLjI4MTAyNDgyIDEwLjU0OTUsMS4zOTYzMTcwNSBMMTAuNTQ5NSwxLjk5ODM5ODcyIEw1LjQ2MjUsMS45OTgzOTg3MiBMNS40NjI1LDEuMzk2MzE3MDUgWiBNMTUuNDEyNSwxLjk5ODM5ODcyIEwxMS43MTI1LDEuOTk4Mzk4NzIgTDExLjcxMjUsMS4zOTYzMTcwNSBDMTEuNzEyNSwwLjYyNzcwMjE2MiAxMS4xLDAgMTAuMzUsMCBMNS42NjI1LDAgQzQuOTEwNjk2NSwwLjAwMTY5MDg1NDI4IDQuMzAxNjQ5OSwwLjYyNTg1MzkwMSA0LjMsMS4zOTYzMTcwNSBMNC4zLDEuOTk4Mzk4NzIgTDAuNTg3NSwxLjk5ODM5ODcyIEMwLjI2MjUsMS45OTgzOTg3MiAwLDIuMjY3NDEzOTMgMCwyLjYwMDQ4MDM4IEMwLDIuOTMzNTQ2ODQgMC4yNjI1LDMuMjAyNTYyMDUgMC41ODc1LDMuMjAyNTYyMDUgTDIuMzM3NSwzLjIwMjU2MjA1IEwyLjMzNzUsMTMuNzk2NjM3MyBDMi4zMzc1LDE1LjAxMzUyMDkgMy4zMDAwODc3OSwxNiA0LjQ4NzUsMTYgTDExLjUxMjUsMTYgQzEyLjY5OTkxMjIsMTYgMTMuNjYyNSwxNS4wMTM1MjA5IDEzLjY2MjUsMTMuNzk2NjM3MyBMMTMuNjYyNSwzLjE4OTc1MTggTDE1LjQxMjUsMy4xODk3NTE4IEMxNS43Mzc1LDMuMTg5NzUxOCAxNiwyLjkyMDczNjU5IDE2LDIuNTg3NjcwMTQgQzE2LDIuMjU0NjAzNjggMTUuNzM3NSwxLjk5ODM5ODcyIDE1LjQxMjUsMS45OTgzOTg3MiBaIE04LDEyLjk4OTU5MTcgQzguMzI1LDEyLjk4OTU5MTcgOC41ODc1LDEyLjcyMDU3NjUgOC41ODc1LDEyLjM4NzUxIEw4LjU4NzUsNS45ODIzODU5MSBDOC41ODc1LDUuNjQ5MzE5NDYgOC4zMjU1LDUuMzgwMzA0MjQgOCw1LjM4MDMwNDI0IEM3LjY3NSw1LjM4MDMwNDI0IDcuNDEyNSw1LjY0OTMxOTQ2IDcuNDEyNSw1Ljk4MjM4NTkxIEw3LjQxMjUsMTIuMzg3NTEgQzcuNDEyNSwxMi43MjA1NzY1IDcuNjc1LDEyLjk4OTU5MTcgOCwxMi45ODk1OTE3IE01LjI2MjUsMTIuOTg5NTkxNyBDNS41ODc1LDEyLjk4OTU5MTcgNS44NSwxMi43MjA1NzY1IDUuODUsMTIuMzg3NTEgTDUuODUsNS45ODIzODU5MSBDNS44NSw1LjY0OTMxOTQ2IDUuNTg3NSw1LjM4MDMwNDI0IDUuMjYyNSw1LjM4MDMwNDI0IEM0LjkzNzUsNS4zODAzMDQyNCA0LjY3NSw1LjY0OTMxOTQ2IDQuNjc1LDUuOTgyMzg1OTEgTDQuNjc1LDEyLjM4NzUxIEM0LjY4NzUsMTIuNzIwNTc2NSA0Ljk1LDEyLjk4OTU5MTcgNS4yNjI1LDEyLjk4OTU5MTcgTTEwLjczNzUsMTIuOTg5NTkxNyBDMTEuMDYyNSwxMi45ODk1OTE3IDExLjMyNTUsMTIuNzIwNTc2NSAxMS4zMjU1LDEyLjM4NzUxIEwxMS4zMjU1LDUuOTgyMzg1OTEgQzExLjMyNTUsNS42NDkzMTk0NiAxMS4wNjMsNS4zODAzMDQyNCAxMC43Mzc1LDUuMzgwMzA0MjQgQzEwLjQxMyw1LjM4MDMwNDI0IDEwLjE1LDUuNjQ5MzE5NDYgMTAuMTUsNS45ODIzODU5MSBMMTAuMTUsMTIuMzg3NTEgQzEwLjE1LDEyLjcyMDU3NjUgMTAuNDEyNSwxMi45ODk1OTE3IDEwLjczNzUsMTIuOTg5NTkxNyIgaWQ9IuW9oueKtiIgZmlsbD0iIzAwMDAwMCIgb3BhY2l0eT0iMC40NDk5OTk5ODgiPjwvcGF0aD4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+',
                    onclick: function () {
                        // alert('111');
                    }
                },
            },
            // emphasis: {
            //     iconStyle: {
            //         color:'#fff',
            //         textBackgroundColor: 'rgba(0, 0, 0, 0.75)',
            //         textPadding:[6,8,6,8]
            //     }
            // }
            // left: 'left',
            // bottom: 'bottom',
        },
        xAxis: {
            type: 'time',
            axisLine: {
                show: true,
                color: "#AEB0B8",
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: ['#f6fcff'],
                    width: 16,
                }
            },
            splitNumber: 5,
            axisTick: {
                show: true,
                color: 'rgba(0,0,0,0.45)'
            },
            axisLabel: {
                show: true,
                showMinLabel: true,
                showMaxLabel: true,
                // rotate: 45,
                // interval:99,
                color: 'rgba(0,0,0,0.45)',
                fontFamily: 'Helvetica',
                formatter: function (val) {
                    return parseInt(val) ? moment(parseInt(val)).format(`YYYY-MM-DD HH:mm`) : "";
                }
            },
            axisPointer: {
                label: {
                    show: false,
                    formatter: function (params) {
                        return params.value
                            ? moment(params.value).format("YYYY-MM-DD HH:mm:ss")
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
                    return value;
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
            boundaryGap: ['10%', '10%']
        },
        series: [
            {
                animation: true,
                animationThreshold: 10000,
                name: IntlFormatMessage('common.rawdata'),
                type: 'line',
                color: '#0066FF',
                symbol: 'circle',
                symbolSize: 4,
                showSymbol: false,
                emphasis: {
                    scale: false,
                },
                // hoverAnimation: false,
                lineStyle: {
                    width: 1
                },
                data: [],
                markLine: {
                    data: [],
                    label: {
                        position: 'middle',
                        distance: 5,
                        formatter: (item = {}) => {
                            const {data = {}} = item;
                            const {yAxis = 0, minValue = 0, name = ''} = data;
                            return `${name}：${(Number(yAxis) + Number(minValue))}`;
                        }
                    },
                    silent: true
                },
                // add 异常点标注
                markPoint: {
                    symbol: 'circle',
                    symbolSize: 10,
                    label: {
                        show: false,
                        position: 'top',
                        color: '#fff',
                        align: 'center',
                        backgroundColor: 'rgba(255, 0, 0,0.7)',
                        lineHeight: 20,
                        padding: 5,
                        borderRadius: 3,
                        formatter: param => {
                            const {value = {}, data = {}} = param;
                            const {minValue = 0, coord = []} = data;
                            // console.log(param);
                            return [
                                `{con|${IntlFormatMessage('laboratory.anomaly.anomaly')}：}`,
                                `{con|${moment(Number(coord[0]) || '').format('YYYY/MM/DD HH:mm:ss')}}`,
                                `{con|${IntlFormatMessage('common.truevalue')}: ${(coord[1] || coord[1] === 0) ? (coord[1] + minValue).toFixed(2) : ''}}`,
                            ].join('\n');
                        },
                        rich: {
                            con: {
                                align: 'left',
                                color: '#fff',
                            },
                            btn: {
                                color: '#fff',
                                // borderColor: '#e1e1e1',
                                // borderWidth: 1,
                                padding: [4, 8, 4, 8],
                                shadowColor: '#c4c4c4',
                                shadowBlur: 5,
                                shadowOffsetX: 0,
                                shadowOffsetY: 3,
                            }
                        },
                    },
                    itemStyle: {
                        color: '#E00003',
                    },
                    emphasis: {
                        label: {
                            show: true,
                        },
                    },
                    data: []
                },
            },
            {
                animation: true,
                name: IntlFormatMessage('datasource.create.forecastValue'),
                type: 'line',
                color: '#3FBF00',
                symbol: 'circle',
                symbolSize: 4,
                showSymbol: false,
                // hoverAnimation: false,
                emphasis: {
                    scale: false,
                },
                lineStyle: {
                    width: 2,
                    type: 'dashed',
                },
                // symbol: 'none',
                data: [],
                markLine: {
                    data: [],
                    lineStyle: {
                        width: 1,
                        color: '#3FBF00',
                    },
                    label: {
                        show: false,
                    },
                    silent: true, // 鼠标悬停事件, true悬停不会出现实线
                    symbol: 'none', // 去掉箭头
                },
                sampling: sampling,
            },
            {
                animation: true,
                name: IntlFormatMessage('common.lowerboundary'),
                nameEn: 'down',
                type: 'line',
                color: '#17c9b9',
                showSymbol: false,
                stack: 'Total',
                lineStyle: {
                    width: 1,
                    type: 'solid',
                    opacity: 0,
                },
                data: [],
                sampling: function (frame) {
                    return frame[0];
                },
                // sampling: sampling
            },
            {
                animation: true,
                name: IntlFormatMessage('common.upperboundary'),
                nameEn: 'up',
                type: 'line',
                color: '#17c9b9',
                stack: 'Total',
                showSymbol: false,
                lineStyle: {
                    width: 1,
                    type: 'solid',
                    opacity: 0,
                },
                data: [],
                areaStyle: {
                    color: '#E0ECFF',
                },
                emphasis: {
                    scale: false,
                    areaStyle: {
                        color: '#E0ECFF'
                    }
                },
                sampling: function (frame) {
                    return frame[0];
                },
                // sampling: sampling
            },
            {
                animation: true,
                name: IntlFormatMessage('laboratory.anomaly.confidenceIntervalForecast'),
                type: 'line',
                color: '#E8F7E0',
                showSymbol: false,
                lineStyle: {
                    width: 0.1,
                    type: 'solid',
                    opacity: 0,
                },
                data: [],
                areaStyle: {
                    color: '#E8F7E0'
                },
                emphasis: {
                    scale: false,
                    areaStyle: {
                        color: '#E8F7E0'
                    }
                },
                sampling: sampling
            },
            {
                animation: true,
                name: IntlFormatMessage('laboratory.anomaly.confidenceIntervalForecast'),
                type: 'line',
                color: '#E8F7E0',
                showSymbol: false,
                lineStyle: {
                    width: 0.1,
                    type: 'solid',
                    opacity: 0,
                },
                emphasis: {
                    scale: false,
                },
                data: [],
                areaStyle: {
                    color: '#fff',
                    opacity: 1
                },
                sampling: sampling
            },
            {
                animation: true,
                name: IntlFormatMessage('common.fittedvalue'),
                type: 'line',
                color: '#FA8C16',
                data: [],
                emphasis: {
                    scale: false,
                },
                lineStyle: {
                    width: 1,
                    type: 'solid'
                },
                smooth: 0.6,
                symbolSize: 0,
                sampling: sampling
            },
        ]
    };
};

export default ChartOption;