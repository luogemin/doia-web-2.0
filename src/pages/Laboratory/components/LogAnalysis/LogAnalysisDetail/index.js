import React, {Fragment, useEffect} from 'react';
import {Steps, Button, BasicLayout, Form, Icon, Spin, Empty, Checkbox, Tooltip, Skeleton,} from '@chaoswise/ui';
import styles from './index.less';
import moment from 'moment';
import ArithmeticSelect from '@/pages/Laboratory/components/SingleCheck/ArithmeticSelect';
import {connect, toJS} from "@chaoswise/cw-mobx";
import {useFetchState} from "@/components/HooksState";
import {error, success} from "@/utils/tip";
import {IntlFormatMessage} from "@/utils/util";
import ChartList from "./ChartList";
import EditAlgorithmAlert from "@/components/EditAlgorithmAlert";
import SaveGeneric from "@/pages/Laboratory/components/Detail/SaveGeneric";

const {Footer} = BasicLayout;
const {Step} = Steps;
const {Group} = Checkbox;
const options = [
    // {label: IntlFormatMessage('laboratory.detail.synchronize'), value: 'link'},
    {label: IntlFormatMessage('laboratory.detail.showparameter'), value: 'parameter'},
];
const timeUnit = {
    'SECOND': IntlFormatMessage('laboratory.anomaly.second'),
    'MINUTE': IntlFormatMessage('laboratory.anomaly.minutes'),
    'HOUR': IntlFormatMessage('laboratory.anomaly.hours'),
    'DAY': IntlFormatMessage('laboratory.anomaly.days'),
};

const LogAnalysisDetail = (props) => {
    const {
        form,
        match = {},
        genericityData,
        queryLogpatternreAsync,
        getlogPatternCalculateAsync,
        searchAlgorithmAsync,
        addGenericList, modifyGenericList, deleteDenericList, getOriginData,
    } = props;
    const {params = {}, path = '',} = match;
    const {id = '', genericId = ''} = params;
    const IconFont = Icon.createFromIconfontCN({
        scriptUrl: '//at.alicdn.com/t/font_2616998_620g0mxg08d.js',
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
    const [modelInfo, setModalInfo] = useFetchState({});
    const [saveGeneVisible, setSaveGeneVisible] = useFetchState(false); //保存泛型的弹框
    const {aggConfig = {}} = modelInfo;

    const searchAlgorithmFun = () => {
        searchAlgorithmAsync({
            pageNum: 1,
            pageSize: 500,
            query: {
                scene: 'log_parsing',
                isIncludeAlgorithm: true,
            }
        });
    };
    //返回清空数据，获取泛型列表
    useEffect(() => {
        searchAlgorithmFun();
        setLoading(true);
        return () => {
            setChartData([]);
            setModalInfo({});
        };
    }, []);

    const queryLogpatternreFun = () => {
        setLoading(true);
        setChartData([]);
        queryLogpatternreAsync(id, {
            cb: (info = {}) => {
                setLoading(false);
                if (!!info && !!Object.keys(info).length) {
                    const {taskInfo = {}, logPatternList = []} = info;
                    setModalInfo(taskInfo);
                    setChartData(logPatternList);
                }
            },
            err: () => {
                setLoading(false);
            }
        });
        if (loading) {
            setTimeout(() => {
                setLoading(false);
            }, 10000);
        }
    };
    //查询结果
    useEffect(() => {
        queryLogpatternreFun();
    }, []);

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
                    queryLogpatternreFun();
                    setChecked(false);
                },
                err: () => {
                    setAddGenericLoading(false);
                }
            });
        } else {
            //确定的添加接口
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
                    queryLogpatternreFun();
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
        <div className={styles["log-analysis-detail"]}>
            <Spin spinning={loading} wrapperClassName='modal-spin-origan'>
                <div className='dataview-modal-main'>
                    <div className='modal-header'>
                        <div className='labor-header-desc flex-box'>
                            <span className='labor-desc flex-box only-show-one-line'>
                                {IntlFormatMessage('laboratory.anomaly.totalLogs')}:
                                <Tooltip title={modelInfo.logNum}>
                                    <p className='labor-desc-span only-show-one-line'>{modelInfo.logNum}</p>
                                </Tooltip>
                            </span>
                            <span className='labor-desc flex-box only-show-one-line'>
                                {IntlFormatMessage('laboratory.list.datasource')}:
                                <Tooltip title={modelInfo.dataSourceName}>
                                    <p className='labor-desc-span only-show-one-line'>{modelInfo.dataSourceName}</p>
                                </Tooltip>
                            </span>
                            <div className="flex-box labor-header-desc-left">
                                <span className='labor-desc flex-box only-show-one-line'>
                                    {IntlFormatMessage('laboratory.detail.trainingtime')}:
                                     <Tooltip
                                         title={`${moment(modelInfo.startTime).format('YYYY-MM-DD HH:mm:ss')}-${moment(modelInfo.endTime).format('YYYY-MM-DD HH:mm:ss')}`}>
                                        <span className='labor-desc-time only-show-one-line'>
                                            {`${moment(modelInfo.startTime).format('YYYY-MM-DD HH:mm:ss')}-${moment(modelInfo.endTime).format('YYYY-MM-DD HH:mm:ss')}`}
                                        </span>
                                     </Tooltip>
                                </span>

                                <span className='labor-desc flex-box only-show-one-line'>
                                {IntlFormatMessage('laboratory.anomaly.statisticsWindow')}:
                                 <Tooltip title={`${aggConfig.aggTimeNumber}${timeUnit[aggConfig.aggTimeUnit]}`}>
                                    <span className='labor-desc-span only-show-one-line'>
                                        {aggConfig.aggTimeNumber}{timeUnit[aggConfig.aggTimeUnit]}
                                    </span>
                                 </Tooltip>
                            </span>
                            </div>
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
                    <div className="dataview-modal-body"
                         style={!!chartData && !!chartData.length ? {} : {alignItems: 'center'}}>
                        {
                            !!chartData && !!chartData.length ?
                                chartData.map((item, index) => {
                                    return <ChartList
                                        key={item.id || index}
                                        indexKey={item.id || index}
                                        index={JSON.stringify(item)}
                                        item={item}
                                        getlogPatternCalculateAsync={getlogPatternCalculateAsync}
                                        setCurrentGenericList={setCurrentGenericList} //编辑弹框
                                        setSaveGeneVisible={setSaveGeneVisible}
                                        editCurrentGeneric={editCurrentGeneric}
                                        selectOption={selectOption}
                                        queryLogpatternreFun={queryLogpatternreFun}
                                        deleteDenericList={deleteDenericList}
                                        getOriginData={getOriginData}
                                    />;
                                })
                                :
                                loading ? <Skeleton active/> : <Empty
                                    style={{width: '100%', height: 300}}
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description={
                                        <span>
                                            {IntlFormatMessage('laboratory.detail.nogenericityfound')}
                                            <span style={{color: '#008DFF', cursor: 'pointer'}}
                                                  onClick={() => setComparisonVisible(true)}>
                                                {IntlFormatMessage('generics.list.table.note.second')}{`>`}
                                            </span>
                                        </span>
                                    }/>
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

        queryLogpatternreAsync: laboratoryStore.queryLogpatternreAsync,
        genericityData: genericsStore.list,
        getResult: laboratoryStore.getResult,
        getlogPatternCalculateAsync: laboratoryStore.getlogPatternCalculateAsync,
        getOriginData: laboratoryStore.getOriginData,
        addGenericList: laboratoryStore.addGenericList,
        modifyGenericList: laboratoryStore.modifyGenericList,
        deleteDenericList: laboratoryStore.deleteDenericList,
    };
})(Form.create()(LogAnalysisDetail));
