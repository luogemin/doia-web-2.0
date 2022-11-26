import React, {useEffect, useRef} from 'react';
import ToolTipDiv from '@/components/TooltipDiv';
import moment from 'moment';
import {
    Table,
    Checkbox,
    Icon,
    Spin,
    Modal,
    Pagination,
    Button,
} from '@chaoswise/ui';
import {connect, toJS} from "@chaoswise/cw-mobx";
import * as echarts from 'echarts';
import ChartList from './ChartList';
import styles from './index.less';
import {useFetchState} from "@/components/HooksState";
import {useHistory, useParams} from "react-router";
import {success} from "@/utils/tip";
import {ClearSomLocalStorage, IntlFormatMessage, IsInternationalization} from "@/utils/util";

let timer = null;

function DropTable(props) {
    const {
        activeKey,
        checked,
        expand,
        onCheckChange,
        onExpandChange,
        metricKey = '',
        targetModel = '',
        id,
        dataSource,
        getSeriesData,
        cancelSingleFavo,
        addSingleFavo,
        searchModelData,
        getTime,
        modifyTime,
        pageNum = 1,
        pageSize = 10,
        totalSize = 0,
        getTotalDetailList,
        seachInfo,
        editId,
        updateCurrent,
        currentPage,
        setBackTitle,
    } = props;
    const {push, go, location} = useHistory();
    const {pathname = ""} = location;
    const useParam = useParams();
    const chartRef = useRef(null);

    const [visible, setVisible] = useFetchState(false);
    const [modalInfo, setModalInfo] = useFetchState({
        name: '',
        time: '',
        metricTags: [],
        targetName: ''
    });
    const [total, setTotal] = useFetchState({
        pageNum: 1,
        pageSize: 1,
        total: 0
    });
    const [linkCheck, setLinkCheck] = useFetchState(true);
    const [chartData, setChartData] = useFetchState([]);
    const [inputValue, setInputValue] = useFetchState(0);
    const [currentView, setCurrentView] = useFetchState(1);
    const [spin, setSpin] = useFetchState(false);
    const [page, setPage] = useFetchState({
        pageNum: 1,
        pageSize: 10
    });
    const [simplePage, setSimplepage] = useFetchState({
        pageNum: 1,
        pageSize: 1,
    });
    const [boxLoading, setBoxLoading] = useFetchState(true);
    const IconFont = Icon.createFromIconfontCN({
        scriptUrl: '//at.alicdn.com/t/font_2616998_620g0mxg08d.js',
    });

    const columns = () => [
        {
            title: IntlFormatMessage('laboratory.detail.metric'),
            dataIndex: 'metricKey',
            key: 'metricKey',
            width: '35%',
            render: (text, record) => {
                return text || '-';
            }
        },
        /*eslint-disable*/
        {
            title: IntlFormatMessage('laboratory.detail.dimension'),
            dataIndex: 'metricTags',
            key: 'metricTags',
            width: '50%',
            render: (text, record) => {
                const {metricTags = {}} = record;
                if (Object.keys(metricTags).length) {
                    return <ToolTipDiv title={JSON.stringify(metricTags)}>{JSON.stringify(metricTags)}</ToolTipDiv>;
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
            width: IsInternationalization() ? '260px' : '100px',

            // fixed: 'right',
            render: (text, record) => {
                return (
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <span style={{color: '#1890FF', cursor: 'pointer', marginRight: 8}}
                              onClick={() => openDataViewModal(record)}>{IntlFormatMessage('laboratory.detail.view')}</span>
                        <span style={{
                            display: 'inline-block',
                            width: '1px',
                            height: '14px',
                            backgroundColor: '#E9E9E9',
                            marginRight: '8px'
                        }}/>
                        {
                            record.favorites === 0 ?
                                <span style={{color: '#1890FF', cursor: 'pointer'}} onClick={() => {
                                    addFavorite(record.id || '', props)
                                }}>{IntlFormatMessage('laboratory.detail.favorites')}
                                </span> : <span className={'nameStyle'} onClick={() => {
                                    cancelFavorite(record.id || '', props)
                                }}>{IntlFormatMessage('laboratory.detail.removefromvorites')}</span>
                        }
                    </div>
                );
            }
        },
        /*eslint-disable*/
    ];
    const onCheckedChange = (e) => {
        onCheckChange(e, id)
    }
    const handleExpand = () => {
        onExpandChange(!expand, id);
        if (!expand) {
            searchModelData(props);
        }
    };

    //取消收藏单个序列
    const cancelFavorite = (id, item) => {
        cancelSingleFavo({
            id,
        }, {
            cb: () => {
                success(IntlFormatMessage('laboratory.anomaly.removedFavorites'));
                searchModelData(item, page);

                // if(activeKey === 'all'){
                //     searchModelData(item, page);
                // }else{
                //     getTotalDetailList()
                // }
            }
        });
    };
    //收藏单个序列
    const addFavorite = (id, item) => {
        addSingleFavo({
            id,
        }, {
            cb: () => {
                success(<span>{`${IntlFormatMessage('laboratory.anomaly.addedFavorites')}，`}<span
                    style={{color: '#008DFF', cursor: 'pointer'}}
                    onClick={() => {
                        push(`/laboratory/${useParam.typeId}/${useParam.id}`);
                    }}
                >{IntlFormatMessage('laboratory.anomaly.view')}</span></span>, 5);
                searchModelData(item, page);
                //     if(activeKey === 'all'){
                //         searchModelData(item, page);
                //     }else{
                //         getTotalDetailList()
                //    }
            }
        });
    };

    const callBack = (data = {}) => {
        setSpin(false)
        const {seriesList = {}} = data
        const {content = [], totalSize = 0, pageNum = 1, pageSize = 1,} = seriesList;

        setTotal({
            pageNum,
            pageSize,
            totalSize
        });

        if (!content.length && pageNum > 1) {
            searchModelData(props, {
                pageNum: pageNum - 1,
                pageSize,
            }, callBack)
        }
        if (content[pageNum - 1]) {
            const item = content[pageNum - 1];
            setModalInfo({
                name: `${IntlFormatMessage('laboratory.detail.metric')}:${item.metricKey || '-'}`,
                time: `${moment(item.startTime).format('YYYY-MM-DD HH:mm:ss')}-${moment(item.endTime).format('YYYY-MM-DD HH:mm:ss')}`,
                targetName: item.targetName,
            });
        }
        const ids = content.map(item => item.id);
        if (ids.length) {
            setSpin(true)
            getSeriesData(ids,
                {
                    cb: (res) => {
                        const data = (Object.entries(res) || []).map(item => {
                            return {
                                id: item[0],
                                info: item[1]
                            }
                        })
                        setChartData(data)
                        setSpin(false)
                    },
                    err: () => {
                        setSpin(false)
                    }
                })
        } else {
            setChartData([])
        }
    }

    //查看
    const openDataViewModal = (record) => {
        setSpin(true)
        // getTime({
        //     cb: (data) => {
        //         setInputValue(data.timeInterval)
        //     }
        // })
        const currentPage = (pageNum - 1) * pageSize + record.currentIndex;
        setSimplepage({
            ...simplePage,
            pageNum: currentPage
        })

        // openModalGetSeriesData(record)
        updateCurrent(record.currentIndex)
        searchModelData(props, {
            pageNum: currentPage,
            pageSize: 1
        }, callBack)
        setVisible(true);
    };

    //弹窗右上角时间
    const inputChange = (value) => {
        setInputValue(value)
    }
    //弹窗点击确定按钮
    const onOk = () => {
        // modifyTime({
        //     timeInterval: inputValue
        // }, {
        //     cb: () => {
        //         success('修改时间成功')
        //         searchModelData(props, page);
        //         setVisible(false)
        //         setCurrentView(1)
        //     }
        // })

        setVisible(false)
        setCurrentView(1)
    }
    //点击收藏星星
    const handleClickStar = (favor, record) => {
        //取消收藏
        if (favor === 1) {
            cancelSingleFavo({
                id: record.id
            }, {
                cb: () => {
                    success(IntlFormatMessage('laboratory.anomaly.removedFavorites'))
                    // openModalGetSeriesData(newRecord)
                    searchModelData(props, {
                        ...simplePage
                    }, callBack)
                }
            })
        } else {
            addSingleFavo({
                id: record.id
            }, {
                cb: () => {
                    success(IntlFormatMessage('laboratory.anomaly.addedFavorites'))
                    searchModelData(props, {
                        ...simplePage
                    }, callBack)
                }
            })
        }

    }
    //表格翻页
    const changePage = (current) => {
        setPage({
            ...page,
            pageNum: current
        })
        searchModelData(props, {
            pageNum: current,
            pageSize: page.pageSize
        })
    }
    //表格点击切换每页多少条
    const showSizeChange = (current, pageSize) => {
        setPage({
            pageNum: current,
            pageSize,
        })
        searchModelData(props, {
            pageNum: current,
            pageSize: pageSize
        })
    }
    //切换当前是几分页视图获取所有数据
    const handleChangePage = (num) => {
        setChartData([])
        setSpin(true)
        setSimplepage({
            pageNum: 1,
            pageSize: num
        })
        setCurrentView(num)
        searchModelData(props, {
            pageNum: 1,
            pageSize: num,
        }, callBack)
    }
    //简单分页页码改变
    const simplePagChange = (current) => {
        setSimplepage({
            ...simplePage,
            pageNum: current,
        })
        searchModelData(props, {
            pageNum: current,
            pageSize: simplePage.pageSize
        }, callBack)
    }
    //刷新按钮触发
    const handleRefresh = () => {
        ClearSomLocalStorage();
        setChartData([])
        searchModelData(props, {
            ...simplePage
        }, callBack)
    }

    useEffect(() => {
        if (linkCheck) {
            echarts.connect('echartsLink')
        } else {
            echarts.connect('echartsUnLink')
        }
        return () => {
            echarts.disconnect('echartsLink');
            echarts.disconnect('echartsUnLink')
        }

    }, [linkCheck])

    const onLinkCheckChange = (e) => {
        setLinkCheck(e.target.checked)
    }

    useEffect(() => {
        if (dataSource.length) {
            setBoxLoading(false)
        } else {
            clearTimeout(timer)
            timer = setTimeout(() => {
                setBoxLoading(false)
            }, 10000)
        }
    }, [dataSource])

    return (
        <div className={styles['origa-data-drop']}>
            <div className='drop-header'>
                <div className='header-icon' style={{cursor: 'pointer',}}>
                    <Icon type={expand ? 'down' : 'right'} className='header-icon-img' onClick={handleExpand}/>
                    <Checkbox checked={checked} onChange={onCheckedChange} style={{
                        marginRight: 8,
                    }}/>
                    <span
                        onClick={handleExpand}>{`${IntlFormatMessage('laboratory.detail.metric')}:${metricKey || '-'}`}</span>
                </div>
            </div>
            <div style={expand ? {} : {display: 'none'}}>
                <Spin style={{height: '100%', width: '100%'}} spinning={boxLoading}>
                    <Table
                        columns={columns()}
                        scroll={{y: 200}}
                        dataSource={dataSource.map((item, index) => {
                            return {
                                ...item,
                                currentIndex: index + 1,
                            }
                        })}
                        rowKey={record => record.id}
                        pagination={{
                            simple: true,
                            total: totalSize,
                            current: pageNum,
                            pageSize: pageSize,
                            onChange: changePage,
                            onShowSizeChange: showSizeChange,
                        }}
                    />
                </Spin>
            </div>
            <Modal
                visible={visible}
                onCancel={() => {
                    setSimplepage({
                        pageNum: 1,
                        pageSize: 1,
                    });
                    setChartData([])
                    searchModelData(props)
                    setVisible(false)
                    setCurrentView(1)
                }}
                footer={null}
                onOk={onOk}
                size='fullScreen'
                className={styles['modal-wrapper-labor']}
                destroyOnClose={true}
                bodyStyle={{overflow: 'auto'}}
                title={
                    <div className={styles['labor-modal-pagi']}>
                        <div className={styles['modal-left']}><span>{modalInfo.name}</span>
                            {
                                total.totalSize !== 0 &&
                                <Pagination
                                    simple
                                    total={total.totalSize}
                                    current={total.pageNum}
                                    pageSize={total.pageSize}
                                    onChange={simplePagChange}
                                />
                            }
                        </div>
                    </div>
                }
            >
                <Spin spinning={spin} wrapperClassName='modal-spin-origan'>
                    <div className={styles['dataview-modal-main']}>
                        <div className={styles['modal-header']}>
                            <div>{IntlFormatMessage('laboratory.detail.trainingtime')}：<span>{modalInfo.time}</span>
                            </div>
                            <div className={styles['model-header-right']}>
                                <Checkbox checked={linkCheck} onChange={onLinkCheckChange}>
                                    {IntlFormatMessage('laboratory.detail.synchronize')}
                                </Checkbox>
                                <div onClick={() => handleChangePage(1)}
                                     style={{borderColor: currentView === 1 ? '#1890FF' : 'rgba(0,0,0,0.15)'}}
                                     className={styles['header-icon']}>
                                    <IconFont type='icon-one' style={{color: currentView === 1 && '#1890FF'}}/>
                                </div>
                                <div onClick={() => handleChangePage(4)}
                                     style={{borderColor: currentView === 4 ? '#1890FF' : 'rgba(0,0,0,0.15)'}}
                                     className={styles['header-icon']}>
                                    <IconFont type='icon-four' style={{color: currentView === 4 && '#1890FF'}}/>
                                </div>
                                <div onClick={() => handleChangePage(9)}
                                     style={{borderColor: currentView === 9 ? '#1890FF' : 'rgba(0,0,0,0.15)'}}
                                     className={styles['header-icon']}>
                                    <IconFont type='icon-nine' style={{color: currentView === 9 && '#1890FF'}}/>
                                </div>
                                <Button icon='sync' onClick={handleRefresh}/>
                            </div>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', height: 'calc(100% - 32px)'}}>
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                width: '100%',
                                height: '100%',
                                padding: '8px 0',
                                justifyContent: currentView === 4 ? 'space-between' : 'flex-start'
                            }}>
                                {
                                    chartData.map((item, index) => {
                                        return <ChartList
                                            key={item.id || index}
                                            item={{
                                                ...item.info,
                                                id: item.id
                                            }}
                                            currentNum={index + 1}
                                            handleClickStar={handleClickStar}
                                            getSeriesData={getSeriesData}
                                            currentView={currentView}
                                            ifRowDataSampling={true}
                                        />
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </Spin>
            </Modal>
        </div>
    )
}

export default connect(({laboratoryStore, store}) => {
    return {
        getSeriesData: laboratoryStore.getSeriesData,
        cancelSingleFavo: laboratoryStore.cancelSingleFavo,
        getTime: laboratoryStore.getTime,
        modifyTime: laboratoryStore.modifyTime,
        addSingleFavo: laboratoryStore.addSingleFavo,
        currentPage: laboratoryStore.currentPage,
        updateCurrent: laboratoryStore.updateCurrent,
        setBackTitle: store.setBackTitle,
    };
})(DropTable)
