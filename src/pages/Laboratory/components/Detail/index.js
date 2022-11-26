import React, {Fragment, useEffect,} from 'react';
import {Checkbox, Select, Form, SearchBar, Spin, Card, Empty, Pagination} from '@chaoswise/ui';
import styles from './index.less';
import ExpandTable from './ExpandTable';
import {connect, toJS} from "@chaoswise/cw-mobx";
import {useFetchState} from "@/components/HooksState";
import {IntlFormatMessage} from "@/utils/util";
import {useHistory, useParams} from "react-router";
import ScrollSelect from "@/components/ScrollSelect";

const {Option} = Select;
const {Group} = Checkbox;
const timer = {
    modalTimer: null,
    metricTimer: null,
};

function Detail(props) {
    const {
        getTbDetailList,
        getModelOrObjList,
        searchAlgorithmAsync,
        getTbDetail,
        setBackTitle,
        getGenericsNumAsync,
        getTuningbenchModelAsync,
        getTuningbenchMetricAsync,
        tuningbenchModelObj,
        tuningbenchMetricObj,
        setTuningbenchModelObj,
        setTuningbenchMetricObj
    } = props;
    const history = useHistory();
    const {id = '', typeId = ''} = useParams();

    const [seachInfo, setSearchInfo] = useFetchState({
        metricKey: null,
        targetModel: null
    });
    const [detail, setDetail] = useFetchState([]);
    // const [selectTag, setSelectTag] = useFetchState({
    //     metricKeySet: [],
    //     targetModelSet: []
    // });
    const [loading, setLoading] = useFetchState(false);
    const [targetModelSet, setTargetModelSet] = useFetchState([]);
    const [lowAndUpValue, setLowAndUpValue] = useFetchState({
        uperValue: undefined,
        lowerValue: undefined
    });
    const [pageInfo, setPageInfo] = useFetchState({
        pageNum: 1,
        pageSize: 10,
        total: 0
    });
    const [isLoadingList, setIsLoadingList] = useFetchState(false);

    useEffect(() => {
        return () => {
            changeModal();
            changeMetric();
        };
    }, []);
    const getList = (pageInfo) => {
        setIsLoadingList(true);
        getTbDetailList({
            ...pageInfo,
            query: {
                taskId: id,
                favoritesAll: 1,
                metricKey: seachInfo.metricKey || null,
                targetModel: seachInfo.targetModel || null
            }
        }, {
            cb: (data) => {
                const {
                    taskName = '', content = [],
                    // metricKeySet = [], targetModelSet = [],
                    page = {}
                } = data;
                setBackTitle(`${taskName}`);
                setDetail(content);
                // setSelectTag({
                //     metricKeySet,
                //     targetModelSet
                // });
                setPageInfo({
                    pageNum: page.pageNum,
                    pageSize: page.pageSize,
                    total: page.totalSize
                });
                setIsLoadingList(false);
            }
        });
    };

    useEffect(() => {
        if (id) {
            getList({
                pageNum: 1,
                pageSize: 10
            });
            if (typeId === 'forecasting') {
                getTbDetail(id, {
                    cb: (data) => {
                        const {extendConfig = {}} = data;
                        const {dataProcessing = {}} = extendConfig;
                        setLowAndUpValue({
                            uperValue: dataProcessing.upperThreshold,
                            lowerValue: dataProcessing.lowerThreshold
                        });

                    }
                });
            }
        }
    }, [id]);
    //获取泛型列表
    useEffect(() => {
        getGenericsNumAsync();
        searchAlgorithmAsync({
            pageNum: 0,
            pageSize: 0,
            query: {
                scene: typeId,
                isIncludeAlgorithm: true,
            }
        });
    }, []);

    const onSearch = (value) => {
        setSearchInfo(value);
        setPageInfo({
            pageNum: 1,
            pageSize: 10
        });
        getTbDetailList({
            pageNum: 1,
            pageSize: 10,
            query: {
                taskId: id,
                favoritesAll: 1,
                metricKey: value.metricKey || null,
                targetModel: value.targetModel || null
            }
        }, {
            cb: (data) => {
                const {taskName = '', content = [], metricKeySet = [], targetModelSet = [], page = {}} = data;
                setDetail(content);
                setPageInfo({
                    pageNum: page.pageNum,
                    pageSize: page.pageSize,
                    total: page.totalSize
                });
            }
        });
    };
    const changeModal = () => {
        setTuningbenchModelObj();
    };
    const changeMetric = () => {
        setTuningbenchMetricObj();
    };
    const onTuningbenchModelChange = (e = null, pageNum) => {
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
                    favoritesAll: 1
                }
            };
            getTuningbenchModelAsync(params, {
                cb: (data) => {
                }
            });
            setLoading(false);
        }, 300);
    };

    const onTuningbenchMetricChange = (e = null, pageNum) => {
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
                    favoritesAll: 1
                }
            }, {
                cb: (data) => {
                }
            });
            setLoading(false);
        }, 300);
    };
    // const onModelChange = (e) => {
    //     getModelOrObjList({
    //         pageNum: 1,
    //         pageSize: 10,
    //         query: {
    //             taskId: id,
    //             flag: 0,
    //             targetModel: e || null
    //         }
    //     }, {
    //         cb: (data) => {
    //             setTargetModelSet(data?.content);
    //             // setSelectTag({
    //             //     ...selectTag,
    //             //     metricKeySet: data
    //             // });
    //         }
    //     });
    // };
    //
    // const onMetricChange = (e) => {
    //     getModelOrObjList({
    //         pageNum: 1,
    //         pageSize: 10,
    //         query: {
    //             taskId: id,
    //             metricKey: e || null,
    //             flag: 1,
    //         }
    //     }, {
    //         cb: (data) => {
    //             setMetricKeySet(data?.content);
    //             // setSelectTag({
    //             //     ...selectTag,
    //             //     targetModelSet: data
    //             // });
    //         }
    //     });
    // };

    const changePage = (page, pageSize) => {
        getList({
            pageNum: page,
            pageSize,
        });
    };
    const showSizeChange = (page, pageSize) => {
        getList({
            pageNum: page,
            pageSize,
        });
    };
    return (
        <div className={styles['labor-main']}>
            <Spin spinning={isLoadingList}>
                <div className={styles['main-search']}>
                    <SearchBar
                        onSearch={onSearch}
                        searchContent={[
                            {
                                components:
                                    <ScrollSelect
                                        showSearch
                                        style={{width: 240}}
                                        key='metricKey'
                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                        allowClear
                                        id='metricKey'
                                        scrollLoading={loading}
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
                            }
                        ]}
                    >
                    </SearchBar>
                </div>
                <div style={{height: 'calc(100% - 120px)', overflow: 'auto'}}>
                    {
                        detail.length === 0 ?
                            <Empty className={styles['collect-empty']} description={<Fragment>
                                <span
                                    className={styles['empty-span']}>{IntlFormatMessage('laboratory.detail.onlydataexperiments')}</span>
                                <span
                                    className={styles['empty-span']}>{IntlFormatMessage('laboratory.detail.noavoritesfound')}，<span
                                    style={{color: '#1890FF', cursor: 'pointer'}}
                                    onClick={() => {
                                        history.push(`/laboratory/${typeId}/original/${id}/all`);
                                    }}>{IntlFormatMessage('laboratory.detail.toadd')}{'>'}</span></span>
                            </Fragment>
                            }/>
                            :
                            detail.map((item, index) => {
                                return <ExpandTable
                                    index={index}
                                    lowAndUpValue={lowAndUpValue}
                                    key={item.id}
                                    expandTitle={`${IntlFormatMessage('laboratory.detail.metric')}:${item.metricKey || '-'}`}
                                    {...item}
                                />;
                            })
                    }
                </div>
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
}

export default connect(({laboratoryStore, genericsStore, store}) => {
    return {
        getTbDetailList: laboratoryStore.getTbDetailList,
        getModelOrObjList: laboratoryStore.getModelOrObjList,
        searchAlgorithmAsync: genericsStore.searchAlgorithmAsync,
        getTbDetail: laboratoryStore.getTbDetail,
        getGenericsNumAsync: laboratoryStore.getGenericsNumAsync,
        getTuningbenchModelAsync: laboratoryStore.getTuningbenchModelAsync,
        getTuningbenchMetricAsync: laboratoryStore.getTuningbenchMetricAsync,
        tuningbenchMetricObj: laboratoryStore.tuningbenchMetricObj,
        tuningbenchModelObj: laboratoryStore.tuningbenchModelObj,
        setTuningbenchModelObj: laboratoryStore.setTuningbenchModelObj,
        setTuningbenchMetricObj: laboratoryStore.setTuningbenchMetricObj,
        setBackTitle: store.setBackTitle,
    };
})(Form.create()(Detail));
