import React, {Fragment, useEffect, useMemo} from 'react';
import {Form, Input, Button, Select, Tooltip, Modal, Icon, Spin, Row, Col,} from '@chaoswise/ui';
import styles from './assets/index.less';
import {guid, IntlFormatMessage} from "@/utils/util";
import {connect, toJS} from '@chaoswise/cw-mobx';
import {useFetchState} from "@/components/HooksState";
import IconTooltip from "@/components/IconTooltip";
import {error} from "@/utils/tip";

const {Option} = Select;
const {Item} = Form;
const formLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 15}
};

const EditTable = (props) => {
    const {
        form, updateOffFiledInfo, fieldDescs, renderOption, offBasicData, offFiledSetData, csvFile = false,
        updateAddList, addList, disabled = false,
    } = props;
    const {getFieldDecorator, setFieldsValue, getFieldValue, getFieldsValue,} = form;
    const [addBodyList, setAddBodyList] = useFetchState(toJS(addList));
    const [addVisible, setAddVisible] = useFetchState(false);

    const addListRenderOption = useMemo(() => {
        return () => addBodyList.concat(toJS(addList)).map(item => {
            return item.tableField;
        }).concat(renderOption()).filter(Boolean);
    }, [renderOption, addList, addBodyList]);
    const dataBodyList = useMemo(() => {
        if (csvFile) {
            if (offBasicData.dataType === 'NODE_RELATION') {
                return [
                    {
                        key: IntlFormatMessage('datasource.create.originModelColumn'),
                        description: IntlFormatMessage('datasource.create.indicatingTheModel'),
                        setting: <Item className="noBottomBox item-width-tighten">
                            {
                                getFieldDecorator('fromModel', {
                                    initialValue: offFiledSetData.fromModel || undefined,
                                    rules: [
                                        {required: true, message: IntlFormatMessage('laboratory.anomaly.originModel')},
                                    ],
                                })(
                                    <Select
                                        disabled={disabled}
                                        onChange={(value) => updateOffFiledInfo('fromModel', value)}
                                        placeholder={IntlFormatMessage('laboratory.anomaly.originModel')}
                                        style={{width: '100%'}}
                                        showSearch
                                        allowClear
                                    >
                                        {
                                            (fieldDescs || []).map((item, index) => {
                                                return <Option
                                                    value={item}
                                                    key={`${index}${item}`}
                                                    disabled={addListRenderOption().includes(item)}
                                                >{item}</Option>;
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </Item>
                    },
                    {
                        key: IntlFormatMessage('datasource.create.originObjectColumn'),
                        description: IntlFormatMessage('datasource.create.indicatingTheObject'),
                        setting: <Item className="noBottomBox item-width-tighten">
                            {
                                getFieldDecorator('fromTarget', {
                                    initialValue: offFiledSetData.fromTarget || undefined,
                                    rules: [
                                        {required: true, message: IntlFormatMessage('laboratory.anomaly.originObject')},
                                    ],
                                })(
                                    <Select
                                        disabled={disabled}
                                        onChange={(value) => updateOffFiledInfo('fromTarget', value)}
                                        placeholder={IntlFormatMessage('laboratory.anomaly.originObject')}
                                        style={{width: '100%'}}
                                        showSearch
                                        allowClear
                                    >
                                        {
                                            (fieldDescs || []).map((item, index) => {
                                                return <Option
                                                    value={item}
                                                    key={`${index}${item}`}
                                                    disabled={addListRenderOption().includes(item)}
                                                >{item}</Option>;
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </Item>
                    },
                    {
                        key: IntlFormatMessage('datasource.create.destinationModelColumn'),
                        description: IntlFormatMessage('datasource.create.subModeModel'),
                        setting: <Item className="noBottomBox item-width-tighten">
                            {
                                getFieldDecorator('toModel', {
                                    initialValue: offFiledSetData.toModel || undefined,
                                    rules: [
                                        {required: true, message: IntlFormatMessage('laboratory.anomaly.columnSelect')},
                                    ],
                                })(
                                    <Select
                                        disabled={disabled}
                                        onChange={(value) => updateOffFiledInfo('toModel', value)}
                                        placeholder={IntlFormatMessage('laboratory.anomaly.columnSelect')}
                                        style={{width: '100%'}}
                                        showSearch
                                        allowClear
                                    >
                                        {
                                            (fieldDescs || []).map((item, index) => {
                                                return <Option
                                                    value={item}
                                                    key={`${index}${item}`}
                                                    disabled={addListRenderOption().includes(item)}
                                                >{item}</Option>;
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </Item>
                    },
                    {
                        key: IntlFormatMessage('datasource.create.destinationObjectColumn'),
                        description: IntlFormatMessage('datasource.create.subModeObject'),
                        setting: <Item className="noBottomBox item-width-tighten">
                            {
                                getFieldDecorator('toTarget', {
                                    initialValue: offFiledSetData.toTarget || undefined,
                                    rules: [
                                        {
                                            required: true,
                                            message: IntlFormatMessage('laboratory.anomaly.destinationSelect')
                                        },
                                    ],
                                })(
                                    <Select
                                        disabled={disabled}
                                        onChange={(value) => updateOffFiledInfo('toTarget', value)}
                                        placeholder={IntlFormatMessage('laboratory.anomaly.destinationSelect')}
                                        style={{width: '100%'}}
                                        showSearch
                                        allowClear
                                    >
                                        {
                                            (fieldDescs || []).map((item, index) => {
                                                return <Option
                                                    value={item}
                                                    key={`${index}${item}`}
                                                    disabled={addListRenderOption().includes(item)}
                                                >{item}</Option>;
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </Item>
                    },
                    {
                        key: IntlFormatMessage('datasource.create.relationshipColumn'),
                        description: IntlFormatMessage('datasource.create.relationshipNode'),
                        setting: <Item className="noBottomBox item-width-tighten">
                            {
                                getFieldDecorator('relationship', {
                                    initialValue: offFiledSetData.relationship || undefined,
                                    rules: [
                                        {
                                            required: true,
                                            message: IntlFormatMessage('laboratory.anomaly.columnRelationship')
                                        },
                                    ],
                                })(
                                    <Select
                                        disabled={disabled}
                                        onChange={(value) => updateOffFiledInfo('relationship', value)}
                                        placeholder={IntlFormatMessage('laboratory.anomaly.columnRelationship')}
                                        style={{width: '100%'}}
                                        showSearch
                                        allowClear
                                    >
                                        {
                                            (fieldDescs || []).map((item, index) => {
                                                return <Option
                                                    value={item}
                                                    key={`${index}${item}`}
                                                    disabled={addListRenderOption().includes(item)}
                                                >{item}</Option>;
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </Item>
                    },
                ];
            } else if (offBasicData.dataType === 'TIME_SERIES') {
                return [
                    {
                        key: IntlFormatMessage('datasource.create.timecolumn'),
                        description: IntlFormatMessage('datasource.create.timeColumnField'),
                        setting: <Item className="noBottomBox item-width-tighten">
                            {
                                getFieldDecorator('time', {
                                    initialValue: offFiledSetData.time || undefined,
                                    rules: [
                                        {
                                            required: true,
                                            message: IntlFormatMessage('datasource.create.selecttimecolumn')
                                        },
                                    ],
                                })(
                                    <Select
                                        disabled={disabled}
                                        onChange={(e) => updateOffFiledInfo('time', e)}
                                        placeholder={IntlFormatMessage('datasource.create.selecttimecolumn')}
                                        style={{width: '100%'}}
                                        showSearch
                                        allowClear
                                    >
                                        {
                                            (fieldDescs || []).map((item, index) => {
                                                return <Option
                                                    value={item}
                                                    key={`${index}${item}`}
                                                    disabled={addListRenderOption().includes(item)}
                                                >{item}</Option>;
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </Item>
                    },
                    {
                        key: IntlFormatMessage('datasource.create.metricvaluecolumn'),
                        description: IntlFormatMessage('datasource.create.thefieldmetricvalueinsource'),
                        setting: <Item className="noBottomBox item-width-tighten">
                            {
                                getFieldDecorator('value', {
                                    initialValue: offFiledSetData.value || undefined,
                                    rules: [
                                        {
                                            required: true,
                                            message: IntlFormatMessage('datasource.create.selectmetricvalue')
                                        },
                                    ],
                                })(
                                    <Select
                                        disabled={disabled}
                                        onChange={(e) => updateOffFiledInfo('value', e)}
                                        placeholder={IntlFormatMessage('datasource.create.selectmetricvalue')}
                                        style={{width: '100%'}}
                                        showSearch
                                        allowClear
                                    >
                                        {
                                            (fieldDescs || []).map((item, index) => {
                                                return <Option
                                                    value={item}
                                                    key={`${index}${item}`}
                                                    disabled={addListRenderOption().includes(item)}
                                                >{item}</Option>;
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </Item>
                    },
                    {
                        key: IntlFormatMessage('datasource.create.metricname'),
                        description: IntlFormatMessage('datasource.create.fieldIndicateMetric'),
                        setting: <Item className="noBottomBox item-width-tighten">
                            {
                                getFieldDecorator('metric', {
                                    initialValue: offFiledSetData.metric || undefined,
                                    // rules: [
                                    //     checkoutChartName(),
                                    // ],
                                })(
                                    <Select
                                        disabled={disabled}
                                        onChange={(e) => updateOffFiledInfo('metric', e)}
                                        placeholder={IntlFormatMessage('datasource.create.metricnamecolumn')}
                                        style={{width: '100%'}}
                                        showSearch
                                        allowClear
                                    >
                                        {
                                            (fieldDescs || []).map((item, index) => {
                                                return <Option
                                                    value={item}
                                                    key={`${index}${item}`}
                                                    disabled={addListRenderOption().includes(item)}
                                                >{item}</Option>;
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </Item>
                    },
                    {
                        key: IntlFormatMessage('datasource.create.dimensioncolumn'),
                        description: IntlFormatMessage('datasource.create.representingthemetricsource'),
                        setting: <Item className="noBottomBox item-width-tighten">
                            {
                                getFieldDecorator('tags', {
                                    initialValue: offFiledSetData.tags || undefined,
                                    // rules: [
                                    //     checkoutChartName(),
                                    // ],
                                })(
                                    <Select
                                        disabled={disabled}
                                        onChange={(e) => updateOffFiledInfo('tags', e)}
                                        placeholder={IntlFormatMessage('datasource.create.selectdimensioncolumn')}
                                        style={{width: '100%'}}
                                        showSearch
                                        allowClear
                                    >
                                        {
                                            (fieldDescs || []).map((item, index) => {
                                                return <Option
                                                    value={item}
                                                    key={`${index}${item}`}
                                                    disabled={addListRenderOption().includes(item)}
                                                >{item}</Option>;
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </Item>
                    }
                ];
            } else if (offBasicData.dataType === 'LOG') {
                return [
                    {
                        key: IntlFormatMessage('datasource.create.timecolumn'),
                        description: IntlFormatMessage('datasource.create.fieldIndicateTime'),
                        setting: <Item className="noBottomBox item-width-tighten">
                            {
                                getFieldDecorator('time', {
                                    initialValue: offFiledSetData.time || undefined,
                                    rules: [
                                        {
                                            required: true,
                                            message: IntlFormatMessage('datasource.create.selecttimecolumn')
                                        },
                                    ],
                                })(
                                    <Select
                                        disabled={disabled}
                                        onChange={(e) => updateOffFiledInfo('time', e)}
                                        placeholder={IntlFormatMessage('datasource.create.selecttimecolumn')}
                                        style={{width: '100%'}}
                                        allowClear
                                    >
                                        {
                                            (fieldDescs || []).map((item, index) => {
                                                return <Option
                                                    value={item}
                                                    key={`${index}${item}`}
                                                    disabled={addListRenderOption().includes(item)}
                                                >{item}</Option>;
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </Item>
                    },
                    {
                        key: IntlFormatMessage('datasource.create.originalLogs'),
                        description: IntlFormatMessage('datasource.create.fieldIndicateLogTi'),
                        setting: <Item className="noBottomBox item-width-tighten">
                            {
                                getFieldDecorator('originLog', {
                                    initialValue: offFiledSetData.originLog || undefined,
                                    rules: [
                                        {required: true, message: IntlFormatMessage('laboratory.anomaly.selectLog')},
                                    ],
                                })(
                                    <Select
                                        disabled={disabled}
                                        onChange={(e) => updateOffFiledInfo('originLog', e)}
                                        placeholder={IntlFormatMessage('laboratory.anomaly.selectLog')}
                                        style={{width: '100%'}}
                                        allowClear
                                    >
                                        {
                                            (fieldDescs || []).map((item, index) => {
                                                return <Option
                                                    value={item}
                                                    key={`${index}${item}`}
                                                    disabled={addListRenderOption().includes(item)}
                                                >{item}</Option>;
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </Item>
                    },
                    {
                        key: IntlFormatMessage('datasource.create.contentColumn'),
                        description: IntlFormatMessage('datasource.create.fieldIndicate'),
                        setting: <div className="flex-box item-width-tighten">
                            <Item className="noBottomBox" style={{width: '100%'}}>
                                {
                                    getFieldDecorator('message', {
                                        initialValue: offFiledSetData.message || undefined,
                                        rules: [
                                            {required: false, message: IntlFormatMessage('laboratory.anomaly.selectContent')},
                                        ],
                                    })(
                                        <Select
                                            disabled={disabled}
                                            onChange={(e) => {
                                                updateOffFiledInfo('message', e);
                                                if (e !== 'grok') {
                                                    updateOffFiledInfo('grok', undefined);
                                                }
                                            }}
                                            placeholder={IntlFormatMessage('laboratory.anomaly.selectContent')}
                                            style={{width: getFieldValue('message') === 'grok' ? '95%' : '100%'}}
                                            allowClear
                                        >
                                            <Option
                                                value={'grok'}
                                                key={'grok'}
                                            >{IntlFormatMessage('laboratory.anomaly.regex')}</Option>
                                            {
                                                (fieldDescs || []).map((item, index) => {
                                                    return <Option
                                                        value={item}
                                                        key={`${index}${item}`}
                                                        disabled={addListRenderOption().includes(item)}
                                                    >{item}</Option>;
                                                })
                                            }
                                        </Select>
                                    )
                                }
                            </Item>
                            {
                                getFieldValue('message') === 'grok' ?
                                    <Item className="noBottomBox" style={{width: '100%'}}>
                                        {
                                            getFieldDecorator('grok', {
                                                initialValue: offFiledSetData.grok || undefined,
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: IntlFormatMessage('laboratory.anomaly.enterRegular')
                                                    },
                                                ],
                                            })(
                                                <Input
                                                    disabled={disabled}
                                                    placeholder={IntlFormatMessage('laboratory.anomaly.enterRegular')}
                                                    style={{width: '100%'}}
                                                    onChange={(e) => updateOffFiledInfo('grok', e.target.value)}
                                                />
                                            )
                                        }
                                    </Item>
                                    : null
                            }
                        </div>
                    },
                    {
                        key: 'Host',
                        description: IntlFormatMessage('datasource.create.fieldIndicateAddress'),
                        setting: <Item className="noBottomBox item-width-tighten">
                            {
                                getFieldDecorator('host', {
                                    initialValue: offFiledSetData.host || undefined,
                                    rules: [
                                        {
                                            required: false,
                                            message: `${IntlFormatMessage('laboratory.anomaly.select')}Host`
                                        },
                                    ],
                                })(
                                    <Select
                                        disabled={disabled}
                                        onChange={(e) => updateOffFiledInfo('host', e)}
                                        placeholder={`${IntlFormatMessage('laboratory.anomaly.select')}Host`}
                                        style={{width: '100%'}}
                                        allowClear
                                    >
                                        {
                                            (fieldDescs || []).map((item, index) => {
                                                return <Option
                                                    value={item}
                                                    key={`${index}${item}`}
                                                    disabled={addListRenderOption().includes(item)}
                                                >{item}</Option>;
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </Item>
                    },
                    {
                        key: 'Loglevel',
                        description: IntlFormatMessage('datasource.create.fieldIndicateLev'),
                        setting: <Item className="noBottomBox item-width-tighten">
                            {
                                getFieldDecorator('loglevel', {
                                    initialValue: offFiledSetData.loglevel || undefined,
                                    rules: [
                                        {
                                            required: false,
                                            message: `${IntlFormatMessage('laboratory.anomaly.select')}Loglevel`
                                        },
                                    ]
                                })(
                                    <Select
                                        disabled={disabled}
                                        onChange={(e) => updateOffFiledInfo('loglevel', e)}
                                        placeholder={`${IntlFormatMessage('laboratory.anomaly.select')}Loglevel`}
                                        style={{width: '100%'}}
                                        allowClear
                                    >
                                        {
                                            (fieldDescs || []).map((item, index) => {
                                                return <Option
                                                    value={item}
                                                    key={`${index}${item}`}
                                                    disabled={addListRenderOption().includes(item)}
                                                >{item}</Option>;
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </Item>
                    },
                    {
                        key: 'Source',
                        description: IntlFormatMessage('datasource.create.fieldIndicateSou'),
                        setting: <Item className="noBottomBox item-width-tighten">
                            {
                                getFieldDecorator('source', {
                                    initialValue: offFiledSetData.source || undefined,
                                    rules: [
                                        {
                                            required: false,
                                            message: `${IntlFormatMessage('laboratory.anomaly.select')}Source`
                                        },
                                    ],
                                })(
                                    <Select
                                        disabled={disabled}
                                        onChange={(e) => updateOffFiledInfo('source', e)}
                                        placeholder={`${IntlFormatMessage('laboratory.anomaly.select')}Source`}
                                        style={{width: '100%'}}
                                        allowClear
                                    >
                                        {
                                            (fieldDescs || []).map((item, index) => {
                                                return <Option
                                                    value={item}
                                                    key={`${index}${item}`}
                                                    disabled={addListRenderOption().includes(item)}
                                                >{item}</Option>;
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </Item>
                    },
                    {
                        key: 'Pattern',
                        description: IntlFormatMessage('datasource.create.fieldIndicatePat'),
                        setting: <Item className="noBottomBox item-width-tighten">
                            {
                                getFieldDecorator('pattern', {
                                    initialValue: offFiledSetData.pattern || undefined,
                                    rules: [
                                        {
                                            required: false,
                                            message: `${IntlFormatMessage('laboratory.anomaly.select')}Pattern`
                                        },
                                    ],
                                })(
                                    <Select
                                        disabled={disabled}
                                        onChange={(e) => updateOffFiledInfo('pattern', e)}
                                        placeholder={`${IntlFormatMessage('laboratory.anomaly.select')}Pattern`}
                                        style={{width: '100%'}}
                                        allowClear
                                    >
                                        {
                                            (fieldDescs || []).map((item, index) => {
                                                return <Option
                                                    value={item}
                                                    key={`${index}${item}`}
                                                    disabled={addListRenderOption().includes(item)}
                                                >{item}</Option>;
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </Item>
                    },
                    {
                        key: 'PatternId',
                        description: IntlFormatMessage('datasource.create.fieldIndicateId'),
                        setting: <Item className="noBottomBox item-width-tighten">
                            {
                                getFieldDecorator('patternId', {
                                    initialValue: offFiledSetData.patternId || undefined,
                                    rules: [
                                        {
                                            required: false,
                                            message: `${IntlFormatMessage('laboratory.anomaly.select')}PatternId`
                                        },
                                    ],
                                })(
                                    <Select
                                        disabled={disabled}
                                        onChange={(e) => updateOffFiledInfo('patternId', e)}
                                        placeholder={`${IntlFormatMessage('laboratory.anomaly.select')}PatternId`}
                                        style={{width: '100%'}}
                                        allowClear
                                    >
                                        {
                                            (fieldDescs || []).map((item, index) => {
                                                return <Option
                                                    value={item}
                                                    key={`${index}${item}`}
                                                    disabled={addListRenderOption().includes(item)}
                                                >{item}</Option>;
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </Item>
                    },
                ];
            }
        } else {
            if (offFiledSetData.type === 'NODE_RELATION') {
                return [
                    {
                        key: IntlFormatMessage('datasource.create.originModelColumn'),
                        description: IntlFormatMessage('datasource.create.indicatingTheModel'),
                        setting: <Item className="noBottomBox item-width-tighten">
                            {
                                getFieldDecorator('fromModel', {
                                    initialValue: offFiledSetData.fromModel || undefined,
                                    rules: [
                                        {required: true, message: IntlFormatMessage('laboratory.anomaly.originModel')},
                                    ],
                                })(
                                    <Select
                                        disabled={disabled}
                                        onChange={(e) => updateOffFiledInfo('fromModel', e)}
                                        placeholder={IntlFormatMessage('laboratory.anomaly.originModel')}
                                        style={{width: '100%'}}
                                        showSearch
                                        allowClear
                                    >
                                        {
                                            fieldDescs.map((item, index) => {
                                                return <Option
                                                    value={item.name}
                                                    key={`${index}${item.name}`}
                                                    disabled={addListRenderOption().includes(item.name)}
                                                >{item.name}</Option>;
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </Item>
                    },
                    {
                        key: IntlFormatMessage('datasource.create.originObjectColumn'),
                        description: IntlFormatMessage('datasource.create.indicatingTheObject'),
                        setting: <Item className="noBottomBox item-width-tighten">
                            {
                                getFieldDecorator('fromTarget', {
                                    initialValue: offFiledSetData.fromTarget || undefined,
                                    rules: [
                                        {required: true, message: IntlFormatMessage('laboratory.anomaly.originObject')},
                                    ],
                                })(
                                    <Select
                                        disabled={disabled}
                                        onChange={(e) => updateOffFiledInfo('fromTarget', e)}
                                        placeholder={IntlFormatMessage('laboratory.anomaly.originObject')}
                                        style={{width: '100%'}}
                                        showSearch
                                        allowClear
                                    >
                                        {
                                            fieldDescs.map((item, index) => {
                                                return <Option
                                                    value={item.name}
                                                    disabled={addListRenderOption().includes(item.name)}
                                                    key={`${index}${item.name}`}
                                                >{item.name}</Option>;
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </Item>
                    },
                    {
                        key: IntlFormatMessage('datasource.create.destinationModelColumn'),
                        description: IntlFormatMessage('datasource.create.subModeModel'),
                        setting: <Item className="noBottomBox item-width-tighten">
                            {
                                getFieldDecorator('toModel', {
                                    initialValue: offFiledSetData.toModel || undefined,
                                    rules: [
                                        {
                                            required: true,
                                            message: IntlFormatMessage('laboratory.anomaly.relationshipModel')
                                        },
                                    ],
                                })(
                                    <Select
                                        disabled={disabled}
                                        placeholder={IntlFormatMessage('laboratory.anomaly.relationshipModel')}
                                        onChange={(e) => updateOffFiledInfo('toModel', e)}
                                        style={{width: '100%'}}
                                        showSearch
                                        allowClear
                                    >
                                        {
                                            fieldDescs.map((item, index) => {
                                                return <Option
                                                    value={item.name}
                                                    disabled={addListRenderOption().includes(item.name)}
                                                    key={`${index}${item.name}`}
                                                >{item.name}</Option>;
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </Item>
                    },
                    {
                        key: IntlFormatMessage('datasource.create.destinationObjectColumn'),
                        description: IntlFormatMessage('datasource.create.subModeObject'),
                        setting: <Item className="noBottomBox item-width-tighten">
                            {
                                getFieldDecorator('toTarget', {
                                    initialValue: offFiledSetData.toTarget || undefined,
                                    rules: [
                                        {
                                            required: true,
                                            message: IntlFormatMessage('laboratory.anomaly.relationshipObject')
                                        },
                                    ],
                                })(
                                    <Select
                                        disabled={disabled}
                                        placeholder={IntlFormatMessage('laboratory.anomaly.relationshipObject')}
                                        onChange={(e) => updateOffFiledInfo('toTarget', e)}
                                        style={{width: '100%'}}
                                        showSearch
                                        allowClear
                                    >
                                        {
                                            fieldDescs.map((item, index) => {
                                                return <Option
                                                    value={item.name}
                                                    disabled={addListRenderOption().includes(item.name)}
                                                    key={`${index}${item.name}`}
                                                >{item.name}</Option>;
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </Item>
                    },
                    {
                        key: IntlFormatMessage('datasource.create.relationshipColumn'),
                        description: IntlFormatMessage('datasource.create.relationshipNode'),
                        setting: <Item className="noBottomBox item-width-tighten">
                            {
                                getFieldDecorator('relationship', {
                                    initialValue: offFiledSetData.relationship || undefined,
                                    rules: [
                                        {
                                            required: true,
                                            message: IntlFormatMessage('laboratory.anomaly.relationshipTip')
                                        },
                                    ],
                                })(
                                    <Select
                                        disabled={disabled}
                                        onChange={(e) => updateOffFiledInfo('relationship', e)}
                                        placeholder={IntlFormatMessage('laboratory.anomaly.relationshipTip')}
                                        style={{width: '100%'}}
                                        showSearch
                                        allowClear
                                    >
                                        {
                                            fieldDescs.map((item, index) => {
                                                return <Option
                                                    value={item.name}
                                                    disabled={addListRenderOption().includes(item.name)}
                                                    key={`${index}${item.name}`}
                                                >{item.name}</Option>;
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </Item>
                    },
                ];
            } else if (offFiledSetData.type === 'TIME_SERIES') {
                return [
                    {
                        key: IntlFormatMessage('datasource.create.timecolumn'),
                        description: IntlFormatMessage('datasource.create.timeColumnField'),
                        setting: <Item className="noBottomBox item-width-tighten">
                            {
                                getFieldDecorator('time', {
                                    initialValue: offFiledSetData.time || undefined,
                                    rules: [
                                        {
                                            required: true,
                                            message: IntlFormatMessage('datasource.create.selecttimecolumn')
                                        },
                                    ],
                                })(
                                    <Select
                                        disabled={disabled}
                                        onChange={(e) => updateOffFiledInfo('time', e)}
                                        placeholder={IntlFormatMessage('datasource.create.selecttimecolumn')}
                                        style={{width: '100%'}}
                                        showSearch
                                        allowClear
                                    >
                                        {
                                            fieldDescs.filter(item => item.type === 'BIGINT').map((item, index) => {
                                                return <Option
                                                    value={item.name}
                                                    disabled={addListRenderOption().includes(item.name)}
                                                    key={`${index}${item.name}`}
                                                >{item.name}</Option>;
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </Item>
                    },
                    {
                        key: IntlFormatMessage('datasource.create.metricvaluecolumn'),
                        description: IntlFormatMessage('datasource.create.thefieldmetricvalueinsource'),
                        setting: <Item className="noBottomBox item-width-tighten">
                            {
                                getFieldDecorator('value', {
                                    initialValue: offFiledSetData.value || undefined,
                                    rules: [
                                        {
                                            required: true,
                                            message: IntlFormatMessage('datasource.create.selectmetricvalue')
                                        },
                                    ],
                                })(
                                    <Select
                                        disabled={disabled}
                                        onChange={(e) => updateOffFiledInfo('value', e)}
                                        placeholder={IntlFormatMessage('datasource.create.selectmetricvalue')}
                                        style={{width: '100%'}}
                                        showSearch
                                        allowClear
                                    >
                                        {
                                            fieldDescs.filter(item => ['DOUBLE', 'INTEGER', 'BIGINT', 'FLOAT'].includes(item.type)).map((item, index) => {
                                                return <Option
                                                    value={item.name}
                                                    disabled={addListRenderOption().includes(item.name)}
                                                    key={`${index}${item.name}`}
                                                >{item.name}</Option>;
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </Item>
                    },
                    {
                        key: IntlFormatMessage('datasource.create.metricname'),
                        description: IntlFormatMessage('datasource.create.fieldIndicateMetric'),
                        setting: <Item className="noBottomBox item-width-tighten">
                            {
                                getFieldDecorator('metric', {
                                    initialValue: offFiledSetData.metric || undefined,
                                    // rules: [
                                    //     checkoutChartName(),
                                    // ],
                                })(
                                    <Select
                                        disabled={disabled}
                                        onChange={(e) => updateOffFiledInfo('metric', e)}
                                        placeholder={IntlFormatMessage('datasource.create.metricnamecolumn')}
                                        style={{width: '100%'}}
                                        showSearch
                                        allowClear
                                    >
                                        {
                                            fieldDescs.filter(item => item.type === 'VARCHAR').map((item, index) => {
                                                return <Option
                                                    value={item.name}
                                                    disabled={addListRenderOption().includes(item.name)}
                                                    key={`${index}${item.name}`}
                                                >{item.name}</Option>;
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </Item>
                    },
                    {
                        key: IntlFormatMessage('datasource.create.dimensioncolumn'),
                        description: IntlFormatMessage('datasource.create.representingthemetricsource'),
                        setting: <Item className="noBottomBox item-width-tighten">
                            {
                                getFieldDecorator('tags', {
                                    initialValue: offFiledSetData.tags || undefined,
                                    // rules: [
                                    //     checkoutChartName(),
                                    // ],
                                })(
                                    <Select
                                        disabled={disabled}
                                        onChange={(e) => updateOffFiledInfo('tags', e)}
                                        placeholder={IntlFormatMessage('datasource.create.selectdimensioncolumn')}
                                        style={{width: '100%'}}
                                        showSearch
                                        allowClear
                                    >
                                        {
                                            fieldDescs.filter(item => item.type === 'VARCHAR').map((item, index) => {
                                                return <Option
                                                    value={item.name}
                                                    disabled={addListRenderOption().includes(item.name)}
                                                    key={`${index}${item.name}`}
                                                >{item.name}</Option>;
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </Item>
                    }
                ];
            } else if (offFiledSetData.type === 'LOG') {
                return [
                    {
                        key: IntlFormatMessage('datasource.create.timecolumn'),
                        description: IntlFormatMessage('datasource.create.fieldIndicateTime'),
                        setting: <Item className="noBottomBox item-width-tighten">
                            {
                                getFieldDecorator('time', {
                                    initialValue: offFiledSetData.time || undefined,
                                    rules: [
                                        {
                                            required: true,
                                            message: IntlFormatMessage('datasource.create.selecttimecolumn')
                                        },
                                    ],
                                })(
                                    <Select
                                        disabled={disabled}
                                        onChange={(e) => updateOffFiledInfo('time', e)}
                                        placeholder={IntlFormatMessage('datasource.create.selecttimecolumn')}
                                        style={{width: '100%'}}
                                        allowClear
                                    >
                                        {
                                            fieldDescs.filter(i => i.type === 'BIGINT').map((item, index) => {
                                                return <Option
                                                    value={item.name}
                                                    disabled={addListRenderOption().includes(item.name)}
                                                    key={`${index}${item.name}`}
                                                >{item.name}</Option>;
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </Item>
                    },
                    {
                        key: IntlFormatMessage('datasource.create.originalLogs'),
                        description: IntlFormatMessage('datasource.create.fieldIndicateLogTi'),
                        setting: <Item className="noBottomBox item-width-tighten">
                            {
                                getFieldDecorator('originLog', {
                                    initialValue: offFiledSetData.originLog || undefined,
                                    rules: [
                                        {required: true, message: IntlFormatMessage('laboratory.anomaly.selectLog')},
                                    ],
                                })(
                                    <Select
                                        disabled={disabled}
                                        onChange={(e) => updateOffFiledInfo('originLog', e)}
                                        placeholder={IntlFormatMessage('laboratory.anomaly.selectLog')}
                                        style={{width: '100%'}}
                                        allowClear
                                    >
                                        {
                                            fieldDescs.map((item, index) => {
                                                return <Option
                                                    value={item.name}
                                                    disabled={addListRenderOption().includes(item.name)}
                                                    key={`${index}${item.name}`}
                                                >{item.name}</Option>;
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </Item>
                    },
                    {
                        key: IntlFormatMessage('datasource.create.contentColumn'),
                        description: IntlFormatMessage('datasource.create.fieldIndicate'),
                        setting: <div className="flex-box item-width-tighten">
                            <Item className="noBottomBox" style={{width: '100%'}}>
                                {
                                    getFieldDecorator('message', {
                                        initialValue: offFiledSetData.message || undefined,
                                        rules: [
                                            {required: false, message: IntlFormatMessage('laboratory.anomaly.selectContent')},
                                        ],
                                    })(
                                        <Select
                                            disabled={disabled}
                                            onChange={(e) => {
                                                updateOffFiledInfo('message', e);
                                                if (e !== 'grok') {
                                                    updateOffFiledInfo('grok', undefined);
                                                }
                                            }}
                                            placeholder={IntlFormatMessage('laboratory.anomaly.selectContent')}
                                            style={{width: getFieldValue('message') === 'grok' ? '95%' : '100%'}}
                                            allowClear
                                        >
                                            <Option
                                                value={'grok'}
                                                key={'grok'}
                                            >{IntlFormatMessage('laboratory.anomaly.regex')}</Option>
                                            {
                                                fieldDescs.filter(item => item.type === 'VARCHAR').map((item, index) => {
                                                    return <Option
                                                        value={item.name}
                                                        disabled={addListRenderOption().includes(item.name)}
                                                        key={`${index}${item.name}`}
                                                    >{item.name}</Option>;
                                                })
                                            }
                                        </Select>
                                    )
                                }
                            </Item>
                            {
                                getFieldValue('message') === 'grok' ?
                                    <Item className="noBottomBox" style={{width: '100%'}}>
                                        {
                                            getFieldDecorator('grok', {
                                                initialValue: offFiledSetData.grok || undefined,
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: IntlFormatMessage('laboratory.anomaly.enterRegular')
                                                    },
                                                ],
                                            })(
                                                <Input
                                                    disabled={disabled}
                                                    placeholder={IntlFormatMessage('laboratory.anomaly.enterRegular')}
                                                    style={{width: '100%'}}
                                                    onChange={(e) => updateOffFiledInfo('grok', e.target.value)}
                                                />
                                            )
                                        }
                                    </Item>
                                    : null
                            }
                        </div>
                    },
                    {
                        key: 'Host',
                        description: IntlFormatMessage('datasource.create.fieldIndicateAddress'),
                        setting: <Item className="noBottomBox item-width-tighten">
                            {
                                getFieldDecorator('host', {
                                    initialValue: offFiledSetData.host || undefined,
                                    rules: [
                                        {
                                            required: false,
                                            message: `${IntlFormatMessage('laboratory.anomaly.select')}Host`
                                        },
                                    ],
                                })(
                                    <Select
                                        disabled={disabled}
                                        onChange={(e) => updateOffFiledInfo('host', e)}
                                        placeholder={`${IntlFormatMessage('laboratory.anomaly.select')}Host`}
                                        style={{width: '100%'}}
                                        allowClear
                                    >
                                        {
                                            fieldDescs.map((item, index) => {
                                                return <Option
                                                    value={item.name}
                                                    disabled={addListRenderOption().includes(item.name)}
                                                    key={`${index}${item.name}`}
                                                >{item.name}</Option>;
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </Item>
                    },
                    {
                        key: 'Loglevel',
                        description: IntlFormatMessage('datasource.create.fieldIndicateLev'),
                        setting: <Item className="noBottomBox item-width-tighten">
                            {
                                getFieldDecorator('loglevel', {
                                    initialValue: offFiledSetData.loglevel || undefined,
                                    rules: [
                                        {
                                            required: false,
                                            message: `${IntlFormatMessage('laboratory.anomaly.select')}Loglevel`
                                        },
                                    ],
                                })(
                                    <Select
                                        disabled={disabled}
                                        onChange={(e) => updateOffFiledInfo('loglevel', e)}
                                        placeholder={`${IntlFormatMessage('laboratory.anomaly.select')}Loglevel`}
                                        style={{width: '100%'}}
                                        allowClear
                                    >
                                        {
                                            fieldDescs.map((item, index) => {
                                                return <Option
                                                    value={item.name}
                                                    disabled={addListRenderOption().includes(item.name)}
                                                    key={`${index}${item.name}`}
                                                >{item.name}</Option>;
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </Item>
                    },
                    {
                        key: 'Source',
                        description: IntlFormatMessage('datasource.create.fieldIndicateSou'),
                        setting: <Item className="noBottomBox item-width-tighten">
                            {
                                getFieldDecorator('source', {
                                    initialValue: offFiledSetData.source || undefined,
                                    rules: [
                                        {
                                            required: false,
                                            message: `${IntlFormatMessage('laboratory.anomaly.select')}Source`
                                        },
                                    ],
                                })(
                                    <Select
                                        disabled={disabled}
                                        onChange={(e) => updateOffFiledInfo('source', e)}
                                        placeholder={`${IntlFormatMessage('laboratory.anomaly.select')}Source`}
                                        style={{width: '100%'}}
                                        allowClear
                                    >
                                        {
                                            fieldDescs.map((item, index) => {
                                                return <Option
                                                    value={item.name}
                                                    disabled={addListRenderOption().includes(item.name)}
                                                    key={`${index}${item.name}`}
                                                >{item.name}</Option>;
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </Item>
                    },
                ];
            }
        }
    }, [offFiledSetData, fieldDescs.length, addList]);

    const updateFun = (type, value, index) => {
        setAddBodyList(prev => {
            return toJS(addList).map((item, cIndex) => {
                if (cIndex === index) {
                    return Object.assign({}, item, {
                        [type]: value,
                    });
                }
                return item;
            });
        });
    };

    useEffect(() => {
        updateAddList(addBodyList);
    }, [addBodyList]);

    return (
        <div className={styles["edit-table-box"]}>
            <div className="edit-table-header flex-box">
                <span
                    className="edit-table-header-key edit-table-header-item">{IntlFormatMessage('laboratory.anomaly.fieldMame')}</span>
                <span
                    className="edit-table-header-description edit-table-header-item">{IntlFormatMessage('datasource.detail.description')}</span>
                <span
                    className="edit-table-header-setting edit-table-header-item">{IntlFormatMessage('datasource.create.tableField')}</span>
            </div>
            <div className="edit-table-body">
                {
                    (dataBodyList || []).map((item, index) => {
                        return <div className="flex-box" key={index}>
                            <div className="edit-table-body-key edit-table-body-item flex-box">
                                <Tooltip title={item.key} placement="topLeft">
                                    <div className="only-show-one-line">
                                        {item.key}
                                    </div>
                                </Tooltip>
                                {
                                    item.key === IntlFormatMessage('datasource.create.contentColumn') ?
                                        <IconTooltip
                                            style={{fontSize: 14, marginLeft: 7}}
                                            title={IntlFormatMessage('laboratory.anomaly.fieldsMessage')}
                                        />
                                        : null
                                }
                            </div>
                            <div className="edit-table-body-description edit-table-body-item">
                                <Tooltip title={item.description} placement="topLeft">
                                    {item.description}
                                </Tooltip>
                            </div>
                            <div className="edit-table-body-setting edit-table-body-item">{item.setting}</div>
                        </div>;
                    })
                }
                {
                    [offFiledSetData.type, offBasicData.dataType].includes('LOG') ?
                        <Fragment>
                            {
                                toJS(addList).map((item, index) => {
                                    return <div className="flex-box" key={index}>
                                        <div className="edit-table-body-key edit-table-body-item">
                                            <Tooltip title={item.fieldType} placement="topLeft">
                                                {item.fieldType}
                                            </Tooltip>
                                        </div>
                                        <div className="edit-table-body-description edit-table-body-item">
                                            <Tooltip title={item.description} placement="topLeft">
                                                {item.description}
                                            </Tooltip>
                                        </div>
                                        <div className="edit-table-body-setting edit-table-body-item">
                                            <Select
                                                defaultValue={item.tableField}
                                                onChange={(e) => updateFun('tableField', e, index)}
                                                placeholder={IntlFormatMessage('datasource.create.selecttimecolumn')}
                                                className="item-width-tighten"
                                                allowClear
                                                disabled={disabled}
                                            >
                                                {
                                                    fieldDescs.map((item, index) => {
                                                        if (item.name) {
                                                            return <Option
                                                                value={item.name}
                                                                disabled={addListRenderOption().includes(item.name)}
                                                                key={`${index}${item.name}`}
                                                            >{item.name}</Option>;
                                                        } else {
                                                            return <Option
                                                                value={item}
                                                                key={`${index}${item}`}
                                                                disabled={addListRenderOption().includes(item)}
                                                            >{item}</Option>;
                                                        }
                                                    })
                                                }
                                            </Select>
                                            {
                                                !disabled ? <Tooltip title={IntlFormatMessage('task.detail.delete')}>
                                                    <Icon type="close-circle" className="clear-btn"
                                                          onClick={() => {
                                                              const result = toJS(addList).filter(i => i.id !== item.id);
                                                              setAddBodyList(result);
                                                          }}/>
                                                </Tooltip> : ""
                                            }
                                        </div>
                                    </div>;
                                })
                            }
                            {
                                !disabled ?
                                    <Button type="primary" style={{marginTop: 16}} onClick={() => {
                                        setAddVisible(true);
                                    }}>{IntlFormatMessage('datasource.create.add')}</Button>
                                    : null
                            }
                        </Fragment>
                        : null
                }
            </div>

            {
                addVisible &&
                <Modal
                    title={IntlFormatMessage('datasource.create.add')}
                    visible={addVisible}
                    destroyOnClose={true}
                    centered={true}
                    onCancel={() => {
                        setAddVisible(false);
                    }}
                    onOk={() => {
                        const {fieldType, description} = getFieldsValue();
                        if ((!!fieldType && fieldType != ' ') && (!!description && description != ' ')) {
                            setAddBodyList(prev => {
                                return toJS(addList).concat({
                                    fieldType,
                                    description,
                                    tableField: '',
                                    id: guid(),
                                });
                            });
                            setAddVisible(false);
                        } else {
                            error(IntlFormatMessage('laboratory.anomaly.informationComplete'));
                        }
                    }}
                >
                    <Item {...formLayout} label={IntlFormatMessage('laboratory.anomaly.fieldMame')}>
                        {
                            getFieldDecorator('fieldType', {
                                rules: [
                                    {
                                        required: true,
                                        message: IntlFormatMessage('laboratory.anomaly.fieldEnter'),
                                        whitespace: true
                                    },

                                ],
                            })(
                                <Input
                                    style={{width: '100%'}}
                                    placeholder={IntlFormatMessage('laboratory.anomaly.fieldEnter')}
                                />
                            )
                        }
                    </Item>
                    <Item {...formLayout} label={IntlFormatMessage('laboratory.anomaly.description')}>
                        {
                            getFieldDecorator('description', {
                                rules: [
                                    {
                                        required: true,
                                        message: IntlFormatMessage('laboratory.anomaly.descriptionEnter'),
                                        whitespace: true
                                    },
                                ],
                            })(
                                <Input
                                    style={{width: '100%'}}
                                    placeholder={IntlFormatMessage('laboratory.anomaly.descriptionEnter')}
                                />
                            )
                        }
                    </Item>
                </Modal>
            }
        </div>
    );
};

export default connect(({dataSourceStore, store}) => {
    return {
        offFiledSetData: dataSourceStore.offFiledSetData,
        offBasicData: dataSourceStore.offBasicData,
        updateAddList: dataSourceStore.updateAddList,
        addList: dataSourceStore.addList,
    };
})(EditTable);