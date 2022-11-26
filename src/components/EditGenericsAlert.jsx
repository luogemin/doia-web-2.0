import React, {Fragment, useEffect, useMemo,} from "react";
import {Button, Modal, Icon, Input, Tooltip, Form, Select, Checkbox} from "@chaoswise/ui";
import {guid, IntlFormatMessage} from "@/utils/util";
import Config from "@/pages/TaskManagement/components/common/Config";
import {labelLayout} from "@/globalConstants";
import {connect, toJS} from "@chaoswise/cw-mobx";
import styles from "@/pages/TaskManagement/assets/index.less";
import {useFetchState} from "@/components/HooksState";

const timeUnit = {
    'MINUTE': 'min',
    'HOUR': 'hour',
    'DAY': 'day',
    'D': 'day',
};

const EditGenericsAlert = (props) => {
    const {
        form, visible, onCancel, onSave, dataSource = {}, getTaskTrainingDaysAsync,
        genericsList = [], typeId = '', dataSetInfo = {}, taskCurrent, comeFrom,
    } = props;
    const {getFieldsValue, validateFields, setFieldsValue} = form;
    const {
        genericId = '', algorithmParams = [], checked = false, isOverwriteForecastParams = false, id, genericityname,
        algorithmNameZh = '', algorithmVersion = '', algorithmName = '', algorithmId = '',
    } = dataSource;
    const alogParams = useMemo(() => {
        return toJS(genericsList).reduce((t, c) => {
            return Object.assign({}, t, {
                [c.id + '']: Object.assign({}, c, genericId === c.id ? {
                    parameters: algorithmParams,
                } : {})
            });
        }, {});
    }, [genericsList]);

    const [selectAlog, setSelectAlog] = useFetchState(genericId)
    const [check, setCheck] = useFetchState(false)
    const [currentParameters, setCurrentParameters] = useFetchState(algorithmParams)
    const [prevTimeObj, setPrevTimeObj] = useFetchState({})

    useEffect(() => {
        setCheck(checked || isOverwriteForecastParams)
    }, [checked, isOverwriteForecastParams])

    useEffect(() => {
        if (isOverwriteForecastParams) {
            if (!Object.keys(prevTimeObj).length) {
                const algorithmParamsName = algorithmParams.reduce((prev, cent) => {
                    return Object.assign({}, prev, {
                        [cent.name]: cent.value,
                    })
                }, {})
                setPrevTimeObj({
                    training_days: algorithmParamsName['training_days'],
                    train_grain: algorithmParamsName['train_grain'],
                    merge_mode: algorithmParamsName['merge_mode'],
                    forecast_period: algorithmParamsName['forecast_period'],
                });
            }
        }
    }, [algorithmParams, isOverwriteForecastParams])

    const onOk = () => {
        validateFields((err, values) => {
            if (!err) {
                const {genericId, genericityname, ...rest} = values;
                const selectAlogParams = alogParams[selectAlog] || {};
                const {algorithm = {}} = selectAlogParams || {};
                let parameters = [];
                Object.entries(rest).sort().forEach(res => {
                    parameters = parameters.concat({
                        name: res[0],
                        value: (!!res[1] || res[1] === 0) ? res[1] : null,
                    })
                });
                const params = Object.assign({rowId: guid()}, dataSource, {
                        algorithmName: !!selectAlogParams.algorithmName ? selectAlogParams.algorithmName : algorithmName,
                        algorithmParams: parameters,
                        algorithmVersion: !!selectAlogParams.algorithmVersion ? selectAlogParams.algorithmVersion : algorithmVersion,
                        genericId: !!selectAlogParams.id ? selectAlogParams.id : genericId,
                        name: selectAlogParams.builtinDisplayNames || selectAlogParams.name,
                        algorithmId: !!algorithmId ? algorithmId : selectAlogParams.algorithmId,
                        algorithmNameZh: algorithm.displayNames || algorithmNameZh || '',
                        algorithmNameEnglish: algorithm.name || algorithmName || '' || '',
                        genericityname,
                        genericName: selectAlogParams.builtinDisplayNames || (selectAlogParams.name || '')
                    },
                    id ? {id} : {}
                )
                onSave(params, check)
                setPrevTimeObj({})
            }
        })
    }
    const onChange = (e) => {
        const prevTimeObjSelf = {};
        if (!Object.keys(prevTimeObj).length) {
            const fieldsValue = getFieldsValue();
            setPrevTimeObj({
                training_days: fieldsValue['training_days'],
                train_grain: fieldsValue['train_grain'],
                merge_mode: fieldsValue['merge_mode'],
                forecast_period: fieldsValue['forecast_period'],
            });
            prevTimeObjSelf['training_days'] = fieldsValue['training_days'];
            prevTimeObjSelf['train_grain'] = fieldsValue['train_grain'];
            prevTimeObjSelf['merge_mode'] = fieldsValue['merge_mode'];
            prevTimeObjSelf['forecast_period'] = fieldsValue['forecast_period'];
        }
        if (e.target.checked) {
            if (comeFrom === 'taskManagement') {
                const {timeConfig = {}, extendConfig = {}, aggConfig = {},} = toJS(taskCurrent);
                const {timeFrameNumber, timeFrameUnit,} = timeConfig;
                const {aggFunc, aggTimeNumber, aggTimeUnit, aggPercentile,} = aggConfig;
                const {forecastTimeNumber, forecastTimeUnit} = extendConfig.dataProcessing || {};
                const training_days = timeFrameNumber + timeUnit[timeFrameUnit];
                const train_grain = aggTimeNumber + timeUnit[aggTimeUnit];
                const forecast_period = forecastTimeNumber + timeUnit[forecastTimeUnit];
                setFieldsValue({
                    training_days, train_grain,
                    forecast_period
                })
            } else {
                const {
                    time, forecastTimeNumber, forecastTimeUnit, extendConfig = {},
                    aggTimeUnit = 'MINUTE', number = 1,
                } = toJS(dataSetInfo);

                const {dataProcessing = {}} = extendConfig
                const startTime = new Date(toJS(time)[0]).getTime();
                const endTime = new Date(toJS(time)[1]).getTime();
                const train_grain = number + timeUnit[aggTimeUnit];
                const forecast_period = (forecastTimeNumber || dataProcessing.forecastTimeNumber) + timeUnit[forecastTimeUnit || dataProcessing.forecastTimeUnit];
                const params = {
                    start_time: startTime,
                    end_time: endTime,
                }
                getTaskTrainingDaysAsync(params, {
                    cb: (res) => {
                        setFieldsValue({
                            training_days: res.data,
                            train_grain,
                            forecast_period
                        })
                    }
                })
            }
        } else {
            setFieldsValue({
                training_days: prevTimeObj.training_days || prevTimeObjSelf.training_days,
                train_grain: prevTimeObj.train_grain || prevTimeObjSelf.train_grain,
                forecast_period: prevTimeObj.forecast_period || prevTimeObjSelf.forecast_period,
            })
        }
        setCheck(e.target.checked)
    }


    return (
        <Modal
            className={styles["edit-generics-modal"]}
            visible={visible}
            destroyOnClose={true}
            onCancel={() => {
                onCancel();
                setCheck(false)
            }}
            footer={
                <div>
                    {typeId === 'forecasting' &&
                    <Checkbox checked={check}
                              onChange={onChange}>{IntlFormatMessage('task.create.usecurrenttask')}</Checkbox>}
                    <Button onClick={() => {
                        setPrevTimeObj({})
                        onCancel()
                        setCheck(false)
                    }
                    }>{
                        IntlFormatMessage('common.explore.setting.modal.cancel')
                    }</Button>
                    <Button type='primary' onClick={onOk}>{
                        IntlFormatMessage('common.explore.setting.modal.determine')
                    }</Button>
                </div>
            }

            title={!!Object.keys(dataSource).length ? IntlFormatMessage('task.create.editgenericity') : IntlFormatMessage('laboratory.detail.createTwo')}
        >
            <Config
                form={form}
                visible={visible}
                genericsList={genericsList}
                alogParams={alogParams}
                selectAlog={selectAlog}
                setSelectAlog={setSelectAlog}
                genericityname={genericityname}
                currentParameters={currentParameters}
                setCurrentParameters={setCurrentParameters}
                checked={check}
                setChecked={setCheck}
                setPrevTimeObj={setPrevTimeObj}
            />
        </Modal>
    )
}

export default connect(({laboratoryStore, genericsStore, taskManagementStore}) => {
    return {
        genericsList: genericsStore.list,
        dataSetInfo: laboratoryStore.dataSetInfo,
        taskCurrent: taskManagementStore.current,
        getTaskTrainingDaysAsync: laboratoryStore.getTaskTrainingDaysAsync,
    };
})(Form.create()(EditGenericsAlert));