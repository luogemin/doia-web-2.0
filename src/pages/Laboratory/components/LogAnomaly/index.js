import React, {Fragment, useEffect} from 'react';
import {Steps, Button, BasicLayout, Form, message} from '@chaoswise/ui';
import styles from './index.less';
import BasicInfo from '@/pages/Laboratory/components/SingleCheck/BasicInfo';
import moment from 'moment';
import ArithmeticSelect from '@/pages/Laboratory/components/SingleCheck/ArithmeticSelect';
import {connect, toJS} from "@chaoswise/cw-mobx";
import DataSetting from './DataSetting';
import {useFetchState} from "@/components/HooksState";
import {success} from "@/utils/tip";
import {IntlFormatMessage} from "@/utils/util";

const {Footer} = BasicLayout;

const {Step} = Steps;

function LogAnomaly(props) {
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
        updateDataSetInfo('scene', 'log_anomaly_detection');
        if (taskId) {
            getTbDetail(taskId, {
                cb: (data) => {
                    const {
                        taskName = '', description = undefined, scene = 'log_anomaly_detection',
                        aggConfig = {}, startTime = 0, endTime = 0, dataSourceList = [],
                    } = data;

                    const {aggFunc = '', aggTimeUnit = '', aggTimeNumber = undefined} = aggConfig;
                    const dataSourceRelation = dataSourceList[0] || {};
                    const {dataSource = {}, filtersConfig = {}} = dataSourceRelation;
                    setDataSetInfo({
                        taskName: taskName + `-${IntlFormatMessage('datasource.create.copy')}`,
                        description,
                        scene,
                        dataSourceType: dataSource.type,
                        datasourceId: {value: dataSourceRelation.dataSourceId, label: dataSource.name},
                        method: aggFunc,
                        aggTimeUnit: aggTimeUnit,
                        number: aggTimeNumber,
                        partitionFields: filtersConfig.partitionFields,
                        analyzeFields: filtersConfig.analyzeFields,
                        time: [moment(startTime), moment(endTime)],
                    });
                }
            });
        }

        return () => {
            deleteDataSetInfo();
        };
    }, [taskId]);

    const [current, setCurrent] = useFetchState(0);
    const [loading, setLoading] = useFetchState(false);

    const renderParams = () => {
        let params = {
            taskName: dataSetInfo.taskName || null,
            description: dataSetInfo.description || null,
            dataSourceType: dataSetInfo.dataSourceType || null,
            datasourceId: dataSetInfo.datasourceId.value || null,
            scene: dataSetInfo.scene || null,
            aggConfig: {
                aggFunc: 'COUNT',
                aggTimeUnit: dataSetInfo.aggTimeUnit || 'MINUTE',
                aggTimeNumber: dataSetInfo.number || 1,
            },
            startTime: dataSetInfo.time[0] ? moment(dataSetInfo.time[0]).valueOf() : null,
            endTime: dataSetInfo.time[1] ? moment(dataSetInfo.time[1]).valueOf() : null,
            dataSourceList: [{
                dataSourceType: dataSetInfo.dataSourceType,
                dataSourceId: (dataSetInfo.datasourceId && dataSetInfo.datasourceId.value) || null,
                relationshipType: 'LOG',
                filtersConfig: (!!dataSetInfo.partitionFields || !!dataSetInfo.analyzeFields) ? {
                    partitionFields: dataSetInfo.partitionFields || null,
                    analyzeFields: dataSetInfo.analyzeFields || null,
                } : null
            }]
        };
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
                } else {
                    console.log(err);
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
                    success(<span>{path.indexOf('copy') > -1 ? IntlFormatMessage('laboratory.anomaly.copied') : IntlFormatMessage('laboratory.anomaly.added')}</span>);
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
        delArithmetic();
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
})(Form.create()(LogAnomaly));
