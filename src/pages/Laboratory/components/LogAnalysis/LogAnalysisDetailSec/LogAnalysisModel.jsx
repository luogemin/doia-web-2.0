import React, {Fragment, useEffect, useRef,} from 'react';
import {
    Table, Select, Icon, Modal, Form, Pagination, EchartsLine, Button, Empty, Tooltip,
    Checkbox, Input, message, Spin,
} from '@chaoswise/ui';
import TooltipDiv from "@/components/TooltipDiv";
import {connect, toJS} from "@chaoswise/cw-mobx";
import {useParams} from 'react-router-dom';
import {error, success} from "@/utils/tip";
import styles from '@/pages/Laboratory/components/Detail/index.less';
import stylesSelf from './index.less';
import moment from 'moment';
import {useFetchState} from "@/components/HooksState";
import {guid, IntlFormatMessage, IsInternationalization} from "@/utils/util";
import LineChart from "@/components/LineCharts";
import Charts from "@/components/Charts";

const formLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 15}
};
const {confirm} = Modal;
const {Option} = Select;
const {Group} = Checkbox;
const options = [
    {label: IntlFormatMessage('laboratory.detail.synchronize'), value: 'link'},
    {label: IntlFormatMessage('laboratory.detail.showparameter'), value: 'parameter'},
];


function LogAnalysisModel(props) {

    const {
        logModalVisible, setLogModalVisible, patternLogs, patternTrends, records,
        logAnalysisList = {},
    } = props;

    const {id, genericId} = useParams();
    const echartsref = useRef(null);

    const [page, setPage] = useFetchState({pageNum: 1, pageSize: 10, totalSize: 1,});
    const [spinningCharts, setSpinningCharts] = useFetchState(true);
    const [spinningTable, setSpinningTable] = useFetchState(false);
    const [patternLogsList, setPatternLogsList] = useFetchState([]);
    const [lineChartList, setLineChartList] = useFetchState([]);
    const {patternId = '', pattern = ''} = records
    const patternTrendsFun = () => {
        //指定模式日志趋势图
        patternTrends({
            taskId: id,
            tuningBenchGenericId: genericId,
            patternId: patternId
        }, {
            cb: (info) => {
                const chartList = (info || []).map(item => {
                    return [Number(item.pointTime), Number(item.value)]
                })
                setLineChartList(chartList)
                setSpinningCharts(false)
            }
        })
    }
    //指定模式日志
    const patternLogsFun = (pageInfo) => {
        setSpinningTable(true)
        const {pageNum = 1, pageSize = 10,} = pageInfo;
        patternLogs({
            pageNum: pageNum,
            pageSize: pageSize,
            query: {
                taskId: id,
                tuningBenchGenericId: genericId,
                patternId: patternId,
            }
        }, {
            cb: (info) => {
                setPatternLogsList(info.content)
                setPage({pageNum: info.pageNum, pageSize: info.pageSize, totalSize: info.totalSize});
                setSpinningTable(false)
            }
        })
    }
    useEffect(() => {
        patternTrendsFun();
        patternLogsFun(page);
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
                    title={text}
                    onClick={() => {
                        setPatternLogsList(prev => {
                            return prev.map((i, cIndex) => {
                                prev[index]['showAll'] = !showAll;
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
            title: IntlFormatMessage('datasource.create.originalLogs'),
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
    /**
     * 页数改变
     * @param current
     */
    const changePage = (current) => {
        const result = Object.assign({}, page, {
            pageNum: current
        })
        setPage(result)
        patternLogsFun(result)
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
        patternLogsFun(result)
    }

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
                    <div style={{width: '40%'}} className="only-show-one-line">
                        <Tooltip title={`${IntlFormatMessage('laboratory.anomaly.pattern')}-${pattern}`}
                                 placement={'topLeft'} style={{height: "500px"}}>
                            {`${IntlFormatMessage('laboratory.anomaly.pattern')}-${pattern}`}
                        </Tooltip>
                    </div>
                </div>
            }
        >
            <div className={stylesSelf['log-analysis-model']}>
                <Spin spinning={spinningCharts}>

                    {
                        !!lineChartList && !!lineChartList.length ?
                            <Charts
                                ref={echartsref}
                                data={{
                                    seriesData: lineChartList,
                                }}
                                ifShowLegend={false}
                            />
                            :
                            <Empty description={IntlFormatMessage('task.detail.nodatafound')}/>
                    }
                </Spin>
            </div>
            <Spin spinning={spinningTable}>
                <Table
                    columns={columns}
                    dataSource={patternLogsList}
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
        </Modal>
    );
}

export default connect(({laboratoryStore, genericsStore, TopoStore,}) => {
    return {
        logAnalysisList: laboratoryStore.logAnalysisList,
        patternLogs: laboratoryStore.patternLogs,
        patternTrends: laboratoryStore.patternTrends,
    };
})(Form.create()(LogAnalysisModel));
