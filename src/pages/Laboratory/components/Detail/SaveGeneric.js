import React, {useEffect, Fragment} from 'react';
import {Modal, Form, Input, Select, message, Tooltip, Icon, Checkbox, Button} from '@chaoswise/ui';
import {connect, toJS} from "@chaoswise/cw-mobx";
import styles from './index.less';
import IconTooltip from "@/components/IconTooltip";
import {useFetchState} from "@/components/HooksState";
import {success} from "@/utils/tip";
import {IntlFormatMessage} from "@/utils/util";

const {Item} = Form;
const formLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 15}
};
const {Option} = Select;

function SaveGeneric(props) {
    const {
        form,
        currentGenericList = {},
        onClose,
        genericityData,
        addAlgorithmService,
        deleteCurrentGenericList,
        publishAlgorithmAsync,
        saveAndAddGeneric,
        onSave,
    } = props;

    const {getFieldDecorator, setFieldsValue} = form;

    const {
        algorithmParams = [],
        processedParams,
        algorithmGenericId = '',
        genericId = '',
        genericName = '',
        algorithmId,
        algorithmName,
        algorithmVersion
    } = currentGenericList;

    const [desParameters, setDesParameters] = useFetchState({});
    const [checked, setChecked] = useFetchState(false);
    const [saveLoading, setSaveLoading] = useFetchState(false);

    useEffect(() => {
        let currentList = (toJS(genericityData) || []).filter(item => (algorithmGenericId || genericId) === item.id);
        if (currentList.length) {
            const {algorithm = {}} = currentList[0];
            const {parameters = []} = algorithm;
            let newParameters = {};
            parameters.forEach(item => {
                newParameters[item.name] = item.descriptions || '';
            });
            setDesParameters(newParameters);
        }
    }, [algorithmGenericId]);

    const onOk = () => {
        form.validateFields((err, values) => {
            if (!err) {
                let newParameters = [];
                for (var i in values) {
                    if (i === 'generic_slect_private' || i === 'name' || i === 'description') {
                        newParameters = newParameters.map(item => item);
                    } else {
                        newParameters = newParameters.concat({
                            name: i,
                            value: values[i]
                        });
                    }
                }
                setSaveLoading(true);
                if (!checked) {
                    addAlgorithmService({
                        // algorithmId,
                        algorithmName,
                        algorithmVersion,
                        name: values.name,
                        description: values.description || null,
                        parameters: newParameters.map(item => {
                            if (item.value || item.value === 0) {
                                return item;
                            }
                            return {
                                name: item.name,
                                value: null
                            };
                        })

                    }, {
                        cb: (data) => {
                            deleteCurrentGenericList();
                            onClose();
                            success(IntlFormatMessage('laboratory.anomaly.saved'));
                            setSaveLoading(false);
                            onSave && onSave();
                        },
                        err: () => {
                            setSaveLoading(false);
                        }
                    });
                } else {
                    saveAndAddGeneric({
                        // algorithmId,
                        algorithmName,
                        algorithmVersion,
                        name: values.name,
                        description: values.description || null,
                        parameters: newParameters.map(item => {
                            if (item.value || item.value === 0) {
                                return item;
                            }
                            return {
                                name: item.name,
                                value: null
                            };
                        })
                    }, {
                        cb: () => {
                            deleteCurrentGenericList();
                            onClose();
                            setChecked(false);
                            success(IntlFormatMessage('laboratory.anomaly.genericitySaved'));
                            setSaveLoading(false);
                            onSave && onSave();
                        },
                        err: () => {
                            setSaveLoading(false);
                        }
                    });
                }

            }
        });
    };
    const onChange = (e) => {
        setChecked(e.target.checked);
    };
    return (
        <Modal
            {...props}
            title={IntlFormatMessage('common.savegenericity')}
            centered={true}
            destroyOnClose={true}
            bodyStyle={{maxHeight: 500, overflow: 'auto'}}
            onCancel={() => {
                deleteCurrentGenericList();
                onClose();
            }}
            footer={
                <div>
                    <Checkbox checked={checked} onChange={onChange}>{
                        IntlFormatMessage('common.ifpublish')
                    }</Checkbox>
                    <Button loading={saveLoading} onClick={() => {
                        deleteCurrentGenericList();
                        onClose();
                    }}>{
                        IntlFormatMessage('common.explore.setting.modal.cancel')
                    }</Button>
                    <Button type='primary' loading={saveLoading} onClick={() => onOk()}>{
                        IntlFormatMessage('common.explore.setting.modal.determine')
                    }</Button>
                </div>
            }
            // onOk={onOk}
        >
            <Form {...formLayout} className={styles['save-modal-item']}>
                <Item label={IntlFormatMessage('laboratory.detail.name')}>
                    {getFieldDecorator('name', {
                        initialValue: genericName || undefined,
                        rules: [
                            {
                                required: true,
                                message: IntlFormatMessage('laboratory.anomaly.cannotEmpty'),
                            },
                        ],
                    })(
                        <Input className="item-width-tighten"/>
                    )}
                </Item>
                <Item label={IntlFormatMessage('laboratory.detail.genericityDetail')}>
                    {getFieldDecorator('description')(
                        <Input.TextArea
                            autoSize={{minRows: 4}}
                            className="item-width-tighten"
                        />
                    )}
                </Item>
                {
                    (processedParams ? processedParams : algorithmParams).map((item, index) => {
                        if (item.name) {
                            return (
                                <Form.Item
                                    key={`${item.name}${index}`}
                                    label={
                                        <Fragment>
                                            <Tooltip title={item.name}>
                                                <span className='label-name'>
                                                    {item.name}
                                                </span>
                                            </Tooltip>
                                        </Fragment>
                                    }
                                    {...formLayout}
                                >
                                    {getFieldDecorator(item.name, {
                                        initialValue: item.value,

                                    })(
                                        <Input
                                            className="item-width-tighten"
                                            disabled autoComplete="off"
                                        />
                                    )}
                                    <IconTooltip
                                        style={{marginLeft: '8px'}}
                                        title={Object.keys(desParameters).length ? (desParameters[item.name] || '') : ''}
                                    />
                                </Form.Item>
                            );
                        }
                    })
                }
            </Form>
        </Modal>
    );
}

export default connect(({laboratoryStore, genericsStore}) => {
    return {
        genericityData: genericsStore.list,
        addAlgorithmService: laboratoryStore.addAlgorithmService,
        publishAlgorithmAsync: genericsStore.publishAlgorithmAsync,
        saveAndAddGeneric: laboratoryStore.saveAndAddGeneric
    };
})(Form.create()(SaveGeneric));
