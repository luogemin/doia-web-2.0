import React, {Fragment, useEffect,} from 'react';
import {Checkbox, Select, Form, SearchBar, Spin, Card, Empty, Pagination} from '@chaoswise/ui';
import styles from './index.less';
import BrawerTableList from '@/pages/Laboratory/components/RootAnalysis/BrawerTableList';
import {connect, toJS} from "@chaoswise/cw-mobx";
import {useFetchState} from "@/components/HooksState";
import {IntlFormatMessage} from "@/utils/util";
import {useHistory, useParams} from "react-router";

const {Option} = Select;
const {Group} = Checkbox;

function BrawerTable(props) {
    const {
        editRow = {},
        getModelOrObjList,
        searchAlgorithmAsync,
        getTbDetail,
        setBackTitle,
        queryModelGroup,
        queryTagsGroup,
        dataSetInfo,
    } = props;
    const {filtersConfig = {}, dataSourceId = '', startTime, endTime} = toJS(editRow);
    const history = useHistory();
    const {id = '', typeId = '', taskId = ''} = useParams();

    const [seachInfo, setSearchInfo] = useFetchState({
        metricKey: null,
        targetModel: null
    });
    const [modelList, setModelList] = useFetchState([]);
    const [targetList, setTargetList] = useFetchState([]);
    const [detail, setDetail] = useFetchState([]);
    const [pageInfo, setPageInfo] = useFetchState({
        pageNum: 1,
        pageSize: 10,
        total: 0
    });
    const [isLoadingList, setIsLoadingList] = useFetchState(false);

    const getList = (pageInfo) => {
        setIsLoadingList(true);
        setDetail([]);
        setPageInfo({
            pageNum: 1,
            pageSize: 10,
            total: 1
        });
        queryModelGroup({
            ...pageInfo,
            query: {
                dataSourceId,
                filtersConfig,
                startTime, endTime,
                target: seachInfo.metricKey || null,
                model: seachInfo.targetModel || null,
                scene: 'root_cause_analysis',
                dataSourceRelationId: !!toJS(dataSetInfo).datasourceId && !!toJS(dataSetInfo).datasourceId.value ? toJS(dataSetInfo).datasourceId.value : toJS(dataSetInfo).datasourceId,
            }
        }, {
            cb: (data) => {
                const {modelAndTargetPageList = {}, modelList = [], targetList = []} = data;
                const {content = [], ...rest} = modelAndTargetPageList;
                setModelList(modelList);
                setTargetList(targetList);
                setDetail(content);
                setPageInfo({
                    ...rest
                });
                setIsLoadingList(false);
            },
            err: () => {
                setIsLoadingList(false);
            }
        });
    };

    useEffect(() => {
        getList({
            pageNum: 1,
            pageSize: 10
        });
    }, [seachInfo]);

    const onModelAndMetricChange = (type, value) => {
        setSearchInfo(prev => {
            return Object.assign({}, prev, {
                [type]: value,
            });
        });
    };

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
                        searchContent={[
                            {
                                components:
                                    <Select
                                        style={{width: 240}}
                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                        key='targetModel'
                                        id='targetModel'
                                        allowClear
                                        onChange={(value) => onModelAndMetricChange('targetModel', value)}
                                        placeholder={IntlFormatMessage('laboratory.detail.selectmodel')}
                                    >
                                        {
                                            modelList.map(model => {
                                                return <Option key={model} value={model}>{model}</Option>;
                                            })
                                        }
                                    </Select>
                            },
                            {
                                components:
                                    <Select
                                        style={{width: 240}}
                                        key='metricKey'
                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                        allowClear
                                        id='metricKey'
                                        onChange={(value) => onModelAndMetricChange('metricKey', value)}
                                        placeholder={IntlFormatMessage('laboratory.detail.selectObject')}
                                    >
                                        {
                                            targetList.map(target => {
                                                return <Option key={target} value={target}>{target}</Option>;
                                            })
                                        }
                                    </Select>
                            }
                        ]}
                    >
                    </SearchBar>
                </div>
                <div style={{height: 'calc(100% - 120px)', overflow: 'auto'}}>
                    {
                        detail.length === 0 ?
                            <Empty className={styles['collect-empty']} description={<Fragment>
                                <span className={styles['empty-span']}>
                                    {IntlFormatMessage('laboratory.detail.nodatafound')}
                                </span>
                            </Fragment>
                            }/>
                            :
                            detail.map((item, index) => {
                                return <BrawerTableList
                                    index={index}
                                    key={index}
                                    expandTitle={`${IntlFormatMessage('laboratory.detail.model')}:${item.model || '-'}-${IntlFormatMessage('laboratory.detail.object')}:${item.target || '-'}`}
                                    item={item}
                                    editRow={editRow}
                                />;
                            })
                    }
                </div>
                {
                    pageInfo.totalSize ?
                        <Pagination
                            total={pageInfo.totalSize}
                            pageSize={pageInfo.pageSize}
                            current={pageInfo.pageNum}
                            showSizeChanger={true}
                            showTotal={total => `${IntlFormatMessage('datasource.create.total')}${total}${IntlFormatMessage('datasource.create.totalItem')}`}
                            showQuickJumper={true}
                            onChange={changePage}
                            onShowSizeChange={showSizeChange}
                        />
                        : null
                }
            </Spin>
        </div>
    );
}

export default connect(({laboratoryStore, genericsStore, store}) => {
    return {
        dataSetInfo: laboratoryStore.dataSetInfo,
        queryModelGroup: laboratoryStore.queryModelGroup,
        getModelOrObjList: laboratoryStore.getModelOrObjList,
        searchAlgorithmAsync: genericsStore.searchAlgorithmAsync,
        getTbDetail: laboratoryStore.getTbDetail,
        setBackTitle: store.setBackTitle,
    };
})(Form.create()(BrawerTable));
