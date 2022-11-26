import React, {Fragment, useEffect, useRef} from 'react';
import {
    Steps, Button, BasicLayout, Form, message, Icon, Spin, Tabs, Tooltip, Table, Progress,
} from '@chaoswise/ui';
import styles from './index.less';
import moment from 'moment';
import {connect, toJS} from "@chaoswise/cw-mobx";
import {useFetchState} from "@/components/HooksState";
import {useHistory, useLocation, useParams} from "react-router";
import {guid, IntlFormatMessage} from "@/utils/util";
import TooltipDiv from "@/components/TooltipDiv";
import LineChart from "@/components/LineCharts";
import LogAnalysisModel from "@/pages/Laboratory/components/LogAnalysis/LogAnalysisDetailSec/LogAnalysisModel";
import TrendLineCharts from "@/components/TrendLineCharts";
import Charts from "@/components/Charts";

const {TabPane} = Tabs;
const {Footer} = BasicLayout;
const {Step} = Steps;

const LogAnalysisDetailSec = (props) => {
    const {
        form,
        match = {},
        logOriginTren,
        patternResults,
        checkOriginLogs
    } = props;
    const {params = {}, path = '',} = match;
    const {id = '', genericId = ''} = params;
    const echartsref = useRef(null);

    // const {id, genericId} = useParams();
    const history = useHistory();
    const {pathname} = useLocation();

    const [activeTabs, setActiveTabs] = useFetchState('0');
    const [page, setPage] = useFetchState({pageNum: 1, pageSize: 10, totalSize: 1,});
    const [logModalVisible, setLogModalVisible] = useFetchState(false);
    const [patternDataList, setPatternDataList] = useFetchState([]);
    const [originLogsList, setOriginLogsList] = useFetchState([]);
    const [originTrenList, setOriginTrenList] = useFetchState([]);
    const [records, setRecords] = useFetchState('');
    const [lineSpinning, setLineSpinning] = useFetchState(false);
    const [spinning, setSpinning] = useFetchState(false);
    useEffect(() => {
        setLineSpinning(true);
        // //原始日志趋势图
        logOriginTren({
            id: id,
            genericId: genericId
        }, {
            cb: (info) => {
                setLineSpinning(false);
                setOriginTrenList(prev => info.map(item => {
                    return [Number(item.pointTime), Number(item.value)];
                }));
            }
        });
    }, []);

    //模式识别0  原始日志1
    const getTabsResultFun = (pageInfo) => {

        const {pageNum = 1, pageSize = 10,} = pageInfo;
        const param = {
            pageNum: pageNum,
            pageSize: pageSize,
            query: {taskId: id,}
        };
        if (activeTabs === '0') {
            setSpinning(true);
            //模式识别
            const params = Object.assign({}, param, {
                query: {taskId: id, tuningBenchGenericId: genericId}
            });
            patternResults(params, {
                cb: (info) => {
                    setPatternDataList(info.logPatternResults || info.content);
                    setPage({pageNum: info.pageNum, pageSize: info.pageSize, totalSize: info.totalSize});
                    setSpinning(false);
                }
            });
        } else {
            setSpinning(true);
            //原始日志
            checkOriginLogs(param, {
                cb: (info) => {
                    setOriginLogsList(info.content.map(item => {
                        return Object.assign({}, item, {showAll: false,});
                    }));
                    setPage({pageNum: info.pageNum, pageSize: info.pageSize, totalSize: info.totalSize});
                    setSpinning(false);
                }
            });
        }
    };
    useEffect(() => {
        getTabsResultFun(page);
    }, [activeTabs]);
    /*eslint-disable*/
    const firstColumns = () => {
        return [
            {
                title: IntlFormatMessage('laboratory.anomaly.number'),
                dataIndex: 'index',
                key: 'index',
                width: '10%',
                render: (text, record, index) => {
                    const {showAll = false} = record;
                    return <div
                        style={{cursor: 'pointer'}}
                        onClick={() => {
                            setPatternDataList(prev => {
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
                            color: '#1890FF',
                        }}/>
                        {index + 1}
                    </div>;
                }
            },
            {
                title: IntlFormatMessage('laboratory.anomaly.logs'),
                dataIndex: 'patternNum',
                key: 'patternNum',
                width: '15%',
                render: (text, record, index) => {
                    return <TooltipDiv onClick={() => {
                        setLogModalVisible(true);
                        setRecords(record);
                    }}>
                        {text}
                    </TooltipDiv>
                }
            },
            {
                title: IntlFormatMessage('laboratory.anomaly.patternPercentage'),
                dataIndex: 'percent',
                key: 'percent',
                width: '20%',
                render: (text, record, index) => {
                    return <Tooltip title={`${text}%`}>
                        <Progress percent={(text).toFixed(2)} status="active" style={{width: '80%'}}/>
                    </Tooltip>
                }
            },
            {
                title: IntlFormatMessage('laboratory.anomaly.trend'),
                dataIndex: 'trendPoints',
                key: 'trendPoints',
                width: 350,
                render: (text, record, index) => {
                    const result = (text || []).map(item => {
                        return [Number(item.pointTime), Number(item.value)]
                    })
                    if (result.length) {
                        return <TrendLineCharts
                            data={[
                                {
                                    name: IntlFormatMessage('laboratory.anomaly.logs'),
                                    symbolSize: 0,
                                    sampling: 'lttb',
                                    emphasis: {scale: false,},
                                    tooltip: {show: false},
                                    data: result
                                },
                            ]}
                        />
                    } else {
                        return null;
                    }
                }
            },
            {
                title: IntlFormatMessage('laboratory.anomaly.pattern'),
                dataIndex: 'pattern',
                key: 'pattern',
                width: '40%',
                render: (text, record) => {
                    const {showAll = false} = record;
                    return <div className={showAll ? "" : "only-show-two-line"}>
                        <Tooltip title={text}>
                            {text}
                        </Tooltip>
                    </div>
                }
            },
        ]
    }
    const secondColumns = () => {
        return [
            {
                title: IntlFormatMessage('laboratory.anomaly.timeBtn'),
                dataIndex: 'timestamp',
                key: 'timestamp',
                width: '20%',
                render: (text, record, index) => {
                    const {showAll = false} = record;
                    return <TooltipDiv
                        title={moment(Number(text)).format('YYYY-MM-DD HH:mm:ss')}
                        onClick={() => {
                            setOriginLogsList(prev => {
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
                    </TooltipDiv>;
                }
            },
            {
                title: IntlFormatMessage('laboratory.anomaly.logContent'),
                dataIndex: 'originLog',
                key: 'originLog',
                width: '80%',
                render: (text, record) => {
                    const {showAll = false} = record;
                    return <div className={showAll ? "" : "only-show-two-line"}>
                        <Tooltip title={text}>
                            {text}
                        </Tooltip>
                    </div>
                }
            },
        ]
    }
    /*eslint-disable*/
    /**
     * 页数改变
     * @param current
     */
    const changePage = (current) => {
        const result = Object.assign({}, page, {
            pageNum: current
        })
        setPage(result)
        getTabsResultFun(result)
    }
    /**
     * 每页条数改变
     * @param current
     * @param pageSize
     */
    const showSizeChange = (current, pageSize) => {
        const result = Object.assign({}, page, {
            pageNum: current,
            pageSize: pageSize
        })
        setPage(result)
        getTabsResultFun(result)
    }

    return (
        <div className={styles["log-analysis-detail-sec"]}>
            <div className="top-box">
                <Spin spinning={lineSpinning}>
                    <Charts
                        ref={echartsref}
                        title={IntlFormatMessage('laboratory.anomaly.logDistribution')}
                        data={{
                            seriesData: originTrenList
                        }}
                        ifShowLegend={false}
                    />
                </Spin>
            </div>
            <Tabs onChange={(key) => {
                setActiveTabs(key);
                setPage({pageNum: 1, pageSize: 10, totalSize: 10,});
            }}>

                <TabPane tab={IntlFormatMessage('laboratory.anomaly.patternRecognition')} key="0">
                    <Spin spinning={spinning}>
                        <Table
                            columns={firstColumns()}
                            dataSource={patternDataList}
                            lazyLoading={true}
                            rowKey={record => guid()}
                            pagination={{
                                total: page.totalSize,
                                current: page.pageNum,
                                pageSize: page.pageSize,
                                onChange: changePage,
                                onShowSizeChange: showSizeChange,
                            }}
                        />
                    </Spin>
                </TabPane>
                <TabPane tab={IntlFormatMessage('laboratory.anomaly.originalLogs')} key="1">
                    <Spin spinning={spinning}>
                        <Table
                            columns={secondColumns()}
                            dataSource={originLogsList}
                            lazyLoading={true}
                            rowKey={record => guid()}
                            pagination={{
                                total: page.totalSize,
                                current: page.pageNum,
                                pageSize: page.pageSize,
                                onChange: changePage,
                                onShowSizeChange: showSizeChange,
                            }}
                        />
                    </Spin>
                </TabPane>
            </Tabs>
            {
                logModalVisible &&
                <LogAnalysisModel
                    logModalVisible={logModalVisible}
                    setLogModalVisible={setLogModalVisible}
                    records={records}
                />
            }
        </div>
    );
};

export default connect(({laboratoryStore, genericsStore, store}) => {
    return {
        checkOriginLogs: laboratoryStore.checkOriginLogs,
        logOriginTren: laboratoryStore.logOriginTren,
        patternResults: laboratoryStore.patternResults
    };
})(Form.create()(LogAnalysisDetailSec));
