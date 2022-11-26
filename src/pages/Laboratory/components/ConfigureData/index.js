import React, {useEffect, Fragment} from 'react';
import {connect, toJS} from "@chaoswise/cw-mobx";
import {
    Button,
    Tabs,
    BasicLayout as Layout,
    Empty,
    Select,
    Spin,
    Input,
    Checkbox,
    Pagination
} from '@chaoswise/ui';
import styles from './index.less';
import DropTable from './DropTable';
import {useFetchState} from "@/components/HooksState";
import {useHistory, useParams} from "react-router";
import {success} from "@/utils/tip";
import {IntlFormatMessage} from "@/utils/util";
import ScrollSelect from "@/components/ScrollSelect";

const {Footer} = Layout;
const {TabPane} = Tabs;
const {Option} = Select;
const timer = {
    modalTimer: null,
    metricTimer: null,
};

function DataView(props) {
    const {
        match = {},
        getModelOrObjList,
        getTbDetailList,
        getSeriesList,
        addAllFavorite,
        delAllFavorite,
        getTuningbenchModelAsync,
        getTuningbenchMetricAsync,
        tuningbenchModelObj,
        tuningbenchMetricObj,
        setTuningbenchModelObj,
        setTuningbenchMetricObj
    } = props;

    const {params = {}} = match;
    const {id = '', tabId = '',} = params;
    const {push, go, location} = useHistory();
    const useParam = useParams();

    const [activeKey, setActiveKey] = useFetchState(tabId || 'collect');
    const [seachInfo, setSearchInfo] = useFetchState({
        metricKey: null,
        targetModel: null
    });
    const [allCheck, setAllCheck] = useFetchState(false);
    const [selectTag, setSelectTag] = useFetchState({
        metricKeySet: [],
        targetModelSet: []
    });
    const [pageInfo, setPageInfo] = useFetchState({
        pageNum: 1,
        pageSize: 10,
        total: 0
    });
    const [data, setData] = useFetchState([]);
    const [isLoadingList, setIsLoadingList] = useFetchState(false);
    const [checkedNum, setCheckedNum] = useFetchState(0);
    const [loading, setLoading] = useFetchState(false);

    useEffect(()=>{
        return ()=>{
            changeModal();
            changeMetric();
        };
    },[]);
    useEffect(() => {
        if (data.length === 0) {
            return setAllCheck(false);
        }
        const checkBool = data.every(item => item.checked === true);
        if (checkBool) {
            setAllCheck(true);
        } else {
            setAllCheck(false);
        }
        const result = data.map(item => {
            if (item.checked) {
                return item;
            }
            return null;
        }).filter(i => !!i);
        setCheckedNum(result.length);
    }, [data]);

    const getList = (page, searchInfo) => {
        setIsLoadingList(true);
        getTbDetailList({
            ...page,
            query: {
                taskId: id,
                favoritesAll: activeKey === 'collect' ? 1 : 0,
                targetModel: searchInfo.targetModel || null,
                metricKey: searchInfo.metricKey || null
            }
        }, {
            cb: (data) => {
                const {content = [], metricKeySet = [], targetModelSet = [], page = {}} = data;
                setIsLoadingList(false);
                setData(content.map(item => {
                    return {
                        ...item,
                        checked: false,
                        expand: false
                    };
                }));
                setSelectTag({
                    metricKeySet,
                    targetModelSet
                });
                setPageInfo({
                    pageNum: page.pageNum,
                    pageSize: page.pageSize,
                    total: page.totalSize
                });
            }
        });
    };
    //点击收藏和全部切换刷新列表
    const getTotalDetailList = (page) => {
        setPageInfo({
            ...pageInfo,
            pageNum: 1,
            pageSize: 10
        });
        let searchInfo = {
            metricKey: null,
            targetModel: null
        };
        getList(page, searchInfo);
    };

    useEffect(() => {
        if (id) {
            getTotalDetailList({
                pageNum: 1,
                pageSize: 10
            });
        }
    }, [id, activeKey]);
    useEffect(() => {
        setSearchInfo({
            metricKey: null,
            targetModel: null
        });
    }, [activeKey]);

    const handleAllCheck = (e) => {
        setAllCheck(e.target.checked);
        setData(data.map(item => {
            return {
                ...item,
                checked: e.target.checked
            };
        }));
    };

    const searchModelData = (item, pageInfo = {
        pageNum: 1,
        pageSize: 10
    }, callback) => {
        getSeriesList({
            ...pageInfo,
            query: {
                id: item.id,
                taskId: item.taskId,
                seriesCreated: item.seriesCreated,
                favoritesAll: activeKey === 'collect' ? 1 : 0,
                targetModel: item.targetModel,
                metricKey: item.metricKey
            }
        }, {
            cb: (info) => {
                if (callback) {
                    return callback(info);
                }
                const {seriesList = {}} = info;

                const {content = [], pageNum = 1, pageSize = 10, totalPages = 0, totalSize = 0} = seriesList;
                if (!content.length && pageNum > 1) {
                    searchModelData(item, {
                        pageNum: pageNum - 1,
                        pageSize
                    });
                }
                setData(data.map((list) => {
                    if (list.id === item.id) {
                        if (content.length === 0 && pageNum === 1) {
                            return;
                        }
                        return {
                            ...list,
                            expand: true,
                            dataSource: content,
                            pageNum,
                            pageSize,
                            totalPages,
                            totalSize
                        };
                    }
                    return list;
                }).filter(item => !!item));
            }
        });
    };

    const onCheckChange = (e, id) => {
        setData(prev => prev.map(item => {
            if (item.id === id) {
                return Object.assign({}, item, {
                    checked: e.target.checked,
                    expand: item.expand
                });
            }
            return item;
        }));
    };

    const onExpandChange = (value, id) => {
        setData(data.map(list => {
            if (list.id === id) {
                return {
                    ...list,
                    expand: value
                };
            }
            return list;
        }));
    };

    const onModelChange = (e) => {
        setSearchInfo({
            ...seachInfo,
            targetModel: e || null
        });
        getTbDetailList({
            pageNum: 1,
            pageSize: 10,
            query: {
                taskId: id,
                favoritesAll: activeKey === 'collect' ? 1 : 0,
                targetModel: e || null,
                metricKey: seachInfo.metricKey
            }
        }, {
            cb: (data) => {
                const {content = [], page = {}} = data;
                setData(content.map(item => {
                    return {
                        ...item,
                        checked: false,
                        expand: false
                    };
                }));
                setPageInfo({
                    pageNum: page.pageNum,
                    pageSize: page.pageSize,
                    total: page.totalSize
                });
            }
        });
        getModelOrObjList({
            taskId: id,
            flag: 0,
            targetModel: e || null
        }, {
            cb: (data) => {
                setSelectTag({
                    ...selectTag,
                    metricKeySet: data
                });
            }
        });
    };

    const onMetricChange = (e) => {
        setSearchInfo({
            ...seachInfo,
            metricKey: e || null
        });
        getTbDetailList({
            pageNum: 1,
            pageSize: 10,
            query: {
                taskId: id,
                favoritesAll: activeKey === 'collect' ? 1 : 0,
                metricKey: e || null,
                targetModel: seachInfo.targetModel
            }
        }, {
            cb: (data) => {
                const {content = [], page = {}} = data;
                setData(content.map(item => {
                    return {
                        ...item,
                        checked: false,
                        expand: false
                    };
                }));
                setPageInfo({
                    pageNum: page.pageNum,
                    pageSize: page.pageSize,
                    total: page.totalSize
                });
            }
        });
        getModelOrObjList({
            taskId: id,
            metricKey: e || null,
            flag: 1
        }, {
            cb: (data) => {
                setSelectTag({
                    ...selectTag,
                    targetModelSet: data
                });
            }
        });
    };

    //取消收藏所有选中的模型指标
    const onCanleAllFavor = () => {
        // delAllFavorite
        const selectCheck = data.map(item => {
            if (item.checked) {
                return item.id;
            }
        }).filter(item => !!item);
        const params = {
            taskId: id,
            modelMetricIdList: selectCheck
        };
        delAllFavorite(params, {
            cb: () => {
                success(IntlFormatMessage('laboratory.anomaly.removedFavorites'));
                getTbDetailList({
                    pageNum: pageInfo.pageNum,
                    pageSize: pageInfo.pageSize,
                    query: {
                        taskId: id,
                        favoritesAll: activeKey === 'collect' ? 1 : 0,
                        ...seachInfo
                    }
                }, {
                    cb: (data) => {
                        const {content = [], metricKeySet = [], targetModelSet = [], page = {}} = data;
                        setData(content.map(item => {
                            return {
                                ...item,
                                checked: false,
                                expand: false
                            };
                        }));
                        setSelectTag({
                            metricKeySet,
                            targetModelSet
                        });
                        setPageInfo({
                            pageNum: page.pageNum,
                            pageSize: page.pageSize,
                            total: page.totalSize
                        });
                    }
                });
            }
        });
    };
    //收藏
    const onAddAllFavor = () => {
        const selectCheck = data.map(item => {
            if (item.checked) {
                return item.id;
            }
        }).filter(item => !!item);
        const params = {
            taskId: id,
            modelMetricIdList: selectCheck
        };
        addAllFavorite(params, {
            cb: () => {
                success(<span>{`${IntlFormatMessage('laboratory.anomaly.addedFavorites')}，`}<span
                    style={{color: '#008DFF', cursor: 'pointer'}}
                    onClick={() => {
                        push(`/laboratory/${useParam.typeId}/${useParam.id}`);
                    }}
                >{IntlFormatMessage('laboratory.anomaly.view')}</span></span>, 5);
                getTbDetailList({
                    pageNum: pageInfo.pageNum,
                    pageSize: pageInfo.pageSize,
                    query: {
                        taskId: id,
                        favoritesAll: activeKey === 'collect' ? 1 : 0,
                        ...seachInfo
                    }
                }, {
                    cb: (data) => {
                        const {content = [], metricKeySet = [], targetModelSet = [], page = {}} = data;
                        setData(content.map(item => {
                            return {
                                ...item,
                                checked: false,
                                expand: false
                            };
                        }));
                        setSelectTag({
                            metricKeySet,
                            targetModelSet
                        });
                        setPageInfo({
                            pageNum: page.pageNum,
                            pageSize: page.pageSize,
                            total: page.totalSize
                        });
                    }
                });
            }
        });
    };

    const changePage = (pageNum, pageSize) => {
        let searchInfo = {
            targetModel: seachInfo.targetModel || null,
            metricKey: seachInfo.metricKey || null
        };
        getList({
            pageNum,
            pageSize
        }, searchInfo);
    };
    const showSizeChange = (pageNum, pageSize) => {
        let searchInfo = {
            targetModel: seachInfo.targetModel || null,
            metricKey: seachInfo.metricKey || null
        };
        getList({
            pageNum,
            pageSize
        }, searchInfo);
    };

    const changeModal = () => {
        setTuningbenchModelObj();
    };
    const changeMetric = () => {
        setTuningbenchMetricObj();
    };
    const onTuningbenchModelChange = (e = null, pageNum = 0) => {
        setLoading(true);
        timer.modalTimer && clearTimeout(timer.modalTimer);
        timer.modalTimer = setTimeout(() => {
            const params = {
                pageNum: pageNum ? pageNum : toJS(tuningbenchModelObj).pageNum + 1,
                pageSize: toJS(tuningbenchModelObj).pageSize,
                query: {
                    taskId: id,
                    targetModel: e,
                    metricKey: seachInfo.metricKey || null,
                    favoritesAll: activeKey === 'collect' ? 1 : null
                }
            };
            getTuningbenchModelAsync(params, {
                cb: (data) => {

                }
            });
            setLoading(false);
        }, 300);
    };
    const onTuningbenchMetricChange = (e = null, pageNum = 0) => {
        setLoading(true);
        timer.metricTimer && clearTimeout(timer.metricTimer);
        timer.metricTimer = setTimeout(() => {
            getTuningbenchMetricAsync({
                pageNum: pageNum ? pageNum : toJS(tuningbenchMetricObj).pageNum + 1,
                pageSize: toJS(tuningbenchMetricObj).pageSize,
                query: {
                    taskId: id,
                    targetModel: seachInfo.targetModel || null,
                    metricKey: e,
                    favoritesAll: activeKey === 'collect' ? 1 : null
                }
            }, {
                cb: (data) => {
                }
            });
            setLoading(false);
        }, 300);
    };

    //渲染table
    const renderTabContent = () => {
        return (
            <div style={{height: '100%', padding: '0 32px'}}>
                <Spin spinning={isLoadingList}>
                    <div style={{display: 'flex', alignItems: 'center', marginBottom: 16}}>
                        <Checkbox
                            onChange={handleAllCheck}
                            checked={allCheck}
                            // style={{width: 80}}
                        >
                            {IntlFormatMessage('laboratory.detail.allselect')}
                        </Checkbox>
                        <ScrollSelect
                            showSearch
                            style={{width: 200}}
                            key='metricKey'
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                            allowClear
                            id='metricKey'
                            value={seachInfo.metricKey || undefined}
                            scrollLoading={loading}
                            onChange={onMetricChange}
                            onPopupScroll={() => {
                                if (toJS(tuningbenchMetricObj).total === toJS(tuningbenchMetricObj).content.length) {
                                    return;
                                }
                                onTuningbenchMetricChange();
                            }}
                            onSearch={e => {
                                onTuningbenchMetricChange(e, 1);
                            }}
                            onFocus={onTuningbenchMetricChange}
                            onBlur={changeMetric}
                            placeholder={IntlFormatMessage('laboratory.detail.selectmetric')}
                        >
                            {
                                (toJS(tuningbenchMetricObj).content || []).map(item => {
                                    return <Option key={item} value={item}>{item}</Option>;
                                })
                            }
                        </ScrollSelect>
                        {
                            data.some(item => item.checked === true) &&
                            <Fragment>
                                {
                                    <Button style={{marginRight: 8}}
                                            onClick={onCanleAllFavor}>{IntlFormatMessage('laboratory.detail.removefromvorites')}</Button>
                                }
                                {
                                    activeKey === 'all' &&
                                    <Button style={{marginRight: 8}} onClick={onAddAllFavor}>
                                        {IntlFormatMessage('laboratory.detail.favorites')}
                                    </Button>

                                }
                                {IntlFormatMessage('laboratory.anomaly.selectedDele')}{checkedNum}{IntlFormatMessage('laboratory.anomaly.selected')}
                            </Fragment>
                        }

                    </div>
                    {
                        data.length === 0 ?
                            <Empty className={styles['collect-empty']} description={activeKey === 'collect' ?
                                <Fragment>
                                    <span
                                        className={styles['empty-span']}>{IntlFormatMessage('laboratory.detail.onlydataexperiments')}</span>
                                    <span
                                        className={styles['empty-span']}>{IntlFormatMessage('laboratory.detail.noavoritesfound')}，<span
                                        style={{color: '#1890FF', cursor: 'pointer'}}
                                        onClick={() => setActiveKey('all')}>{IntlFormatMessage('laboratory.detail.toadd')}{'>'}</span></span>
                                </Fragment>
                                : IntlFormatMessage('laboratory.detail.nodatafound')
                            }/>
                            :
                            <div style={{height: 'calc(100% - 104px)', overflow: 'auto'}}>
                                {
                                    data.map(item => {
                                        return <DropTable
                                            getTotalDetailList={getTotalDetailList}
                                            key={item.id}
                                            seachInfo={seachInfo}
                                            activeKey={activeKey}
                                            checked={item.checked}
                                            expand={item.expand}
                                            onCheckChange={onCheckChange}
                                            onExpandChange={onExpandChange}
                                            dataSource={item.dataSoure || []}
                                            searchModelData={searchModelData}
                                            editId={id}
                                            {...item}
                                        />;
                                    })
                                }
                            </div>

                    }
                    <Pagination
                        total={pageInfo.total}
                        pageSize={pageInfo.pageSize}
                        current={pageInfo.pageNum}
                        showSizeChanger={true}
                        showTotal={total => `${IntlFormatMessage('datasource.create.total')}${total}${IntlFormatMessage('datasource.create.totalItem')}`}
                        showQuickJumper={true}
                        onChange={changePage}
                        onShowSizeChange={showSizeChange}
                    />
                </Spin>
            </div>
        );
    };

    const onActiveKeyChange = (current) => {
        changeMetric();
        changeModal();
        setData([]);
        setActiveKey(current);
    };

    return (
        <div className={styles['single-view-wrapper']}>
            <Tabs
                activeKey={activeKey}
                onChange={onActiveKeyChange}
            >
                <TabPane tab={IntlFormatMessage('laboratory.detail.favoritesTwo')}
                         key="collect">
                    {renderTabContent()}
                </TabPane>
                <TabPane tab={IntlFormatMessage('laboratory.detail.all')} key="all">
                    {renderTabContent()}
                </TabPane>
            </Tabs>
        </div>
    );
}

export default connect(({laboratoryStore}) => {
    return {
        getTbDetailList: laboratoryStore.getTbDetailList,
        getModelOrObjList: laboratoryStore.getModelOrObjList,
        getSeriesList: laboratoryStore.getSeriesList,
        cancelSingleFavo: laboratoryStore.cancelSingleFavo,
        addSingleFavo: laboratoryStore.addSingleFavo,
        addAllFavorite: laboratoryStore.addAllFavorite,
        delAllFavorite: laboratoryStore.delAllFavorite,
        getTuningbenchModelAsync: laboratoryStore.getTuningbenchModelAsync,
        getTuningbenchMetricAsync: laboratoryStore.getTuningbenchMetricAsync,
        tuningbenchMetricObj: laboratoryStore.tuningbenchMetricObj,
        tuningbenchModelObj: laboratoryStore.tuningbenchModelObj,
        setTuningbenchModelObj: laboratoryStore.setTuningbenchModelObj,
        setTuningbenchMetricObj: laboratoryStore.setTuningbenchMetricObj,
    };
})(DataView);
