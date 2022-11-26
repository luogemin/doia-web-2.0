import React, {useEffect, Fragment, useMemo,} from 'react';
import {
    Button, Form, BasicLayout, Col, Row, Select, RangePicker, Table, Tooltip, InputNumber, Drawer,
    Radio,
} from '@chaoswise/ui';
import {connect, toJS} from "@chaoswise/cw-mobx";
import {
    polymerizationType,
    labelLayout,
    OperatorList,
} from "@/globalConstants";
import ScrollSelect from '@/components/ScrollSelect';
import styles from '@/pages/Laboratory/components/SingleCheck/index.less';
import moment from 'moment';
import {utilType} from '@/globalConstants';
import DataSetModal from './DataSetModal';
import {error, warning} from '@/utils/tip';
import IconTooltip from "@/components/IconTooltip";
import BrawerTable from "./BrawerTable";
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
    cursor: 'not-allowed'
};

const timeUnit = {
    'MINUTE': 'min',
    'HOUR': 'hour',
    'DAY': 'day',
    'D': 'day',
};

function DataSetting(props) {
    const {
        form, dataSetInfo, updateDataSetInfo, adddimensionalList, dimensionalList = [], emptyDimensionalList, getDataSourceList,
        dataSourceList, delDimensionalList, modifyDimensionallist, disableEdit = false,
        dataSourcePage, setDataSourcePage, clearGenericityList,
        getTaskTrainingDaysAsync, genericityList = [], setGenericityList, getTaskTimerangeAsync,
    } = props;

    const {getFieldDecorator, setFieldsValue, getFieldValue, getFieldsValue} = form;
    const {
        dataSourceType, datasourceId, time = undefined, startTime, endTime, method,
        number, aggTimeUnit,
    } = toJS(dataSetInfo);

    const [visible, setVisible] = useFetchState(false);
    const [timeRange, setTimeRange] = useFetchState([]);
    const [drawerVsible, setDrawerVsible] = useFetchState(false);
    const [editRow, setEditRow] = useFetchState({});
    const [editId, setEditId] = useFetchState('');
    const [loading, setLoading] = useFetchState(false);
    const [dimensionalListChanged, setDimensionalListChanged] = useFetchState(false);

    useEffect(() => {
        updateDataSetInfo('nowDate', new Date().getTime());
    }, []);

    const getTaskTimerangeFun = () => {
        const renderParams = () => {
            let params = {
                taskName: dataSetInfo.taskName || null,
                description: dataSetInfo.description || null,
                scene: dataSetInfo.scene || null,
                aggConfig: Object.assign({}, {
                    aggFunc: dataSetInfo.method || 'AVG',
                    aggTimeUnit: dataSetInfo.aggTimeUnit || 'MINUTE',
                    aggTimeNumber: dataSetInfo.number || 1,
                }, dataSetInfo.method === 'QUANTILE_EXACT' ? {
                    aggPercentile: dataSetInfo.aggPercentile,
                } : {}),
                //新加参数
                dataSourceRelation: {},
                dataSourceTimeSeriesList: toJS(dimensionalList),
                dataSourceList: toJS(dimensionalList),
            };
            params.dataSourceRelation = {
                dataSourceType: dataSetInfo.dataSourceType,
                dataSourceId: (dataSetInfo.datasourceId && dataSetInfo.datasourceId.value) || null,
                relationshipType: 'NODE_RELATION',
            };
            const dataSourceListR = [].concat(toJS(dimensionalList));
            if (dataSetInfo.datasourceId && dataSetInfo.datasourceId.value) {
                params.dataSourceList = dataSourceListR.concat((params.dataSourceRelation));
            } else {
                params.dataSourceList = dataSourceListR;
            }

            return params;
        };
        getTaskTimerangeAsync({
            ...renderParams(),
        }, {
            cb: (data) => {
                const {minTime, maxTime} = data;
                if (maxTime && maxTime.toString().length === 13) {
                    setTimeRange([minTime, maxTime]);
                    // const currentEndTime = !!toJS(dataSetInfo).time && toJS(dataSetInfo).time.length === 2 ? new Date(toJS(dataSetInfo).time[1]).getTime() : new Date().getTime();
                    // if (maxTime < currentEndTime) {
                    const startTime = maxTime - (window.DOIA_CONFIG.timeRangeOffset || 24) * 3600 * 1000;
                    const endTime = maxTime;
                    setFieldsValue({
                        time: [moment(startTime), moment(endTime)]
                    });
                    updateDataSetInfo('time', [moment(startTime), moment(endTime)]);
                    // }
                } else {
                    setFieldsValue({
                        time: undefined
                    });
                    updateDataSetInfo('time', undefined);
                }
            }
        });
    };

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

    const columns = [
        {
            title: IntlFormatMessage('laboratory.anomaly.dataSourceType'),
            dataIndex: 'dataSourceType',
            key: 'dataSourceType',
            width: IsInternationalization() ? '20%' : '15%',
            ellipsis: true,
            render: (text, record) => {
                if (text) {
                    if (text === 'FILE') {
                        return IntlFormatMessage('laboratory.detail.createofflinedata');
                    }
                    if (text === 'DODB') {
                        return IntlFormatMessage('laboratory.detail.adddatasource');
                    }
                } else {
                    const {dataSource = {}} = record;
                    const {type} = dataSource;
                    if (type === 'FILE') {
                        return IntlFormatMessage('laboratory.detail.createofflinedata');
                    }
                    if (type === 'DODB') {
                        return IntlFormatMessage('laboratory.detail.adddatasource');
                    }
                }
                // return relationshipTypeUnit[text] || '-';
            }
        },
        {
            title: IntlFormatMessage('laboratory.anomaly.name'),
            dataIndex: 'dataSourceName',
            key: 'dataSourceName',
            width: IsInternationalization() ? '10%' : '15%',
            ellipsis: true,
            render: (text, record) => {
                return text;
            }
        },
        {
            title: IntlFormatMessage('laboratory.detail.model'),
            dataIndex: 'model',
            key: 'model',
            width: '15%',
            ellipsis: true,
            render: (text, record) => {
                const {filtersConfig = {}} = record;
                const {modelFilter = {}} = filtersConfig;
                if (!!modelFilter && Object.keys(modelFilter).length) {
                    const {key, compare, value} = modelFilter;
                    return value.join(',');
                } else {
                    return null;
                }
            }
        },
        {
            title: IntlFormatMessage('laboratory.detail.object'),
            dataIndex: 'object',
            key: 'object',
            width: '15%',
            ellipsis: true,
            render: (text, record) => {
                const {filtersConfig = {}} = record;
                const {targetFilter = {}} = filtersConfig;
                if (!!targetFilter && Object.keys(targetFilter).length) {
                    const {key, compare, value} = targetFilter;
                    return value.join(',');
                } else {
                    return null;
                }
            }
        },
        {
            title: IntlFormatMessage('laboratory.detail.metric'),
            dataIndex: 'metric',
            key: 'metric',
            width: '15%',
            ellipsis: true,
            render: (text, record) => {
                const {filtersConfig = {}} = record;
                const {metricAndTagFilters = []} = filtersConfig;
                const {metricFilter = {}} = metricAndTagFilters.length ? metricAndTagFilters[0] : {};
                if (!!metricFilter && !!metricFilter.value) {
                    const {key, compare, value} = metricFilter;
                    return value.join(',');
                } else {
                    return null;
                }
            }
        },
        {
            title: IntlFormatMessage('laboratory.detail.dimension'),
            dataIndex: 'filter',
            key: 'filter',
            width: '25%',
            ellipsis: true,
            render: (text, record) => {
                const {filtersConfig = []} = record;
                const {metricAndTagFilters = []} = filtersConfig;
                const {tagsFilter = []} = metricAndTagFilters.length ? metricAndTagFilters[0] : {};
                const result = (tagsFilter || []).map(val => {
                    return `${val.key} ${OperatorList[val.compare] ? IntlFormatMessage(OperatorList[val.compare].sign) : ''} ${val.value || ''} ${(val.compare === 'IN' || val.compare === 'NIN') ? IntlFormatMessage('laboratory.anomaly.middle') : ''}`;
                }).join(` ${IntlFormatMessage('task.create.and')} `);
                if (result) {
                    return <div
                        dangerouslySetInnerHTML={{
                            __html: result.split(IntlFormatMessage('task.create.and')).join(` ${IntlFormatMessage('task.create.and')}<br/>`)
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
            width: IsInternationalization() ? 170 : 155,
            key: 'operation',
            render: (text, record) => {
                const {dataSource = {}} = record;
                const {sourceConfig = {}} = dataSource;
                const recordRow = !!record.dataSourceType ? record : Object.assign({}, record, {
                    dataSourceType: sourceConfig.type,
                })
                return (
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <span style={nameStyle}
                              onClick={() => {
                                  setEditRow(Object.assign({}, recordRow, !!time && !!time.length ? {
                                      startTime: new Date(time[0]).getTime(), endTime: new Date(time[1]).getTime(),
                                  } : {}))
                                  setDrawerVsible(true)
                              }}>{IntlFormatMessage('laboratory.detail.view')}</span>
                        <span className="operation_line">|</span>
                        <span style={disableEdit ? editStyle : nameStyle} onClick={() => {
                            if (disableEdit) {
                                return
                            }
                            setEditId(record.id)
                            setEditRow(recordRow)
                            setVisible(true)
                        }}>
                            {IntlFormatMessage('laboratory.detail.edit')}
                        </span>
                        <span className="operation_line">|</span>
                        <span style={disableEdit ? editStyle : nameStyle} onClick={() => {
                            if (disableEdit) {
                                return
                            }
                            delDimensionalList(record.id)
                            setDimensionalListChanged(true)
                        }}>{IntlFormatMessage('laboratory.detail.delete')}
                        </span>
                    </div>
                );
            }
        },
        /*eslint-disable*/
    ];
    useEffect(() => {
        if (dimensionalListChanged && !disableEdit) {
            getTaskTimerangeFun()
            setDimensionalListChanged(false)
        }
    }, [dimensionalListChanged])
    const onTargetSave = (values, id, {cb}) => {
        if (id) {
            modifyDimensionallist(values, id)
        } else {
            adddimensionalList(values);
        }
        setDimensionalListChanged(true)
        setEditRow({});
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
    const onDropdownVisibleChange = (open, type) => {
        if (!open) {
            setLoading(false);
        }
        handleChangeDataSourceType(dataSourceType, {
            pageNum: 1,
            pageSize: 100
        });
    };

    return (
        <Fragment>
            <div
                className='title-label-box title-label-box-margin'>{IntlFormatMessage('laboratory.anomaly.relationship')}</div>
            <Item label={IntlFormatMessage('laboratory.list.algorithmscenario')} {...labelLayout}>
                {
                    getFieldDecorator('scene', {
                        initialValue: dataSetInfo.scene,
                    })(
                        <Radio.Group disabled>
                            <Radio value="root_cause_analysis">
                                {IntlFormatMessage('laboratory.anomaly.rootCauseAnalysis')}
                            </Radio>
                        </Radio.Group>
                    )
                }
            </Item>
            <Item label={
                <span>{IntlFormatMessage('laboratory.list.datasource')}
            </span>} {...labelLayout} className="noBottomBox">
                <Row className="item-width-tighten">
                    <Col span={12}>
                        <Item className="need-margin-right noBottomBox">
                            {
                                getFieldDecorator('dataSourceType', {
                                    initialValue: dataSourceType || undefined,
                                    rules: [
                                        {
                                            required: false,
                                            message: IntlFormatMessage('datasource.select.datasourcetype')
                                        },
                                    ],
                                })(
                                    <Select
                                        disabled={disableEdit}
                                        placeholder={IntlFormatMessage('datasource.select.datasourcetype')}
                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                        style={{width: '100%'}}
                                        onChange={(e) => {
                                            updateDataSetInfo('dataSourceType', e);
                                            setFieldsValue({
                                                datasourceId: undefined,
                                                time: undefined,
                                                method: 'AVG',
                                                aggPercentile: 1,
                                                number: 1,
                                                aggTimeUnit: 'MINUTE',
                                            });
                                            updateDataSetInfo('datasourceId', undefined);
                                            updateDataSetInfo('time', undefined);
                                            updateDataSetInfo('method', 'AVG');
                                            updateDataSetInfo('aggPercentile', 1);
                                            updateDataSetInfo('number', 1);
                                            updateDataSetInfo('aggTimeUnit', 'MINUTE');
                                            emptyDimensionalList();
                                            clearGenericityList();
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
                        <Item className="noBottomBox">
                            {
                                getFieldDecorator('datasourceId', {
                                    initialValue: datasourceId || undefined,
                                    rules: [
                                        {required: false, message: IntlFormatMessage('task.create.selectdatasource')},
                                    ],
                                })(
                                    <ScrollSelect
                                        placeholder={IntlFormatMessage('task.create.selectdatasource')}
                                        disabled={disableEdit}
                                        style={{width: '100%'}}
                                        showSearch
                                        allowClear
                                        scrollLoading={loading}
                                        loading={loading}
                                        onDropdownVisibleChange={onDropdownVisibleChange}
                                        optionFilterProp='search'
                                        onPopupScroll={onScroll}
                                        labelInValue={true}
                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                        onChange={(e) => {
                                            updateDataSetInfo('datasourceId', Object.keys(e).length ? e : undefined);
                                            setFieldsValue({
                                                time: undefined,
                                                method: 'AVG',
                                                aggPercentile: 1,
                                                number: 1,
                                                aggTimeUnit: 'MINUTE',
                                            });
                                            updateDataSetInfo('time', undefined);
                                            updateDataSetInfo('method', 'AVG');
                                            updateDataSetInfo('aggPercentile', 1);
                                            updateDataSetInfo('number', 1);
                                            updateDataSetInfo('aggTimeUnit', 'MINUTE');
                                            emptyDimensionalList();
                                            clearGenericityList();
                                        }}
                                    >
                                        {
                                            dataSourceList.map(item => {
                                                return <Option
                                                    value={item.id} key={item.id} search={item.name}
                                                    disabled={item.isDeleted === 2}
                                                >
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
            <div className='title-label-box title-label-box-margin'>
                {IntlFormatMessage('laboratory.detail.selmetric')}</div>
            <Item label={`${IntlFormatMessage('laboratory.anomaly.metricList')}:`}{...labelLayout}>
                <Button type="primary" disabled={disableEdit} onClick={() => {
                    // if (!!time && time.length) {
                    setEditRow({})
                    setVisible(true)
                    // } else {
                    //     error('请先选择训练时间')
                    // }
                }}>{IntlFormatMessage('laboratory.anomaly.addMetric')}</Button>
            </Item>
            {/*<div style={{minHeight: 300,}}>*/}
            <Table
                columns={columns}
                scroll={{y: 250}}
                rowKey={record => record.dataSourceId}
                dataSource={toJS(dimensionalList)}
            />
            {/*</div>*/}
            <div className='title-label-box title-label-box-margin'>
                {IntlFormatMessage('laboratory.detail.trainingtime')}
            </div>
            <Item label={IntlFormatMessage('laboratory.detail.trainingtime')} {...labelLayout}>
                {
                    getFieldDecorator('time', {
                        initialValue: time || undefined,
                        rules: [
                            {required: true, message: IntlFormatMessage('laboratory.anomaly.selectTime')},
                        ],
                    })(
                        <RangePicker
                            showTime={true}
                            className='item-width-tighten'
                            // disabledDate={(current) => {
                            //     const timeLong = !!timeRange && timeRange.length === 2 ? timeRange : time;
                            //     if (timeLong && timeLong.length === 2) {
                            //         const timeLongResult = [new Date(timeLong[0]).getTime(), new Date(timeLong[1]).getTime()];
                            //         const currentTime = new Date(current).getTime();
                            //         return moment(currentTime).endOf('day') < moment(timeLongResult[0]).endOf('day')
                            //             ||
                            //             moment(currentTime).endOf('day') > moment(timeLongResult[1]).endOf('day');
                            //     }
                            // }}
                            onChange={(e) => {
                                updateDataSetInfo('time', e);
                                if (e.length && e.length === 2) {
                                    const sevenDay = 7 * 24 * 60 * 60 * 1000;
                                    const result = (new Date(e[1]).getTime() - new Date(e[0]).getTime())
                                    if (result > sevenDay) {
                                        warning(IntlFormatMessage('laboratory.anomaly.periodCause'), 3);
                                    }
                                }
                            }}
                            disabled={disableEdit}
                        />
                    )
                }
                <IconTooltip
                    style={{marginLeft: '8px'}}
                    title={IntlFormatMessage('laboratory.detail.trainingtime')}
                />
            </Item>
            <Item label={
                <span className="requird-before">{IntlFormatMessage('laboratory.detail.aggregationmethod')}</span>
            }
                  {...labelLayout} className="noBottomBox">
                <Row className="item-width-tighten">
                    <Col span={getFieldValue('method') === 'QUANTILE_EXACT' ? 6 : 12}>
                        <Item className="need-margin-right">
                            {
                                getFieldDecorator('method', {
                                    initialValue: method || 'AVG',
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
                                            if (e === 'QUANTILE_EXACT') {
                                                updateDataSetInfo('aggPercentile', 1)
                                            }
                                        }}
                                        style={{width: '100%'}}
                                    >
                                        {
                                            polymerizationType.map(item => {
                                                return <Option value={item.key}
                                                               key={item.key}>{IntlFormatMessage(item.id)}</Option>
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </Item>
                    </Col>
                    {
                        getFieldValue('method') === 'QUANTILE_EXACT' ?
                            <Col span={6}>
                                <Item className="need-margin-right">
                                    {
                                        getFieldDecorator('aggPercentile', {
                                            initialValue: dataSetInfo.aggPercentile || 1,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: IntlFormatMessage('task.create.enterTimeRange')
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
                                                placeholder={IntlFormatMessage('laboratory.anomaly.enterValue')}
                                                style={{width: '100%'}}>
                                            </InputNumber>
                                        )
                                    }
                                </Item>
                            </Col>
                            : null
                    }
                    <Col span={6}>
                        <Item className="need-margin-right">
                            {
                                getFieldDecorator('number', {
                                    initialValue: number || 1,
                                    rules: [
                                        {required: true, message: IntlFormatMessage('task.create.enterTimeRange')},

                                    ],
                                })(
                                    <InputNumber
                                        disabled={disableEdit}
                                        onChange={(e) => updateDataSetInfo('number', e)}
                                        placeholder={IntlFormatMessage('laboratory.anomaly.enterValue')}
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
                                    initialValue: aggTimeUnit || 'MINUTE',
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
            <div style={{height: 24}}/>
            {
                visible && <DataSetModal
                    onScroll={onScroll}
                    visible={visible}
                    setLoading={setLoading}
                    loading={loading}
                    onSave={onTargetSave}
                    onClose={() => {
                        setVisible(false)
                        setEditRow({})
                        setEditId('')
                    }}
                    destroyOnClose={true}
                    editId={editId}
                    dataSource={editRow}
                />
            }

            {
                drawerVsible ?
                    <Drawer
                        title={IntlFormatMessage('laboratory.detail.view')}
                        placement="right"
                        width={'60vw'}
                        bodyStyle={{padding: 0}}
                        onClose={() => {
                            setDrawerVsible(false)
                        }}
                        visible={drawerVsible}
                    >
                        <BrawerTable editRow={editRow}/>
                    </Drawer>
                    : null
            }
        </Fragment>
    );
}

export default connect(({laboratoryStore}) => {
    return {
        dataSetInfo: laboratoryStore.dataSetInfo,
        updateDataSetInfo: laboratoryStore.updateDataSetInfo,
        adddimensionalList: laboratoryStore.adddimensionalList,
        getTaskTimerangeAsync: laboratoryStore.getTaskTimerangeAsync,
        emptyDimensionalList: laboratoryStore.emptyDimensionalList,
        delDimensionalList: laboratoryStore.delDimensionalList,
        modifyDimensionallist: laboratoryStore.modifyDimensionallist,
        dimensionalList: laboratoryStore.dimensionalList,
        getDataSourceList: laboratoryStore.getDataSourceList,
        dataSourceList: laboratoryStore.dataSourceList,
        setDataSourcePage: laboratoryStore.setDataSourcePage,
        dataSourcePage: laboratoryStore.dataSourcePage,
        getTaskTrainingDaysAsync: laboratoryStore.getTaskTrainingDaysAsync,
        setGenericityList: laboratoryStore.setGenericityList,
        genericityList: laboratoryStore.genericityList,
        clearGenericityList: laboratoryStore.clearGenericityList,
    };
})(DataSetting)
