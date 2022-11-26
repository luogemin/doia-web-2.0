import React, {Fragment, useEffect, useRef} from 'react';
import {Steps, Button, BasicLayout, Form, Empty, Spin, Checkbox, Tooltip, Skeleton,} from '@chaoswise/ui';
import styles from './index.less';
import moment from 'moment';
import ArithmeticSelect from '@/pages/Laboratory/components/SingleCheck/ArithmeticSelect';
import {connect, toJS} from "@chaoswise/cw-mobx";
import {useFetchState} from "@/components/HooksState";
import {error, success} from "@/utils/tip";
import {IntlFormatMessage} from "@/utils/util";
import ChartList from "./ChartList";
import DataView from './DataView';
import EditAlgorithmAlert from "@/components/EditAlgorithmAlert";
import SaveGeneric from "@/pages/Laboratory/components/Detail/SaveGeneric";
import {useHistory, useLocation, useParams} from "react-router";

const {Footer} = BasicLayout;
const {Step} = Steps;
const {Group} = Checkbox;

const timeUnit = {
    'SECOND': IntlFormatMessage('laboratory.anomaly.second'),
    'MINUTE': IntlFormatMessage('laboratory.anomaly.minutes'),
    'HOUR': IntlFormatMessage('laboratory.anomaly.hours'),
    'DAY': IntlFormatMessage('laboratory.anomaly.days'),
};

const options = [
    // {label: IntlFormatMessage('laboratory.detail.synchronize'), value: 'link'},
    {label: IntlFormatMessage('laboratory.detail.showparameter'), value: 'parameter'},
];
const LogAnomalyDetail = (props) => {
    const {
        form,
        genericityData,
        queryLogpatternreAsync,
        getlogPatternCalculateAsync,
        searchAlgorithmAsync,
        addGenericList, modifyGenericList, deleteDenericList, getOriginData,
        originLogTrendAsync, getAnomalyResultAsync, genericId,
    } = props;
    const history = useHistory();
    const {id} = useParams();
    const {pathname} = useLocation();
    const ref = useRef({
        getCalculate: null,
    });
    const [loading, setLoading] = useFetchState(false);
    const [comparisonVisible, setComparisonVisible] = useFetchState(false);
    const [chartData, setChartData] = useFetchState([]);
    const [editNum, seteditNum] = useFetchState('');
    const [currentGenericList, setCurrentGenericList] = useFetchState({});
    const [genericName, setGenericName] = useFetchState(undefined);
    const [currentParameters, setCurrentParameters] = useFetchState(null);
    const [addGenericLoading, setAddGenericLoading] = useFetchState(false);
    const [checked, setChecked] = useFetchState(false);
    const [currentEditId, setCurrebtEditId] = useFetchState('');
    const [selectOption, setSelectOption] = useFetchState([]);
    const [saveGeneVisible, setSaveGeneVisible] = useFetchState(false); //保存泛型的弹框
    const [laboratoryRecord, setLaboratoryRecord] = useFetchState({});
    //趋势图
    const [allTrendList, setAllTrendList] = useFetchState([]);

    const {dataSourceName, aggConfig = {}, startTime, endTime,} = laboratoryRecord;

    const searchAlgorithmFun = () => {
        searchAlgorithmAsync({
            pageNum: 1,
            pageSize: 500,
            query: {
                scene: 'log_anomaly_detection',
                isIncludeAlgorithm: true,
            }
        });
    };
    //返回清空数据，获取泛型列表
    useEffect(() => {
        searchAlgorithmFun();
        queryOriginLogTrendFun();
    }, []);

    const queryOriginLogTrendFun = (type, currentEditId) => {
        setLoading(true);
        setAllTrendList([]);
        getAnomalyResultAsync({taskId: id}, {
            cb: (res) => {
                if (res.code && res.code === 100000) {
                    const {data = {}} = res;
                    const {trainResults = [], ...rest} = data;
                    if (type === 'getCalculate-add') {
                        setAllTrendList(trainResults.map((item, index) => {
                            return Object.assign({}, item,
                                index === 0 ? {
                                    needGetCalculate: true
                                } : {});
                        }));
                    } else if (type === 'getCalculate-edit') {
                        setAllTrendList(trainResults.map(item => {
                            return Object.assign({}, item,
                                item.tuningBenchGeneric.id === currentEditId ? {
                                    needGetCalculate: true
                                } : {});
                        }));
                    } else {
                        setAllTrendList(trainResults);
                    }
                    setLaboratoryRecord(data);
                    setLoading(false);
                } else {
                    error(res.msg || IntlFormatMessage('task.common.obtainedFailed'));
                    setLoading(false);
                }
            }
        });

        // originLogTrendAsync(id, {
        //     cb: (info) => {
        //         setOriginTrenList(info);
        //         setLoading(false);
        //     }
        // });
    };
    //添加对比模型
    const addAlgorithmList = (param, checked) => {
        const {algorithmId = '', algorithmName = '', algorithmVersion = '', algorithmGenericId = ''} = currentGenericList;
        setAddGenericLoading(true);
        const {algorithm = {}} = param;
        if (editNum) {
            modifyGenericList({
                algorithmId: param.algorithmId || algorithmId,
                algorithmName: param.algorithmName || algorithmName,
                algorithmGenericId: param.id || algorithmGenericId,
                algorithmVersion: param.algorithmVersion || algorithmVersion,
                taskId: id,
                seriesId: '0',
                algorithmParams: param.parameters.map(item => {
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
                genericName: param.genericityname,
                isOverwriteForecastParams: !!checked
            }, {
                cb: (data) => {
                    success(IntlFormatMessage('laboratory.anomaly.edited'));
                    setAddGenericLoading(false);
                    seteditNum('');
                    setCurrentParameters(null);
                    handleCancelEditAlo();
                    queryOriginLogTrendFun('getCalculate-edit', currentEditId); //
                    setChecked(false);
                },
                err: () => {
                    setAddGenericLoading(false);
                }
            });
        } else {
            addGenericList({
                algorithmId: param.algorithmId,
                algorithmName: param.algorithmName,
                algorithmGenericId: param.id,
                algorithmVersion: param.algorithmVersion,
                taskId: id,
                seriesId: '0',
                algorithmParams: param.parameters.map(item => {
                    if (item.value || item.value === 0) {
                        return item;
                    }
                    return {
                        name: item.name,
                        value: null
                    };
                }),
                genericName: param.genericityname,
                algorithmNameZh: algorithm.nameZh,
                isOverwriteForecastParams: !!checked
                // algorithmNameEnglish: algorithm.name
            }, {
                cb: (data) => {
                    success(IntlFormatMessage('laboratory.anomaly.addedBtn'));
                    setAddGenericLoading(false);
                    handleCancelEditAlo();
                    setCurrentParameters(null);
                    setAllTrendList(prev => {
                        prev.unshift({});
                        return prev;
                    });
                    queryOriginLogTrendFun('getCalculate-add');
                    setChecked(false);
                },
                err: () => {
                    setAddGenericLoading(false);
                }
            });
        }
    };
    const handleCancelEditAlo = () => {
        setComparisonVisible(false);
        seteditNum('');
        setGenericName(undefined);
        setCurrentParameters(null);
    };
    const editCurrentGeneric = (item) => {
        const {algorithmGenericId = '', id = '', algorithmParams, isOverwriteForecastParams = false, genericName} = item;
        setChecked(isOverwriteForecastParams);
        seteditNum(algorithmGenericId || id);
        setCurrentParameters(algorithmParams);
        setCurrebtEditId(id);
        setComparisonVisible(true);
        setGenericName(genericName);
    };

    return (
        <div className={styles["log-anomaly-detail"]}>
            <Spin spinning={loading} wrapperClassName='modal-spin-origan'>
                <div className='dataview-modal-main'>
                    <div className='modal-header'>
                        <div className='labor-header-desc'>
                            <span className='labor-desc'>{IntlFormatMessage('laboratory.list.datasource')}:
                                <span>{dataSourceName}</span>
                            </span>
                            <span className='labor-desc'>{IntlFormatMessage('laboratory.detail.trainingtime')}:
                                <span>{moment(startTime).format('YYYY-MM-DD HH:mm:ss')}
                                    -{moment(endTime).format('YYYY-MM-DD HH:mm:ss')}</span>
                            </span>
                            <span className='labor-desc'>{IntlFormatMessage('laboratory.anomaly.statisticsWindow')}:
                                <span>{aggConfig.aggTimeNumber}{timeUnit[aggConfig.aggTimeUnit]}</span>
                            </span>
                        </div>
                        <div className='model-header-right'>
                            <Group value={selectOption} onChange={(value) => {
                                setSelectOption(value);
                            }} options={options}/>
                            <Tooltip title={IntlFormatMessage('laboratory.anomaly.addContrastive')}>
                                <Button
                                    icon='plus' type='primary'
                                    // disabled={chartData.length >= 10 ? true : false}
                                    onClick={() => {
                                        setComparisonVisible(true);
                                    }}
                                />
                            </Tooltip>
                        </div>
                    </div>
                    <div className="dataview-modal-body">
                        {
                            !!allTrendList && allTrendList.length ?
                                (allTrendList || []).map((item, index) => {
                                    return <DataView
                                        key={index}
                                        index={index}
                                        item={item}
                                        selectOption={selectOption}
                                        setCurrentGenericList={setCurrentGenericList}
                                        editCurrentGeneric={editCurrentGeneric}
                                        setSaveGeneVisible={setSaveGeneVisible}
                                        queryOriginLogTrendFun={queryOriginLogTrendFun}
                                        setAllTrendList={setAllTrendList}
                                    />;
                                })
                                :
                                loading ? <Skeleton active/> :
                                    <Empty
                                        style={{width: '100%'}}
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        description={<span>
                                            {`${IntlFormatMessage('task.detail.nogenericityfound')}，`}
                                    <span style={{color: '#008DFF', cursor: 'pointer'}}
                                          onClick={() => setComparisonVisible(true)}>
                                        {IntlFormatMessage('task.detail.toadd')}
                                    </span>
                                </span>}/>
                        }
                    </div>
                </div>
            </Spin>
            {
                comparisonVisible &&
                <EditAlgorithmAlert
                    title={editNum ? IntlFormatMessage('laboratory.anomaly.editContrastive') : IntlFormatMessage('laboratory.anomaly.addContrastive')}
                    visible={comparisonVisible}
                    onSave={(value, checked) => {
                        if (!loading) {
                            addAlgorithmList(value, checked);
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
                    loading={addGenericLoading}
                />
            }
            {
                saveGeneVisible &&
                <SaveGeneric
                    visible={saveGeneVisible}
                    currentGenericList={currentGenericList}
                    deleteCurrentGenericList={() => {
                        setCurrentGenericList({});
                    }}
                    onSave={() => {
                        if (!loading) {
                            searchAlgorithmFun();
                        }
                    }}
                    onClose={() => {
                        setSaveGeneVisible(false);
                    }}
                />
            }
        </div>
    );
};

export default connect(({laboratoryStore, genericsStore, store}) => {
    return {
        searchAlgorithmAsync: genericsStore.searchAlgorithmAsync,
        genericId: laboratoryStore.genericId,
        originLogTrendAsync: laboratoryStore.originLogTrendAsync,
        queryLogpatternreAsync: laboratoryStore.queryLogpatternreAsync,
        genericityData: genericsStore.list,
        getResult: laboratoryStore.getResult,
        getlogPatternCalculateAsync: laboratoryStore.getlogPatternCalculateAsync,
        getOriginData: laboratoryStore.getOriginData,
        addGenericList: laboratoryStore.addGenericList,
        modifyGenericList: laboratoryStore.modifyGenericList,
        deleteDenericList: laboratoryStore.deleteDenericList,
        getAnomalyResultAsync: laboratoryStore.getAnomalyResultAsync,
    };
})(Form.create()(LogAnomalyDetail));
