import React, {Fragment, useEffect} from 'react';
import {Steps, Button, BasicLayout, Form, message} from '@chaoswise/ui';
import styles from './index.less';
import BasicInfo from './BasicInfo';
import moment from 'moment';
import ArithmeticSelect from './ArithmeticSelect';
import {connect, toJS} from "@chaoswise/cw-mobx";
import DataSetting from './DataSetting';
import {useFetchState} from "@/components/HooksState";
import {success} from "@/utils/tip";
import {IntlFormatMessage} from "@/utils/util";

const {Footer} = BasicLayout;

const {Step} = Steps;

function SingleCheck(props) {
    const {
        form,
        match = {},
        addTbList,
        dataSetInfo,
        history,
        dimensionalList,
        genericityList,
        getTbDetail,
        currentList,
        setDataSetInfo,
        setDimensionalList,
        delArithmetic,
        updateDataSetInfo,
        setBackTitle,
        deleteDataSetInfo,
    } = props;
    const {params = {}, path = '',} = match;
    const {taskId = '', sceneId = ''} = params;

    useEffect(() => {
        if (sceneId) {
            updateDataSetInfo('scene', sceneId);
        }

        return () => {
            deleteDataSetInfo();

        };
    }, [sceneId]);

    const [current, setCurrent] = useFetchState(0);
    const [loading, setLoading] = useFetchState(false);

    useEffect(() => {
        if (taskId) {
            getTbDetail(taskId, {
                cb: (data) => {
                    const {
                        taskName = '', description = undefined, scene = 'anomaly_detection',
                        dataSourceList = [], aggConfig = {}, startTime = 0, endTime = 0, extendConfig = {}
                    } = data;
                    const {filtersConfig = {}, dataSource = {},} = dataSourceList[0];
                    const {metricAndTagFilters = [], modelFilter = {}, targetFilter = {}} = filtersConfig;
                    const {
                        dataProcessing = {},
                        // dataDecting = {}
                    } = extendConfig;
                    const {forecastTimeNumber = undefined, forecastTimeUnit = '', lowerThreshold = undefined, upperThreshold = undefined} = dataProcessing;
                    // const {image, to_ratio} = dataDecting;
                    const {type = 'DODB', id = '', name = ''} = dataSource;
                    const {aggFunc = '', aggTimeUnit = '', aggTimeNumber = undefined, aggPercentile = undefined} = aggConfig;
                    if (Object.keys(modelFilter).length) {
                        if (modelFilter.compare === 'IN') {
                            setDataSetInfo({
                                model: modelFilter.value
                            });
                        } else {
                            setDataSetInfo({
                                model: [modelFilter.value]
                            });
                        }
                    }
                    if (Object.keys(targetFilter).length) {
                        if (targetFilter.compare === 'IN') {
                            setDataSetInfo({
                                obj: targetFilter.value
                            });
                        } else {
                            setDataSetInfo({
                                obj: [targetFilter.value]
                            });
                        }
                    }
                    setDataSetInfo({
                        taskName: taskName + `-${IntlFormatMessage('datasource.create.copy')}`,
                        description,
                        scene,
                        dataSourceType: type,
                        datasourceId: {value: id, label: name},
                        method: aggFunc,
                        aggTimeUnit: aggTimeUnit,
                        aggPercentile,
                        number: aggTimeNumber,
                        time: [moment(startTime), moment(endTime)],
                        forecastTimeNumber,
                        forecastTimeUnit,
                        lowerThreshold,
                        upperThreshold,
                        // image, to_ratio,
                    });
                    if (metricAndTagFilters.length) {
                        setDimensionalList(metricAndTagFilters.map((item, index) => {
                            const {metricFilter = {}, tagsFilter = []} = item;
                            const tagsField = tagsFilter.map(item => {
                                let value = item.value;
                                if (item.compare !== 'E' && item.value !== 'NE') {
                                    if (typeof item.value === 'string') {
                                        value = [item.value];
                                    }
                                }
                                return {
                                    key: item.key,
                                    compare: item.compare,
                                    value: value
                                };
                            });
                            return {
                                id: index + 1,
                                metric: metricFilter.compare === 'E' ? [metricFilter.value] : metricFilter.value,
                                tagsField: tagsField
                            };
                        }));
                    }
                }
            });
        }
    }, [taskId]);

    const renderParams = () => {
        let metricAndTagFilters = [];
        if (dimensionalList.length > 0) {
            metricAndTagFilters = toJS(dimensionalList).map(item => {
                let obj = {};
                if (!!item.metric && item.metric.length) {
                    obj = Object.assign({}, obj, {
                        metricFilter: {
                            compare: item.metric.length > 1 ? 'IN' : 'E',
                            value: item.metric.length > 1 ? item.metric : item.metric[0]
                        },
                    });
                }
                return Object.assign({}, obj, {
                    tagsFilter: item.tagsField.map(v => {
                        let value = null;
                        if (v.value) {
                            if (typeof v.value === 'string') {
                                value = v.value;
                            } else if (v.value.length) {
                                value = v.value.length > 1 ? v.value : v.value[0];
                            }
                        }
                        return {
                            compare: v.compare || null,
                            key: v.key || null,
                            value,
                        };
                    })
                });
            });
        }
        let params = {
            taskName: dataSetInfo.taskName || null,
            description: dataSetInfo.description || null,
            datasourceId: dataSetInfo.datasourceId.value || null,
            scene: dataSetInfo.scene || null,
            aggConfig: Object.assign({}, {
                aggFunc: dataSetInfo.method || 'AVG',
                aggTimeUnit: dataSetInfo.aggTimeUnit || 'MINUTE',
                aggTimeNumber: dataSetInfo.number || 1,
            }, dataSetInfo.aggPercentile ? {
                aggPercentile: dataSetInfo.aggPercentile,
            } : {}),

            startTime: dataSetInfo.time[0] ? moment(dataSetInfo.time[0]).valueOf() : null,
            endTime: dataSetInfo.time[1] ? moment(dataSetInfo.time[1]).valueOf() : null,
            dataSourceList: [{
                dataSourceType: dataSetInfo.dataSourceType,
                dataSourceId: (dataSetInfo.datasourceId && dataSetInfo.datasourceId.value) || null,
                relationshipType: 'TIME_SERIES',
            }]
        };

        if ((dataSetInfo.model && dataSetInfo.model.length) || (dataSetInfo.obj && dataSetInfo.obj.length) || metricAndTagFilters.length) {
            params.dataSourceList[0].filtersConfig = {};
        }
        if (dataSetInfo.model && dataSetInfo.model.length) {
            params.dataSourceList[0].filtersConfig.modelFilter = {
                key: 'model',
                compare: dataSetInfo.model.length > 1 ? 'IN' : 'E',
                value: dataSetInfo.model.length > 1 ? dataSetInfo.model : dataSetInfo.model[0]
            };
        }
        if (dataSetInfo.obj && dataSetInfo.obj.length) {
            params.dataSourceList[0].filtersConfig.targetFilter = {
                key: 'target',
                compare: dataSetInfo.obj.length > 1 ? 'IN' : 'E',
                value: dataSetInfo.obj.length > 1 ? dataSetInfo.obj : dataSetInfo.obj[0]
            };
        }
        if (metricAndTagFilters.length) {
            params.dataSourceList[0].filtersConfig.metricAndTagFilters = metricAndTagFilters;
        }
        if (dataSetInfo.scene === 'forecasting') {
            params.extendConfig = {
                dataProcessing: {
                    forecastTimeNumber: dataSetInfo.forecastTimeNumber,
                    forecastTimeUnit: dataSetInfo.forecastTimeUnit,
                    lowerThreshold: dataSetInfo.lowerThreshold,
                    upperThreshold: dataSetInfo.upperThreshold,
                    // mode: dataSetInfo.mode.length > 0 ? 'FIT' : 'FORECAST'
                }
            };
            // } else {
            //     params.extendConfig = {
            //         dataDecting: {
            //             image: dataSetInfo.image,
            //             to_ratio: dataSetInfo.to_ratio,
            //         }
            //     };
        }
        return params;
    };
    const renderTaskPublicGenericList = () => {
        let taskPublicGenericList = [];
        if (genericityList.length > 0) {
            const {selectRowKey = [], scene = 'anomaly_detection'} = dataSetInfo;
            taskPublicGenericList = genericityList.map(item => {
                return {
                    algorithmGenericId: item.genericId,
                    algorithmId: item.algorithmId,
                    algorithmName: item.algorithmName,
                    algorithmVersion: item.algorithmVersion,
                    algorithmParams: item.algorithmParams.map(item => {
                        if (item.value || item.value === 0) {
                            return item;
                        }
                        return {
                            name: item.name,
                            value: null
                        };
                    }),
                    algorithmNameZh: item.algorithmNameZh,
                    genericName: item.genericityname,
                    isOverwriteForecastParams: (scene === 'forecasting' && item.checked) ? true : false
                };
            });
        }
        return taskPublicGenericList;
    };

    const handleNext = () => {
        if (current !== 2) {
            form.validateFields((err) => {
                if (!err) {
                    setCurrent(current + 1);
                    delArithmetic();
                }
            });
        }
        if (current === 2) {
            setLoading(true);
            addTbList({
                ...renderParams(),
                taskPublicGenericList: renderTaskPublicGenericList(),
            }, {
                cb: (record) => {
                    delArithmetic();
                    success(
                        <span>{path.indexOf('copy') > -1 ? IntlFormatMessage('laboratory.anomaly.experimentCopied') : IntlFormatMessage('laboratory.anomaly.experimentCreated')}<span
                            style={{color: '#008DFF', cursor: 'pointer'}}
                            onClick={() => {
                                setBackTitle(record.taskName);
                                history.push(`/laboratory/${record.scene}/original/${record.id}/collect`);
                            }}
                        >{IntlFormatMessage('laboratory.anomaly.configureData')}</span></span>, 5);
                    setLoading(false);
                    history.go(-1);
                },
                err: () => {
                    setLoading(false);
                }
            });
        }

        // setCurrent(current + 1);
    };

    const handleDone = () => {

    };

    const handlePrev = () => {
        setCurrent(current - 1);
        delArithmetic(); //清空数据5个数据list
    };


    const handleSubmit = () => {
        // renderParams();
        // renderTaskPublicGenericList();
        form.validateFields((err) => {
            if (!err) {
                addTbList({
                    ...renderParams(),
                    taskPublicGenericList: renderTaskPublicGenericList()
                }, {
                    cb: (record) => {

                        delArithmetic();
                        success(<span>{IntlFormatMessage('laboratory.anomaly.experimentTaskCreated')}<span
                            style={{color: '#008DFF', cursor: 'pointer'}}
                            onClick={() => {
                                setBackTitle(record.taskName);
                                history.push(`/laboratory/${record.scene}/original/${record.id}/collect`);
                            }}
                        >{IntlFormatMessage('laboratory.anomaly.configureData')}</span></span>, 5);
                        history.push('/laboratory');
                    }
                });
            }
        });
    };

    const steps = [
        {
            title: IntlFormatMessage('laboratory.create.basicinformation'),
            content: <BasicInfo handleNext={handleNext} form={form}/>
        },
        {
            title: IntlFormatMessage('laboratory.detail.datasettings'),
            content: <DataSetting handleNext={handleNext} form={form} handlePrev={handlePrev}/>
        },
        {
            title: IntlFormatMessage('laboratory.create.agorithmgenericity'),
            content: <ArithmeticSelect handlePrev={handlePrev} handleDone={handleDone}/>
        },
    ];


    return (
        <Fragment>
            <div className={styles['single-wrapper']}>
                <Steps current={current} style={{marginBottom: current === 2 ? 24 : 40}}>
                    {steps.map(item => (
                        <Step key={item.title} title={item.title}/>
                    ))}
                </Steps>
                <div className={styles["single-content"]}>{steps[current].content}</div>
            </div>
            <Footer>
                {
                    current !== 0 && (
                        <Button style={{marginRight: '16px'}}
                                onClick={handlePrev}
                        >{IntlFormatMessage('common.previous')}</Button>
                    )
                }
                {
                    current !== 1 && <Button type='primary' loading={loading} onClick={handleNext}>{
                        current === 2 ?
                            IntlFormatMessage('common.ok') :
                            IntlFormatMessage('common.next')
                    }</Button>
                }

                {
                    current === 1 &&
                    <Button onClick={handleNext} type='primary' style={{marginRight: '16px'}}>{
                        IntlFormatMessage('common.next')
                    }</Button>
                }
            </Footer>
        </Fragment>
    );
}

export default connect(({laboratoryStore, store}) => {
    return {
        addTbList: laboratoryStore.addTbList,
        dataSetInfo: laboratoryStore.dataSetInfo,
        dimensionalList: laboratoryStore.dimensionalList,
        genericityList: laboratoryStore.genericityList,
        getTbDetail: laboratoryStore.getTbDetail,
        currentList: laboratoryStore.currentList,
        setDataSetInfo: laboratoryStore.setDataSetInfo,
        setDimensionalList: laboratoryStore.setDimensionalList,
        delArithmetic: laboratoryStore.delArithmetic,
        updateDataSetInfo: laboratoryStore.updateDataSetInfo,
        deleteDataSetInfo: laboratoryStore.deleteDataSetInfo,
        setBackTitle: store.setBackTitle,
    };
})(Form.create()(SingleCheck));
