import {Button, Modal, Icon, Input, message, Tooltip, Form, Select} from "@chaoswise/ui";
import React, {useEffect, useMemo,} from "react";
import styles from '@/pages/TaskManagement/assets/index.less';
import {connect, toJS} from "@chaoswise/cw-mobx";
import {guid, IntlFormatMessage, numberParseChina} from "@/utils/util";
import {OperatorList} from "@/globalConstants";
import ScrollSelect from '@/components/ScrollSelect';
import {data} from "jquery";
import {useFetchState} from "@/components/HooksState";
import {error} from "@/utils/tip";
import moment from 'moment';

const labelLayout = {
    labelCol: {span: 3},
    wrapperCol: {span: 21},
};
const nameStyle = {
    color: '#1890FF',
    cursor: 'pointer',
};
const FormItem = Form.Item;
const Option = Select.Option;

const EditTargetAlert = (props) => {
    const {
        form: {getFieldDecorator, validateFields, getFieldValue},
        dataSource = {},
        visible,
        onSave,
        onClose,
        editId,
        getDimension,
        metricList,
        tagsList = [],
        tagsValueList = [],
        metricPage,
        metricCallBack,
        onDropdownVisibleChange,
        getMetricList,
        loading,
        metricLoading,
        setLoading,
        dataSetInfo,
        delMetricList,
        setMetricPage,
        getLabMetricAsync,
        getTagsKeysAsync,
        getTagsValueAsync
    } = props;
    const {metric = [], tagsField = [],} = dataSource;
    const {time, scene, nowDate,} = toJS(dataSetInfo);
    const [dimensionList, setDimensionList] = useFetchState([
        {
            id: guid(),
            key: undefined,
            compare: undefined,
            value: undefined,
        }
    ]);
    const [searchValue, setSearchValue] = useFetchState(null);
    const [typesFilter, setTypesFilter] = useFetchState([]);
    const [tagsLoading, setTagsLoading] = useFetchState(false);
    const [tagsPage, setTagsPage] = useFetchState({
        pageNum: 1,
        pageSize: 100,
        total: 0
    });

    useEffect(() => {
        if (!!tagsField && !!tagsField.length) {
            setDimensionList(prev => {
                return tagsField.map(item => Object.assign({}, item, {id: guid()}));
            });
        }
        if (!editId) {
            setDimensionList([
                {
                    id: guid(),
                    key: undefined,
                    compare: undefined,
                    value: undefined,
                }
            ]);
        }
    }, [dataSource, editId]);

    const onTargetChange = (value, type, id) => {
        setDimensionList(prev => {
            return prev.map((item) => {
                if (item.id === id) {
                    return Object.assign({}, item, {
                        [type]: value,
                    });
                }
                return item;
            });
        });
    };
    const tagsCallBack = (page = {
        pageNum: 1, pageSize: 10, totalSize: 0
    }) => {
        setTagsPage({
            pageNum: page.pageNum,
            pageSize: page.pageSize,
            total: page.totalSize
        });
        setLoading(false);
        setTagsLoading(false);
    };
    const onScrollMetric = () => {
        if (metricPage.total === metricList.length) {
            return;
        }
        if (time && time.length === 2) {
            setLoading(true);
            if (dataSetInfo.dataSourceType === 'DODB') {
                getLabMetricAsync({
                        targetValue: dataSetInfo.obj,
                        modelValue: dataSetInfo.model,
                        metricValue: []
                    }, {
                        pageNum: metricPage.pageNum + 1,
                        pageSize: metricPage.pageSize
                    },
                    metricCallBack, searchValue
                );
            } else {
                getMetricList(
                    dataSetInfo.datasourceId.value,
                    dataSetInfo.model || [],
                    dataSetInfo.obj || [],
                    {
                        pageNum: metricPage.pageNum + 1,
                        pageSize: metricPage.pageSize
                    },
                    metricCallBack, searchValue
                );
            }
        }
    };

    const ifError = useMemo(() => {
        let error = false;
        try {
            dimensionList.forEach(item => {
                const {key, compare, value} = item;
                if (!key || (!!key && !!compare && !!value)) {
                    return false;
                } else {
                    error = true;
                    throw Error();
                }
            });
        } catch (err) {
            console.log(err);
        }
        return error;
    }, [dimensionList]);

    useEffect(() => {
        setTypesFilter(prev => {
            return dimensionList.map(item => item.key);
        });
    }, [dimensionList]);

    return (
        <Modal
            visible={visible}
            destroyOnClose={true}
            onCancel={() => {
                if (!editId) {
                    setDimensionList([{
                        id: guid(),
                        key: undefined,
                        compare: undefined,
                        value: undefined,
                    }]);
                }
                onClose();
            }}
            onOk={() => {
                validateFields((err, values) => {
                    if (!err) {
                        if (!ifError) {
                            let test = dimensionList.map(item => {
                                if (item.compare) {
                                    if (item.compare === 'E' || item.compare === 'NE') {
                                        if (!item.key) {
                                            error(IntlFormatMessage('laboratory.anomaly.dimensionValid'));
                                            return 0;
                                        } else {
                                            return 1;
                                        }
                                    }
                                    if (item.compare === 'LIKE' || item.compare === 'NLIKE') {
                                        if (!item.key || !item.value) {
                                            error(IntlFormatMessage('laboratory.anomaly.dimensionType'));
                                            return 0;
                                        } else {
                                            return 1;
                                        }
                                    }
                                    if (item.compare === 'NIN' || item.compare === 'IN') {
                                        if (!item.key || !item.value) {
                                            error(IntlFormatMessage('laboratory.anomaly.dimensionType'));
                                            return 0;
                                        } else {
                                            return 1;
                                        }
                                    }
                                } else {
                                    if (item.key || item.value) {
                                        error(IntlFormatMessage('aboratory.anomaly.selectValid'));
                                        return 0;
                                    } else {
                                        return 1;
                                    }
                                }
                            });
                            if (test.every(item => item === 1)) {
                                const params = {
                                    metric: values.metric,
                                    tagsField: dimensionList.filter(item => !!item.compare)
                                };
                                onSave(params, editId, {
                                    cb: () => {
                                        setDimensionList([{
                                            id: guid(),
                                            key: undefined,
                                            compare: undefined,
                                            value: undefined,
                                        }]);
                                        onClose();
                                    }
                                });
                            }
                        } else {
                            error(IntlFormatMessage('laboratory.anomaly.dimensionComplete'));
                        }
                    }
                });
            }}
            title={Object.keys(dataSource).length ? IntlFormatMessage('laboratory.anomaly.editMetric') : IntlFormatMessage('laboratory.detail.addmetric')}
            className={[styles["edit-target-modal"], styles["edit-target-alert"]]}
        >
            <Form>
                <FormItem
                    label={IntlFormatMessage('laboratory.detail.selmetric')}
                    className="metric-box"
                >
                    {getFieldDecorator('metric', {
                        initialValue: toJS(metric) || undefined,
                        rules: [
                            {required: false, message: IntlFormatMessage('laboratory.detail.selectmetric')},
                        ],
                    })(
                        <ScrollSelect
                            placeholder={IntlFormatMessage('laboratory.detail.selectmetric')}
                            onDropdownVisibleChange={(open) => {
                                onDropdownVisibleChange(open);
                                if (open) {
                                    setSearchValue(null);
                                    // delMetricList();
                                    if (time && time.length === 2) {
                                        setMetricPage({
                                            pageNum: 1,
                                            pageSize: 100,
                                            total: 0
                                        });
                                        if (dataSetInfo.dataSourceType === 'FILE') {
                                            getMetricList(
                                                dataSetInfo.datasourceId.value,
                                                dataSetInfo.model || [],
                                                dataSetInfo.obj || [],
                                                {
                                                    pageNum: 1,
                                                    pageSize: 100
                                                },
                                                metricCallBack,
                                            );
                                        } else {
                                            getLabMetricAsync({
                                                    targetValue: dataSetInfo.obj,
                                                    modelValue: dataSetInfo.model,
                                                    metricValue: []
                                                }, {
                                                    pageNum: 1,
                                                    pageSize: 100
                                                },
                                                metricCallBack
                                            );
                                        }
                                    }
                                }
                            }}
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                            scrollLoading={loading}
                            loading={metricLoading}
                            filterOption={false}
                            onSearch={(searchValue) => {
                                setSearchValue(searchValue);
                                if (time && time.length === 2) {
                                    setMetricPage({
                                        pageNum: 1,
                                        pageSize: 100,
                                        total: 0
                                    });
                                    if (dataSetInfo.dataSourceType === 'FILE') {
                                        getMetricList(
                                            dataSetInfo.datasourceId.value,
                                            dataSetInfo.model || [],
                                            dataSetInfo.obj || [],
                                            {
                                                pageNum: 1,
                                                pageSize: 100
                                            },
                                            metricCallBack,
                                            searchValue
                                        );
                                    } else {
                                        getLabMetricAsync({
                                                targetValue: dataSetInfo.obj,
                                                modelValue: dataSetInfo.model,
                                                metricValue: []
                                            }, {
                                                pageNum: 1,
                                                pageSize: 100
                                            },
                                            metricCallBack,
                                            searchValue
                                        );
                                    }
                                }
                            }}
                            onPopupScroll={onScrollMetric}
                            onChange={(e) => {
                                if (time && time.length === 2) {
                                    setDimensionList([{
                                        id: guid(),
                                        key: undefined,
                                        compare: undefined,
                                        value: undefined,
                                    }]);
                                }
                            }}
                            mode='multiple'
                        >
                            {
                                (toJS(metricList) || []).map(item => {
                                    return <Option key={item} value={item}>{item}</Option>;
                                })
                            }
                        </ScrollSelect>
                    )}
                </FormItem>
                <div className="dimension-clear">
                    <Button style={dimensionList.length > 1 ? nameStyle : null} onClick={() => {
                        setDimensionList([{
                            id: guid(),
                            key: undefined,
                            compare: undefined,
                            value: undefined,
                        }]);
                    }}>{IntlFormatMessage('laboratory.detail.reset')}</Button>
                </div>
                <div className="dimension-box">
                    <div className='demension-filter'>{IntlFormatMessage('laboratory.detail.dimensionfilter')}</div>
                    <div className='demension-wrapper'>
                        <FormItem className='demension-formadd'>
                            {
                                (dimensionList || []).map((item, index) => {
                                    return <div key={index}>
                                        <div className="dimension-item">
                                            <p className="dimension-item-title">{`${IntlFormatMessage('laboratory.detail.condition')}${index + 1}`}</p>
                                            <div className="dimension-item-right">
                                                <div className="dimension-item-margin">
                                                    <ScrollSelect
                                                        showSearch
                                                        value={item.key}
                                                        scrollLoading={loading}
                                                        loading={tagsLoading}
                                                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                                        placeholder={IntlFormatMessage('laboratory.detail.selectdimension')}
                                                        onPopupScroll={() => {
                                                            if (tagsPage.total === tagsList.length) {
                                                                return;
                                                            }
                                                            setLoading(true);
                                                            getTagsKeysAsync(
                                                                {
                                                                    pageNum: tagsPage.pageNum + 1,
                                                                    pageSize: 100,
                                                                    query: {
                                                                        dataSourceId: dataSetInfo.datasourceId.value,
                                                                        // dataSourceRelationId: (dataSetInfo.datasourceId) instanceof Object ? dataSetInfo.datasourceId.value : dataSetInfo.datasourceId,
                                                                        startTime: moment(time[0]).valueOf(),
                                                                        endTime: moment(time[1]).valueOf(),
                                                                        scene,
                                                                        nowDate,
                                                                        taskType: 1,
                                                                        filters: {
                                                                            modelFilter: (dataSetInfo?.model?.length && dataSetInfo?.model[0]) ? {
                                                                                compare: dataSetInfo?.model?.length > 1 ? 'IN' : 'E',
                                                                                value: dataSetInfo?.model?.length > 1 ? dataSetInfo.model : dataSetInfo.model[0]
                                                                            } : {},
                                                                            targetFilter: (dataSetInfo?.obj?.length && dataSetInfo?.obj[0]) ? {
                                                                                compare: dataSetInfo?.obj?.length > 1 ? 'IN' : 'E',
                                                                                value: dataSetInfo?.obj?.length > 1 ? dataSetInfo.obj : dataSetInfo.obj[0]
                                                                            } : {},
                                                                            metricFilter: (getFieldValue('metric').length && getFieldValue('metric')[0]) ? {
                                                                                compare: getFieldValue('metric').length > 1 ? 'IN' : 'E',
                                                                                value: getFieldValue('metric').length > 1 ? getFieldValue('metric') : getFieldValue('metric')[0]
                                                                            } : {},
                                                                        },
                                                                    }
                                                                },
                                                                tagsCallBack,
                                                            );
                                                        }}
                                                        onChange={(value) => {
                                                            onTargetChange(value, 'key', item.id);
                                                            onTargetChange(undefined, 'value', item.id);
                                                        }}
                                                        onFocus={e => {
                                                            // setLoading(true);
                                                            getTagsKeysAsync(
                                                                {
                                                                    pageNum: 1,
                                                                    pageSize: 100,
                                                                    query: {
                                                                        dataSourceId: dataSetInfo.datasourceId.value,
                                                                        // dataSourceRelationId: (dataSetInfo.datasourceId) instanceof Object ? dataSetInfo.datasourceId.value : dataSetInfo.datasourceId,
                                                                        startTime: moment(time[0]).valueOf(),
                                                                        endTime: moment(time[1]).valueOf(),
                                                                        scene,
                                                                        nowDate,
                                                                        taskType: 1,
                                                                        filters: {
                                                                            modelFilter: (dataSetInfo?.model?.length && dataSetInfo?.model[0]) ? {
                                                                                compare: dataSetInfo?.model?.length > 1 ? 'IN' : 'E',
                                                                                value: dataSetInfo?.model?.length > 1 ? dataSetInfo.model : dataSetInfo.model[0]
                                                                            } : {},
                                                                            targetFilter: (dataSetInfo?.obj?.length && dataSetInfo?.obj[0]) ? {
                                                                                compare: dataSetInfo?.obj?.length > 1 ? 'IN' : 'E',
                                                                                value: dataSetInfo?.obj?.length > 1 ? dataSetInfo.obj : dataSetInfo.obj[0]
                                                                            } : {},
                                                                            metricFilter: (getFieldValue('metric').length && getFieldValue('metric')[0]) ? {
                                                                                compare: getFieldValue('metric').length > 1 ? 'IN' : 'E',
                                                                                value: getFieldValue('metric').length > 1 ? getFieldValue('metric') : getFieldValue('metric')[0]
                                                                            } : {},
                                                                        },
                                                                    }
                                                                },
                                                                tagsCallBack,
                                                            );
                                                        }}
                                                    >
                                                        {
                                                            (toJS(tagsList) || []).map((tag) => (
                                                                <Option
                                                                    key={tag}
                                                                    value={tag}
                                                                >
                                                                    <Tooltip title={tag} placement={'topLeft'}>
                                                                        {tag}
                                                                    </Tooltip>
                                                                </Option>
                                                            ))
                                                        }
                                                    </ScrollSelect>
                                                </div>
                                                <Select
                                                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                                    placeholder={IntlFormatMessage('laboratory.detail.selecttype')}
                                                    style={{width: 'calc(40% - 64px)'}}
                                                    value={item.compare}
                                                    onChange={(value) => {
                                                        onTargetChange(value, 'compare', item.id);
                                                        onTargetChange(undefined, 'value', item.id);
                                                    }}
                                                >
                                                    {Object.entries(OperatorList).map((res) => {
                                                        const item = res[1];
                                                        return (
                                                            <Option key={item.key} value={item.key}>
                                                                <Tooltip title={IntlFormatMessage(item.value)}>
                                                                    {IntlFormatMessage(item.value)}
                                                                </Tooltip>
                                                            </Option>
                                                        );
                                                    })}
                                                </Select>
                                                <div className="dimension-item-margin">
                                                    {
                                                        ['LIKE', 'NLIKE'].includes(item.compare) ?
                                                            <Input
                                                                value={item.value}
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    onTargetChange(value, 'value', item.id);
                                                                }}
                                                            />
                                                            :
                                                            <ScrollSelect
                                                                showSearch
                                                                value={item.value}
                                                                scrollLoading={loading}
                                                                loading={tagsLoading}
                                                                mode={['IN', 'NIN'].includes(item.compare) ? 'multiple' : ''}
                                                                optionFilterProp={'name'}
                                                                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                                                placeholder={IntlFormatMessage('laboratory.detail.selectdimensionvalue')}
                                                                onPopupScroll={() => {
                                                                    if (tagsPage.total === tagsValueList.length) {
                                                                        return;
                                                                    }
                                                                    setLoading(true);
                                                                    getTagsKeysAsync(
                                                                        {
                                                                            pageNum: tagsPage.pageNum + 1,
                                                                            pageSize: 100,
                                                                            query: {
                                                                                dataSourceId: dataSetInfo.datasourceId.value,
                                                                                // dataSourceRelationId: (dataSetInfo.datasourceId) instanceof Object ? dataSetInfo.datasourceId.value : dataSetInfo.datasourceId,
                                                                                startTime: moment(time[0]).valueOf(),
                                                                                endTime: moment(time[1]).valueOf(),
                                                                                scene,
                                                                                nowDate,
                                                                                taskType: 1,
                                                                                filters: {
                                                                                    modelFilter: (dataSetInfo?.model?.length && dataSetInfo?.model[0]) ? {
                                                                                        compare: dataSetInfo?.model?.length > 1 ? 'IN' : 'E',
                                                                                        value: dataSetInfo?.model?.length > 1 ? dataSetInfo.model : dataSetInfo.model[0]
                                                                                    } : {},
                                                                                    targetFilter: (dataSetInfo?.obj?.length && dataSetInfo?.obj[0]) ? {
                                                                                        compare: dataSetInfo?.obj?.length > 1 ? 'IN' : 'E',
                                                                                        value: dataSetInfo?.obj?.length > 1 ? dataSetInfo.obj : dataSetInfo.obj[0]
                                                                                    } : {},
                                                                                    metricFilter: (getFieldValue('metric').length && getFieldValue('metric')[0]) ? {
                                                                                        compare: getFieldValue('metric').length > 1 ? 'IN' : 'E',
                                                                                        value: getFieldValue('metric').length > 1 ? getFieldValue('metric') : getFieldValue('metric')[0]
                                                                                    } : {},
                                                                                    metricTagsKey: item.key,
                                                                                },
                                                                            }
                                                                        },
                                                                        tagsCallBack,
                                                                    );
                                                                }}
                                                                onChange={(value) => {
                                                                    onTargetChange(value, 'value', item.id);
                                                                }}
                                                                onFocus={e => {
                                                                    if (item?.key && item?.key?.length) {
                                                                        getTagsValueAsync(
                                                                            {
                                                                                pageNum: 1,
                                                                                pageSize: 100,
                                                                                query: {
                                                                                    dataSourceId: dataSetInfo.datasourceId.value,
                                                                                    // dataSourceRelationId: (dataSetInfo.datasourceId) instanceof Object ? dataSetInfo.datasourceId.value : dataSetInfo.datasourceId,
                                                                                    startTime: moment(time[0]).valueOf(),
                                                                                    endTime: moment(time[1]).valueOf(),
                                                                                    scene,
                                                                                    nowDate,
                                                                                    taskType: 1,
                                                                                    filters: {
                                                                                        modelFilter: (dataSetInfo?.model?.length && dataSetInfo?.model[0]) ? {
                                                                                            compare: dataSetInfo?.model?.length > 1 ? 'IN' : 'E',
                                                                                            value: dataSetInfo?.model?.length > 1 ? dataSetInfo.model : dataSetInfo.model[0]
                                                                                        } : {},
                                                                                        targetFilter: (dataSetInfo?.obj?.length && dataSetInfo?.obj[0]) ? {
                                                                                            compare: dataSetInfo?.obj?.length > 1 ? 'IN' : 'E',
                                                                                            value: dataSetInfo?.obj?.length > 1 ? dataSetInfo.obj : dataSetInfo.obj[0]
                                                                                        } : {},
                                                                                        metricFilter: (getFieldValue('metric').length && getFieldValue('metric')[0]) ? {
                                                                                            compare: getFieldValue('metric').length > 1 ? 'IN' : 'E',
                                                                                            value: getFieldValue('metric').length > 1 ? getFieldValue('metric') : getFieldValue('metric')[0]
                                                                                        } : {},
                                                                                        metricTagsKey: item.key,
                                                                                    },
                                                                                }
                                                                            },
                                                                            tagsCallBack,
                                                                        );
                                                                    }
                                                                }}
                                                            >
                                                                {toJS(tagsValueList).map((tag) => {
                                                                    return (
                                                                        <Option
                                                                            key={tag}
                                                                            value={tag}
                                                                            name={tag}
                                                                        >
                                                                            <Tooltip title={tag}>
                                                                                {tag}
                                                                            </Tooltip>
                                                                        </Option>
                                                                    );
                                                                })}
                                                            </ScrollSelect>
                                                    }
                                                </div>
                                                {
                                                    dimensionList.length > 1 ?
                                                        <Tooltip title={IntlFormatMessage('task.detail.delete')}>
                                                            <Icon type="close-circle" className="dimension-item-delete"
                                                                  onClick={() => {
                                                                      setDimensionList(prev => {
                                                                          return prev.filter((i, cIndex) => i.id !== item.id);
                                                                      });
                                                                  }}/>
                                                        </Tooltip>
                                                        : null
                                                }
                                            </div>
                                        </div>
                                        {
                                            (index + 1) < dimensionList.length ? IntlFormatMessage('task.create.and') : ' '
                                        }
                                    </div>;
                                })
                            }
                        </FormItem>
                        <Button
                            className='demension-button'
                            onClick={() => {
                                setDimensionList(prev => {
                                    return prev.concat([{
                                        id: guid(),
                                        key: undefined,
                                        compare: undefined,
                                        value: undefined,
                                    }]);
                                });
                            }}>{IntlFormatMessage('laboratory.anomaly.add')}</Button>
                    </div>
                </div>
            </Form>
        </Modal>
    );
};

export default connect(({laboratoryStore}) => {
    return {
        dataSetInfo: laboratoryStore.dataSetInfo,
        updateDataSetInfo: laboratoryStore.updateDataSetInfo,
        dataSetTableList: laboratoryStore.dataSetTableList,
        getDimension: laboratoryStore.getDimension,
        metricList: laboratoryStore.metricList,
        tagsList: laboratoryStore.tagsList,
        getMetricList: laboratoryStore.getMetricList,
        delMetricList: laboratoryStore.delMetricList,
        getLabMetricAsync: laboratoryStore.getLabMetricAsync,
        getTagsKeysAsync: laboratoryStore.getTagsKeysAsync,
        getTagsValueAsync: laboratoryStore.getTagsValueAsync,
        tagsValueList: laboratoryStore.tagsValueList
    };
})(Form.create()(EditTargetAlert));