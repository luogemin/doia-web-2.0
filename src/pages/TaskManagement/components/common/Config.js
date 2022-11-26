import React, {useMemo, useEffect, Fragment} from 'react';
import {Form, Input, Icon, Tooltip, InputNumber, Select} from '@chaoswise/ui';
import {paramsModalLabelLayout} from "@/globalConstants";
import {toJS} from "@chaoswise/cw-mobx";
import {useFetchState} from "@/components/HooksState";
import BasicTooltip from "@/components/BasicTooltip";
import {IntlFormatMessage} from "@/utils/util";

const FormItem = Form.Item;
const Option = Select.Option;

const Config = (props) => {
    const {
        visible,
        form: {getFieldDecorator, setFieldsValue},
        genericsList = [],
        alogParams,
        setSelectAlog,
        selectAlog,
        title = IntlFormatMessage('laboratory.detail.genericityNew'),
        currentParameters = [],
        setCurrentParameters,
        genericityname,
        editTitle = '',
        checked,
        setChecked,
        setPrevTimeObj,
    } = props;

    const [desParameters, setDesParameters] = useFetchState({});

    useEffect(() => {
        if (alogParams[selectAlog]) {
            const {algorithm = {}} = alogParams[selectAlog];
            const {parameters = []} = algorithm;
            let newParameters = {};
            parameters.forEach(item => {
                newParameters[item.name] = {
                    description: item.descriptions ? (item.descriptions || '') : '',
                    type: item.type || '',
                };
            });

            setDesParameters(newParameters);
        }
    }, [selectAlog]);

    if (visible) {
        return (
            <Form>
                <FormItem label={`${title}${IntlFormatMessage('laboratory.detail.select')}`} {...paramsModalLabelLayout}>
                    {getFieldDecorator('genericId', {
                        initialValue: alogParams[selectAlog] ? selectAlog :
                            (
                                selectAlog ? (selectAlog.indexOf(IntlFormatMessage('task.common.deleted')) < 0 ? (selectAlog + IntlFormatMessage('task.common.deleted')) : selectAlog)
                                    : undefined
                            ),
                        rules: [
                            {
                                required: true,
                                message: IntlFormatMessage('laboratory.detail.selectgenericity'),
                            },
                        ],
                    })(
                        <Select
                            // getPopupContainer={triggerNode => triggerNode.parentNode}
                            placeholder={IntlFormatMessage('task.create.selectgenericity')}
                            showSearch={true}
                            className="item-width-tighten"
                            onChange={(value, option) => {
                                const {genericityname = ''} = option.props;
                                setSelectAlog('');
                                setCurrentParameters([]);
                                setChecked(false);
                                setPrevTimeObj({});
                                setTimeout(() => {
                                    setSelectAlog(value);
                                    setFieldsValue({
                                        genericityname: `${genericityname}-${IntlFormatMessage('datasource.create.instance')}`
                                    });
                                });
                            }}
                            optionFilterProp='search'
                        >
                            {(toJS(genericsList) || []).map((item) => {
                                const {id = '', name = '', algorithmVersion = '', builtinDisplayNames,} = item;
                                return (
                                    <Option value={id + ''}
                                            search={`${builtinDisplayNames || name} ${algorithmVersion}`}
                                            key={id + ''}
                                            genericityname={`${builtinDisplayNames || name}`}
                                    >
                                        {`${builtinDisplayNames || name} ${algorithmVersion}`}
                                        {
                                            builtinDisplayNames ?
                                                ` (${IntlFormatMessage('common.builtin')})` :
                                                ` (${IntlFormatMessage('common.custom')})`
                                        }
                                    </Option>
                                );
                            })}
                        </Select>
                    )}
                </FormItem>
                <FormItem label={IntlFormatMessage('laboratory.detail.genericityinstance')}
                          {...paramsModalLabelLayout}>
                    {getFieldDecorator('genericityname', {
                        initialValue: genericityname || undefined,
                        rules: [
                            {
                                required: true,
                                message: IntlFormatMessage('laboratory.detail.selectgenericity'),
                            },
                        ],
                    })(
                        <Input
                            placeholder={IntlFormatMessage('task.create.entergenericityinstance')}
                            className="item-width-tighten"
                        />
                    )}
                </FormItem>
                {
                    (!!currentParameters && currentParameters.length) ? ((currentParameters || []).filter(param => param.name !== 'stream_mode').map((item, index) => {
                            const {name = '', value = '', nameZhDescription} = item;
                            return (
                                <FormItem
                                    key={`${name}-${index}`}
                                    label={
                                        <Fragment>
                                            <Tooltip title={name}>
                                            <span className="label-name">
                                                {name}
                                            </span>
                                            </Tooltip>
                                        </Fragment>
                                    }
                                    {...paramsModalLabelLayout}
                                >
                                    {getFieldDecorator(`${name}`, {
                                        initialValue: (typeof value === 'number' ? JSON.stringify(value) : value) || null,
                                        rules: (!!desParameters[name] && desParameters[name].type === 'int') ? [
                                            {
                                                pattern: /^-?[0-9]\d*$/,
                                                message: IntlFormatMessage('laboratory.anomaly.anIntegerEnter'),
                                            },
                                            {
                                                validator: (rule, value, callback) => {
                                                    if (value !== 0 && !value) {
                                                        return callback(`${IntlFormatMessage('laboratory.anomaly.cannotParameter')}`);
                                                    }
                                                    if (value < -1) {
                                                        return callback(IntlFormatMessage('task.common.cannotSmaller'));
                                                    }
                                                    callback();
                                                }
                                            }
                                        ] : [
                                            // {
                                            //     pattern: /^[^\s]*$/,
                                            //     message: '禁止输入空格',
                                            // },
                                        ],
                                    })(
                                        (!!desParameters[name] && desParameters[name].type === 'int') ?
                                            <InputNumber
                                                autoComplete="off"
                                                className="item-width-tighten"
                                                disabled={['training_days', 'train_grain', 'merge_mode', 'forecast_period'].includes(name) && checked}
                                            />
                                            :
                                            <Input
                                                autoComplete="off"
                                                className="item-width-tighten"
                                                disabled={['training_days', 'train_grain', 'merge_mode', 'forecast_period'].includes(name) && checked}
                                            />
                                    )}
                                    {
                                        desParameters[name] ?
                                            <BasicTooltip
                                                title={desParameters[name] ? desParameters[name].description : ''}>
                                                <Icon type="question-circle" style={{marginLeft: '8px', fontSize: 16}}/>
                                            </BasicTooltip>
                                            : null
                                    }
                                </FormItem>
                            );
                        }))
                        : null
                }
                {
                    (!currentParameters || !currentParameters.length) ? (!!alogParams[selectAlog] && !!alogParams[selectAlog].parameters &&
                        (alogParams[selectAlog].parameters || []).filter(param => param.name !== 'stream_mode').map((item, index) => {
                            const {name = '', value = '', nameZhDescription = ''} = item;
                            return (
                                <FormItem
                                    key={name}
                                    label={
                                        <Fragment>
                                            <Tooltip title={name}>
                                                <span className="label-name">
                                                    {name}
                                                </span>
                                            </Tooltip>
                                        </Fragment>
                                    }
                                    {...paramsModalLabelLayout}
                                >
                                    {getFieldDecorator(`${name}`, {
                                        initialValue: value || null,
                                        rules: (!!desParameters[name] && desParameters[name].type === 'int') ? [
                                            {
                                                pattern: /^-?[0-9]\d*$/,
                                                message: IntlFormatMessage('laboratory.anomaly.anIntegerEnter'),
                                            },
                                            {
                                                validator: (rule, value, callback) => {
                                                    if (value !== 0 && !value) {
                                                        return callback(`${IntlFormatMessage('laboratory.anomaly.cannotParameter')}`);
                                                    }
                                                    if (value < -1) {
                                                        return callback(IntlFormatMessage('task.common.cannotSmaller'));
                                                    }
                                                    callback();
                                                }
                                            }
                                        ] : [
                                            // {
                                            //     pattern: /^[^\s]*$/,
                                            //     message: '禁止输入空格',
                                            // },
                                        ],
                                    })(
                                        (!!desParameters[name] && desParameters[name].type === 'int') ?
                                            <InputNumber
                                                autoComplete="off"
                                                className="item-width-tighten"
                                                disabled={['training_days', 'train_grain', 'merge_mode', 'forecast_period'].includes(name) && checked}
                                            />
                                            :
                                            <Input
                                                autoComplete="off"
                                                className="item-width-tighten"
                                                disabled={['training_days', 'train_grain', 'merge_mode', 'forecast_period'].includes(name) && checked}
                                            />
                                    )}
                                    {
                                        desParameters[name] ?
                                            <Tooltip
                                                title={desParameters[name] ? desParameters[name].description : ''}>
                                                <Icon type="question-circle" style={{marginLeft: '8px', fontSize: 16}}/>
                                            </Tooltip>
                                            : null
                                    }
                                </FormItem>
                            );
                        }))
                        : null
                }
            </Form>
        );
    } else {
        return null;
    }
};

export default Config;
