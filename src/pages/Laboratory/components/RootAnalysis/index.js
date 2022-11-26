import React, {Fragment, useEffect} from 'react';
import {Steps, Button, BasicLayout, Form, message} from '@chaoswise/ui';
import styles from '@/pages/Laboratory/components/SingleCheck/index.less';
import BasicInfo from '@/pages/Laboratory/components/SingleCheck/BasicInfo';
import moment from 'moment';
import ArithmeticSelect from '@/pages/Laboratory/components/SingleCheck/ArithmeticSelect';
import {connect, toJS} from "@chaoswise/cw-mobx";
import DataSetting from './DataSetting';
import {useFetchState} from "@/components/HooksState";
import {success, error} from "@/utils/tip";
import {IntlFormatMessage} from "@/utils/util";

const {Footer} = BasicLayout;

const {Step} = Steps;

function RootAnalysis(props) {
    const {
        form,
        match = {},
        addTbList,
        addModifyGeneric,
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
        deleteDataSetInfo,
        setBackTitle
    } = props;
    const {params = {}, path = '',} = match;
    const {taskId = '', sceneId = ''} = params;

    const [current, setCurrent] = useFetchState(0);
    const [loading, setLoading] = useFetchState(false);

    useEffect(() => {
        updateDataSetInfo('scene', 'root_cause_analysis');

        return () => {
            deleteDataSetInfo();
        };
    }, []);

    useEffect(() => {
        if (taskId) {
            getTbDetail(taskId, {
                cb: (data) => {
                    const {
                        taskName = '', description = undefined, scene = 'anomaly_detection',
                        aggConfig = {}, startTime = 0, endTime = 0, dataSourceList = [],
                    } = data;
                    const {aggFunc = '', aggTimeUnit = '', aggTimeNumber = undefined, aggPercentile = undefined} = aggConfig;
                    const dataSourceRelation = dataSourceList.filter(i => i.relationshipType === 'NODE_RELATION')[0] || {};
                    const {dataSource = {}} = dataSourceRelation;
                    const dataSourceTimeSeriesList = (dataSourceList.filter(i => i.relationshipType === 'TIME_SERIES') || []).map(item => {
                        return Object.assign({}, item, {
                            dataSourceName: item.dataSource.name
                        });
                    });
                    setDataSetInfo({
                        taskName: taskName + `-${IntlFormatMessage('datasource.create.copy')}`,
                        description,
                        scene,
                        dataSourceType: dataSource.type,
                        datasourceId: {value: dataSource.id, label: dataSource.name},
                        method: aggFunc,
                        aggTimeUnit: aggTimeUnit,
                        number: aggTimeNumber,
                        aggPercentile,
                        time: [moment(startTime), moment(endTime)],
                    });
                    if (dataSourceTimeSeriesList.length) {
                        setDimensionalList(dataSourceTimeSeriesList);
                    }
                }
            });
        }
    }, [taskId]);
    /*创建任务的2个参数*/
    const renderParams = () => {
        let metricAndTagFilters = [];
        let params = {
            taskName: dataSetInfo.taskName || null,
            description: dataSetInfo.description || null,
            scene: dataSetInfo.scene || null,
            aggConfig: Object.assign({}, {
                aggFunc: dataSetInfo.method || 'AVG',
                aggTimeUnit: dataSetInfo.aggTimeUnit || 'MINUTE',
                aggTimeNumber: dataSetInfo.number || 1,
            }, dataSetInfo.method === 'QUANTILE_EXACT' ? {
                aggPercentile: dataSetInfo.aggPercentile,
            } : {}),
            startTime: dataSetInfo.time[0] ? moment(dataSetInfo.time[0]).valueOf() : null,
            endTime: dataSetInfo.time[1] ? moment(dataSetInfo.time[1]).valueOf() : null,
            //新加参数
            dataSourceRelation: {},
            dataSourceTimeSeriesList: dimensionalList,
            dataSourceList: [],
        };
        params.dataSourceRelation = {
            dataSourceType: dataSetInfo.dataSourceType,
            dataSourceId: (dataSetInfo.datasourceId && dataSetInfo.datasourceId.value) || null,
            relationshipType: 'NODE_RELATION',
        };
        const dataSourceListR = [].concat(toJS(dimensionalList));
        if (dataSetInfo.datasourceId && dataSetInfo.datasourceId.value) {
            params.dataSourceList = dataSourceListR.concat((params.dataSourceRelation));
        } else {
            params.dataSourceList = dataSourceListR;
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
                    isOverwriteForecastParams: !!(scene === 'forecasting' && item.checked)
                };
            });
        }
        return taskPublicGenericList;
    };

    const handleNext = () => {
        if (current === 0) {
            form.validateFields((err) => {
                if (!err) {
                    setCurrent(current + 1);
                    delArithmetic();
                }
            });
        }
        if (current === 1) {
            form.validateFields((err) => {
                if (!err) {
                    const dataSourceList = [].concat(toJS(dimensionalList));
                    if (!!dataSourceList && !!dataSourceList.length) {
                        setCurrent(current + 1);
                    } else {
                        error(IntlFormatMessage('laboratory.anomaly.seriesSpecify'));
                    }
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
                    // delArithmetic();
                    success(<span>{path.indexOf('copy') > -1 ? IntlFormatMessage('laboratory.anomaly.copied') : IntlFormatMessage('laboratory.anomaly.added')}</span>);
                    // success(<span>{path.indexOf('copy') > -1 ? '复制' : '新建'}成功，去<span
                    //     style={{color: '#008DFF', cursor: 'pointer'}}
                    //     onClick={() => {
                    //         setBackTitle(record.taskName);
                    //         history.push(`/laboratory/${record.scene}/original/${record.id}/collect`);
                    //     }}
                    // >配置数据</span></span>, 5);
                    // history.push('/laboratory');
                    setLoading(false);
                    history.go(-1);
                },
                err: () => {
                    setLoading(false);
                }
            });
        }
    };

    const handleDone = () => {

    };

    const handlePrev = () => {
        setCurrent(current - 1);
        delArithmetic();
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
                    current !== 0 && ( //1,2
                        <Button style={{marginRight: '16px'}}
                                onClick={handlePrev}
                        >{IntlFormatMessage('common.previous')}</Button>
                    )
                }
                {
                    current !== 1 ? <Button type='primary' loading={loading} onClick={handleNext}>{
                            current === 2 ?
                                IntlFormatMessage('common.ok') :
                                IntlFormatMessage('common.next')
                        }</Button> :
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
        addModifyGeneric: laboratoryStore.addModifyGeneric,
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
})(Form.create()(RootAnalysis));
