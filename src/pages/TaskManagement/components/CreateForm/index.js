import React, {Component, useEffect, useMemo, Fragment} from 'react';
import {connect, toJS} from '@chaoswise/cw-mobx';
import {
    Form,
    Button,
    BasicLayout,
    CWTable as Table, Steps,
} from '@chaoswise/ui';
import styles from '@/pages/TaskManagement/components/CreateForm/index.less';
import {useHistory, useParams} from "react-router";
import {
    timeType
} from "@/globalConstants";
import {success} from "@/utils/tip";
import DataSetting from "@/pages/TaskManagement/components/common/DataSetting";
import AlgorithmSelect from "@/pages/TaskManagement/components/common/AlgorithmSelect";
import {useFetchState} from "@/components/HooksState";
import {IntlFormatMessage} from "@/utils/util";

const {Step} = Steps;
const Footer = BasicLayout.Footer;

const CreateForm = (props) => {
    const {
        form, addTaskAsync, current, setCurrentReducer, getTaskDetailAsync, setIfEditTaskName, setFilterListReducer,

    } = props;
    const {getFieldDecorator, validateFields, getFieldValue} = form;

    const {push, go, location} = useHistory();
    const {pathname = ""} = location;
    const {typeId = '', taskId = ''} = useParams();

    const [loading, setLoading] = useFetchState(false);
    const [currentStep, setCurrentStep] = useFetchState(0);
    const [metricList, setMetricList] = useFetchState([]);
    const [genericIdsList, setGenericIdsList] = useFetchState([]);

    useEffect(() => {
        if (taskId) {
            getTaskDetailAsync({id: taskId});
        }
        return () => {
            setCurrentReducer({});
            setIfEditTaskName(false);
            setFilterListReducer();
        };
    }, [taskId]);

    const handleNext = () => {
        setLoading(true);
        validateFields((err, values) => {
            if (!err) {
                const {
                    name, scene, model, target, dataSourceId, aggTimeNumber, aggTimeUnit, aggFunc, aggPercentile, bizSceneId,
                    execStartTime, cycleNumber, cycleUnit, timeFrameNumber, timeFrameUnit, nowExecute,
                    forecastTimeNumber, forecastTimeUnit,
                    upperThreshold, lowerThreshold,
                } = values;

                const time = timeType(timeFrameNumber, timeFrameUnit);
                const nowTime = new Date().getTime();
                const params = Object.assign({}, {
                    name, scene, bizSceneId, scheduleType: 2,
                    filtersConfig: Object.assign(
                        (!!metricList && !!metricList.length) ? {
                            metricAndTagFilters: metricList,
                        } : {},
                        (!!model && model.length) ? {
                            modelFilter: {
                                compare: model.length === 1 ? 'E' : 'IN',
                                value: model.length === 1 ? model[0] : model
                            }
                        } : {},
                        (!!target && target.length) ? {
                            targetFilter: {
                                compare: target.length === 1 ? 'E' : 'IN',
                                value: target.length === 1 ? target[0] : target
                            }
                        } : {},
                    ),
                    timeConfig: {
                        startTime: nowTime - time,
                        endTime: nowTime,
                        execStartTime: new Date(execStartTime).getTime(),
                        cycleNumber, cycleUnit, timeFrameNumber, timeFrameUnit, nowExecute,
                    },
                    dataSourceId,
                    aggConfig: {
                        aggTimeNumber, aggTimeUnit, aggFunc, aggPercentile
                    },
                }, scene === 'forecasting' ? {
                    extendConfig: {
                        dataProcessing: {
                            // mode: mode ? 'FIT' : 'FORECAST',
                            forecastTimeNumber, forecastTimeUnit,
                            upperThreshold, lowerThreshold,
                        }
                    }
                } : {});

                setCurrentReducer(Object.assign({}, current, params));
                setCurrentStep(currentStep + 1);
                setLoading(false);
            } else {
                console.log(err);
                setLoading(false);
            }
        });
    };

    const handlePrev = () => {
        const params = Object.assign({}, current, {
            taskAlgorithms: genericIdsList.map(item => {
                return Object.assign({}, {
                    ...item,
                    genericName: item.genericityname
                });
            })
        });
        setCurrentReducer(Object.assign({}, current, params));
        setCurrentStep(currentStep - 1);
    };

    const saveFormHandler = () => {
        const params = Object.assign({}, current, {
            taskAlgorithms: genericIdsList.map(item => {
                return Object.assign({}, {
                    ...item,
                    genericName: item.genericityname
                });
            })
        });
        addTaskAsync(params, () => {
            success(`${pathname.indexOf('copy') > -1 ? IntlFormatMessage('laboratory.anomaly.taskCopied') : IntlFormatMessage('laboratory.anomaly.taskCreate')}`);
            go(-1);
        });
    };

    const steps = [
        {
            title: IntlFormatMessage('task.create.datasettings'),
            content: <DataSetting
                form={form}
                metricList={metricList}
                setMetricList={setMetricList}
                typeId={typeId}
            />,
        },
        {
            title: IntlFormatMessage('task.create.algorithmsettings'),
            content: <AlgorithmSelect
                form={form}
                genericIdsList={genericIdsList}
                setGenericIdsList={setGenericIdsList}
            />,
        },
    ];

    return (
        <div className={styles['task-create-form']} style={{height: '100%'}}>
            <Steps current={currentStep} style={{marginBottom: 40}}>
                {steps.map(item => (
                    <Step key={item.title} title={item.title}/>
                ))}
            </Steps>
            {/*<StepLine current={currentStep} steps={steps}/>*/}
            <Fragment>
                {steps[currentStep].content}
            </Fragment>

            <Footer>
                {
                    currentStep === 0 ?
                        <Button disabled={loading} type="primary" onClick={handleNext}>{
                            IntlFormatMessage('common.next')
                        }</Button>
                        :
                        <Fragment>
                            <Button disabled={loading} onClick={handlePrev}
                                    style={{marginRight: 8}}>{
                                IntlFormatMessage('common.previous')
                            }</Button>
                            <Button disabled={loading} type="primary" onClick={saveFormHandler}>{
                                IntlFormatMessage('common.ok')
                            }</Button>
                        </Fragment>
                }
            </Footer>
        </div>
    );
};

export default Form.create()(connect(({taskManagementStore, dataSourceStore}) => {
    return {
        addTaskAsync: taskManagementStore.addTaskAsync,
        current: taskManagementStore.current,
        setCurrentReducer: taskManagementStore.setCurrentReducer,
        postTaskNameAsync: taskManagementStore.postTaskNameAsync,
        getTaskDetailAsync: taskManagementStore.getTaskDetailAsync,
        setIfEditTaskName: taskManagementStore.setIfEditTaskName,
        setFilterListReducer: taskManagementStore.setFilterListReducer,
    };
})(CreateForm));
