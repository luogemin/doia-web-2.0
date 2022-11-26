import {Button, Modal, Icon, Tooltip, Checkbox, Pagination, Spin, Form, Select} from "@chaoswise/ui";
import React, {useEffect,} from "react";
import styles from '@/pages/TaskManagement/components/Detail/index.less';
import {guid, IntlFormatMessage, numberParseChina} from "@/utils/util";
import moment from 'moment';
import * as echarts from 'echarts';
import {OperatorList} from "@/globalConstants";
import {error, success, warning} from "@/utils/tip";
import {connect, toJS} from "@chaoswise/cw-mobx";
import {useHistory, useParams} from "react-router";
import ChartsItem from "@/pages/TaskManagement/components/common/ChartsItem";
import EditAlgorithmAlert from "@/components/EditAlgorithmAlert";
import EditGenericsAlert from "@/components/EditGenericsAlert";
import ChartsItemComparison from "@/pages/TaskManagement/components/common/ChartsItem/indexComparison";
import TooltipDiv from "@/components/TooltipDiv";
import SaveGeneric from "@/pages/Laboratory/components/Detail/SaveGeneric";
import {useFetchState} from "@/components/HooksState";
import ScrollSelect from "@/components/ScrollSelect";

const FormItem = Form.Item;
const Option = Select.Option;

const greyColorStyle = {
    background: '#c4c4c4',
    cursor: 'not-allowed',
};
let timer = null;

const TaskInfoModel = (props) => {
    const {
        form, visible, onCancel, searchTaskInfoDetailAsync, taskInfoList = [], currentDetailInfo,
        searchTaskInfoDetailTimeListAsync, taskTimeList = {content: []}, searchTaskInfoChartsListAsync, taskChartsList = [],
        addContrastChartAsync, searchAlgorithmAsync, genericsList = [], setTaskInfoListReducer, setTaskTimeListReducer,
        setTaskChartsListReducer, searchChartsRawDataInfoAsync, lowAndUpValue, searchChartsInfoAsync, getTaskDetailAsync,
    } = props;

    const {push, location} = useHistory();
    const {pathname = ""} = location;
    const {typeId = '', taskId = '', taskVersion = ''} = useParams();

    const [currntStep, setCurrentStep] = useFetchState(1);
    const [currentTaskInfo, setCurrentTaskInfo] = useFetchState({});
    const [selectTimeLine, setSelectTimeLine] = useFetchState({});
    const [showParams, setShowParams] = useFetchState(false);
    const [ifLink, setIfLink] = useFetchState(false);
    const [comparisonList, setComparisonList] = useFetchState([]);
    const [addAlgorithmModal, setAddAlgorithmModal] = useFetchState(false);
    const [addAlgorithmLoading, setAddAlgorithmLoading] = useFetchState(false);
    const [loading, setLoading] = useFetchState(true);
    const [loadingSelect, setLoadingSelect] = useFetchState(false);
    const [saveGeneVisible, setSaveGeneVisible] = useFetchState(false);
    const [currentGenericList, setCurrentGenericList] = useFetchState({});
    const [modelListPage, setModelListPage] = useFetchState({
        pageNum: 1,
        totalPages: 1
    });
    const [modelListScrollLoading, setModelListScrollLoading] = useFetchState(false);
    const [modelListScrollFooter, setModelListScrollFooter] = useFetchState('');

    //添加对比模型-下拉框-泛型列表
    const initAlgorithmFun = () => {
        getTaskDetailAsync({id: taskId}, (res) => {
            const params = {
                pageNum: 1,
                pageSize: 1000,
                query: {
                    scene: typeId,
                    isIncludeAlgorithm: true,
                    bizSceneId: res.bizSceneId,
                }
            }
            searchAlgorithmAsync(params)
        }, false);

    }
    useEffect(() => {
        initAlgorithmFun()
    }, [])

    const callBack = () => {
        setLoadingSelect(false)
    }

    //模型指标列表
    useEffect(() => {
        const {startTime = '', endTime = '', model = null, metric = null,} = currentDetailInfo;
        const params = Object.assign({}, {
                taskId,
                taskVersion,
                startTime: startTime,
                endTime: endTime,
                model: !!model ? model : null,
                metric: !!metric ? metric : null,
            }
        )

        searchTaskInfoDetailAsync(params);

        return () => {
            setTaskInfoListReducer([])
        }
    }, [taskId, taskVersion, currentDetailInfo]);

    useEffect(() => {
        if (!!taskInfoList[currntStep - 1]) {
            setCurrentTaskInfo(taskInfoList[currntStep - 1])
        }

        return () => {
            setCurrentTaskInfo({})
            setSelectTimeLine({})
        }
    }, [currntStep, taskInfoList])

    //模型指标-时间段列表
    const initTimeLineFun = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            const params = {
                pageNum: 1,
                pageSize: 100,
                query: Object.assign({}, {
                    metric: !!currentTaskInfo.metric ? currentTaskInfo.metric : null,
                    model: !!currentTaskInfo.model ? currentTaskInfo.model : null,
                    tags: !!currentTaskInfo.tags ? currentTaskInfo.tags : null,
                    target: !!currentTaskInfo.target ? currentTaskInfo.target : null,
                }, {
                    taskId,
                    // taskVersion,
                })
            }
            searchTaskInfoDetailTimeListAsync(params, (content) => {
                setSelectTimeLine(content[0])
            })
        }, 500)
    }

    useEffect(() => {
        initTimeLineFun()

        return () => {
            setTaskTimeListReducer([])
            setSelectTimeLine({})
        }
    }, [currentTaskInfo])

    //模型指标-时间段-模型列表
    useEffect(() => {
        if (
            !!selectTimeLine.seriesId && !!selectTimeLine.taskTriggerTime
            && selectTimeLine.taskTriggerTime !== "undefined"
        ) {
            initModelList()
        } else {
            setTaskChartsListReducer([{
                status: "",
                data: {},
                seriesResultId: guid(),
            }])
        }
        return () => {
            setTaskChartsListReducer([])
        }
    }, [selectTimeLine])

    const initModelList = (pageNum = 1) => {
        const params = {
            pageNum: pageNum,
            pageSize: 3,
            query: {
                seriesId: selectTimeLine.seriesId,
                taskTriggerTime: selectTimeLine.taskTriggerTime,
                taskId,
                taskVersion: selectTimeLine.taskVersion,
            }
        }
        searchTaskInfoChartsListAsync(params, (res) => {
            const ids = (res.content || []).map(item => {
                return item.genericIndex;
            });
            const params = {
                ...currentTaskInfo,
                ...selectTimeLine,
                genericIndexs: ids,
                taskId,
                content: res.content,
            }
            searchChartsInfoAsync(params, (data) => {
                setModelListPage({
                    pageNum: res.pageNum + 1,
                    totalPages: res.totalPages
                })
                setTimeout(() => {
                    setLoading(false);
                    setModelListScrollLoading(false);
                },0)
            });
        })
    }

    //添加对比模型
    const onAlgorithmSave = (values, checked) => {
        setAddAlgorithmLoading(true);
        const {
            algorithmName = '', parameters = [], algorithmVersion = '', id = '', name = '',
            algorithmId = '', builtinDisplayNames, algorithm = {}, genericityname
        } = values;

        const params = {
            taskId,
            algorithmGenerics: [{
                algorithmName,
                algorithmParams: parameters,
                algorithmVersion,
                genericId: id,
                isOverwriteForecastParams: !!checked,
                genericName: genericityname
            }],
            dataCoordinate: {
                metric: !!currentTaskInfo.metric ? currentTaskInfo.metric : null,
                model: !!currentTaskInfo.model ? currentTaskInfo.model : null,
                tags: !!currentTaskInfo.tags ? currentTaskInfo.tags : null,
                target: !!currentTaskInfo.target ? currentTaskInfo.target : null,
            },
            timeConfig: {
                startTime: selectTimeLine.startTime,
                endTime: selectTimeLine.endTime,
            },
        }
        const currentIndex = !!Object.keys(currentGenericList).length ? (comparisonList.length - currentGenericList.index - 1) : 0;
        if (!Object.keys(currentGenericList).length) {
            setComparisonList(prev => {
                prev = prev.concat({chartsData: {}})
                return prev;
            })
        } else {
            setComparisonList(prev => {
                const result = [].concat(prev);
                result[currentIndex] = {chartsData: {}};
                return result;
            })
        }
        onAlgorithmCancel()

        addContrastChartAsync(params, (res) => {
            if (res.status === "success") {
                const {data = {}, message = ''} = res.data;
                const commonResult = {
                    id: guid(),
                    algorithm,
                    genericId: id,
                    algorithmId, parameters,
                    algorithmParams: parameters,
                    algorithmName: algorithmName,
                    algorithmNameZh: name,
                    algorithmVersion: algorithmVersion,
                    builtinDisplayNames,
                    genericName: genericityname,
                    isOverwriteForecastParams: !!checked
                };

                if (res.data.status === 'success') {
                    success(message);
                } else if (res.data.status === 'warning') {
                    warning(message);
                } else {
                    error(message);
                    setTimeout(() => {
                        const params = Object.assign({}, {
                            metric: !!currentTaskInfo.metric ? currentTaskInfo.metric : null,
                            model: !!currentTaskInfo.model ? currentTaskInfo.model : null,
                            tags: !!currentTaskInfo.tags ? currentTaskInfo.tags : null,
                            target: !!currentTaskInfo.target ? currentTaskInfo.target : null,
                        }, {
                            taskId,
                            taskVersion: selectTimeLine.taskVersion || taskVersion,
                            startTime: selectTimeLine.startTime,
                            endTime: selectTimeLine.endTime,
                        });
                        searchChartsRawDataInfoAsync(params, secRes => {
                            const resultData = Object.assign({}, {
                                errorMsg: {
                                    status: 'error',//secRes.data.length ? '' : 'nodata',
                                    messageZH: message,
                                },
                                chartsData: (!!secRes.data && secRes.data.length) ? {
                                    seriesData: secRes.data
                                } : {},
                            }, commonResult);
                            if (!Object.keys(currentGenericList).length) {
                                setComparisonList(prev => {
                                    prev.pop();
                                    prev = prev.concat(resultData)
                                    return prev;
                                })
                            } else {
                                setComparisonList(prev => {
                                    const result = [].concat(prev);
                                    result[currentIndex] = resultData;
                                    return result;
                                })
                            }
                        });
                    }, 300)
                    setAddAlgorithmLoading(false)
                    return
                }
                const resultData = Object.assign({}, {
                    errorMsg: {
                        status: res.data.status || '',
                        messageZH: message,
                    },
                    chartsData: data,
                }, commonResult);
                if (!Object.keys(currentGenericList).length) {
                    setComparisonList(prev => {
                        prev.pop();
                        prev = prev.concat(resultData)
                        return prev;
                    })
                } else {
                    setComparisonList(prev => {
                        const result = [].concat(prev);
                        result[currentIndex] = resultData;
                        return result;
                    })
                }
            }
            setAddAlgorithmLoading(false)
        })
    }

    const onAlgorithmCancel = () => {
        setAddAlgorithmModal(false)
        setCurrentGenericList({});
    }

    useEffect(() => {
        if (ifLink) {
            echarts.connect('echartsLink');
        } else {
            echarts.connect('echartsUnLink');
        }
        return () => {
            echarts.disconnect('echartsLink');
            echarts.disconnect('echartsUnLink');
        };
    }, [ifLink])

    return (
        <Modal
            size='fullScreen'
            visible={visible}
            onCancel={() => onCancel()}
            footer={null}
            className={styles['task-info-modal']}
            title={
                <div className="task-info-model-header flex-box">
                    <span className="title">{
                        `${IntlFormatMessage('task.detail.metric')}: ${currentTaskInfo.metric || '-'}`
                    }</span>
                    <Pagination
                        simple
                        total={taskInfoList.length}
                        current={currntStep}
                        onChange={(current) => {
                            setModelListPage({
                                pageNum: 1,
                                totalPages: 1
                            })
                            setTimeout(() => {
                                setCurrentStep(current)
                                setComparisonList([])
                                setSelectTimeLine({})
                            }, 50)
                        }}
                        pageSize={1}
                    />
                </div>
            }
        >
            <Spin spinning={loading}>
                <div className="body" onScroll={(e) => {
                    const {scrollTop, offsetHeight, scrollHeight,} = e.target;
                    if ((scrollHeight - (scrollTop + offsetHeight) < 50) && !modelListScrollLoading) {
                        if (modelListPage.pageNum < modelListPage.totalPages) {
                            setModelListScrollLoading(true)
                            clearTimeout(timer);
                            timer = setTimeout(() => {
                                console.log(`现在是第${modelListPage.pageNum}页，一共${modelListPage.totalPages}页`)
                                initModelList(modelListPage.pageNum)
                            }, 300)
                        }
                    }
                }}>
                    <div className="body-top flex-box">
                        <div className="body-top-left flex-box">
                            <div className="train-time-box flex-box">{IntlFormatMessage('task.detail.trainingtime')}：
                                {
                                    !!selectTimeLine.taskTriggerTime ?
                                        <ScrollSelect
                                            style={{width: 400}}
                                            defaultValue={selectTimeLine.taskTriggerTime}
                                            onPopupScroll={(e) => {
                                                if (taskTimeList.content.length === taskTimeList.totalSize) {
                                                    return;
                                                }
                                                setLoadingSelect(true);
                                                const params = {
                                                    pageNum: taskTimeList.pageNum,
                                                    pageSize: 100,
                                                    query: Object.assign({}, {
                                                        metric: !!currentTaskInfo.metric ? currentTaskInfo.metric : null,
                                                        model: !!currentTaskInfo.model ? currentTaskInfo.model : null,
                                                        tags: !!currentTaskInfo.tags ? currentTaskInfo.tags : null,
                                                        target: !!currentTaskInfo.target ? currentTaskInfo.target : null,
                                                    }, {
                                                        taskId,
                                                        // taskVersion,
                                                    })
                                                }
                                                searchTaskInfoDetailTimeListAsync(params, callBack)
                                            }}
                                            scrollLoading={loadingSelect}
                                            loading={loadingSelect}
                                            onDropdownVisibleChange={(open) => {
                                                if (!open) {
                                                    const params = {
                                                        pageNum: 1,
                                                        pageSize: 100,
                                                        query: Object.assign({}, {
                                                            metric: !!currentTaskInfo.metric ? currentTaskInfo.metric : null,
                                                            model: !!currentTaskInfo.model ? currentTaskInfo.model : null,
                                                            tags: !!currentTaskInfo.tags ? currentTaskInfo.tags : null,
                                                            target: !!currentTaskInfo.target ? currentTaskInfo.target : null,
                                                        }, {
                                                            taskId,
                                                            // taskVersion,
                                                        })
                                                    }
                                                    searchTaskInfoDetailTimeListAsync(params, callBack)
                                                }
                                            }}
                                            onChange={(value, option) => {
                                                const {item = '{}'} = option.props;
                                                setModelListPage(prev => Object.assign({}, prev, {pageNum: 1}))
                                                setSelectTimeLine(JSON.parse(item))
                                            }}
                                        >
                                            {(toJS(taskTimeList.content) || []).map((item) => {
                                                const {startTime = '', endTime = ''} = item;
                                                return <Option
                                                    key={JSON.stringify(item)}
                                                    value={item.taskTriggerTime}
                                                    item={JSON.stringify(item)}
                                                >
                                                    {moment(new Date(startTime)).format("YYYY-MM-DD HH:mm:ss")}
                                                    &nbsp;~&nbsp;
                                                    {moment(new Date(endTime)).format("YYYY-MM-DD HH:mm:ss")}
                                                </Option>
                                            })}
                                        </ScrollSelect>
                                        : null
                                }
                            </div>
                            <TooltipDiv
                                className="item-title"
                                title={currentTaskInfo.tags}
                            >
                                {IntlFormatMessage('task.detail.dimension')}：
                                <span>{currentTaskInfo.tags || '-'}</span>
                            </TooltipDiv>
                        </div>
                        <div className="body-top-right flex-box">
                            <Checkbox onChange={(e) => {
                                const value = e.target.checked;
                                setIfLink(value)
                            }}>{IntlFormatMessage('task.detail.synchronize')}
                            </Checkbox>
                            <Checkbox defaultChecked={!!showParams} onChange={(e) => {
                                const value = e.target.checked;
                                setShowParams(value)
                            }}>{IntlFormatMessage('task.detail.showparameter')}</Checkbox>
                            <Tooltip title={IntlFormatMessage('laboratory.anomaly.addContrastive')}>
                                <Button
                                    type="primary"
                                    icon="plus"
                                    // disabled={!Object.keys(selectTimeLine).length || comparisonList.length >= 5}
                                    onClick={() => setAddAlgorithmModal(true)}
                                />
                            </Tooltip>
                        </div>
                    </div>
                    <div className="body-bottom">
                        {
                            comparisonList.length ?
                                (([].concat(comparisonList)).reverse() || []).map((item, index) => {
                                    return <ChartsItemComparison
                                        key={`${item.id}_${index}`}
                                        item={item}
                                        lowAndUpValue={lowAndUpValue}
                                        id={item.id}
                                        index={index}
                                        showParams={showParams}
                                        onSave={(value) => {
                                            setCurrentGenericList(value);
                                            setSaveGeneVisible(true);
                                        }}
                                        onEdit={(value) => {
                                            setCurrentGenericList(value);
                                            setAddAlgorithmModal(true)
                                        }}
                                        addAlgorithmLoading={addAlgorithmLoading}
                                    />
                                })
                                : null
                        }
                        {
                            !!Object.keys(selectTimeLine).length
                            && (toJS(taskChartsList) || []).map((item, index) => {
                                return <ChartsItem
                                    key={`${item.seriesResultId}_${index}`}
                                    index={index}
                                    item={item}
                                    lowAndUpValue={lowAndUpValue}
                                    param={currentTaskInfo}
                                    selectTimeLine={selectTimeLine}
                                    showParams={showParams}
                                    onSave={(value) => {
                                        setCurrentGenericList(value);
                                        setSaveGeneVisible(true);
                                    }}
                                    setLoading={setLoading}
                                />
                            })
                        }
                    </div>
                    <div className="body-footer">
                        {
                            modelListScrollLoading ? <Spin tip={"Loading..."}/> :
                                ((modelListPage.pageNum > modelListPage.totalPages) ? '' : null)
                        }
                    </div>
                </div>

                {/*添加对比模型*/}
                {
                    addAlgorithmModal &&
                    <EditAlgorithmAlert
                        visible={addAlgorithmModal}
                        onSave={onAlgorithmSave}
                        onCancel={onAlgorithmCancel}
                        genericsList={genericsList}
                        // loading={addAlgorithmLoading}
                        genericId={currentGenericList.genericId}
                        isChecked={currentGenericList.isOverwriteForecastParams}
                        currentParameters={currentGenericList.algorithmParams}
                        setCurrentParameters={() => setCurrentGenericList({})}
                        currentGeneric={currentGenericList}
                        genericName={currentGenericList.genericName}
                        title={Object.keys(currentGenericList).length ? IntlFormatMessage('laboratory.anomaly.editContrastiveG') : IntlFormatMessage('laboratory.anomaly.addContrastiveG')}
                        comeFrom={"taskManagement"}
                    />
                }
                {
                    saveGeneVisible &&
                    <SaveGeneric
                        visible={saveGeneVisible}
                        currentGenericList={currentGenericList}
                        deleteCurrentGenericList={() => {
                            setCurrentGenericList({})
                        }}
                        onSave={() => {
                            initAlgorithmFun()
                        }}
                        onClose={() => {
                            setSaveGeneVisible(false);
                        }}
                    />
                }
            </Spin>
        </Modal>
    )
}

export default connect(({taskManagementStore, genericsStore}) => {
    return {
        searchTaskInfoDetailAsync: taskManagementStore.searchTaskInfoDetailAsync,
        taskInfoList: taskManagementStore.taskInfoList,
        currentDetailInfo: taskManagementStore.currentDetailInfo,
        searchTaskInfoDetailTimeListAsync: taskManagementStore.searchTaskInfoDetailTimeListAsync,
        taskTimeList: taskManagementStore.taskTimeList,
        searchTaskInfoChartsListAsync: taskManagementStore.searchTaskInfoChartsListAsync,
        taskChartsList: taskManagementStore.taskChartsList,
        addContrastChartAsync: taskManagementStore.addContrastChartAsync,
        searchChartsRawDataInfoAsync: taskManagementStore.searchChartsRawDataInfoAsync,
        setTaskInfoListReducer: taskManagementStore.setTaskInfoListReducer,
        setTaskTimeListReducer: taskManagementStore.setTaskTimeListReducer,
        setTaskChartsListReducer: taskManagementStore.setTaskChartsListReducer,
        searchChartsInfoAsync: taskManagementStore.searchChartsInfoAsync,
        getTaskDetailAsync: taskManagementStore.getTaskDetailAsync,

        searchAlgorithmAsync: genericsStore.searchAlgorithmAsync,
        genericsList: genericsStore.list,
    };
})(Form.create()(TaskInfoModel));