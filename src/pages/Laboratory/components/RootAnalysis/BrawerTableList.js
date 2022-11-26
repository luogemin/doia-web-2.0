import React, {Fragment, useEffect,} from 'react';
import {
    Table,
    Icon,
    Modal,
    Form,
    Spin
} from '@chaoswise/ui';
import EditAlgorithmAlert from "@/components/EditAlgorithmAlert";
import TooltipDiv from "@/components/TooltipDiv";
import {connect, toJS} from "@chaoswise/cw-mobx";
import {useParams} from 'react-router-dom';
import {error, success} from "@/utils/tip";
import styles from './index.less';
import moment from 'moment';
import SaveGeneric from '@/pages/Laboratory/components/Detail/SaveGeneric';
import * as echarts from 'echarts';
import ChartList from './ChartList';
import {useFetchState} from "@/components/HooksState";
import {guid, IntlFormatMessage, IsInternationalization} from "@/utils/util";

const IconFont = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_2616998_620g0mxg08d.js',
});

function ExpandTable(props) {

    const {
        expandTitle = '',
        taskId = '',
        form,
        index,
        queryTagsGroup, getSeriesList, getSeriesData, updateCurrent, taskUnsaveRawdata,
        dataSetInfo, item,
        editRow = {}, pageNum = 1, pageSize = 10, totalSize = 0,
    } = props;
    const {dataSourceId = '', filtersConfig = {}, startTime, endTime} = editRow;
    const {getFieldDecorator, setFieldsValue} = form;
    const {typeId = ''} = useParams();

    const [expand, setExpand] = useFetchState(index === 0);
    const [dataSource, setDataSource] = useFetchState([]);
    const [page, setPage] = useFetchState({
        pageNum: 1,
        pageSize: 10,
    });
    const [chartData, setChartData] = useFetchState([]);
    const [visible, setVisible] = useFetchState(false);
    const [currentPageInfo, setCurrentPageInfo] = useFetchState({
        pageNum: 1,
        pageSize: 1,
        totalSize: 0
    });
    const [spin, setSpin] = useFetchState(false);
    const [boxLoading, setBoxLoading] = useFetchState(false);
    const [modalMetric, setModalMetric] = useFetchState({}); //查看图显示的模型指标

    useEffect(() => {
        // 默认展开第一条
        if (index === 0) {
            getSeriesListInfo();
        }
    }, []);

    const columns = [
        {
            title: IntlFormatMessage('laboratory.detail.model'),
            dataIndex: 'model',
            key: 'model',
            width: '20%',
            ellipsis: true,
            render: (text, record) => {
                return text || '-';
            }
        },
        {
            title: IntlFormatMessage('laboratory.detail.metric'),
            dataIndex: 'metric',
            key: 'metric',
            width: '20%',
            render: (text, record) => {
                return text || '-';
            }
        },
        {
            title: IntlFormatMessage('laboratory.detail.object'),
            dataIndex: 'target',
            key: 'target',
            width: '20%',
            render: (text, record) => {
                return text || '-';
            }
        },
        /*eslint-disable*/
        {
            title: IntlFormatMessage('laboratory.detail.dimension'),
            dataIndex: 'tags',
            key: 'tags',
            width: '40%',
            render: (text, record) => {
                if (!!text) {
                    return <TooltipDiv title={text}>{text}</TooltipDiv>;
                }
                return '-';
            }
        },
        /*eslint-disable*/
        /*eslint-disable*/
        {
            title: IntlFormatMessage('common.operation'),
            dataIndex: 'operation',
            key: 'operation',
            width: IsInternationalization() ? 115 : 100,
            // fixed: 'right',
            render: (text, record) => {
                return (
                    <div>
                        <span className={'nameStyle'}
                              onClick={() => openDataViewModal(record)}>{IntlFormatMessage('laboratory.detail.view')}</span>
                    </div>
                );
            }
        },
        /*eslint-disable*/
    ];

    //展开列表
    const getSeriesListInfo = (pageInfo = {pageNum: 1, pageSize: 10}) => {
        setBoxLoading(true);
        queryTagsGroup({
            ...pageInfo,
            query: {
                dataSourceId,
                filtersConfig, startTime, endTime,
                ...item,
            }
        }, {
            cb: (info) => {
                const {content = [], ...rest} = info;
                setCurrentPageInfo({
                    ...rest
                })
                setDataSource(prev => content.map((item, index) => {
                    return {
                        ...item,
                        currentIndex: index + 1
                    }
                }));

                setBoxLoading(false);
            }
        });
    }

    const handleExpand = () => {
        setExpand(!expand);
        if (!expand) {
            getSeriesListInfo()
        }
    };

    const searchModelData = (pageInfo) => {
        getSeriesListInfo(pageInfo)
    };

    //打开查看的弹窗
    const openDataViewModal = (record) => {
        setModalMetric(record)
        setSpin(true)
        updateCurrent(record.currentIndex)
        setVisible(true);
        //抽屉，查看
        taskUnsaveRawdata({
            dataSourceId: dataSourceId,
            scene: "root_cause_analysis",
            startTime: new Date(toJS(dataSetInfo.time)[0]).getTime(),
            endTime: new Date(toJS(dataSetInfo.time)[1]).getTime(),
            metric: record.metric,
            model: record.model,
            tags: record.tags,
            target: record.target,
        }, {
            cb: (info) => {
                setChartData(info)
                setSpin(false)
            }
        })
    };

    //表格翻页
    const changePage = (current) => {
        setPage({
            ...page,
            pageNum: current
        })
        searchModelData({
            ...page,
            pageNum: current
        })
    }
    //表格点击切换每页多少条
    const showSizeChange = (current, pageSize) => {
        setPage({
            pageNum: current,
            pageSize,
        })
        searchModelData({
            pageNum: current,
            pageSize: pageSize
        })
    }

    return (
        <div className={styles['exp-table-wrapper']}>
            <div className='exp-header'>
                <div style={{cursor: 'pointer', display: 'flex', alignItems: 'center'}} onClick={handleExpand}>
                    <Icon type={expand ? 'down' : 'right'} className='header-icon-img'/>
                    <span className='exp-title'>{expandTitle}</span>
                </div>
            </div>
            <div style={expand ? {} : {display: 'none'}}>
                <Spin style={{height: '100%', width: '100%'}} spinning={boxLoading}>
                    <Table
                        columns={columns}
                        dataSource={dataSource}
                        rowKey={record => guid()}
                        scroll={{y: 200}}
                        pagination={{
                            simple: true,
                            total: currentPageInfo.totalSize,
                            current: currentPageInfo.pageNum,
                            pageSize: currentPageInfo.pageSize,
                            onChange: changePage,
                            onShowSizeChange: showSizeChange,
                        }}
                    />
                </Spin>
            </div>
            <Modal
                size='fullScreen'
                visible={visible}
                onCancel={() => {
                    setVisible(false);
                    setChartData([])
                }}
                onOk={() => {
                    setVisible(false);
                    setChartData([])
                }}
                footer={null}
                className={styles['modal-wrapper-labor']}
                title={
                    <div className={styles['labor-modal-pagi']}>
                        {IntlFormatMessage('laboratory.detail.model')}:{modalMetric.model}-{IntlFormatMessage('laboratory.detail.object')}:{modalMetric.target}
                    </div>
                }
            >
                <Spin spinning={spin} wrapperClassName='modal-spin-origan'>
                    <div className={styles['dataview-modal-main']}>
                        <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                width: '100%',
                                height: '100%',
                                padding: '8px 0',
                            }}>
                                <ChartList
                                    key={index}
                                    item={chartData}
                                    currentNum={1}
                                    ifRowDataSampling={true}
                                    modalMetric={modalMetric}
                                />
                            </div>
                        </div>
                    </div>
                </Spin>
            </Modal>
        </div>
    );
}

export default connect(({laboratoryStore, genericsStore}) => {
    return {
        dataSetInfo: laboratoryStore.dataSetInfo,
        taskUnsaveRawdata: laboratoryStore.taskUnsaveRawdata,
        getSeriesList: laboratoryStore.getSeriesList,
        queryTagsGroup: laboratoryStore.queryTagsGroup,
        getSeriesData: laboratoryStore.getSeriesData,
        updateCurrent: laboratoryStore.updateCurrent,
    };
})(Form.create()(ExpandTable));
