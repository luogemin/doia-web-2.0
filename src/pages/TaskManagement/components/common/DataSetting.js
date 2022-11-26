import {connect, toJS} from "@chaoswise/cw-mobx";
import TooltipDiv from "@/components/TooltipDiv";
import {
    formatType,
    labelLayout,
    OperatorList,
    polymerizationType
} from "@/globalConstants";
import React, {Fragment, useCallback, useEffect, useMemo,} from "react";
import {
    BasicLayout,
    Button,
    Checkbox,
    Col,
    Form,
    Input,
    InputNumber,
    Radio,
    RangePicker,
    Row,
    Select,
    CWTable as Table,
    DatePicker,
} from "@chaoswise/ui";
import DimensionBox from "@/components/DimensionBox";
import IconTooltip from "@/components/IconTooltip";
import {guid, IntlFormatMessage, IsInternationalization} from "@/utils/util";
import moment from 'moment';
import {omit} from "lodash-es";
import EditTargetAlert from "@/pages/TaskManagement/components/common/EditTargetAlert";
import {useHistory, useParams} from "react-router";
import {utilType} from '@/globalConstants';
import forecastingSvg from "@/pages/Dashboard/assets/forecasting.svg";
import {formNameReg} from "@/utils/formRegex";
import ScrollSelect from '@/components/ScrollSelect';
import {call} from "@/utils/effects";
import {useFetchState} from "@/components/HooksState";

const FormItem = Form.Item;
const Option = Select.Option;
let timer = {};

const DataSetting = (props) => {
    const {
        form, metricList = [], setMetricList, getDataSourceList, dataSourceList = [], current, postTaskNameAsync,
        getTaskSceneAsync, sceneList = [], ifCanEdit, typeId = 'anomaly_detection',
        getTaskModelAsync, getTaskTargetAsync, getTaskMetricAsync, getTaskTagsAsync, setFilterListReducer,
        modelList = {}, metricStoreList = {}, targetList = {}, tagsList = [], setIfEditTaskName, ifEditTaskName = false,
        setCurrentReducer, setListParams, listParams = {}, getTagsKeysAsync, getTagsValueAsync
    } = props;
    const {getFieldDecorator, getFieldValue, validateFields, setFieldsValue} = form;

    const {push, go, location} = useHistory();
    const {pathname = ""} = location;
    const {taskId = ''} = useParams();

    const {
        name = '', scene, bizSceneId, dataSourceId, filtersConfig = {}, aggConfig = {}, timeConfig = {},
        extendConfig = {},
    } = toJS(current);
    const {modelFilter = {}, targetFilter = {}, metricAndTagFilters = []} = filtersConfig;
    const {aggFunc, aggTimeNumber, aggTimeUnit, aggPercentile,} = aggConfig;
    const {timeFrameNumber, timeFrameUnit, cycleNumber, cycleUnit, execStartTime, nowExecute,} = timeConfig;
    const {dataProcessing = {},} = extendConfig;
    const {upperThreshold, lowerThreshold, forecastTimeNumber, forecastTimeUnit, mode} = dataProcessing;

    const columns = () => {
        return [
            {
                title: IntlFormatMessage('task.create.metricname'),
                dataIndex: 'metricFilter',
                key: 'metricFilter',
                width: '50%',
                render: (text, record) => {
                    if (text && text.value) {
                        const {value = []} = text;
                        const result = (typeof value === 'string') ? value : value.join(',');
                        return <TooltipDiv
                            title={result}
                        >
                            {result}
                        </TooltipDiv>;
                    } else {
                        return null;
                    }
                }
            },
            {
                title: IntlFormatMessage('task.detail.dimensionfilter'),
                dataIndex: 'tagsFilter',
                key: 'tagsFilter',
                width: '50%',
                render: (text, record) => {
                    if (text) {
                        const result = (text || []).map((item, index) => {
                            const {key = '', compare = '', value = ''} = item;
                            let result = `${key} ${(!!compare && OperatorList[compare]) ? IntlFormatMessage(OperatorList[compare].sign) : ''} ${value} ${(compare === 'IN' || compare === 'NIN') ? IntlFormatMessage('laboratory.anomaly.middle') : ''}`;
                            result += ((index + 1) < text.length ? `${IntlFormatMessage('laboratory.anomaly.and')}` : '');
                            return result;
                        });
                        return <div
                            dangerouslySetInnerHTML={{
                                __html: result.join(`<br/>`)
                            }}
                        />;
                    }
                }
            },
            /*eslint-disable*/
            {
                title: IntlFormatMessage('common.operation'),
                dataIndex: 'operation',
                key: 'operation',
                width: IsInternationalization() ? 125 : 115,
                render: (text, record) => {
                    return (
                        <div>
                            {
                                !ifCanEdit ?
                                    <Fragment>
                                        <span
                                            className={'greyColorStyle'}>{IntlFormatMessage('task.detail.edit')}</span>
                                        <span className="operation_line">|</span>
                                        <span
                                            className={'greyColorStyle'}>{IntlFormatMessage('task.detail.delete')}</span>
                                    </Fragment>
                                    :
                                    <Fragment>
                                        <span className={'nameStyle'} onClick={() => {
                                            setCurrentTarget(record)
                                            setTimeout(() => {
                                                setEditTargetModal(true)
                                            }, 200)
                                        }}>
                                            {IntlFormatMessage('task.detail.edit')}
                                        </span>
                                        <span className="operation_line">|</span>
                                        <span className={'nameStyle'} onClick={() => {
                                            deleteTarget(record)
                                        }}>
                                            {IntlFormatMessage('task.detail.delete')}
                                        </span>
                                    </Fragment>
                            }
                        </div>
                    );
                }
            },
            /*eslint-disable*/
        ];
    };

    const [currentTarget, setCurrentTarget] = useFetchState({});
    const [editTargetModal, setEditTargetModal] = useFetchState(false);
    const [loading, setLoading] = useFetchState(false);
    const [tagsPage, setTagsPage] = useFetchState({
        pageNum: 1,
        pageSize: 100,
        total: 0
    });
    const nowDate = new Date().getTime();

    useEffect(() => {
    }, [getFieldValue('dataSourceId')])
    // 拉取模型
    const initModelFun = useCallback(() => {
        clearTimeout(timer['modelTimer'])
        timer['modelTimer'] = setTimeout(() => {
            if (getFieldValue('dataSourceId')) {
                setLoading(true);
                const params = {
                    pageNum: 1,
                    pageSize: 100,
                    query: {
                        dataSourceId: getFieldValue('dataSourceId'),
                        filters: {
                            metricFilter: {},
                            modelFilter: {},
                            targetFilter: {}
                        },
                        nowDate: nowDate,
                        taskType: 2
                    },
                }
                setListParams({
                    modelListParam: params,
                })
                getTaskModelAsync(params, callBack)
            }
        }, 300)
    }, [getFieldValue('dataSourceId')])
    // 拉取对象
    const initTargetFun = useCallback(() => {
        clearTimeout(timer['targetTimer'])
        timer['targetTimer'] = setTimeout(() => {
            if (getFieldValue('dataSourceId')) {
                setLoading(true);
                const params = {
                    pageNum: 1,
                    pageSize: 100,
                    query: {
                        dataSourceId: getFieldValue('dataSourceId'),
                        filters: {
                            metricFilter: {},
                            modelFilter: (!!getFieldValue('model') && getFieldValue('model').length) ? {
                                compare: getFieldValue('model').length === 1 ? 'E' : 'IN',
                                value: getFieldValue('model').length === 1 ? getFieldValue('model')[0] : getFieldValue('model')
                            } : {},
                            targetFilter: {}
                        },
                        nowDate,
                        taskType: 2
                    }
                }
                setListParams({
                    targetListParam: params,
                })
                getTaskTargetAsync(params, callBack)
            }
        }, 300)
    }, [getFieldValue('model')])
    // 拉取指标
    const initMetricFun = useCallback(() => {
        clearTimeout(timer['metricTimer'])
        timer['metricTimer'] = setTimeout(() => {
            if (getFieldValue('dataSourceId')) {
                setLoading(true);
                const params = {
                    pageNum: 1,
                    pageSize: 100,
                    query: {
                        dataSourceId: getFieldValue('dataSourceId'),
                        filters: {
                            metricFilter: {},
                            modelFilter: (!!getFieldValue('model') && getFieldValue('model').length) ? {
                                compare: getFieldValue('model').length === 1 ? 'E' : 'IN',
                                value: getFieldValue('model').length === 1 ? getFieldValue('model')[0] : getFieldValue('model')
                            } : {},
                            targetFilter: (!!getFieldValue('target') && getFieldValue('target').length) ? {
                                compare: getFieldValue('target').length === 1 ? 'E' : 'IN',
                                value: getFieldValue('target').length === 1 ? getFieldValue('target')[0] : getFieldValue('target')
                            } : {},
                        },
                        nowDate,
                        taskType: 2
                    }
                }
                setListParams({
                    metricListParam: params,
                })
                getTaskMetricAsync(params, callBack)
            }
        }, 300)
    }, [getFieldValue('model'), getFieldValue('target')])
    // 拉取维度key
    const initTagsKeysFun = useCallback((page = {pageNum: 0}) => {
        if (getFieldValue('dataSourceId')) {
            const params = {
                pageNum: page.pageNum + 1,
                pageSize: 100,
                query: {
                    dataSourceId: getFieldValue('dataSourceId'),
                    filters: {
                        metricFilter: (!!getFieldValue('metric') && getFieldValue('metric').length) ? {
                            compare: getFieldValue('metric').length === 1 ? 'E' : 'IN',
                            value: getFieldValue('metric').length === 1 ? getFieldValue('metric')[0] : getFieldValue('metric')
                        } : {},
                        modelFilter: (!!getFieldValue('model') && getFieldValue('model').length) ? {
                            compare: getFieldValue('model').length === 1 ? 'E' : 'IN',
                            value: getFieldValue('model').length === 1 ? getFieldValue('model')[0] : getFieldValue('model')
                        } : {},
                        targetFilter: (!!getFieldValue('target') && getFieldValue('target').length) ? {
                            compare: getFieldValue('target').length === 1 ? 'E' : 'IN',
                            value: getFieldValue('target').length === 1 ? getFieldValue('target')[0] : getFieldValue('target')
                        } : {},
                    },
                    nowDate,
                    taskType: 2
                }
            }
            getTagsKeysAsync(params, (page) => {
                setLoading(false);
                setTagsPage({
                    pageNum: page.pageNum,
                    pageSize: page.pageSize,
                    total: page.totalSize
                })
            })
        }
    }, [getFieldValue('model'), getFieldValue('target'), getFieldValue('metric'),])
    // 拉取维度value
    const tagsParams = useMemo(() => {
        return {
            dataSourceId: getFieldValue('dataSourceId'),
            filters: {
                metricFilter: (!!getFieldValue('metric') && getFieldValue('metric').length) ? {
                    compare: getFieldValue('metric').length === 1 ? 'E' : 'IN',
                    value: getFieldValue('metric').length === 1 ? getFieldValue('metric')[0] : getFieldValue('metric')
                } : {},
                modelFilter: (!!getFieldValue('model') && getFieldValue('model').length) ? {
                    compare: getFieldValue('model').length === 1 ? 'E' : 'IN',
                    value: getFieldValue('model').length === 1 ? getFieldValue('model')[0] : getFieldValue('model')
                } : {},
                targetFilter: (!!getFieldValue('target') && getFieldValue('target').length) ? {
                    compare: getFieldValue('target').length === 1 ? 'E' : 'IN',
                    value: getFieldValue('target').length === 1 ? getFieldValue('target')[0] : getFieldValue('target')
                } : {},
            },
            nowDate,
            taskType: 2
        }
    }, [getFieldValue('dataSourceId'), getFieldValue('metric'), getFieldValue('model'), getFieldValue('target')])
    // const initTagsValueFun = useCallback(() => {
    //     if (getFieldValue('dataSourceId')) {
    //         const params = {
    //             pageNum: 1,
    //             pageSize: 100,
    //             query: {
    //                 dataSourceId: getFieldValue('dataSourceId'),
    //                 filters: {
    //                     metricFilter: (!!getFieldValue('metric') && getFieldValue('metric').length) ? {
    //                         compare: getFieldValue('metric').length === 1 ? 'E' : 'IN',
    //                         value: getFieldValue('metric').length === 1 ? getFieldValue('metric')[0] : getFieldValue('metric')
    //                     } : {},
    //                     modelFilter: (!!getFieldValue('model') && getFieldValue('model').length) ? {
    //                         compare: getFieldValue('model').length === 1 ? 'E' : 'IN',
    //                         value: getFieldValue('model').length === 1 ? getFieldValue('model')[0] : getFieldValue('model')
    //                     } : {},
    //                     targetFilter: (!!getFieldValue('target') && getFieldValue('target').length) ? {
    //                         compare: getFieldValue('target').length === 1 ? 'E' : 'IN',
    //                         value: getFieldValue('target').length === 1 ? getFieldValue('target')[0] : getFieldValue('target')
    //                     } : {},
    //                 },
    //                 nowDate,
    //                 taskType: 2
    //             }
    //         }
    //         getTagsValueAsync(params, callBack)
    //     }
    // }, [getFieldValue('model'), getFieldValue('target'), getFieldValue('metric'),])

    useEffect(() => {
        setMetricList(prev => {
            return metricAndTagFilters.map(item => Object.assign({}, item, {id: guid()}))
        })
    }, [current])

    useEffect(() => {
        if (typeId) {
            //获取场景
            getTaskSceneAsync(typeId)
        }
    }, [typeId])

    useEffect(() => {
        getDataSourceList({
            query: {
                type: 'DODB'
            }
        })
    }, [])

    //新建/编辑指标
    const onTargetSave = (data) => {
        if (!Object.keys(currentTarget).length) {
            setMetricList(prev => prev.concat(data))
        } else {
            setMetricList(prev => {
                return prev.map(item => {
                    if (item.id === data.id) {
                        return data
                    }
                    return item
                })
            })
        }
        onCancel()
    }
    const onCancel = () => {
        setEditTargetModal(false)
        setCurrentTarget({})
    }

    //删除指标
    const deleteTarget = (record) => {
        const {id} = record;
        setMetricList(prev => {
            return prev.filter(i => i.id !== id)
        })
    };

    const ifTaskName = (name) => {
        postTaskNameAsync({
            id: taskId,
            name,
        }, () => {

        })
    }
    const callBack = () => {
        setLoading(false)
    }

    //Datapicker禁用的时间范围
    const disabledDate = (current) => {
        // Can not select days before today and today
        const result = new Date().getTime() - 1000;
        return current && current < moment(new Date(result)).endOf('second');
    }

    useEffect(() => {
        if (!!name && pathname.indexOf('/copy/') > -1 && !ifEditTaskName) {
            const nameResult = name + `-${IntlFormatMessage('datasource.create.copy')}`;
            setCurrentReducer(Object.assign({}, current, {
                name: nameResult,
            }));
            setIfEditTaskName(true)
        }
    }, [name])

    return <Fragment>
        <div className='title-label-box title-label-box-margin'>
            {IntlFormatMessage('task.detail.basicinformation')}
        </div>
        <Form>
            {/*名称*/}
            <FormItem
                label={IntlFormatMessage('task.list.taskname')}
                {...labelLayout}
            >
                {getFieldDecorator('name', {
                    initialValue: name || undefined,
                    rules: [
                        {
                            required: true,
                            message: IntlFormatMessage('laboratory.list.searchbytaskname'),
                        },
                        {
                            max: 200,
                            message: IntlFormatMessage('laboratory.anomaly.charactersMaximum'),
                        },
                        // formNameReg()
                    ],
                })(
                    <Input
                        placeholder={IntlFormatMessage('task.list.searchbytaskname')}
                        onBlur={(e) => {
                            const value = e.target.value.trim();
                            ifTaskName(value)
                        }}
                    />
                )}
            </FormItem>
            {/*类型*/}
            <FormItem label={IntlFormatMessage('task.create.tasktype')} {...labelLayout}>
                {getFieldDecorator('scene', {
                    rules: [
                        {
                            required: false,
                            message: IntlFormatMessage('task.common.typeSelect'),
                        },
                    ],
                    initialValue: scene || typeId,
                })(
                    <span>{IntlFormatMessage(formatType(scene || typeId))}</span>
                )}
            </FormItem>
            {/*场景*/}
            <FormItem label={IntlFormatMessage('task.detail.businesscenario')} {...labelLayout}>
                {getFieldDecorator('bizSceneId', {
                    rules: [
                        {
                            required: true,
                            message: IntlFormatMessage('task.detail.selectbusinesscenario'),
                        },
                    ],
                    initialValue: bizSceneId || undefined,
                })(
                    <Select
                        allowClear
                        showSearch
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                        placeholder={IntlFormatMessage('task.detail.selectbusinesscenario')}
                        disabled={!ifCanEdit}
                        optionFilterProp={'name'}
                    >
                        {(toJS(sceneList) || []).map((item) => {
                            const {builtinDisplayNames = '', name = '', builtin = 0,} = item;
                            return <Option
                                key={item.id}
                                value={item.id}
                                name={builtinDisplayNames || name}
                            >
                                {builtinDisplayNames || name}
                                {builtin ?
                                    ` (${IntlFormatMessage('common.builtin')})` : null
                                }
                            </Option>
                        })}
                    </Select>
                )}
            </FormItem>
            {/*数据源*/}
            <FormItem label={<span className="required">{IntlFormatMessage('task.create.datasourcetype')}</span>}
                      {...labelLayout}
                      className="noBottomBox">
                <Row>
                    <Col span={12}>
                        <FormItem className="need-margin-right">
                            {getFieldDecorator('dataSourceType', {
                                rules: [
                                    {
                                        required: true,
                                        message: IntlFormatMessage('datasource.select.datasourcetype'),
                                    },
                                ],
                                initialValue: 'DODB',
                            })(
                                <Select
                                    allowClear
                                    showSearch
                                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                    placeholder={IntlFormatMessage('datasource.select.datasourcetype')}
                                    disabled={!ifCanEdit}
                                    onChange={(value) => {
                                        getDataSourceList({
                                            query: {
                                                type: value
                                            }
                                        })
                                    }}
                                >
                                    {/*<Option value="FILE">{IntlFormatMessage('laboratory.detail.createofflinedata')}</Option>*/}
                                    <Option value="DODB">{IntlFormatMessage('laboratory.detail.adddatasource')}</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem>
                            {getFieldDecorator('dataSourceId', {
                                rules: [
                                    {
                                        required: true,
                                        message: IntlFormatMessage('task.create.selectdatasource'),
                                    },
                                ],
                                initialValue: dataSourceId || undefined,
                            })(
                                <Select
                                    allowClear
                                    showSearch
                                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                    disabled={!ifCanEdit}
                                    onChange={() => {
                                        setFilterListReducer()
                                        setMetricList([])
                                        setFieldsValue({
                                            model: undefined,
                                            target: undefined,
                                        })
                                        // initModelFun()
                                    }}
                                    placeholder={IntlFormatMessage('task.create.selectdatasource')}
                                    optionFilterProp={'name'}
                                >
                                    {(getFieldValue('dataSourceType') ? toJS(dataSourceList) : []).map((item) => {
                                        return (
                                            <Option
                                                key={item.id}
                                                value={item.id}
                                                name={item.name}
                                            >
                                                {item.name}
                                            </Option>
                                        )
                                    })}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </FormItem>
            {/*聚合方式*/}
            <FormItem label={<span className="required">
                {IntlFormatMessage('task.detail.aggregationmethod')}
            </span>} {...labelLayout} className="noBottomBox">
                <Row>
                    <Col span={12}>
                        <Row>
                            <Col span={getFieldValue('aggFunc') === 'QUANTILE_EXACT' ? 12 : 24}>
                                <FormItem className="need-margin-right">
                                    {getFieldDecorator('aggFunc', {
                                        rules: [
                                            {
                                                required: true,
                                                message: IntlFormatMessage('laboratory.anomaly.aggregationSelect'),
                                            },
                                        ],
                                        initialValue: aggFunc || 'AVG',
                                    })(
                                        <Select
                                            getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                            placeholder={IntlFormatMessage('laboratory.anomaly.aggregationSelect')}
                                        >
                                            {polymerizationType.map((item) => (
                                                <Option key={item.key} value={item.key}>
                                                    {IntlFormatMessage(item.id)}
                                                </Option>
                                            ))}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            {
                                getFieldValue('aggFunc') === 'QUANTILE_EXACT' ?
                                    <Col span={12}>
                                        <FormItem className="need-margin-right">
                                            {
                                                getFieldDecorator('aggPercentile', {
                                                    initialValue: aggPercentile || 1,
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: IntlFormatMessage('laboratory.anomaly.percentileEnter')
                                                        },
                                                        {
                                                            pattern: RegExp('^[1-9][0-9]?$'),
                                                            message: IntlFormatMessage('laboratory.anomaly.integerEnter')
                                                        },
                                                    ],
                                                })(
                                                    <InputNumber
                                                        step={1}
                                                        precision={0}
                                                        autoComplete="off"
                                                        placeholder={IntlFormatMessage('laboratory.anomaly.percentileEnter')}
                                                        style={{width: '100%'}}
                                                    />
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                    : null
                            }
                        </Row>
                    </Col>
                    <Col span={6}>
                        <FormItem className="need-margin-right">
                            {getFieldDecorator('aggTimeNumber', {
                                rules: [
                                    {
                                        required: true,
                                        message: IntlFormatMessage('laboratory.anomaly.aggregationEnter'),
                                    },
                                    {
                                        pattern: new RegExp(/^\+?[1-9][0-9]*$/),
                                        message: IntlFormatMessage('laboratory.anomaly.positiveEnter')
                                    }
                                ],
                                initialValue: aggTimeNumber || 1,
                            })(
                                <InputNumber
                                    // type="number"
                                    step={1}
                                    precision={0}
                                    autoComplete="off"
                                    placeholder={IntlFormatMessage('laboratory.anomaly.aggregationEnter')}
                                    style={{
                                        width: '100%'
                                    }}
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem>
                            {getFieldDecorator('aggTimeUnit', {
                                rules: [
                                    {
                                        required: true,
                                        message: IntlFormatMessage('task.common.aggregationSelect'),
                                    },
                                ],
                                initialValue: aggTimeUnit || 'MINUTE',
                            })(
                                <Select
                                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                    placeholder= {IntlFormatMessage('task.common.aggregationSelect')}
                                >
                                    {
                                        utilType.map(item => {
                                            return <Option key={item.key} value={item.key}>
                                                {IntlFormatMessage(item.id)}
                                            </Option>
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </FormItem>
            {/*训练时间*/}
            <FormItem label={<span className="required">
                 {IntlFormatMessage('task.detail.trainingtime')}
            </span>} {...labelLayout}>
                <div className="flex-box train-box" style={{marginBottom: "25px"}}>
                    <DimensionBox>{IntlFormatMessage('task.create.timerange')}&nbsp;</DimensionBox>
                    <div className="flex-box centerLong">
                        <Col span={12}>
                            <FormItem className="need-margin-right">
                                {getFieldDecorator('timeFrameNumber', {
                                    rules: [
                                        {
                                            required: true,
                                            message: IntlFormatMessage('task.create.enterTimeRange'),
                                        },
                                    ],
                                    initialValue: timeFrameNumber || undefined,
                                })(
                                    <InputNumber
                                        // type="number"
                                        step={1}
                                        precision={0}
                                        autoComplete="off"
                                        placeholder={IntlFormatMessage('task.create.enterTimeRange')}
                                        style={{
                                            width: '100%'
                                        }}
                                    />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem className="need-margin-right">
                                {getFieldDecorator('timeFrameUnit', {
                                    rules: [
                                        {
                                            required: true,
                                            message: IntlFormatMessage('task.create.selectUnit'),
                                        },
                                    ],
                                    initialValue: timeFrameUnit || undefined,
                                })(
                                    <Select
                                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                        placeholder={IntlFormatMessage('task.create.selectUnit')}
                                    >
                                        {
                                            utilType.map(item => {
                                                return <Option key={item.key} value={item.key}>
                                                    {IntlFormatMessage(item.id)}
                                                </Option>
                                            })
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </div>
                    <div className="flex-box right">
                        <IconTooltip title={IntlFormatMessage('task.detail.timeperiodused')}/>
                    </div>
                </div>
                <div className="flex-box train-box" style={{marginBottom: "25px"}}>
                    <DimensionBox>{IntlFormatMessage('task.create.updatecycle')}&nbsp;</DimensionBox>
                    <div className="flex-box centerLong">
                        <Col span={12}>
                            <FormItem className="need-margin-right">
                                {getFieldDecorator('cycleNumber', {
                                    rules: [
                                        {
                                            required: true,
                                            message: IntlFormatMessage('task.create.enterUpdateCycle'),
                                        },
                                    ],
                                    initialValue: cycleNumber || undefined,
                                })(
                                    <InputNumber
                                        // type="number"
                                        step={1}
                                        precision={0}
                                        autoComplete="off"
                                        placeholder={IntlFormatMessage('task.create.enterUpdateCycle')}
                                        style={{
                                            width: '100%'
                                        }}
                                    />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem className="need-margin-right">
                                {getFieldDecorator('cycleUnit', {
                                    rules: [
                                        {
                                            required: true,
                                            message: IntlFormatMessage('task.create.selectUnit'),
                                        },
                                    ],
                                    initialValue: cycleUnit || undefined,
                                })(
                                    <Select
                                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                        placeholder={IntlFormatMessage('task.create.selectUnit')}
                                    >
                                        {
                                            utilType.map(item => {
                                                return <Option key={item.key} value={item.key}>
                                                    {IntlFormatMessage(item.id)}
                                                </Option>
                                            })
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </div>
                    <div className="flex-box right">
                        <IconTooltip title={IntlFormatMessage('task.create.thetrainingscheduled')}/>
                    </div>
                </div>
                <div className="flex-box">
                    <DimensionBox>{IntlFormatMessage('task.create.starttime')}&nbsp;</DimensionBox>
                    <div className="flex-box center">
                        <FormItem className="need-margin-right">
                            {getFieldDecorator('execStartTime', {
                                rules: [
                                    {
                                        required: false,
                                        message: IntlFormatMessage('task.create.selecttimerange'),
                                    },
                                ],
                                initialValue: !!execStartTime ? moment(new Date(execStartTime)) : moment(new Date()),
                            })(
                                <DatePicker
                                    style={{width: '100%'}}
                                    getCalendarContainer={(triggerNode) => triggerNode.parentNode}
                                    showTime={true}
                                    format="YYYY-MM-DD HH:mm:ss"
                                    disabledDate={disabledDate}
                                    // showToday={false}
                                />
                            )}
                        </FormItem>
                    </div>
                    <div className="flex-box right">
                        <IconTooltip title={IntlFormatMessage('task.create.thefirstexecutiontime')}
                                     style={{marginRight: 8}}/>
                        <FormItem>
                            {getFieldDecorator('nowExecute', {
                                valuePropName: 'checked',
                                // initialValue: nowExecute || undefined,
                            })(
                                <Checkbox
                                    style={{marginLeft: '5px'}}
                                >{IntlFormatMessage('task.create.executenow')}</Checkbox>
                            )}
                        </FormItem>
                    </div>
                </div>
            </FormItem>

            {
                ['forecasting'].includes(getFieldValue('scene')) ?
                    <Fragment>
                        {/*预测时长*/}
                        <FormItem label={<span className="required">{IntlFormatMessage('task.create.forecastduration')
                        }</span>} {...labelLayout}
                                  style={{marginBottom: 0}}>
                            {getFieldDecorator('yuceshichang', {
                                rules: [
                                    {
                                        required: false,
                                        message: IntlFormatMessage('task.create.selectUnit'),
                                    },
                                ],
                                initialValue: undefined,
                            })(
                                <Row>
                                    <Col span={12}>
                                        <FormItem className="need-margin-right">
                                            {getFieldDecorator('forecastTimeNumber', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: IntlFormatMessage('task.create.enterForecasting'),
                                                    },
                                                ],
                                                initialValue: forecastTimeNumber || undefined,
                                            })(
                                                <InputNumber
                                                    // type="number"
                                                    step={1}
                                                    precision={0}
                                                    autoComplete="off"
                                                    placeholder={IntlFormatMessage('task.create.enterForecasting')}
                                                    style={{
                                                        width: '100%'
                                                    }}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem className="need-margin-right">
                                            {getFieldDecorator('forecastTimeUnit', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: IntlFormatMessage('task.create.selectUnit'),
                                                    },
                                                ],
                                                initialValue: forecastTimeUnit || undefined,
                                            })(
                                                <Select
                                                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                                    placeholder={IntlFormatMessage('task.create.selectUnit')}
                                                >
                                                    {
                                                        utilType.map(item => {
                                                            return <Option key={item.key} value={item.key}>
                                                                {IntlFormatMessage(item.id)}
                                                            </Option>
                                                        })
                                                    }
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            )}
                        </FormItem>
                        {/*上下阈值*/}
                        <FormItem label={IntlFormatMessage('task.detail.upper')}
                                  {...labelLayout} style={{marginBottom: 0}}>
                            {getFieldDecorator('line-box', {})(
                                <Row>
                                    <Col span={12}>
                                        <FormItem className="need-margin-right">
                                            {getFieldDecorator('upperThreshold', {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: IntlFormatMessage('task.create.enterupperboundary'),
                                                    },
                                                    {
                                                        validator: (rule, value, callback) => {
                                                            const chartBottomNum = form.getFieldValue('lowerThreshold')
                                                            if (!!chartBottomNum && !!value && (Number(value) <= Number(chartBottomNum))) {
                                                                callback(IntlFormatMessage('laboratory.anomaly.upperBoundary')) //算法版本不能与算法标识符相同
                                                            } else {
                                                                callback()
                                                            }
                                                        },
                                                    },
                                                ],
                                                initialValue: upperThreshold || undefined,
                                            })(
                                                <InputNumber
                                                    // type="number"
                                                    step={1}
                                                    precision={0}
                                                    autoComplete="off"
                                                    placeholder={IntlFormatMessage('task.create.enterupperboundary')}
                                                    style={{
                                                        width: '100%'
                                                    }}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem className="need-margin-right"
                                                  label={IntlFormatMessage('task.detail.lower')}
                                                  {...{
                                                      labelCol: {span: 4},
                                                      wrapperCol: {span: 20},
                                                  }}>
                                            {getFieldDecorator('lowerThreshold', {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: IntlFormatMessage('task.create.enterlowerboundary'),
                                                    },
                                                    {
                                                        validator: (rule, value, callback) => {
                                                            const chartTopNum = form.getFieldValue('upperThreshold')
                                                            if (!!chartTopNum && !!value && (Number(value) >= Number(chartTopNum))) {
                                                                callback(IntlFormatMessage('laboratory.anomaly.lowerBoundary')) //算法版本不能与算法标识符相同
                                                            } else {
                                                                callback()
                                                            }
                                                        },
                                                    },
                                                ],
                                                initialValue: lowerThreshold || undefined,
                                            })(
                                                <InputNumber
                                                    // type="number"
                                                    step={1}
                                                    precision={0}
                                                    autoComplete="off"
                                                    placeholder={IntlFormatMessage('task.create.enterlowerboundary')}

                                                    style={{
                                                        width: '100%'
                                                    }}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            )}
                        </FormItem>
                        {/*是否即检测又预测*/}
                        {/*<FormItem*/}
                        {/*    label={'检测又预测'}*/}
                        {/*    {...labelLayout}*/}
                        {/*>*/}
                        {/*    {getFieldDecorator('mode', {*/}
                        {/*        valuePropName: 'checked',*/}
                        {/*        initialValue: !!mode || undefined,*/}
                        {/*    })(*/}
                        {/*        <Checkbox*/}
                        {/*            onChange={(e) => {*/}
                        {/*                const check = e.target.checked;*/}
                        {/*                console.log(check);*/}
                        {/*            }}*/}
                        {/*        >检测又预测</Checkbox>*/}
                        {/*    )}*/}
                        {/*</FormItem>*/}
                    </Fragment>
                    : null
            }

        </Form>
        <div className='title-label-box title-label-box-margin'
             style={{margin: 0}}>{IntlFormatMessage('task.detail.metric')}</div>
        <div>
            <Button type="primary" style={{margin: '8px 0 8px 24px'}} disabled={!ifCanEdit} onClick={() => {
                setEditTargetModal(true)
            }}>
                {IntlFormatMessage('task.detail.addmetric')}
            </Button>
            <Table
                columns={columns()}
                dataSource={metricList}
                lazyLoading={true}
                scroll={{y: 200}}
                rowKey={record => record.id}
            />
        </div>

        {/*指标弹框*/}
        {!!editTargetModal ?
            <EditTargetAlert
                visible={editTargetModal}
                onSave={onTargetSave}
                onCancel={onCancel}
                dataSource={currentTarget}
                form={form}
                setLoading={setLoading}
                loading={loading}
                tagsPage={tagsPage}
                callBack={callBack}
                // initTagsFun={initTagsFun}
                initTagsKeysFun={initTagsKeysFun}
                initMetricFun={initMetricFun}
                tagsParams={tagsParams}
            />
            : null
        }
    </Fragment>
}

export default connect(({taskManagementStore, dataSourceStore}) => {
    return {
        postTaskNameAsync: taskManagementStore.postTaskNameAsync,
        getTaskSceneAsync: taskManagementStore.getTaskSceneAsync,
        sceneList: taskManagementStore.sceneList,
        modelList: taskManagementStore.modelList,
        targetList: taskManagementStore.targetList,
        current: taskManagementStore.current,
        ifCanEdit: taskManagementStore.ifCanEdit,
        getTaskModelAsync: taskManagementStore.getTaskModelAsync,
        getTaskTargetAsync: taskManagementStore.getTaskTargetAsync,
        getTaskMetricAsync: taskManagementStore.getTaskMetricAsync,
        getTaskTagsAsync: taskManagementStore.getTaskTagsAsync,
        setFilterListReducer: taskManagementStore.setFilterListReducer,
        setIfEditTaskName: taskManagementStore.setIfEditTaskName,
        ifEditTaskName: taskManagementStore.ifEditTaskName,
        setCurrentReducer: taskManagementStore.setCurrentReducer,
        listParams: taskManagementStore.listParams,
        setListParams: taskManagementStore.setListParams,
        getDataSourceList: dataSourceStore.getDataSourceList,
        dataSourceList: dataSourceStore.dataSourceList,
        getTagsKeysAsync: taskManagementStore.getTagsKeysAsync,
        getTagsValueAsync: taskManagementStore.getTagsValueAsync,
    };
})(DataSetting);
