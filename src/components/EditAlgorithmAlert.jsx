import React, {useEffect, useMemo,} from "react";
import {Form, Modal, Icon, Input, Spin, Button, Checkbox} from "@chaoswise/ui";
import {guid, IntlFormatMessage} from "@/utils/util";
import {omit} from "lodash-es";
import Config from "@/pages/TaskManagement/components/common/Config";
import {connect, toJS} from "@chaoswise/cw-mobx";
import {useParams} from "react-router";
import styles from "@/pages/TaskManagement/assets/index.less";
import {useFetchState} from "@/components/HooksState";

const EditAlgorithmAlert = (props) => {
    const {
        form, visible, onCancel: _onCancle = () => {
        }, onSave, genericsList = [], genericId = '', genericName, comeFrom, getTaskParamsAsync, taskGetTaskParamsAsync,
        loading = false, currentParameters, setCurrentParameters, currentGeneric = {}, isChecked = false, ...rest
    } = props;
    const {getFieldsValue, validateFields, setFieldsValue} = form;
    const {title = ''} = rest;

    const {typeId = '', id = '', taskId = '', taskVersion = ''} = useParams();

    const [selectAlog, setSelectAlog] = useFetchState('')
    const [checked, setChecked] = useFetchState(false)
    const [prevTimeObj, setPrevTimeObj] = useFetchState({})

    useEffect(() => {
        setSelectAlog(genericId)
    }, [genericId])

    useEffect(() => {
        setChecked(isChecked)
    }, [isChecked])

    const alogParams = useMemo(() => {
        return toJS(genericsList).reduce((t, c) => {
            return Object.assign({}, t, {
                [c.id + '']: c
            });
        }, {});
    }, [genericsList]);

    useEffect(() => {
        if (!visible) {
            setSelectAlog('')
        }
    }, [visible])

    const onCheckChange = (e) => {
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
                taskGetTaskParamsAsync(!!taskId ? taskId : id, (res) => {
                    setFieldsValue(res.data || {})
                })
            } else {
                getTaskParamsAsync(!!taskId ? taskId : id, {
                    cb: (res) => {
                        setFieldsValue(res.data || {})
                    }
                })
            }
        } else {
            setFieldsValue({
                training_days: prevTimeObj.training_days || prevTimeObjSelf.training_days,
                train_grain: prevTimeObj.train_grain || prevTimeObjSelf.train_grain,
                merge_mode: prevTimeObj.merge_mode || prevTimeObjSelf.merge_mode,
                forecast_period: prevTimeObj.forecast_period || prevTimeObjSelf.forecast_period
            })
        }
        setChecked(e.target.checked)
    }
    const onCancel = () => {
        setPrevTimeObj({})
        _onCancle()
        setChecked(false)
    }
    const onOk = () => {
        if (!loading) {
            validateFields((err, values) => {
                if (!err) {
                    const {genericId, genericityname, ...rest} = values;
                    let parameters = [];
                    Object.entries(rest).sort().forEach(res => {
                        parameters = parameters.concat({
                            name: res[0],
                            value: (!!res[1] || res[1] === 0) ? res[1] : null,
                        })
                    });
                    const params = Object.assign({}, alogParams[selectAlog], {
                        parameters,
                        genericityname
                    });
                    onSave(params, checked)
                    setPrevTimeObj({})
                }
            })
        }
    }

    return (
        <Modal
            className={styles["edit-generics-modal"]}
            visible={visible}
            destroyOnClose={true}
            onCancel={() => {
                _onCancle()
            }}
            footer={
                <div style={{display: 'felx', alignItems: 'center'}}>
                    {
                        typeId === 'forecasting' &&
                        <Checkbox checked={checked} onChange={onCheckChange}>{IntlFormatMessage('task.create.usecurrenttask')}</Checkbox>
                    }
                    <Button onClick={onCancel}>{
                        IntlFormatMessage('common.explore.setting.modal.cancel')
                    }</Button>
                    <Button type="primary" onClick={onOk}>{
                        IntlFormatMessage('common.explore.setting.modal.determine')
                    }</Button>
                </div>
            }
            title={title || IntlFormatMessage('laboratory.anomaly.addContrastiveG')}
            {...rest}
        >
            <Spin spinning={loading}>
                <Config
                    form={form}
                    visible={visible}
                    genericsList={genericsList}
                    alogParams={alogParams}
                    selectAlog={selectAlog}
                    setSelectAlog={setSelectAlog}
                    currentParameters={currentParameters}
                    setCurrentParameters={setCurrentParameters}
                    editTitle={title}
                    genericityname={genericName}
                    checked={checked}
                    setChecked={setChecked}
                    setPrevTimeObj={setPrevTimeObj}
                />
            </Spin>
        </Modal>
    )
}

export default connect(({laboratoryStore, taskManagementStore}) => {
    return {
        getTaskParamsAsync: laboratoryStore.getTaskParamsAsync,
        taskGetTaskParamsAsync: taskManagementStore.getTaskParamsAsync,
    };
})(Form.create()(EditAlgorithmAlert));