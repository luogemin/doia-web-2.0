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
    Tooltip,
    InputNumber,
} from '@chaoswise/ui';
import {connect, toJS} from "@chaoswise/cw-mobx";
import {
    labelLayout,
} from "@/globalConstants";
import ScrollSelect from '@/components/ScrollSelect';
import styles from './index.less';
import moment from 'moment';
import {utilType} from '@/globalConstants';
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
        form, dataSetInfo, updateDataSetInfo, getDataSourceList,
        dataSourceList, emptyDimensionalList, disableEdit = false, dataSourcePage, setDataSourcePage,
        getDataSourceTime, getTaskTrainingDaysAsync, genericityList = [], setGenericityList,
    } = props;

    const {getFieldDecorator, setFieldsValue, getFieldValue, getFieldsValue} = form;
    const {time = undefined, startTime, endTime,} = toJS(dataSetInfo);

    const [editId, setEditId] = useFetchState('');
    const [loading, setLoading] = useFetchState(false);

    useEffect(() => {
        updateDataSetInfo('nowDate', new Date().getTime());
    }, []);

    useEffect(() => {
        const dataSourceType = getFieldValue('dataSourceType');
        if (dataSourceType) {
            setDataSourcePage({
                pageNum: 1,
                pageSize: 500,
                total: 0
            });
            handleChangeDataSourceType(dataSourceType, {
                pageNum: 1,
                pageSize: 500
            });
        }
    }, [dataSetInfo.dataSourceType]);

    //根据数据源类型获取数据源列表
    const handleChangeDataSourceType = (e, page) => {
        const callBack = (data) => {
            setDataSourcePage({
                ...page,
                total: data.totalSize
            });
        };
        getDataSourceList({
            query: {
                type: e
            },
            pageNum: page.pageNum,
            pageSize: page.pageSize
        }, callBack);
    };
    const onScroll = () => {
        if (dataSourceList.length === dataSourcePage.total) {
            return;
        }
        const callback = () => {
            setLoading(false);
            setDataSourcePage({
                ...dataSourcePage,
                pageNum: dataSourcePage.pageNum + 1,
            });
        };
        setLoading(true);
        getDataSourceList({
            query: {
                type: getFieldValue('dataSourceType'),
            },
            pageNum: dataSourcePage.pageNum + 1,
            pageSize: dataSourcePage.pageSize
        }, callback);
    };
    const onDropdownVisibleChange = (open, type) => {
        if (!open) {
            setLoading(false);
        }
    };

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
        };
        getTaskTrainingDaysAsync(params, {
            cb: (res) => {
                const result = (toJS(genericityList) || []).map(item => {
                    const {isOverwriteForecastParams, algorithmParams} = item;
                    if (isOverwriteForecastParams) {
                        item.algorithmParams = ([].concat(algorithmParams)).map(param => {
                            if (param.name === 'training_days') {
                                param.value = res.data;
                            }
                            if (param.name === 'forecast_period') {
                                param.value = forecast_period;
                            }
                            return param;
                        });
                    }
                    return item;
                });
                setGenericityList(result);
            }
        });
    };

    return (
        <Fragment>
            <div
                className='title-label-box title-label-box-margin'>{IntlFormatMessage('laboratory.detail.datasettings')}</div>
            <Item label={IntlFormatMessage('laboratory.list.algorithmscenario')} {...labelLayout}>
                {
                    getFieldDecorator('scene', {
                        initialValue: dataSetInfo.scene,
                    })(
                        <Radio.Group disabled>
                            <Radio value="log_parsing">
                                {IntlFormatMessage('laboratory.anomaly.logPatternRecognition')}
                            </Radio>
                        </Radio.Group>
                    )
                }
            </Item>
            <Item label={
                <span className="requird-before">{IntlFormatMessage('laboratory.list.datasource')}
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
                                        placeholder={IntlFormatMessage('datasource.select.datasourcetype')}
                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                        style={{width: '100%'}}
                                        onChange={(e) => {
                                            updateDataSetInfo('dataSourceType', e);
                                            setFieldsValue({
                                                datasourceId: undefined,
                                                time: undefined,
                                            });
                                            emptyDimensionalList();
                                            updateDataSetInfo('datasourceId', undefined);
                                            updateDataSetInfo('time', undefined);
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
                                        placeholder={IntlFormatMessage('task.create.selectdatasource')}
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
                                            setFieldsValue({
                                                time: undefined,
                                            });
                                            updateDataSetInfo('time', undefined);
                                            emptyDimensionalList();
                                            if (e.value) {
                                                getDataSourceTime(e.value, {
                                                    cb: (res) => {

                                                        const {data = {}} = res;

                                                        const {maxTime = 0, minTime = 0} = data;
                                                        if (maxTime && minTime) {
                                                            setFieldsValue({
                                                                time: [moment(minTime), moment(maxTime)]
                                                            });
                                                            updateDataSetInfo('time', [moment(minTime), moment(maxTime)]);

                                                            const type = getFieldValue('dataSourceType');
                                                            const datasourceId = getFieldValue('datasourceId');
                                                            if (!datasourceId.value) {
                                                                return;
                                                            }
                                                        } else {
                                                            setFieldsValue({
                                                                time: undefined,
                                                            });
                                                            updateDataSetInfo('time', undefined);
                                                        }
                                                    }
                                                });
                                            }
                                        }}
                                    >
                                        {
                                            dataSourceList.map(item => {
                                                return <Option value={item.id} key={item.id} search={item.name}>
                                                    <Tooltip title={item.name}>{item.name}</Tooltip>
                                                </Option>;
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
                        initialValue: startTime ? [moment(startTime), moment(endTime)] : time || undefined,
                        rules: [
                            {required: true, message: IntlFormatMessage('laboratory.anomaly.selectTime')},
                        ],
                    })(
                        <RangePicker
                            showTime={true}
                            className='item-width-tighten'
                            onChange={(e) => {
                                updateDataSetInfo('time', e);
                                if (e.length && e.length === 2) {
                                    const type = getFieldValue('dataSourceType');
                                    const datasourceId = getFieldValue('datasourceId');
                                    if (!datasourceId.value) {
                                        return;
                                    }
                                    updateTineFun({time: e});
                                }
                            }}
                            disabled={disableEdit}
                        />
                    )
                }
                <IconTooltip
                    style={{marginLeft: '8px'}}
                    title={IntlFormatMessage('laboratory.detail.trainingtime')} f
                />
            </Item>

            <Item label={
                <span className="requird-before">{IntlFormatMessage('laboratory.anomaly.statisticsWindow')}</span>
            }
                  {...labelLayout} className="noBottomBox">
                <Row className="item-width-tighten">
                    <Col span={12}>
                        <Item className="need-margin-right">
                            {
                                getFieldDecorator('number', {
                                    initialValue: dataSetInfo.number || 1,
                                    rules: [
                                        {
                                            required: true,
                                            message: IntlFormatMessage('laboratory.anomaly.statisticsEnter')
                                        },

                                    ],
                                })(
                                    <InputNumber
                                        disabled={disableEdit}
                                        onChange={(e) => updateDataSetInfo('number', e)}
                                        placeholder={IntlFormatMessage('laboratory.anomaly.statisticsEnter')}

                                        style={{width: '100%'}}>
                                    </InputNumber>
                                )
                            }
                        </Item>
                    </Col>
                    <Col span={12}>
                        <Item>
                            {
                                getFieldDecorator('aggTimeUnit', {
                                    initialValue: dataSetInfo.aggTimeUnit || 'MINUTE',
                                    rules: [
                                        {
                                            required: true,
                                            message: IntlFormatMessage('laboratory.anomaly.granularitySelect')
                                        },
                                    ],
                                })(
                                    <Select
                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                        onChange={(e) => updateDataSetInfo('aggTimeUnit', e)}
                                        placeholder={IntlFormatMessage('laboratory.anomaly.granularitySelect')}
                                        disabled={disableEdit}
                                        style={{width: '100%'}}>
                                        {
                                            utilType.map(item => {
                                                return <Option value={item.key} key={item.key}>
                                                    {IntlFormatMessage(item.id)}
                                                </Option>;
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </Item>
                    </Col>
                </Row>
            </Item>
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
        addTbList: laboratoryStore.addTbList,
        modifyDimensionallist: laboratoryStore.modifyDimensionallist,
        objList: laboratoryStore.objList,
        metricList: laboratoryStore.metricList,
        getList: laboratoryStore.getList,
        emptyDimensionalList: laboratoryStore.emptyDimensionalList,
        setDimensionalList: laboratoryStore.setDimensionalList,
        setDataSourcePage: laboratoryStore.setDataSourcePage,
        dataSourcePage: laboratoryStore.dataSourcePage,
        getDataSourceTime: laboratoryStore.getDataSourceTime,
        getTaskTrainingDaysAsync: laboratoryStore.getTaskTrainingDaysAsync,
        setGenericityList: laboratoryStore.setGenericityList,
        genericityList: laboratoryStore.genericityList,
    };
})(DataSetting);
