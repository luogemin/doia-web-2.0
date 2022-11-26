import React, {useDebugValue, useEffect} from 'react';
import {
    Tree, Table, Tooltip, Spin, Empty,
} from '@chaoswise/ui';
import moment from "moment";
import TrendLineCharts from "@/components/TrendLineCharts";
import styles from './index.less';
import {connect} from "@chaoswise/cw-mobx";
import {useFetchState} from "@/components/HooksState";
import {useParams} from "react-router";
import TooltipDiv from "@/components/TooltipDiv";
import {guid, IntlFormatMessage, IsInternationalization} from "@/utils/util";
import {error} from '@/utils/tip';
import IconTooltip from "@/components/IconTooltip";

const {TreeNode} = Tree;

const DetailBody = function (props) {
    const {
        getAnomalyCountInfoAsync, getPartitionFieldValuesAsync,
        setLogModalVisible, setLogModalLineData, setModelTitle,
        singleCalculateAsync, setUnnormalList
    } = props;
    const {id, genericId} = useParams();

    const [checkedKeys, setCheckedKeys] = useFetchState([]);
    const [leftTree, setLeftTree] = useFetchState([]);
    const [anomalyCountInfo, setAnomalyCountInfo] = useFetchState([]);
    const [currentPageInfo, setCurrentPageInfo] = useFetchState({
        pageNum: 1, pageSize: 10, totalSize: 0
    });
    const [spinning, setSpinning] = useFetchState(false);

    const columns = [
        {
            title: IntlFormatMessage('laboratory.anomaly.number'),
            dataIndex: 'key',
            key: 'key',
            width: '15%',
            render: (text, record, index) => {
                return (index + 1)
            }
        },
        {
            title: IntlFormatMessage('laboratory.anomaly.groupingFieldFilter'),
            dataIndex: 'partitionValues',
            key: 'partitionValues',
            width: '30%',
            render: (text, record, index) => {
                if (!!text) {
                    const box = document.getElementsByClassName('ant-table-tbody')[0];
                    const widthBox = box.clientWidth * 0.2;
                    const tooltipResult = Object.entries(text).map(res => {
                        return `${res[0]} = ${res[1] || '-'}`

                    })
                    return <Tooltip title={tooltipResult.join('\n')}>
                        {
                            Object.entries(text).map((res, index) => {
                                return <div className="only-show-one-line" key={index} style={{maxWidth: widthBox}}>
                                    {`${res[0]} = ${res[1] || '-'}`}
                                </div>
                            })
                        }
                    </Tooltip>
                } else {
                    return IntlFormatMessage('laboratory.detail.all')
                }
            }
        },
        {
            title: IntlFormatMessage('laboratory.anomaly.trend'),
            dataIndex: 'anomalyTrend',
            key: 'anomalyTrend',
            width: '40%',
            render: (text, record, index) => {
                const {lineList, isAnomalyList} = (text || []).reduce((prev, cent) => {
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
                if (lineList.length) {
                    return <TrendLineCharts
                        data={[
                            {
                                name: IntlFormatMessage('laboratory.anomaly.logs'),
                                symbolSize: lineList.length === 1 ? 5 : 0,
                                emphasis: {scale: false,},
                                tooltip: {show: false},
                                // markPoint: {
                                //     symbol: 'circle',
                                //     symbolSize: 5,
                                //     itemStyle: {
                                //         color: '#7262FD',
                                //     },
                                //     emphasis: {
                                //         label: {
                                //             show: false,
                                //         },
                                //     },
                                //     data: isAnomalyList.filter(i => i.anomalyType === 1)
                                // },
                                data: lineList
                            },
                            // {
                            //     name: '时段新增异常',
                            //     symbolSize: 1,
                            //     markPoint: {
                            //         symbol: 'circle',
                            //         symbolSize: 5,
                            //         itemStyle: {
                            //             color: '#F6903D',
                            //         },
                            //         emphasis: {
                            //             label: {
                            //                 show: false,
                            //             },
                            //         },
                            //         data: isAnomalyList.filter(i => i.anomalyType === 2)
                            //     },
                            //     data: []
                            // },
                            // {
                            //     name: '时段突增异常',
                            //     symbolSize: 1,
                            //     markPoint: {
                            //         symbol: 'circle',
                            //         symbolSize: 5,
                            //         itemStyle: {
                            //             color: '#FF4D4F',
                            //         },
                            //         emphasis: {
                            //             label: {
                            //                 show: false,
                            //             },
                            //         },
                            //         data: isAnomalyList.filter(i => i.anomalyType === 3)
                            //     },
                            //     data: []
                            // },
                            // {
                            //     name: '时段突降异常',
                            //     symbolSize: 1,
                            //     markPoint: {
                            //         symbol: 'circle',
                            //         symbolSize: 5,
                            //         itemStyle: {
                            //             color: '#9661BC',
                            //         },
                            //         emphasis: {
                            //             label: {
                            //                 show: false,
                            //             },
                            //         },
                            //         data: isAnomalyList.filter(i => i.anomalyType === 4)
                            //     },
                            //     data: []
                            // },
                            // {
                            //     name: '日周同比异常',
                            //     symbolSize: 1,
                            //     markPoint: {
                            //         symbol: 'circle',
                            //         symbolSize: 5,
                            //         itemStyle: {
                            //             color: '#6657FF',
                            //         },
                            //         emphasis: {
                            //             label: {
                            //                 show: false,
                            //             },
                            //         },
                            //         data: isAnomalyList.filter(i => i.anomalyType === 5)
                            //     },
                            //     data: []
                            // },
                        ]}
                    />
                } else {
                    return null;
                }
            }
        },
        {
            title: IntlFormatMessage('laboratory.anomaly.anomalies'),
            dataIndex: 'anomalyCount',
            key: 'anomalyCount',
            width: IsInternationalization()? '28%':'25%',
            render: (text, record) => {
                const {status = 'fail', message = ''} = record;
                return (!!status && status === 'error') ?
                    <TooltipDiv className="flex-box" onClick={() => {
                        singleCalculateAsyncFun(record)
                    }}>
                        {IntlFormatMessage('laboratory.anomaly.failedTraining')}
                        {
                            !!message ?
                                <IconTooltip
                                    type={'question-circle'}
                                    style={{
                                        marginLeft: '8px',
                                        fontSize: 14,
                                        color: '#ec5b56'
                                    }}
                                    title={message}
                                />
                                : null
                        }
                    </TooltipDiv>
                    :
                    <TooltipDiv onClick={() => {
                        setModelTitle(record.partitionValues)
                        setLogModalLineData(record)
                        setLogModalVisible(true)
                    }}>
                        {text}
                        {
                            !!message ?
                                <IconTooltip
                                    type={'exclamation-circle'}
                                    style={{
                                        marginLeft: '8px',
                                        fontSize: 14,
                                        color: '#efaf41',
                                    }}
                                    title={message}
                                />
                                : null
                        }
                    </TooltipDiv>
            }
        }
    ];
    //重新训练
    const singleCalculateAsyncFun = (record) => {
        const {partitionValues = {}} = record
        const filterArr = Object.entries(partitionValues).map((item, index) => {
            return {
                key: item[0],
                value: [item[1]]
            }
        })
        singleCalculateAsync({
            taskId: id,
            genericId: genericId,
            filterList: filterArr
        }, {
            cb: (info) => {
                const {content = []} = info;
                if (content.length) {
                    const {message} = content[0];
                    message && error(message);
                }
            }
        })
    }
    const getPartitionFieldValuesFun = () => {
        //左侧树状图
        getPartitionFieldValuesAsync({taskId: id, genericId: genericId}, {
            cb: (info) => {
                setLeftTree(prev => {
                    if (!!info && !!Object.keys(info).length) {
                        return Object.entries(info).map(item => {
                            return {
                                title: item[0],
                                key: item[0],
                                children: item[1].map(i => {
                                    return {
                                        title: i || '-',
                                        key: `${item[0]}chi&$ld${i}`,
                                    }
                                })
                            }
                        })
                    }
                    return []
                })

                const leftAllSelect = (!!info && !!Object.keys(info).length) ?
                    Object.entries(info).map(item => {
                        return {
                            key: item[0],
                            value: item[1]
                        }
                    }) : []
                setCheckedKeys(leftAllSelect)
                getAnomalyCountInfoFun(currentPageInfo, leftAllSelect)
            }
        });
    };

    const getAnomalyCountInfoFun = (pageInfo = {pageNum: 1, pageSize: 10}, leftAllSelect) => {
        setSpinning(true)
        getAnomalyCountInfoAsync({
            pageNum: pageInfo.pageNum,
            pageSize: pageInfo.pageSize,
            query: {
                taskId: id,
                genericId: genericId,
                filterList: !!leftAllSelect ? leftAllSelect : checkedKeys
            }
        }, {
            cb: (info) => {
                if (!info) {
                    setAnomalyCountInfo([])
                    setCurrentPageInfo({
                        pageNum: 1,
                        pageSize: 10,
                        totalPages: 0,
                        totalSize: 0,
                    })
                } else {
                    setAnomalyCountInfo(info.content)
                    setCurrentPageInfo({
                        pageNum: info.pageNum,
                        pageSize: info.pageSize,
                        totalPages: info.totalPages,
                        totalSize: info.totalSize,
                    })
                }
                setSpinning(false)
            },
            err: () => {
                setSpinning(false)
                setCurrentPageInfo({
                    pageNum: 1,
                    pageSize: 10,
                    totalPages: 0,
                    totalSize: 0,
                })
            }
        })
    }

    useEffect(() => {
        getPartitionFieldValuesFun()
    }, [])

    // useEffect(() => {
    //     getAnomalyCountInfoFun()
    // }, [checkedKeys]);

    const onCheck = (checkedKeys, e) => {
        const {halfCheckedKeys = [], checkedNodes = []} = e;
        const selectedNode = checkedNodes.filter(i => !!i.props.children);//获取父节点的所有数据
        const result = selectedNode.map(item => {
            return {
                key: item.key,
                value: item.props.children.map(node => {
                    return node.props.title === '-' ? null : node.props.title;//.key.split('chi&$ld')[1]
                })
            }
        })
        const selectHalf = halfCheckedKeys.map(item => {
            return {
                key: item,
                value: checkedKeys.map(node => {
                    let result = '';
                    const parent = leftTree.filter(i => i.key === item)[0];
                    parent.children.forEach(child => {
                        if (child.key === node) {
                            result = child.title === '-' ? null : child.title;//node.split('chi&$ld')[1];
                        }
                    })
                    return result;
                }),
            }
        })

        if (selectHalf.length === 1 || (!selectHalf.length && result.length === 1)) {
            const allReady = !!selectHalf[0] ? selectHalf[0].key : result[0].key
            const otherKey = leftTree.filter(i => i.key !== allReady);
            for (let i = 0; i < otherKey.length; i++) {
                selectHalf.push({
                    key: otherKey[i].key,
                    value: otherKey[i].children.map(item => item.title === '-' ? null : item.title),
                })
            }
        }
        const allResult = result.concat(selectHalf)
        setCheckedKeys(allResult);
        getAnomalyCountInfoFun(currentPageInfo, allResult)
    };

    const getTreeNodes = (data) => {
        return data.map(item => {
            return <TreeNode title={item.title} key={item.key}>
                {
                    item.children ? getTreeNodes(item.children) : ''
                }
            </TreeNode>
        })
    }

    //表格翻页
    const changePage = (current) => {
        getAnomalyCountInfoFun(Object.assign({}, currentPageInfo, {
            pageNum: current,
        }))
    }
    //表格点击切换每页多少条
    const showSizeChange = (current, pageSize) => {
        getAnomalyCountInfoFun(Object.assign({}, currentPageInfo, {
            pageNum: current,
            pageSize,
        }))
    }
    return <div className={styles['detail-body-wrap']}>
        <div className='checks-wrap'>
            {
                !!leftTree.length ?
                    <Tree
                        checkable={true}
                        defaultCheckedKeys={leftTree.map(item => item.title)}
                        defaultExpandAll
                        onCheck={onCheck}
                    >
                        {
                            getTreeNodes(leftTree)
                        }
                    </Tree>
                    :
                    <Empty description={
                        <span>{IntlFormatMessage('laboratory.detail.nodatafound')}</span>
                    }/>
            }
        </div>
        <div className='table-wrap'>
            <Spin spinning={spinning}>
                <Table
                    dataSource={anomalyCountInfo}
                    columns={columns}
                    rowKey={row => guid()}
                    scroll={{y: 450}}
                    pagination={{
                        total: currentPageInfo.totalSize,
                        current: currentPageInfo.pageNum,
                        pageSize: currentPageInfo.pageSize,
                        onChange: changePage,
                        onShowSizeChange: showSizeChange,
                    }}
                />
            </Spin>
        </div>

    </div>
}

export default connect(({laboratoryStore, genericsStore, store}) => {
    return {
        singleCalculateAsync: laboratoryStore.singleCalculateAsync,
        getAnomalyCountInfoAsync: laboratoryStore.getAnomalyCountInfoAsync,
        getPartitionFieldValuesAsync: laboratoryStore.getPartitionFieldValuesAsync,
    };
})(DetailBody);


