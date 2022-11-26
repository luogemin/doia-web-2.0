import React, {Fragment, useEffect, useLayoutEffect, useMemo, useRef,} from 'react';
import {
    Table, Tabs, Select, Icon, Modal, Form, Pagination, EchartsLine, Row, Col, Tooltip,
    Checkbox, Input, Button, Spin, Radio, Empty
} from '@chaoswise/ui';
import TooltipDiv from "@/components/TooltipDiv";
import {connect, toJS} from "@chaoswise/cw-mobx";
import {useParams} from 'react-router-dom';
import {error, success} from "@/utils/tip";
import stylesSelf from './index.less';
import styles from './LogAnalysisModel.less'
import moment from 'moment';
import {useFetchState} from "@/components/HooksState";
import {guid, IntlFormatMessage, IsInternationalization} from "@/utils/util";
import LineChart from "@/components/LineCharts";
import PieCharts from '../PieCharts'
import BarCharts from '../BarCharts'

const {TabPane} = Tabs
const ButtonGroup = Button.Group
const formLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 15}
};

function LogAnalysisModel(props) {
    const {
        logModalVisible, setLogModalVisible, patternLogs, patternTrends, records,
        logAnalysisList = {}, anmalyOrginLogAsync, anmalyFieldsAnalyzAsync,
        logModalLineData = {}, modelTitle, originLogTrendDetailAsync
    } = props;
    const {id, genericId} = useParams();
    const echartsref = useRef(null);
    const {partitionValues = {}} = logModalLineData
    const [page, setPage] = useFetchState({pageNum: 1, pageSize: 10, totalSize: 1})
    const [lineChartLoading, setLineChartLoading] = useFetchState(false);
    const [tableLoading, setTableLoading] = useFetchState(true);
    const [patternLogsList, setPatternLogsList] = useFetchState([]);
    const [lineChartData, setLineChartData] = useFetchState([]);
    const [fieldAnalysisList, setFieldAnalysisList] = useFetchState([]); //放置分区字段
    const [lineSelectedStartTime, setLineSelectedStartTime] = useFetchState(null); //折线图上选中的开始时间
    useEffect(() => {
        return () => {
            localStorage.removeItem('tabsActiveKey')
        }
    }, [])

    //原始日志
    const patternLogsFun = (pageInfo = {}, startTime) => {
        const {pageNum = 1, pageSize = 10,} = pageInfo
        setTableLoading(true)
        //接口
        anmalyOrginLogAsync(
            {
                pageNum: pageNum,
                pageSize: pageSize,
                query: {
                    taskId: id,
                    genericId: genericId,
                    filterList: Object.entries(partitionValues).map(item => {
                        return {
                            key: item[0], value: [item[1]]
                        }
                    }),
                    startTime,
                }
            }, {
                cb: (info) => {
                    setPatternLogsList(info.content.map(item => {
                        return Object.assign({}, item, {showAll: false,})
                    }))
                    setPage({pageNum: info.pageNum, pageSize: info.pageSize, totalSize: info.totalSize});
                    setTableLoading(false)
                }
            })
    }
    //字段分析
    const fieldAnalysisFun = (startTime) => {
        //接口
        anmalyFieldsAnalyzAsync(
            {
                taskId: id,
                genericId: genericId,
                filterList: Object.entries(partitionValues).map(item => {
                    return {
                        key: item[0], value: [item[1]]
                    }
                }),
                startTime
            }, {
                cb: (info) => {
                    !!info &&
                    setFieldAnalysisList(prev => {
                        return info.map(item => {
                            return Object.assign({}, item, {
                                ipPieOrBar: 'pie'
                            })
                        })
                    })
                }
            }
        )
    }
    // 获取折线图
    const getlineCharts = () => {
        setLineChartLoading(true)
        originLogTrendDetailAsync({
            taskId: id,
            genericId: genericId,
            filterList: Object.entries(partitionValues).map(item => {
                return {
                    key: item[0],
                    value: [item[1]]
                }
            }),
        }, {
            cb: (info) => {
                console.log(info.data)
                const {lineList, isAnomalyList} = (!!info.data ? info.data : []).reduce((prev, cent) => {
                    return Object.assign({}, prev, {
                        lineList: prev.lineList.concat([[cent.log_time, cent.log_value]]),
                    }, cent.anomalyType !== 0 ? {
                        isAnomalyList: prev.isAnomalyList.concat({
                            anomalyType: cent.anomalyType,
                            symbolSize: 5,
                            coord: [cent.log_time, cent.log_value],
                        })
                    } : {})
                }, {
                    lineList: [],
                    isAnomalyList: [],
                })
                const result = [
                    {
                        name: IntlFormatMessage('laboratory.anomaly.logs'),
                        symbolSize: 1,
                        emphasis: {
                            lineStyle: {
                                width: 2
                            }
                        },
                        data: lineList
                    }
                ];
                if (isAnomalyList.filter(i => i.anomalyType === 1).length) {
                    result.push({
                        name: IntlFormatMessage('laboratory.anomaly.historicalNewTwo'),
                        type: 'scatter',
                        symbolSize: 0,
                        color: '#7262FD',
                        markPoint: {
                            symbol: 'circle',
                            symbolSize: 10,
                            label: {
                                show: false,
                                position: 'top',
                                color: '#fff',
                                align: 'center',
                                backgroundColor: 'rgba(255, 0, 0, 0.7)',
                                lineHeight: 20,
                                padding: 5,
                                borderRadius: 3,
                                formatter: param => {
                                    const {value = {}, data = {}} = param;
                                    const {minValue = 0, coord = []} = data;
                                    return [
                                        // `{con|异常检测点：}`,
                                        `{con|${moment(Number(coord[0]) || '').format('YYYY/MM/DD HH:mm:ss')}}`,
                                        `{con|${IntlFormatMessage('common.truevalue')}: ${(coord[1] || coord[1] === 0) ? (coord[1] + minValue).toFixed(2) : ''}}`,
                                        `{con|${IntlFormatMessage('laboratory.anomaly.historicalNewTootipOne')}}`,
                                        `{con|${IntlFormatMessage('laboratory.anomaly.historicalNewTootipTwo')}}`
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
                                color: '#7262FD',
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                },
                            },
                            data: isAnomalyList.filter(i => i.anomalyType === 1)
                        },
                        data: isAnomalyList.filter(i => i.anomalyType === 1).map(item => item.coord)
                    })
                }
                if (isAnomalyList.filter(i => i.anomalyType === 2).length) {
                    result.push({
                        name: IntlFormatMessage('laboratory.anomaly.periodNewTwo'),
                        type: 'scatter',
                        symbolSize: 0,
                        color: '#F6903D',
                        markPoint: {
                            symbol: 'circle',
                            symbolSize: 10,
                            label: {
                                show: false,
                                position: 'top',
                                color: '#fff',
                                align: 'center',
                                backgroundColor: 'rgba(255, 0, 0, 0.7)',
                                lineHeight: 20,
                                padding: 5,
                                borderRadius: 3,
                                formatter: param => {
                                    const {value = {}, data = {}} = param;
                                    const {minValue = 0, coord = []} = data;
                                    return [
                                        // `{con|异常检测点：}`,
                                        `{con|${moment(Number(coord[0]) || '').format('YYYY/MM/DD HH:mm:ss')}}`,
                                        `{con|${IntlFormatMessage('common.truevalue')}: ${(coord[1] || coord[1] === 0) ? (coord[1] + minValue).toFixed(2) : ''}}`,
                                        `{con|${IntlFormatMessage('laboratory.anomaly.periodNewTooptipOne')}}`,
                                        `{con|${IntlFormatMessage('laboratory.anomaly.periodNewTooptipTwo')}}`
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
                                color: '#F6903D',
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                },
                            },
                            data: isAnomalyList.filter(i => i.anomalyType === 2)
                        },
                        data: isAnomalyList.filter(i => i.anomalyType === 2).map(item => item.coord)
                    })
                }
                if (isAnomalyList.filter(i => i.anomalyType === 3).length) {
                    result.push({
                        name: IntlFormatMessage('laboratory.anomaly.periodBurstTwo'),
                        type: 'scatter',
                        symbolSize: 0,
                        color: '#FF4D4F',
                        markPoint: {
                            symbol: 'circle',
                            symbolSize: 10,
                            label: {
                                show: false,
                                position: 'top',
                                color: '#fff',
                                align: 'center',
                                backgroundColor: 'rgba(255, 0, 0, 0.7)',
                                lineHeight: 20,
                                padding: 5,
                                borderRadius: 3,
                                formatter: param => {
                                    const {value = {}, data = {}} = param;
                                    const {minValue = 0, coord = []} = data;
                                    return [
                                        // `{con|异常检测点：}`,
                                        `{con|${moment(Number(coord[0]) || '').format('YYYY/MM/DD HH:mm:ss')}}`,
                                        `{con|${IntlFormatMessage('common.truevalue')}: ${(coord[1] || coord[1] === 0) ? (coord[1] + minValue).toFixed(2) : ''}}`,
                                        `{con|${IntlFormatMessage('laboratory.anomaly.periodBurstTooptipOne')}}`,
                                        `{con|${IntlFormatMessage('laboratory.anomaly.periodBurstTooptipTwo')}}`
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
                                color: '#FF4D4F',
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                },
                            },
                            data: isAnomalyList.filter(i => i.anomalyType === 3)
                        },
                        data: isAnomalyList.filter(i => i.anomalyType === 3).map(item => item.coord)
                    })
                }
                if (isAnomalyList.filter(i => i.anomalyType === 4).length) {
                    result.push({
                        name: IntlFormatMessage('laboratory.anomaly.periodDropTwo'),
                        type: 'scatter',
                        symbolSize: 0,
                        color: '#9661BC',
                        markPoint: {
                            symbol: 'circle',
                            symbolSize: 10,
                            label: {
                                show: false,
                                position: 'top',
                                color: '#fff',
                                align: 'center',
                                backgroundColor: 'rgba(255, 0, 0, 0.7)',
                                lineHeight: 20,
                                padding: 5,
                                borderRadius: 3,
                                formatter: param => {
                                    const {value = {}, data = {}} = param;
                                    const {minValue = 0, coord = []} = data;
                                    return [
                                        // `{con|异常检测点：}`,
                                        `{con|${moment(Number(coord[0]) || '').format('YYYY/MM/DD HH:mm:ss')}}`,
                                        `{con|${IntlFormatMessage('common.truevalue')}: ${(coord[1] || coord[1] === 0) ? (coord[1] + minValue).toFixed(2) : ''}}`,
                                        `{con|${IntlFormatMessage('laboratory.anomaly.periodDropTooptipOne')}}`,
                                        `{con|${IntlFormatMessage('laboratory.anomaly.periodDropTooptipTwo')}}`
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
                                color: '#9661BC',
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                },
                            },
                            data: isAnomalyList.filter(i => i.anomalyType === 4)
                        },
                        data: isAnomalyList.filter(i => i.anomalyType === 4).map(item => item.coord)
                    })
                }
                if (isAnomalyList.filter(i => i.anomalyType === 5).length) {
                    result.push({
                        name: IntlFormatMessage('laboratory.anomaly.periodAnomaly'),
                        type: 'scatter',
                        symbolSize: 0,
                        color: '#6657FF',
                        markPoint: {
                            symbol: 'circle',
                            symbolSize: 10,
                            label: {
                                show: false,
                                position: 'top',
                                color: '#fff',
                                align: 'center',
                                backgroundColor: 'rgba(255, 0, 0, 0.7)',
                                lineHeight: 20,
                                padding: 5,
                                borderRadius: 3,
                                formatter: param => {
                                    const {value = {}, data = {}} = param;
                                    const {minValue = 0, coord = []} = data;
                                    return [
                                        // `{con|异常检测点：}`,
                                        `{con|${moment(Number(coord[0]) || '').format('YYYY/MM/DD HH:mm:ss')}}`,
                                        `{con|${IntlFormatMessage('common.truevalue')}: ${(coord[1] || coord[1] === 0) ? (coord[1] + minValue).toFixed(2) : ''}}`,
                                        `{con|${IntlFormatMessage('laboratory.anomaly.periodAnomalyTootip')}}`
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
                                color: '#9661BC',
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                },
                            },
                            data: isAnomalyList.filter(i => i.anomalyType === 5)
                        },
                        data: isAnomalyList.filter(i => i.anomalyType === 5).map(item => item.coord)
                    })
                }
                setLineChartData(result)
                setLineChartLoading(false)
            }
        })
    }
    useEffect(() => {
        patternLogsFun();
        // fieldAnalysisFun()
        getlineCharts()
    }, [])

    const columns = [
        {
            title: IntlFormatMessage('laboratory.anomaly.timeBtn'),
            dataIndex: 'timestamp',
            key: 'timestamp',
            width: '20%',
            render: (text, record, index) => {
                const {showAll = false} = record;
                return <TooltipDiv
                    title= {moment(Number(text)).format('YYYY-MM-DD HH:mm:ss')}
                    onClick={() => {
                        setPatternLogsList(prev => {
                            return prev.map((i, cIndex) => {
                                if (cIndex === index) {
                                    i['showAll'] = !showAll
                                }
                                return i;
                            })
                        });
                    }}
                >
                    <Icon type={showAll ? 'down' : 'right'} style={{
                        marginRight: 8,
                        fontSize: 12,
                    }}/>
                    {moment(Number(text)).format('YYYY-MM-DD HH:mm:ss')}
                </TooltipDiv>
            }
        },
        {
            title: IntlFormatMessage('laboratory.anomaly.logContent'),
            dataIndex: 'originLog',
            key: 'originLog',
            width: '80%',
            render: (text, record) => {
                const {showAll = false} = record;
                return <div className={showAll ? '' : "only-show-two-line only-show-two-line-ie"}>
                    <Tooltip title={text}>
                        {text}
                    </Tooltip>
                </div>
            }
        },
    ]
    //折线图上异常点
    const nodeClickFun = (timestamp) => {
        const tabsActiveKey = localStorage.getItem('tabsActiveKey') || '1';
        (!tabsActiveKey || tabsActiveKey === '1') ?
            patternLogsFun(page, timestamp) : fieldAnalysisFun(timestamp)
    }
    //页数
    const changePage = (current) => {
        const result = Object.assign({}, page, {
            pageNum: current
        })
        setPage(result)
        patternLogsFun(result, lineSelectedStartTime)
    }

    const titleInfo = useMemo(() => {
        return `${IntlFormatMessage('laboratory.anomaly.groupingField')}:${(Object.entries(modelTitle || [])).map(item => {
            if (item[1] === null) {
                item[1] = '-'
            }
            return `${item[0]} = ${item[1]}`
        }).join(';')}`
    }, [modelTitle])
    return (
        <Modal
            size='fullScreen'
            visible={logModalVisible}
            onCancel={() => {
                setLogModalVisible(false)
            }}
            footer={null}
            className={styles['labor-modal']}
            title={
                <div className={styles['labor-modal-pagi']}>
                    <Tooltip title={titleInfo}>
                        <div className={styles['modal-left']}>
                            {titleInfo}
                        </div>
                    </Tooltip>
                </div>
            }
        >
            <Spin spinning={lineChartLoading}>
                <div className={stylesSelf['log-anomaly-model']}>
                    {
                        !!lineChartData && !!lineChartData.length ?
                            <LineChart
                                LogAnalysisModel
                                title={IntlFormatMessage('laboratory.anomaly.logTrendBtn')}
                                data={lineChartData}
                                itemOnClick={(timestamp) => {
                                    setLineSelectedStartTime(timestamp);
                                    nodeClickFun(timestamp)
                                }}
                            />
                            :
                            <Empty description={IntlFormatMessage('task.detail.nodatafound')}/>
                    }
                </div>
                <div className="labor-modal-tab">
                    <Tabs onChange={(key) => {
                        localStorage.setItem('tabsActiveKey', key)
                        if (key === '1') {
                            patternLogsFun(page, lineSelectedStartTime);
                        } else if (key === '2') {
                            fieldAnalysisFun(lineSelectedStartTime)
                        }
                    }} tabBarExtraContent={<Button icon="sync" onClick={() => {
                        patternLogsFun();
                        fieldAnalysisFun()
                        getlineCharts()
                    }}/>}>
                        <TabPane tab={IntlFormatMessage('laboratory.anomaly.originalLogs')} key="1">
                            <Spin style={{height: '100%'}} spinning={tableLoading}>
                                <Table
                                    columns={columns}
                                    dataSource={patternLogsList}
                                    rowKey={record => guid()}
                                    pagination={{
                                        total: page.totalSize,
                                        current: page.pageNum,
                                        pageSize: page.pageSize,
                                        onChange: changePage,
                                    }}
                                />
                            </Spin>
                        </TabPane>
                        <TabPane tab={IntlFormatMessage('laboratory.anomaly.analysisField')} key="2">
                            <Row style={{marginBottom: 24}}>
                                {
                                    !!fieldAnalysisList && !!fieldAnalysisList.length ?
                                        fieldAnalysisList.map((item, index) => {
                                            const {ipPieOrBar = 'pie'} = item;
                                            const echartsData = (item.result || []).map(pie => {
                                                if (!!pie && !!pie.log_value) {
                                                    return {
                                                        value: pie.log_value,
                                                        name: pie?.log_type?.toString() || '-'
                                                    }
                                                }
                                            }).filter(Boolean);

                                            return <Col span={12} key={index}>
                                                <div className="field-analysis"
                                                     style={(index % 2) === 0 ? {marginRight: 16} : {}}>
                                                    <div className="field-analysis-title">
                                                        <div className="field-analysis-title-left">{item.field}</div>
                                                        <div className="field-analysis-title-right">
                                                            <Radio.Group value={ipPieOrBar} onChange={e => {
                                                                const {value} = e.target;
                                                                setFieldAnalysisList(prev => {
                                                                    return prev.map((field, fIndex) => {
                                                                        if (index === fIndex) {
                                                                            field['ipPieOrBar'] = value;
                                                                        }
                                                                        return field;
                                                                    })
                                                                })
                                                            }}>
                                                                <Tooltip placement="topLeft"
                                                                         title={IntlFormatMessage('datasource.create.pieChart')}>
                                                                    <Radio.Button value="pie" icon="pie-chart"> <Icon
                                                                        type="pie-chart"/></Radio.Button>
                                                                </Tooltip>
                                                                <Tooltip placement="topLeft"
                                                                         title={IntlFormatMessage('datasource.create.columnChart')}>
                                                                    <Radio.Button value="bar" icon="bar-chart"><Icon
                                                                        type="bar-chart"/></Radio.Button>
                                                                </Tooltip>

                                                            </Radio.Group>
                                                        </div>
                                                    </div>
                                                    <div className="field-analysis-content">
                                                        {
                                                            !!item.result && !!Object.keys(item.result).length ?
                                                                ((ipPieOrBar === 'pie') ?
                                                                    <PieCharts
                                                                        style={{height: 200}}
                                                                        title={''}
                                                                        data={echartsData}
                                                                    /> :
                                                                    <BarCharts
                                                                        style={{height: 200}}
                                                                        data={echartsData}
                                                                    />)
                                                                :
                                                                <Empty description={
                                                                    <span>{IntlFormatMessage('laboratory.detail.nodatafound')}</span>
                                                                }/>
                                                        }
                                                    </div>
                                                </div>
                                            </Col>
                                        })
                                        :
                                        <Empty description={IntlFormatMessage('task.detail.nodatafound')}/>
                                }
                            </Row>
                        </TabPane>
                    </Tabs>
                </div>
            </Spin>
        </Modal>
    );
}

export default connect(({laboratoryStore, genericsStore, TopoStore,}) => {
    return {
        anmalyFieldsAnalyzAsync: laboratoryStore.anmalyFieldsAnalyzAsync,
        originLogTrendDetailAsync: laboratoryStore.originLogTrendDetailAsync,
        anmalyOrginLogAsync: laboratoryStore.anmalyOrginLogAsync,
        logAnalysisList: laboratoryStore.logAnalysisList,
        patternLogs: laboratoryStore.patternLogs,
        patternTrends: laboratoryStore.patternTrends,
    };
})(Form.create()(LogAnalysisModel));
