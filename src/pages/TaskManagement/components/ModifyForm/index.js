import React, {Component, useEffect,} from 'react';
import {connect, toJS} from '@chaoswise/cw-mobx';
import {
    Form,
    Input,
    Icon,
    Select,
    Button,
    Radio,
    Row,
    Col,
    RangePicker,
    BasicLayout,
    Tooltip,
    Checkbox,
    CWTable as Table, Tabs,
} from '@chaoswise/ui';
import styles from '@/pages/TaskManagement/components/CreateForm/index.less';
import {useHistory, useParams} from "react-router";
import {success} from "@/utils/tip";
import DataSetting from "@/pages/TaskManagement/components/common/DataSetting";
import AlgorithmSelect from "@/pages/TaskManagement/components/common/AlgorithmSelect";
import {useFetchState} from "@/components/HooksState";
import {IntlFormatMessage} from "@/utils/util";

const Footer = BasicLayout.Footer;
const {TabPane} = Tabs;

const CreateForm = (props) => {
    const {
        form, modifyTaskAsync, modifyTaskGenericsAsync, getTaskDetailAsync, current,
        getDataSourceList, dataSourceList, setCurrentReducer, setIfCanEditReducer, setFilterListReducer,

    } = props;
    const {getFieldDecorator, validateFields, getFieldValue} = form;

    const {push, go, location} = useHistory();
    const {pathname = ""} = location;
    const {typeId = '', taskId = ''} = useParams();

    const [loading, setLoading] = useFetchState(false);
    const [activeTab, setActiveTab] = useFetchState('0');
    const [metricList, setMetricList] = useFetchState([]);
    const [genericIdsList, setGenericIdsList] = useFetchState([]);

    useEffect(() => {
        if (taskId) {
            getTaskDetailAsync({id: taskId});
            setIfCanEditReducer(false);
        }

        return () => {
            setCurrentReducer({});
            setIfCanEditReducer(true);
            setFilterListReducer();
        };
    }, [taskId]);

    const saveFormHandler = () => {
        setLoading(true);
        if (activeTab === '0') {
            validateFields((err, values) => {
                if (!err) {
                    const {
                        name, scene, model, target, dataSourceId, aggTimeNumber, aggTimeUnit, aggFunc, aggPercentile, bizSceneId,
                        execStartTime, cycleNumber, cycleUnit, timeFrameNumber, timeFrameUnit, nowExecute,
                        forecastTimeNumber, forecastTimeUnit,
                        upperThreshold, lowerThreshold,
                    } = values;
                    const params = Object.assign({}, {
                        id: taskId,
                        name, scene, bizSceneId, scheduleType: 2,
                        filtersConfig: Object.assign(
                            {metricAndTagFilters: metricList,},
                            model ? {
                                modelFilter: {
                                    compare: model.length === 1 ? 'equals' : 'in',
                                    value: model.length === 1 ? model[0] : model
                                }
                            } : {},
                            target ? {
                                targetFilter: {
                                    compare: target.length === 1 ? 'equals' : 'in',
                                    value: target.length === 1 ? target[0] : target
                                }
                            } : {},
                        ),
                        timeConfig: {
                            "startTime": 1621151663000,
                            "endTime": 1629100463000,
                            execStartTime: new Date(execStartTime).getTime(),
                            cycleNumber, cycleUnit, timeFrameNumber, timeFrameUnit, nowExecute,
                        },
                        dataSourceId,
                        aggConfig: {
                            aggTimeNumber, aggTimeUnit, aggFunc, aggPercentile,
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
                    modifyTaskAsync(params, () => {
                        success(IntlFormatMessage('laboratory.anomaly.taskEdited'));
                        // go(-1);
                    });
                } else {
                    console.log(err);
                    setLoading(false);
                }
            });
        } else {
            setCurrentReducer(Object.assign({}, current, {
                taskAlgorithms: genericIdsList.map(item => {
                    return Object.assign({}, {
                        ...item,
                        genericName: item.genericityname
                    });
                })
            }));
            modifyTaskGenericsAsync({
                id: taskId,
                taskAlgorithms: genericIdsList.map(item => {
                    return Object.assign({}, {
                        ...item,
                        genericName: item.genericityname
                    });
                })
            }, () => {
                success(IntlFormatMessage('laboratory.anomaly.taskEdited'));
                // go(-1);
            });
        }
        setLoading(false);
    };

    return (
        <div className={styles['task-create-form']} style={{padding: 0, height: '100%'}}>
            <Tabs defaultActiveKey={activeTab} onChange={(key) => {
                setActiveTab(key);
                setLoading(false);
            }}
                  style={{height: '100%', overflow: 'auto'}}>
                <TabPane tab={IntlFormatMessage('task.create.datasettings')} key="0">
                    <PaddingDiv>
                        <DataSetting
                            form={form}
                            metricList={metricList}
                            setMetricList={setMetricList}
                            typeId={typeId}
                        />
                    </PaddingDiv>
                </TabPane>
                <TabPane tab={IntlFormatMessage('task.create.algorithmsettings')} key="1">
                    <PaddingDiv>
                        <AlgorithmSelect
                            form={form}
                            genericIdsList={genericIdsList}
                            setGenericIdsList={setGenericIdsList}
                        />
                    </PaddingDiv>
                </TabPane>
            </Tabs>

            <Footer>
                <Button onClick={() => go(-1)} style={{marginRight: 8}}>{
                    IntlFormatMessage('common.explore.setting.modal.cancel')
                }</Button>
                <Button disabled={loading} type="primary" onClick={saveFormHandler}>{
                    IntlFormatMessage('common.explore.setting.modal.determine')
                }</Button>
            </Footer>
        </div>
    );
};

const PaddingDiv = (props) => {
    const {children} = props;
    return <div className='padding-div' style={{padding: '0 32px', height: '100%'}}>
        {children}
    </div>;
};

export default Form.create()(connect(({store, taskManagementStore, dataSourceStore}) => {
    return {
        modifyTaskAsync: taskManagementStore.modifyTaskAsync,
        modifyTaskGenericsAsync: taskManagementStore.modifyTaskGenericsAsync,
        getTaskDetailAsync: taskManagementStore.getTaskDetailAsync,
        current: taskManagementStore.current,
        setCurrentReducer: taskManagementStore.setCurrentReducer,
        setIfCanEditReducer: taskManagementStore.setIfCanEditReducer,
        setFilterListReducer: taskManagementStore.setFilterListReducer,

        getDataSourceList: dataSourceStore.getDataSourceList,
        dataSourceList: dataSourceStore.dataSourceList,
    };
})(CreateForm));
