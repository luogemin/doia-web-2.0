import React, {useEffect, Fragment, useMemo,} from 'react';
import {
    Button,
    Form,
    Input,
    BasicLayout,
    Radio,
    Col,
    Row,
    Select,
    RangePicker,
    Table,
    Tooltip,
    InputNumber,
    Checkbox,
    Icon
} from '@chaoswise/ui';
import {connect, toJS} from "@chaoswise/cw-mobx";
import {
    polymerizationType,
    labelLayout,
    OperatorList,
    formatType,
} from "@/globalConstants";
import ScrollSelect from '@/components/ScrollSelect';
import styles from './index.less';
import moment from 'moment';
import {utilType} from '@/globalConstants';
import DataSetModal from './DataSetModal';
import IconTooltip from "@/components/IconTooltip";
import {useFetchState} from "@/components/HooksState";
import {IntlFormatMessage, IsInternationalization} from "@/utils/util";

const {Item} = Form;
const {Footer} = BasicLayout;
const {Option} = Select;
const nameStyle = {
    color: '#1890FF',
    cursor: 'pointer',
};
const editStyle = {
    color: '#b7b7b7',
    cursor: 'pointer'
};

const timeUnit = {
    'MINUTE': 'min',
    'HOUR': 'hour',
    'DAY': 'day',
    'D': 'day',
};

function DataSetting(props) {
    const {
        form, dataSetInfo, updateDataSetInfo, adddimensionalList, dimensionalList, getDataSourceList,
        dataSourceList, delDimensionalList, modifyDimensionallist, modelList, objList, metricList,
        getList, getObjList, getMetricList, getTagsList, getLabModelAsync, getLaboratoryAsync,
        getLabMetricAsync, getLabTagsAsync, emptyDimensionalList, disableEdit = false, dataInfo, setDimensionalList,
        getModel, delBlurModelList, delBlurObjList, dataSourcePage, modelPage, objPage,
        metricPage, setDataSourcePage, setObjPage, setModelPage, setMetricPage,
        getDataSourceTime, getTaskTrainingDaysAsync, genericityList = [], setGenericityList
    } = props;
    const {getFieldDecorator, setFieldsValue, getFieldValue, getFieldsValue} = form;
    const {
        model = undefined, obj = undefined, time = undefined, startTime, endTime,
        aggTimeUnit, number,
        // image, to_ratio,
    } = toJS(dataSetInfo);

    const [visible, setVisible] = useFetchState(false);
    const [editId, setEditId] = useFetchState('');
    const [loading, setLoading] = useFetchState(false);
    const [modelLoading, setModelLoading] = useFetchState(false);
    const [objLoading, setObjLoading] = useFetchState(false);
    const [metricLoading, setMetricLoading] = useFetchState(false);
    // const [tagsLoading, setTagsLoading] = useFetchState(false);
    const [searchValue, setSearchValue] = useFetchState(null);

    useEffect(() => {
        updateDataSetInfo('nowDate', new Date().getTime());
        updateDataSetInfo('aggTimeUnit', aggTimeUnit);
        updateDataSetInfo('number', number);
    }, []);
    useEffect(() => {
        const datasourceId = getFieldValue('datasourceId');
        const type = getFieldValue('dataSourceType');
        const timeValue = getFieldValue('time');
        if (datasourceId && timeValue && timeValue.length === 2) {
            if (disableEdit) {
                return;
            }
            setModelLoading(true);
            setObjLoading(true);
            setMetricLoading(true);
            // setTagsLoading(true);
            // getList('datasourceId', datasourceId.value);
            if (type === 'FILE') {
                if (disableEdit) {
                    return;
                }
                // getModel(datasourceId.value, {pageNum: 1, pageSize: 100}, modelCallBack);
                // getObjList(datasourceId.value, model || [], {pageNum: 1, pageSize: 100}, objCallBack);
                // getMetricList(datasourceId.value, model || [], obj || [], {pageNum: 1, pageSize: 100}, metricCallBack);
                // getTagsList(datasourceId.value, model || [], obj || [], [], {
                //     pageNum: 1,
                //     pageSize: 100
                // }, tagsCallBack);
            } else if (type === 'DODB') {
                if (disableEdit) {
                    return;
                }
                const params = {
                    metricValue: [],
                    modelValue: model || [],
                    targetValue: obj || [],
                };

                // getLaboratoryAsync(params, {pageNum: 1, pageSize: 100}, objCallBack);
                // getLabModelAsync(params, {pageNum: 1, pageSize: 100}, modelCallBack);
                // getLabMetricAsync(params, {pageNum: 1, pageSize: 100}, metricCallBack);
                // getLabTagsAsync(params, {pageNum: 1, pageSize: 100}, tagsCallBack);
            }
        }
    }, [dataSetInfo.datasourceId]);

    useEffect(() => {
        const dataSourceType = getFieldValue('dataSourceType');
        if (dataSourceType) {
            setDataSourcePage({
                pageNum: 1,
                pageSize: 100,
                total: 0
            });
            handleChangeDataSourceType(dataSourceType, {
                pageNum: 1,
                pageSize: 100
            });
        }
    }, [dataSetInfo.dataSourceType]);

    // useEffect(() => {
    //     setFieldsValue({
    //         time: toJS(dataSetInfo.time)
    //     });
    // }, [dataSetInfo]);
    useEffect(() => {
        if (disableEdit) {
            if (Object.keys(dataInfo).length) {
                const {
                    scene = '',
                    aggConfig = {},
                    startTime = 0,
                    endTime = 0,
                    extendConfig = {},
                    dataSourceList = [],
                } = dataInfo;
                const {dataSource = {}, filtersConfig = {},} = dataSourceList[0];
                const {type = '', id = '', name = ''} = dataSource;
                const {dataProcessing = {}} = extendConfig;
                const {forecastTimeNumber = undefined, forecastTimeUnit = '', lowerThreshold = undefined, upperThreshold = undefined} = dataProcessing;
                const {aggFunc = undefined, aggTimeUnit = undefined, aggTimeNumber = undefined} = aggConfig;
                const {metricAndTagFilters = [], modelFilter = {}, targetFilter = {}} = filtersConfig;
                setTimeout(() => {
                    setFieldsValue({
                        scene,
                        dataSourceType: type,
                        datasourceId: {label: name, value: id},
                        time: [moment(startTime), moment(endTime)],
                        method: aggFunc,
                        aggTimeUnit: aggTimeUnit,
                        number: aggTimeNumber,
                    });
                });
                if (scene === 'forecasting') {
                    setTimeout(() => {
                        setFieldsValue({
                            forecastTimeNumber,
                            forecastTimeUnit,
                            lowerThreshold,
                            upperThreshold,
                        });
                    });
                }
                if (Object.keys(modelFilter).length) {
                    if (modelFilter.compare === 'IN') {
                        setTimeout(() => {
                            setFieldsValue({
                                model: modelFilter.value
                            });
                        });
                    } else {
                        setTimeout(() => {
                            setFieldsValue({
                                model: [modelFilter.value]
                            });
                        });
                    }
                }
                if (Object.keys(targetFilter).length) {
                    if (targetFilter.compare === 'IN') {
                        setTimeout(() => {
                            setFieldsValue({
                                obj: targetFilter.value
                            });
                        });
                    } else {
                        setTimeout(() => {
                            setFieldsValue({
                                obj: [targetFilter.value]
                            });
                        });
                    }
                }


                if (metricAndTagFilters.length) {
                    setDimensionalList(metricAndTagFilters.map((item, index) => {
                        const {metricFilter = {}, tagsFilter = []} = item;
                        const tagsField = tagsFilter.map(item => {
                            let value = item.value;
                            if (item.compare !== 'E' && item.value !== 'NE') {
                                if (typeof item.value === 'string') {
                                    value = [item.value];
                                }
                            }
                            return {
                                key: item.key,
                                compare: item.compare,
                                value: value
                            };
                        });
                        return {
                            id: index + 1,
                            metric: metricFilter.compare === 'E' ? [metricFilter.value] : metricFilter.value,
                            tagsField: tagsField
                        };
                    }));
                }
            }
        }
    }, [dataInfo]);

    const columns = [
        {
            title: IntlFormatMessage('laboratory.detail.metricname'),
            dataIndex: 'name',
            key: 'name',
            width: '50%',
            render: (text, record) => {
                return text;
            }
        },
        {
            title: IntlFormatMessage('laboratory.detail.dimensionfilter'),
            dataIndex: 'filter',
            key: 'filter',
            width: '50%',
            render: (text, record) => {
                if (text) {
                    return <div
                        dangerouslySetInnerHTML={{
                            __html: text.split(IntlFormatMessage('task.create.and')).join(` ${IntlFormatMessage('task.create.and')}<br/>`)
                        }}
                    />;
                } else {
                    return null;
                }
            }
        },
        /*eslint-disable*/
        {
            title: IntlFormatMessage('common.operation'),
            dataIndex: 'operation',
            width: IsInternationalization() ? 125 : 115,
            key: 'operation',
            render: (text, record) => {
                return (
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <span style={disableEdit ? editStyle : nameStyle} onClick={() => {
                            if (disableEdit) {
                                return
                            }
                            setEditId(record.id)
                            setVisible(true)
                        }}>
                            {IntlFormatMessage('laboratory.detail.edit')}
                        </span>
                        <span style={{
                            display: 'inline-block',
                            width: '1px',
                            height: '14px',
                            backgroundColor: '#E9E9E9',
                            margin: '0 8px'
                        }}/>
                        <span style={disableEdit ? editStyle : nameStyle} onClick={() => {
                            if (disableEdit) {
                                return
                            }
                            delDimensionalList(record.id)
                        }}>{IntlFormatMessage('laboratory.detail.delete')}
                        </span>
                    </div>
                );
            }
        },
        /*eslint-disable*/
    ];


    const onTargetSave = (values, id, {cb}) => {
        if (id) {
            modifyDimensionallist(values, id)
        } else {
            adddimensionalList(values);
        }
        cb && cb()
    }
    //根据数据源类型获取数据源列表
    const handleChangeDataSourceType = (e, page) => {
        const callBack = (data) => {
            setDataSourcePage({
                ...page,
                total: data.totalSize
            })
        }
        getDataSourceList({
            query: {
                type: e
            },
            pageNum: page.pageNum,
            pageSize: page.pageSize
        }, callBack)
    }
    const onScroll = () => {
        if (dataSourceList.length === dataSourcePage.total) {
            return
        }
        const callback = () => {
            setLoading(false);
            setDataSourcePage({
                ...dataSourcePage,
                pageNum: dataSourcePage.pageNum + 1,
            })
        }
        setLoading(true);
        getDataSourceList({
            query: {
                type: getFieldValue('dataSourceType'),
            },
            pageNum: dataSourcePage.pageNum + 1,
            pageSize: dataSourcePage.pageSize
        }, callback)
    }
    const modelCallBack = (page) => {
        setModelPage({
            pageNum: page.pageNum,
            pageSize: page.pageSize,
            total: page.totalSize
        });
        setLoading(false)
        setModelLoading(false)
    }
    const tagsCallBack = (page) => {
        setModelPage({
            pageNum: page.pageNum,
            pageSize: page.pageSize,
            total: page.totalSize
        })
        setLoading(false)
    }
    const objCallBack = (page) => {
        setObjPage({
            pageNum: page.pageNum,
            pageSize: page.pageSize,
            total: page.totalSize
        })
        setLoading(false)
        setObjLoading(false)
    }
    const metricCallBack = (page) => {
        setMetricPage({
            pageNum: page.pageNum,
            pageSize: page.pageSize,
            total: page.totalSize
        })
        setLoading(false)
        setMetricLoading(false)
    }
    const onScrollModel = () => {
        if (modelList.length === modelPage.total) {
            return
        }
        const time = getFieldValue('time');
        if (time && time.length === 2) {
            setLoading(true)
            if (dataSetInfo.dataSourceType === 'DODB') {
                getLabModelAsync({
                    metricValue: [],
                    modelValue: [],
                    targetValue: []
                }, {
                    pageNum: dataSourcePage.pageNum + 1,
                    pageSize: dataSourcePage.pageSize
                }, modelCallBack, searchValue)
            } else {
                getModel(getFieldValue('datasourceId').value,
                    {pageNum: modelPage.pageNum + 1, pageSize: modelPage.pageSize},
                    modelCallBack, searchValue
                )
            }
        }
    }
    const onScrollObj = () => {
        if (objList.length === objPage.total) {
            return
        }
        const time = getFieldValue('time');
        if (time && time.length === 2) {
            setLoading(true)
            if (dataSetInfo.dataSourceType === 'DODB') {
                getLaboratoryAsync({
                    metricValue: [],
                    modelValue: dataSetInfo.model,
                    targetValue: []
                }, {
                    pageNum: dataSourcePage.pageNum + 1,
                    pageSize: dataSourcePage.pageSize
                }, objCallBack, searchValue);
            } else {
                getObjList(
                    getFieldValue('datasourceId').value,
                    model || [],
                    {pageNum: objPage.pageNum + 1, pageSize: objPage.pageSize},
                    objCallBack, searchValue)
            }
        }

    }

    const onDropdownVisibleChange = (open, type) => {
        if (!open) {
            setLoading(false)
            setSearchValue(null)
            if (type && type === 'model') {
                // delBlurModelList()
                const time = getFieldValue('time');
                if (time && time.length === 2) {
                    setModelPage({
                        pageNum: 1,
                        pageSize: 100,
                        total: 0
                    })
                    if (dataSetInfo.dataSourceType === 'FILE') {
                        getModel(getFieldValue('datasourceId').value, {
                            pageNum: 1,
                            pageSize: 100
                        }, modelCallBack);
                    } else {
                        getLabModelAsync({
                            metricValue: [],
                            modelValue: [],
                            targetValue: []
                        }, {
                            pageNum: 1,
                            pageSize: 100
                        }, modelCallBack)
                    }
                }
            }
            if (type && type === 'obj') {
                // delBlurObjList()
                const time = getFieldValue('time');
                if (time && time.length === 2) {
                    setObjPage({
                        pageNum: 1,
                        pageSize: 100,
                        total: 0
                    })
                    if (dataSetInfo.dataSourceType === 'FILE') {
                        getObjList(getFieldValue('datasourceId').value,
                            model || [],
                            {pageNum: 1, pageSize: 100},
                            modelCallBack);
                    } else {
                        getLaboratoryAsync({
                            metricValue: [],
                            modelValue: dataSetInfo.model,
                            targetValue: []
                        }, {
                            pageNum: 1,
                            pageSize: 100
                        }, objCallBack);
                    }

                }
            }
        }
    }

    const updateTineFun = (data) => {
        const {time, forecastTimeNumber, forecastTimeUnit} = data;
        const timeq = time || getFieldValue('time');
        const forecastTimeNumberq = forecastTimeNumber || getFieldValue('forecastTimeNumber');
        const forecastTimeUnitq = forecastTimeUnit || getFieldValue('forecastTimeUnit');

        const startTime = new Date(toJS(timeq)[0]).getTime();
        const endTime = new Date(toJS(timeq)[1]).getTime();
        const forecast_period = forecastTimeNumberq + timeUnit[forecastTimeUnitq];
        const params = {
            start_time: startTime,
            end_time: endTime,
        }
        getTaskTrainingDaysAsync(params, {
            cb: (res) => {
                const result = (toJS(genericityList) || []).map(item => {
                    const {isOverwriteForecastParams, algorithmParams} = item;
                    if (!!isOverwriteForecastParams) {
                        item.algorithmParams = ([].concat(algorithmParams)).map(param => {
                            if (param.name === 'training_days') {
                                param.value = res.data;
                            }
                            if (param.name === 'forecast_period') {
                                param.value = forecast_period;
                            }
                            return param;
                        })
                    }
                    return item;
                })
                setGenericityList(result)
            }
        })
    };

    return (
        <Fragment>
            <div
                className='title-label-box title-label-box-margin'>{IntlFormatMessage('laboratory.create.basicinformation')}</div>
            <Item label={IntlFormatMessage('laboratory.list.algorithmscenario')}
                  {...labelLayout}>
                {
                    getFieldDecorator('scene', {
                        initialValue: dataSetInfo.scene,
                    })(
                        <Radio.Group
                            disabled
                            onChange={(e) => updateDataSetInfo('scene', e.target.value)}
                        >
                            <Radio value={dataSetInfo.scene}>
                                {IntlFormatMessage(formatType(dataSetInfo.scene))}
                            </Radio>
                        </Radio.Group>
                    )
                }
            </Item>
            <Item label={<span className="requird-before">{IntlFormatMessage('laboratory.list.datasource')}
            </span>} {...labelLayout} className="noBottomBox">
                <Row className="item-width-tighten">
                    <Col span={12}>
                        <Item className="need-margin-right">
                            {
                                getFieldDecorator('dataSourceType', {
                                    initialValue: dataSetInfo.dataSourceType || undefined,
                                    rules: [
                                        {
                                            required: true,
                                            message: IntlFormatMessage('datasource.select.datasourcetype')
                                        },
                                    ],
                                })(
                                    <Select
                                        disabled={disableEdit}
                                        placeholder={IntlFormatMessage('laboratory.detail.selectdatasourcetype')}
                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                        style={{width: '100%'}}
                                        onChange={(e) => {
                                            updateDataSetInfo('dataSourceType', e);
                                            setFieldsValue({
                                                datasourceId: undefined,
                                                model: undefined,
                                                obj: undefined
                                            })
                                            emptyDimensionalList()
                                            updateDataSetInfo('datasourceId', undefined);
                                            updateDataSetInfo('model', undefined);
                                            updateDataSetInfo('obj', undefined);
                                            setFieldsValue({
                                                time: undefined,
                                            })
                                            updateDataSetInfo('time', undefined)
                                            // handleChangeDataSourceType(e);
                                        }}
                                    >

                                        <Option
                                            value="FILE">{IntlFormatMessage('laboratory.detail.createofflinedata')}</Option>
                                        <Option
                                            value="DODB">{IntlFormatMessage('laboratory.detail.adddatasource')}</Option>
                                    </Select>
                                )
                            }
                        </Item>
                    </Col>
                    <Col span={12}>
                        <Item>
                            {
                                getFieldDecorator('datasourceId', {
                                    initialValue: dataSetInfo.datasourceId || undefined,
                                    rules: [
                                        {required: true, message: IntlFormatMessage('task.create.selectdatasource')},
                                    ],
                                })(
                                    <ScrollSelect
                                        placeholder={IntlFormatMessage('laboratory.detail.selectdatasource')}
                                        allowClear
                                        disabled={disableEdit}
                                        style={{width: '100%'}}
                                        showSearch
                                        scrollLoading={loading}
                                        loading={loading}
                                        onDropdownVisibleChange={onDropdownVisibleChange}
                                        optionFilterProp='search'
                                        onPopupScroll={onScroll}
                                        labelInValue={true}
                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                        onChange={(e) => {
                                            updateDataSetInfo('datasourceId', e);
                                            // getList('datasourceId', e,{ pageNum:1,pageSize:100 },callBack)
                                            setFieldsValue({
                                                model: undefined,
                                                obj: undefined,
                                                time: undefined,
                                            })
                                            emptyDimensionalList()
                                            updateDataSetInfo('model', undefined);
                                            updateDataSetInfo('obj', undefined);
                                            updateDataSetInfo('time', undefined);
                                            if (e.value) {
                                                getDataSourceTime(e.value, {
                                                    cb: (res) => {
                                                        const {data = {}} = res;
                                                        const {maxTime = 0, minTime = 0} = data;
                                                        if (maxTime && minTime) {
                                                            setFieldsValue({
                                                                time: [moment(minTime), moment(maxTime)]
                                                            })
                                                            updateDataSetInfo('time', [moment(minTime), moment(maxTime)]);
                                                            const type = getFieldValue('dataSourceType');
                                                            if (!e.value) {
                                                                return
                                                            }
                                                        }
                                                    }
                                                })
                                            }
                                        }}
                                    >
                                        {
                                            dataSourceList.map(item => {
                                                return <Option value={item.id} key={item.id} search={item.name}>
                                                    <Tooltip title={item.name}>{item.name}</Tooltip>
                                                </Option>
                                            })
                                        }
                                    </ScrollSelect>
                                )
                            }
                        </Item>
                    </Col>
                </Row>
            </Item>
            <Item label={IntlFormatMessage('laboratory.detail.trainingtime')} {...labelLayout}>
                {
                    getFieldDecorator('time', {
                        initialValue: !!startTime ? [moment(startTime), moment(endTime)] : time || undefined,
                        rules: [
                            {required: true, message: IntlFormatMessage('laboratory.anomaly.selectTime')},
                        ],
                    })(
                        <RangePicker
                            showTime={true}
                            className='item-width-tighten'
                            onChange={(e) => {
                                updateDataSetInfo('time', e);
                                // if (e.length && e.length === 2) {
                                //     const type = getFieldValue('dataSourceType');
                                //     const datasourceId = getFieldValue('datasourceId');
                                //     if (!datasourceId.value) {
                                //         return
                                //     }
                                //     if (type === 'FILE') {
                                // getModel(datasourceId.value, {pageNum: 1, pageSize: 100}, modelCallBack);
                                // getObjList(datasourceId.value, model || [], {
                                //     pageNum: 1,
                                //     pageSize: 100
                                // }, objCallBack);
                                // getMetricList(datasourceId.value, model || [], obj || [], {
                                //     pageNum: 1,
                                //     pageSize: 100
                                // }, metricCallBack);
                                // getTagsList(datasourceId.value, model || [], obj || [], [], {
                                //     pageNum: 1,
                                //     pageSize: 100
                                // }, tagsCallBack);
                                // } else if (type === 'DODB') {
                                //     const params = {
                                //         metricValue: [],
                                //         modelValue: model || [],
                                //         targetValue: obj || [],
                                //     };
                                //     getLaboratoryAsync(params, {pageNum: 1, pageSize: 100}, objCallBack);
                                //     getLabModelAsync(params, {pageNum: 1, pageSize: 100}, modelCallBack);
                                //     getLabMetricAsync(params, {pageNum: 1, pageSize: 100}, metricCallBack);
                                //     getLabTagsAsync(params, {pageNum: 1, pageSize: 100}, tagsCallBack);
                                // }
                                // updateTineFun({time: e})
                                }
                            }
                            disabled={disableEdit}
                        />
                    )
                }
                <IconTooltip
                    style={{marginLeft: '8px'}}
                    title={IntlFormatMessage('laboratory.anomaly.trainingSpecified')}
                />
            </Item>
            <Item label={<span className="requird-before">
                        {IntlFormatMessage('laboratory.detail.aggregationmethod')}
                    </span>}
                  {...labelLayout} className="noBottomBox"
            >
                <Row className="item-width-tighten">
                    <Col span={12}>
                        <Row>
                            <Col span={getFieldValue('method') === 'QUANTILE_EXACT' ? 12 : 24}>
                                <Item className="need-margin-right">
                                    {
                                        getFieldDecorator('method', {
                                            initialValue: dataSetInfo.method || 'AVG',
                                            rules: [
                                                {
                                                    required: true,
                                                    message: IntlFormatMessage('laboratory.anomaly.aggregationSelect')
                                                },
                                            ],
                                        })(
                                            <Select
                                                getPopupContainer={triggerNode => triggerNode.parentNode}
                                                placeholder={IntlFormatMessage('laboratory.anomaly.aggregationSelect')}
                                                disabled={disableEdit}
                                                onChange={(e) => {
                                                    updateDataSetInfo('method', e)
                                                    if(e === 'QUANTILE_EXACT') {
                                                        updateDataSetInfo('aggPercentile', 1)
                                                    }
                                                }}
                                                style={{width: '100%'}}
                                            >
                                                {
                                                    polymerizationType.map(item => {
                                                        return <Option value={item.key} key={item.key}>{
                                                            IntlFormatMessage(item.id)
                                                        }</Option>
                                                    })
                                                }
                                            </Select>
                                        )
                                    }
                                </Item>
                            </Col>
                            {
                                getFieldValue('method') === 'QUANTILE_EXACT' ?
                                    <Col span={12}>
                                        <Item className="need-margin-right">
                                            {
                                                getFieldDecorator('aggPercentile', {
                                                    initialValue: dataSetInfo.aggPercentile || 1,
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
                                                        disabled={disableEdit}
                                                        onChange={(e) => {
                                                            updateDataSetInfo('aggPercentile', e)
                                                        }}
                                                        placeholder={IntlFormatMessage('laboratory.anomaly.percentileEnter')}
                                                        style={{width: '100%'}}>
                                                    </InputNumber>
                                                )
                                            }
                                        </Item>
                                    </Col>
                                    : null
                            }
                        </Row>
                    </Col>
                    <Col span={6}>
                        <Item className="need-margin-right">
                            {
                                getFieldDecorator('number', {
                                    initialValue: dataSetInfo.number || 1,
                                    rules: [
                                        {
                                            required: true,
                                            message: IntlFormatMessage('laboratory.anomaly.aggregationEnter'),
                                        },
                                        {
                                            pattern: new RegExp(/^\+?[1-9][0-9]*$/),
                                            message: IntlFormatMessage('laboratory.anomaly.positiveEnter'),
                                        }
                                    ],
                                })(
                                    <InputNumber
                                        min={0}
                                        disabled={disableEdit}
                                        onChange={(e) => updateDataSetInfo('number', e)}
                                        placeholder={IntlFormatMessage('laboratory.anomaly.aggregationEnter')}
                                        style={{width: '100%'}}>
                                    </InputNumber>
                                )
                            }
                        </Item>
                    </Col>
                    <Col span={6}>
                        <Item>
                            {
                                getFieldDecorator('aggTimeUnit', {
                                    initialValue: dataSetInfo.aggTimeUnit || 'MINUTE',
                                    rules: [
                                        {required: true, message: IntlFormatMessage('task.common.aggregationSelect')},
                                    ],
                                })(
                                    <Select
                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                        onChange={(e) => updateDataSetInfo('aggTimeUnit', e)}
                                        placeholder={IntlFormatMessage('task.common.aggregationSelect')}
                                        disabled={disableEdit}
                                        style={{width: '100%'}}>
                                        {
                                            utilType.map(item => {
                                                return <Option value={item.key} key={item.key}>
                                                    {IntlFormatMessage(item.id)}
                                                </Option>
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </Item>
                    </Col>
                </Row>
            </Item>
            {/*{*/}
            {/*    (dataSetInfo.scene !== 'forecasting' || getFieldValue('scene') !== 'forecasting') &&*/}
            {/*    <Fragment>*/}
            {/*        <Item {...labelLayout} label={<span className="requird-before">滑动窗口</span>}>*/}
            {/*            <Row className="item-width-tighten">*/}
            {/*                <Col span={12}>*/}
            {/*                    <Item className="need-margin-right">*/}
            {/*                        {*/}
            {/*                            getFieldDecorator('image', {*/}
            {/*                                initialValue: image || false,*/}
            {/*                                rules: [*/}
            {/*                                    {*/}
            {/*                                        required: true,*/}
            {/*                                        message: IntlFormatMessage('laboratory.anomaly.aggregationSelect')*/}
            {/*                                    },*/}
            {/*                                ],*/}
            {/*                            })(*/}
            {/*                                <Select*/}
            {/*                                    disabled={disableEdit}*/}
            {/*                                    onChange={(e) => {*/}
            {/*                                        updateDataSetInfo('image', e)*/}
            {/*                                        updateDataSetInfo('to_ratio', undefined)*/}
            {/*                                    }}*/}
            {/*                                    style={{width: '100%'}}*/}
            {/*                                >*/}
            {/*                                    <Option value={true} key={1}>*/}
            {/*                                        <Tooltip title='仅Tima、DW Tima算法可用'>true</Tooltip>*/}
            {/*                                    </Option>*/}
            {/*                                    <Option value={false} key={2}>false</Option>*/}
            {/*                                </Select>*/}
            {/*                            )*/}
            {/*                        }*/}
            {/*                    </Item>*/}
            {/*                </Col>*/}
            {/*                <Col span={12}>*/}
            {/*                    <Item label={'数据比例'} {...{*/}
            {/*                        labelCol: {span: 5},*/}
            {/*                        wrapperCol: {span: 19},*/}
            {/*                    }}>*/}
            {/*                        {*/}
            {/*                            getFieldDecorator('to_ratio', {*/}
            {/*                                initialValue: to_ratio,*/}
            {/*                                rules: [*/}
            {/*                                    {*/}
            {/*                                        required: getFieldValue('image'),*/}
            {/*                                        message: "请输入数据比例"*/}
            {/*                                    },*/}
            {/*                                ],*/}
            {/*                            })(*/}
            {/*                                <Input style={{width: "100%"}}*/}
            {/*                                       disabled={(!getFieldValue('image') || disableEdit)}*/}
            {/*                                       onChange={(e) => {*/}
            {/*                                           updateDataSetInfo('to_ratio', e.target.value)*/}
            {/*                                       }}/>*/}
            {/*                            )*/}
            {/*                        }*/}
            {/*                    </Item>*/}
            {/*                </Col>*/}

            {/*            </Row>*/}
            {/*        </Item>*/}
            {/*    </Fragment>*/}
            {/*}*/}
            {
                (dataSetInfo.scene === 'forecasting' || getFieldValue('scene') === 'forecasting')
                &&
                <Fragment>
                    <Item label={<span className="requird-before">
                            {IntlFormatMessage('laboratory.detail.forecast')}
                        </span>}
                          {...labelLayout} className="noBottomBox"
                    >
                        <Row className="item-width-tighten">
                            <Col span={12}>
                                <Item className="need-margin-right">
                                    {
                                        getFieldDecorator('forecastTimeNumber', {
                                            initialValue: dataSetInfo.forecastTimeNumber || undefined,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: IntlFormatMessage('task.create.selectforecast')
                                                },
                                            ],
                                        })(
                                            <InputNumber
                                                placeholder={IntlFormatMessage('task.create.enterForecasting')}
                                                step={1}
                                                precision={0}
                                                disabled={disableEdit}
                                                onChange={(e) => {
                                                    updateDataSetInfo('forecastTimeNumber', e)
                                                    updateTineFun({forecastTimeNumber: e})
                                                }}
                                                style={{width: '100%'}}
                                            >
                                            </InputNumber>
                                        )
                                    }
                                </Item>
                            </Col>
                            <Col span={12}>
                                <Item>
                                    {
                                        getFieldDecorator('forecastTimeUnit', {
                                            initialValue: dataSetInfo.forecastTimeUnit || undefined,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: IntlFormatMessage('task.create.selectUnit')
                                                },

                                            ],
                                        })(
                                            <Select
                                                onChange={(e) => {
                                                    updateTineFun({forecastTimeUnit: e});
                                                    updateDataSetInfo('forecastTimeUnit', e)
                                                }}
                                                getPopupContainer={triggerNode => triggerNode.parentNode}
                                                placeholder={IntlFormatMessage('task.create.selectUnit')}
                                                disabled={disableEdit}
                                                style={{width: '100%'}}
                                            >
                                                {
                                                    utilType.map(item => {
                                                        return <Option value={item.key} key={item.key}>
                                                            {IntlFormatMessage(item.id)}
                                                        </Option>
                                                    })
                                                }
                                            </Select>
                                        )
                                    }
                                </Item>
                            </Col>
                        </Row>
                    </Item>
                    <Item label={IntlFormatMessage('common.upper')} {...labelLayout} className="noBottomBox">
                        <Row className="item-width-tighten">
                            <Col span={12}>
                                <Item className="need-margin-right">
                                    {
                                        getFieldDecorator('upperThreshold', {
                                            initialValue: dataSetInfo.upperThreshold || undefined,
                                            rules: [
                                                // { required: true, message: '请输入上阈值' },
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
                                        })(
                                            <InputNumber
                                                step={1}
                                                precision={0}
                                                placeholder={IntlFormatMessage('laboratory.detail.enterupperboundary')}
                                                disabled={disableEdit}
                                                onChange={(e) => updateDataSetInfo('upperThreshold', e)}
                                                style={{width: '100%'}}
                                            >
                                            </InputNumber>
                                        )
                                    }
                                </Item>
                            </Col>
                            <Col span={12}>
                                <Item label={IntlFormatMessage('common.lower')} {...{
                                    labelCol: {span: 4},
                                    wrapperCol: {span: 20},
                                }}>
                                    {
                                        getFieldDecorator('lowerThreshold', {
                                            initialValue: dataSetInfo.lowerThreshold || undefined,
                                            rules: [
                                                // { required: true, message: '请输入下阈值' },
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
                                        })(
                                            <InputNumber
                                                step={1}
                                                precision={0}
                                                disabled={disableEdit}
                                                onChange={(e) => updateDataSetInfo('lowerThreshold', e)}
                                                placeholder={IntlFormatMessage('laboratory.detail.enterlowerboundary')}
                                                style={{width: '100%'}}>

                                            </InputNumber>
                                        )
                                    }
                                </Item>
                            </Col>
                        </Row>
                    </Item>
                </Fragment>
            }
            <div className={styles['dataset-basicinfo']}>{IntlFormatMessage('laboratory.detail.metric')}</div>

            <div>
                <Button type="primary" style={{margin: '8px 0 8px 24px'}} disabled={disableEdit} onClick={() => {
                    setVisible(true)
                    setEditId('')
                }}>{IntlFormatMessage('laboratory.detail.addmetric')}
                </Button>
                <Table
                    columns={columns}
                    scroll={{y: 400}}
                    rowKey={record => record.id}
                    dataSource={dimensionalList.map(item => {
                        return {
                            name: item.metric ? item.metric.length > 1 ? item.metric.join(',') : item.metric[0] : null,
                            filter: (item.tagsField || []).map(val => {
                                return `${val.key} ${OperatorList[val.compare] ? IntlFormatMessage(OperatorList[val.compare].sign) : ''} ${val.value || ''} ${(val.compare === 'IN' || val.compare === 'NIN') ? IntlFormatMessage('laboratory.anomaly.middle') : ''}`
                            }).join(` ${IntlFormatMessage('task.create.and')} `),
                            id: item.id
                        }
                    })}
                />
            </div>
            {
                visible && <DataSetModal
                    metricPage={metricPage}
                    setMetricPage={setMetricPage}
                    metricCallBack={metricCallBack}
                    visible={visible}
                    setLoading={setLoading}
                    onDropdownVisibleChange={onDropdownVisibleChange}
                    loading={loading}
                    metricLoading={metricLoading}
                    onSave={onTargetSave}
                    onClose={() => setVisible(false)}
                    destroyOnClose={true}
                    editId={editId}
                    dataSource={editId ? dimensionalList.filter(item => {
                        return editId === item.id
                    })[0] : {}}
                >
                </DataSetModal>
            }
        </Fragment>
    );
}

export default connect(({laboratoryStore}) => {
    return {
        dataSetInfo: laboratoryStore.dataSetInfo,
        updateDataSetInfo: laboratoryStore.updateDataSetInfo,
        dataSetTableList: laboratoryStore.dataSetTableList,
        adddimensionalList: laboratoryStore.adddimensionalList,
        dimensionalList: laboratoryStore.dimensionalList,
        getDataSourceList: laboratoryStore.getDataSourceList,
        dataSourceList: laboratoryStore.dataSourceList,
        delDimensionalList: laboratoryStore.delDimensionalList,
        modifyDimensionallist: laboratoryStore.modifyDimensionallist,
        modelList: laboratoryStore.modelList,
        objList: laboratoryStore.objList,
        metricList: laboratoryStore.metricList,
        getList: laboratoryStore.getList,
        getObjList: laboratoryStore.getObjList,
        getMetricList: laboratoryStore.getMetricList,
        getTagsList: laboratoryStore.getTagsList,
        getLaboratoryAsync: laboratoryStore.getLaboratoryAsync,
        getLabModelAsync: laboratoryStore.getLabModelAsync,
        getLabMetricAsync: laboratoryStore.getLabMetricAsync,
        getLabTagsAsync: laboratoryStore.getLabTagsAsync,
        emptyDimensionalList: laboratoryStore.emptyDimensionalList,
        setDimensionalList: laboratoryStore.setDimensionalList,
        getModel: laboratoryStore.getModel,
        delBlurModelList: laboratoryStore.delBlurModelList,
        delBlurObjList: laboratoryStore.delBlurObjList,
        setDataSourcePage: laboratoryStore.setDataSourcePage,
        setObjPage: laboratoryStore.setObjPage,
        setModelPage: laboratoryStore.setModelPage,
        setMetricPage: laboratoryStore.setMetricPage,
        dataSourcePage: laboratoryStore.dataSourcePage,
        modelPage: laboratoryStore.modelPage,
        objPage: laboratoryStore.objPage,
        metricPage: laboratoryStore.metricPage,
        getDataSourceTime: laboratoryStore.getDataSourceTime,
        getTaskTrainingDaysAsync: laboratoryStore.getTaskTrainingDaysAsync,
        setGenericityList: laboratoryStore.setGenericityList,
        genericityList: laboratoryStore.genericityList,
    };
})(DataSetting)
