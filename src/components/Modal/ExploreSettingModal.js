import React, {Component} from 'react';
import {isDev} from "@/globalConstants";
import {Modal, Input, Form, Checkbox, Tooltip, Icon, InputNumber} from '@chaoswise/ui';
import style from './copyApi.less';
import {IntlFormatMessage} from "@/utils/util";

const FormItem = Form.Item;
const TextArea = Input.TextArea;

const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 18}
};

class ExploreSettingModal extends Component {
    constructor() {
        super();
    }

    saveModel = () => {
        const {
            form,
            setTempState,
            handleCancelModal
        } = this.props;

        form.validateFields((err, values) => {
            if (!err) {
                values['pushdown'] = true;
                //尝试解析一下配置参数，如果不对，则提示格式错误
                let combinedValues = Object.assign({}, values);
                if (values.params && values.params.length) {
                    let params = null;
                    try {
                        params = JSON.parse(values.params);
                    } catch (error) {
                        if (isDev) {
                            console.log(error);
                        }
                        form.setFields({
                            params: {
                                value: values.params,
                                errors: [new Error('参数非JSON格式，请检查')],
                            },
                        });
                        return false;
                    }

                    const dualParams = Object.keys(params).reduce((obj, key) => {
                        obj[`${key}`] = params[key];
                        return obj;
                    }, {});

                    combinedValues.params = dualParams;
                    //清空错误
                    form.setFields({
                        params: {
                            value: values.params,
                            errors: null
                        }
                    });
                }

                if (setTempState instanceof Function) {
                    setTempState(combinedValues, () => {
                        handleCancelModal();
                    });
                }
            }
        });
    }

    render() {
        const self = this;
        let {
            form,
            model: {confJson},
            tagList,
            handleCancelModal,
            visible = false
        } = this.props;

        const {
            getFieldDecorator
        } = form;

        confJson = confJson ? confJson : {};

        let {pushdown = true, limit = true, cacheSeconds = 10, params = '{}'} = confJson;
        if (params instanceof Object && params != null) {
            params = JSON.stringify(params);
        }

        return (
            <Modal
                className={`${style['customModal']} ${style['modelModal']}`}
                width={"45%"}
                title={IntlFormatMessage('task.common.querySettings')}
                visible={visible}
                onOk={this.saveModel}
                onCancel={handleCancelModal}
                okText={IntlFormatMessage('common.explore.setting.modal.determine')}
                cancelText={IntlFormatMessage('common.explore.setting.modal.cancel')}
            >
                <FormItem {...formItemLayout} label={(
                    <span>
                        {IntlFormatMessage('common.explore.setting.modal.query.number.limit')}
                        <Tooltip title={<span>{IntlFormatMessage('common.explore.setting.modal.default.on.query.number.limit')}</span>}>
                            <Icon type="question-circle-o"/>
                        </Tooltip>
                    </span>
                )}>
                    {
                        getFieldDecorator("limit", {
                            initialValue: limit,
                            valuePropName: 'checked'
                        })(
                            <Checkbox/>
                        )
                    }
                </FormItem>
                <FormItem {...formItemLayout} label={(
                    <span>
                        {IntlFormatMessage('common.explore.setting.modal.cache.time')}
                        <Tooltip title={<span>{IntlFormatMessage('common.explore.setting.modal.query.result.cache.time')}</span>}>
                            <Icon type="question-circle-o"/>
                        </Tooltip>
                    </span>
                )}>
                    {
                        getFieldDecorator("cacheSeconds", {
                            initialValue: cacheSeconds,
                            rules: [
                                {
                                    required: true, message: IntlFormatMessage('common.explore.setting.modal.cache.time.required'),

                                }
                            ]
                        })(
                            <InputNumber
                                min={0}
                                max={300}
                            />
                        )
                    }
                </FormItem>
                <FormItem
                    key="3"
                    label={IntlFormatMessage('common.explore.setting.modal.parameter.setting')}
                    {...formItemLayout}
                >
                    {
                        getFieldDecorator("params", {
                            initialValue: params
                        })(
                            <TextArea
                                autoSize={{minRows: 4}}
                                placeholder={IntlFormatMessage('common.explore.setting.modal.json.format.parameters')}
                            />
                        )
                    }
                </FormItem>

            </Modal>
        );
    }
}

export default Form.create()(ExploreSettingModal);
