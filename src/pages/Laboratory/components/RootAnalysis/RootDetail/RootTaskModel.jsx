import React, {Fragment, useEffect,} from 'react';
import {
    Select,
    Modal,
    Form,
    Pagination,
    Button,
    Empty,
    Tooltip,
    Checkbox,
    Input,
    Spin
} from '@chaoswise/ui';
import EditAlgorithmAlert from "@/components/EditAlgorithmAlert";
import TooltipDiv from "@/components/TooltipDiv";
import {connect, toJS} from "@chaoswise/cw-mobx";
import {useParams} from 'react-router-dom';
import {error, success, info, warning} from "@/utils/tip";
import styles from './index.less';
import moment from 'moment';
import * as echarts from 'echarts';
import ChartList from './ChartList';
import {useFetchState} from "@/components/HooksState";
import {ClearSomLocalStorage, IntlFormatMessage, IsInternationalization} from "@/utils/util";
import SaveGeneric from "@/pages/Laboratory/components/Detail/SaveGeneric";

const formLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 15}
};
const {confirm} = Modal;
const {Option} = Select;
const {Search} = Input;
const {Group} = Checkbox;
const options = [
    {label: IntlFormatMessage('laboratory.detail.synchronize'), value: 'link'},
    {label: IntlFormatMessage('laboratory.detail.showparameter'), value: 'parameter'},
];
let timer = {
    getGroupMetriclistAsync: null,
    searchValue: null,
};

function RootTaskModel(props) {

    const {
        rootCauseGenericDataAsync,
        seriesCreated,
        targetModel,
        metricKey,
        form,
        genericityData,
        getGenericSericeList,
        getResult,
        getTrigger,
        getOriginData,
        getGroupMetriclistAsync,
        groupMetricDetaillist,
        selectedNode, modifyGenericList,
        setSelectedNode, setSelectNodeToCheck, rootCauseCalculatAsync, searchAlgorithmAsync,
        getRootAlgorithmDetailAsync, getGenericSericeFun,
        ...rest
    } = props;
    const fromModel = JSON.parse(toJS(selectedNode[0]).id).model;
    const fromTarget = JSON.parse(toJS(selectedNode[0]).id).target;
    const fromModelAndTargetJson = toJS(selectedNode[0]).id;
    const {id} = useParams();

    const [visible, setVisible] = useFetchState(false);
    const [pageInfo, setPageInfo] = useFetchState({
        pageNum: 1,
        pageSize: 10,
        totalSize: 0,
        searchValue: null,
    });
    const [spinning, setSpinning] = useFetchState(false);
    const [editNum, seteditNum] = useFetchState('');
    const [editIndex, seteditIndex] = useFetchState(null);
    const [selectOption, setSelectOption] = useFetchState(['link']);
    const [chartDataList, setChartDataList] = useFetchState([]);
    const [currentEditId, setCurrebtEditId] = useFetchState('');
    const [currentGenericList, setCurrentGenericList] = useFetchState({});
    const [saveGeneVisible, setSaveGeneVisible] = useFetchState(false);
    const [genericName, setGenericName] = useFetchState(undefined);
    const [checked, setChecked] = useFetchState(false);
    const [currentParameters, setCurrentParameters] = useFetchState(null);
    const [comparisonVisible, setComparisonVisible] = useFetchState(false);
    const [settingGenericVisible, setSettingGenericVisible] = useFetchState(false);

    useEffect(() => {
        searchAlgorithmAsync({
            pageNum: 1,
            pageSize: 500,
            query: {
                taskId: id,
                scene: 'anomaly_detection',
                isIncludeAlgorithm: true,
            }
        });

        return () => {
            //泛型选择接口algorithmGeneric
            getRootAlgorithmDetailAsync({
                pageNum: 1,
                pageSize: 500,
                query: {
                    taskId: id,
                    scene: 'root_cause_analysis',
                    isIncludeAlgorithm: true,
                }
            });
        }
    }, [])

    const getGroupMetricFun = (page = {}) => {
        ClearSomLocalStorage();
        !spinning && setSpinning(true)
        // 根据模型对象，拉取指标维度
        const params = {
            pageNum: page.pageNum || 1,
            pageSize: page.pageSize || 10,
            query: {
                taskId: id,
                entryNodeJson: fromModelAndTargetJson,
                searchValue: page.searchValue || null
            }
        }
        clearTimeout(timer.getGroupMetriclistAsync);
        timer.getGroupMetriclistAsync = setTimeout(() => {
            getGroupMetriclistAsync(params, (res) => {
                const {content = [], pageNum = 1, pageSize = 1, totalPages = 0, totalSize = 0} = res;
                setPageInfo(prev => {
                    return Object.assign({}, prev, {
                        pageNum, totalSize
                    })
                })
                if (content.length) {
                    const modelList = content.map(item => {
                        return {
                            model: fromModel,
                            target: fromTarget,
                            ...item
                        }
                    });
                    rootCauseGenericDataAsync({
                        taskId: id,
                        isExecAll: false,
                        rawDataList: modelList,
                    }, {
                        cb: (res = []) => {
                            setChartDataList(prev => res.map((rowData, index) => {
                                const {tuningBenchResult = {}, tuningBenchGeneric = {}} = rowData;
                                return Object.assign({}, {
                                    tuningBenchResult,
                                    tuningBenchGeneric,
                                    rawData: {
                                        ...modelList[index]
                                    },
                                    fromModelAndTargetJson,
                                    ...modelList[index],
                                })
                            }));
                            setSpinning(false);
                        },
                        err: () => {
                            setChartDataList([]);
                            setSpinning(false);
                        }
                    });
                } else {
                    setChartDataList([]);
                    setSpinning(false);
                }
            })
        }, 500)
    }

    useEffect(() => {
        !visible && setVisible(true)
        getGroupMetricFun()
    }, [selectedNode])

    useEffect(() => {
        if (selectOption.includes('link')) {
            echarts.connect('echartsLink');
        } else {
            echarts.connect('echartsUnLink');
        }
        return () => {
            echarts.disconnect('echartsLink');
            echarts.disconnect('echartsUnLink');
        };
    }, [selectOption]);

    // 计算
    const getTriggerresult = (param = [], type = '', index = 0) => {
        if (!!index || index === 0) {
            setChartDataList(prev => {
                return prev.map((each, Indx) => {
                    if (Indx === index) {
                        each.tuningBenchResult.status = 'starting';
                        each.tuningBenchResult.message = '';
                    }
                    return each;
                })
            })
        } else {
            setChartDataList(prev => {
                return prev.map((each, Indx) => {
                    each.tuningBenchResult.status = 'starting';
                    each.tuningBenchResult.message = '';
                    return each;
                })
            })
        }
        !spinning && setSpinning(true);
        rootCauseCalculatAsync({
            taskId: id,
            lists: param,
            isExecAll: false,
        }, {
            cb: (res) => {
                if (res.length) {
                    if (res.length > 1) {
                        setChartDataList(prev => res.map((rowData, index) => {
                            const {tuningBenchResult = {}, tuningBenchGeneric = {}} = rowData;
                            const {status = '', message} = tuningBenchResult;
                            if (!!status) {
                                if (status === 'success') {
                                    if (type === 'edit') {
                                        success(IntlFormatMessage('laboratory.anomaly.edited'));
                                    } else if (type === 'setting') {
                                        success(IntlFormatMessage('datasource.create.configured'));
                                    } else {
                                        success(IntlFormatMessage('laboratory.anomaly.calculated'));
                                    }
                                } else if (status === 'error') {
                                    error(message);
                                } else {
                                    warning(message);
                                }
                            } else {
                                warning(IntlFormatMessage('task.common.succeedsReturned'));
                            }

                            return Object.assign({}, param[index], param[index].rawData, rowData)
                        }));
                    } else {
                        const {tuningBenchResult = {}, tuningBenchGeneric = {}} = res[0];
                        const {status = '', message} = tuningBenchResult;
                        if (!!status) {
                            if (status === 'success') {
                                if (type === 'edit') {
                                    success(IntlFormatMessage('laboratory.anomaly.edited'));
                                } else if (type === 'setting') {
                                    success(IntlFormatMessage('datasource.create.configured'));
                                } else {
                                    success(IntlFormatMessage('laboratory.anomaly.calculated'));
                                }
                            } else if (status === 'error') {
                                error(message);
                            } else {
                                warning(message);
                            }
                        } else {
                            warning(IntlFormatMessage('task.common.succeedsReturned'));
                        }
                        setChartDataList(prev => {
                            prev[index] = Object.assign({}, param[0], param[0].rawData, res[0]);
                            return prev;
                        })
                    }
                    handleCancelEditAlo();
                } else {
                    setSpinning(false);
                    error(res.msg)
                }
            },
            err: () => {
                setSpinning(false);
            }
        });
    };

    //联动和显示参数变化
    const onOptionChange = (value) => {
        setSelectOption(value)
    }

    const handleCancelEditAlo = () => {
        setSpinning(false);
        setComparisonVisible(false);
        setSettingGenericVisible(false);
        seteditNum('');
        setChecked(false);
        setGenericName(undefined);
        setCurrentParameters(null);
    };

    const editCurrentGeneric = (item = {}, index = 0) => {
        const {algorithmGenericId = '', id = '', algorithmParams, isOverwriteForecastParams = false, genericName} = item;
        setChecked(isOverwriteForecastParams);
        seteditNum(algorithmGenericId || id);
        seteditIndex(index)
        setCurrentParameters(algorithmParams);
        setCurrebtEditId(id);
        setComparisonVisible(true);
        setGenericName(genericName);
    };

    const onCancel = () => {
        setSelectedNode([]);
        setVisible(false);
        setTimeout(() => {
            setSelectNodeToCheck(false)
        })
    }


    return (
        <Fragment>
            <Modal
                size='fullScreen'
                visible={visible}
                className={styles['root-modal-wrapper']}
                onCancel={() => onCancel()}
                footer={null}
                title={
                    <div className='labor-modal-pagi'>
                        <div className='modal-left'>
                            <span>{`${IntlFormatMessage('laboratory.detail.model')}:${fromModel} - ${IntlFormatMessage('laboratory.detail.object')}:${fromTarget}`}</span>
                        </div>
                        <div className="modal-right">
                            <Search
                                style={{width: 240}}
                                placeholder={IntlFormatMessage('laboratory.anomaly.metricDimension')}
                                onChange={(e) => {
                                    const {value} = e.target;
                                    clearTimeout(timer.searchValue);
                                    timer.searchValue = setTimeout(() => {
                                        const page = Object.assign({}, pageInfo, {
                                            searchValue: !!value ? value : null
                                        });
                                        setPageInfo(page)
                                        getGroupMetricFun(page)
                                    }, 300)
                                }}
                            />
                        </div>
                    </div>
                }
            >
                <Spin style={{height: '100%'}} spinning={spinning}>
                    <div className={'labor-modal-body'}>
                        <div className={'labor-header'}>
                            <span>{`${IntlFormatMessage('laboratory.detail.model')}:${fromModel} - ${IntlFormatMessage('laboratory.detail.object')}:${fromTarget}`}</span>
                            <div>
                                <Group value={selectOption} onChange={onOptionChange} options={options}/>
                                <Button
                                    style={{marginRight: 8}}
                                    disabled={!chartDataList || !chartDataList.length}
                                    onClick={() => {
                                        let isCanTriggerAll = true;
                                        try {
                                            chartDataList.forEach(item => {
                                                if (!item.tuningBenchGeneric || !Object.keys(item.tuningBenchGeneric).length) {
                                                    isCanTriggerAll = false;
                                                    throw Error();
                                                }
                                            })
                                        } catch (err) {
                                            console.log(err)
                                        }
                                        if (isCanTriggerAll) {
                                            const params = chartDataList.map(item => {
                                                return {
                                                    tuningBenchGeneric: item.tuningBenchGeneric,
                                                    rawData: item.rawData,
                                                }
                                            })
                                            setChartDataList(prev => {
                                                return prev.map((each) => {
                                                    each.tuningBenchResult.status = 'starting';

                                                    return each;
                                                })
                                            })
                                            getTriggerresult(params)
                                        } else {
                                            info(<span>{IntlFormatMessage('laboratory.anomaly.firstGenerity')}<span
                                                style={{color: '#008DFF', cursor: 'pointer'}}
                                                onClick={() => {
                                                    setSettingGenericVisible(true);
                                                }}
                                            >{IntlFormatMessage('laboratory.anomaly.firstGenericitySpecify')}</span></span>, 5)
                                        }
                                    }}
                                >{IntlFormatMessage('laboratory.anomaly.calculateAll')}</Button>
                                <Tooltip title={IntlFormatMessage('laboratory.anomaly.genericitySpecify')}>
                                    <Button
                                        icon="setting"
                                        style={{marginRight: 8}}
                                        onClick={() => {
                                            setSettingGenericVisible(true)
                                        }}
                                    />
                                </Tooltip>
                                <Tooltip title={IntlFormatMessage('laboratory.detail.resetBtn')}>
                                    <Button
                                        icon="sync"
                                        onClick={() => {
                                            getGroupMetricFun()
                                        }}
                                    />
                                </Tooltip>
                            </div>
                        </div>
                        <div className="labor-body-scroll">
                            {
                                (!!chartDataList && !!chartDataList.length) ? chartDataList.map((item, index) => {
                                        return <div className={'labor-chart'} key={index}>
                                            <ChartList
                                                taskId={id}
                                                item={item}
                                                index={index}
                                                getResult={getResult}
                                                getTrigger={getTrigger}
                                                setCurrentGenericList={setCurrentGenericList}
                                                selectOption={selectOption}
                                                getOriginData={getOriginData}
                                                setSelectOption={setSelectOption}
                                                selectedNode={selectedNode}
                                                setSaveGeneVisible={setSaveGeneVisible}
                                                editCurrentGeneric={editCurrentGeneric}
                                                onCancel={onCancel}
                                                ifSetAnalysis={true}
                                                getTriggerresult={getTriggerresult}
                                                {...rest}
                                            />
                                        </div>
                                    })
                                    :
                                    <div className={'chart-wrapper'}>
                                        <Empty description={
                                            <span>{IntlFormatMessage('laboratory.detail.nodatafound')}</span>
                                        }/>
                                    </div>
                            }
                        </div>
                    </div>
                    <div className="modal-footer">
                        <Pagination
                            showSizeChanger
                            showQuickJumper
                            pageSizeOptions={['5', '10', '20']}
                            total={pageInfo.totalSize}
                            current={pageInfo.pageNum}
                            pageSize={pageInfo.pageSize}
                            onChange={(current) => {
                                const page = Object.assign({}, pageInfo, {
                                    pageNum: current
                                });
                                setPageInfo(page)
                                getGroupMetricFun(page)
                            }}
                            onShowSizeChange={(current, pageSize) => {
                                const page = Object.assign({}, pageInfo, {
                                    pageNum: current,
                                    pageSize
                                });
                                setPageInfo(page)
                                getGroupMetricFun(page)
                            }}
                        />
                    </div>
                </Spin>
            </Modal>

            {/*添加/编辑 对比泛型*/}
            {
                comparisonVisible &&
                <EditAlgorithmAlert
                    title={editNum ? IntlFormatMessage('laboratory.anomaly.editContrastive') : IntlFormatMessage('laboratory.anomaly.addContrastive')}
                    visible={comparisonVisible}
                    onSave={(value, checked) => {
                        if (!spinning) {
                            const {tuningBenchGeneric = {}, rawData = {}} = currentGenericList;
                            const {
                                algorithmId = '', algorithmName = '', algorithmVersion = '', algorithmGenericId = '',
                                metric = '', tags = '',
                            } = tuningBenchGeneric;

                            const {algorithm = {}} = value;
                            const params = {
                                algorithmId: value.algorithmId || algorithmId,
                                algorithmName: value.algorithmName || algorithmName,
                                algorithmGenericId: value.id || algorithmGenericId,
                                algorithmVersion: value.algorithmVersion || algorithmVersion,
                                taskId: id,
                                seriesId: '0',
                                algorithmParams: value.parameters.map(item => {
                                    if (item.value || item.value === 0) {
                                        return item;
                                    }
                                    return {
                                        name: item.name,
                                        value: null
                                    };
                                }),
                                id: currentEditId,
                                algorithmNameZh: algorithm.nameZh,
                                genericName: value.genericityname,
                                isOverwriteForecastParams: !!checked
                            }
                            // addAlgorithmList(value, checked);
                            getTriggerresult([{
                                tuningBenchGeneric: params,
                                rawData,
                                ...rawData,
                            }], 'edit', editIndex)
                        }
                    }}
                    onCancel={handleCancelEditAlo}
                    centered={true}
                    isChecked={checked}
                    // bodyStyle={{ maxHeight: '400px', overflow: 'auto' }}
                    genericsList={genericityData}
                    setCurrentParameters={setCurrentParameters}
                    currentParameters={currentParameters}
                    genericId={editNum}
                    genericName={genericName}
                    loading={spinning}
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
                        searchAlgorithmAsync({
                            pageNum: 1,
                            pageSize: 500,
                            query: {
                                taskId: id,
                                scene: 'anomaly_detection',
                                isIncludeAlgorithm: true,
                            }
                        });
                    }}
                    onClose={() => {
                        setSaveGeneVisible(false)
                    }}
                />
            }

            {/*设置统一泛型*/}
            {
                settingGenericVisible &&
                <EditAlgorithmAlert
                    title={IntlFormatMessage('laboratory.anomaly.commonSpecify')}
                    visible={settingGenericVisible}
                    onSave={(value, checked) => {
                        if (!spinning) {
                            const {algorithm = {}} = value;
                            const algorithmParams = {
                                algorithmId: value.algorithmId,
                                algorithmName: value.algorithmName,
                                algorithmGenericId: value.id,
                                algorithmVersion: value.algorithmVersion,
                                taskId: id,
                                seriesId: '0',
                                algorithmParams: value.parameters.map(item => {
                                    if (item.value || item.value === 0) {
                                        return item;
                                    }
                                    return {
                                        name: item.name,
                                        value: null
                                    };
                                }),
                                id: currentEditId,
                                algorithmNameZh: algorithm.nameZh,
                                genericName: value.genericityname,
                                isOverwriteForecastParams: !!checked
                            }
                            const params = [].concat(chartDataList).map(item => {
                                return {
                                    tuningBenchGeneric: algorithmParams,
                                    rawData: item.rawData,
                                }
                            })
                            getTriggerresult(params, 'setting', !!editIndex ? editIndex : 0)
                        }
                    }}
                    onCancel={() => setSettingGenericVisible(false)}
                    centered={true}
                    // bodyStyle={{ maxHeight: '400px', overflow: 'auto' }}
                    genericsList={genericityData}
                    setCurrentParameters={setCurrentParameters}
                    currentParameters={currentParameters}
                    loading={spinning}
                />
            }
        </Fragment>
    );
}

export default connect(({laboratoryStore, genericsStore, TopoStore,}) => {
    return {
        selectedNode: TopoStore.selectedNode,
        setSelectedNode: TopoStore.setSelectedNode,

        rootCauseGenericDataAsync: laboratoryStore.rootCauseGenericDataAsync,
        rootCauseCalculatAsync: laboratoryStore.rootCauseCalculatAsync,

        searchAlgorithmService: laboratoryStore.searchAlgorithmService,
        genericityData: genericsStore.list,
        getGenericSericeList: laboratoryStore.getGenericSericeList,
        addGenericList: laboratoryStore.addGenericList,
        deleteDenericList: laboratoryStore.deleteDenericList,
        modifyGenericList: laboratoryStore.modifyGenericList,
        getResult: laboratoryStore.getResult,
        getTrigger: laboratoryStore.getTrigger,
        searchAlgorithmAsync: genericsStore.searchAlgorithmAsync,
        getRootAlgorithmDetailAsync: genericsStore.getRootAlgorithmDetailAsync,
        getOriginData: laboratoryStore.getOriginData,
        getGenericsNumAsync: laboratoryStore.getGenericsNumAsync,
        getGroupMetriclistAsync: laboratoryStore.getGroupMetriclistAsync,
        groupMetricDetaillist: laboratoryStore.groupMetricDetaillist,
    };
})(Form.create()(RootTaskModel));
