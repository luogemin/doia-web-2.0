import {Button, Modal, Icon, Input, Col, Tooltip, Form, Select} from "@chaoswise/ui";
import React, {useEffect, useMemo} from "react";
import styles from '@/pages/TaskManagement/assets/index.less';
import {guid, IntlFormatMessage, numberParseChina} from "@/utils/util";
import {omit} from "lodash-es";
import {connect, toJS} from "@chaoswise/cw-mobx";
import {OperatorList, paramsModalLabelLayout} from "@/globalConstants";
import {error} from "@/utils/tip";
import ScrollSelect from "@/components/ScrollSelect";
import {useFetchState} from "@/components/HooksState";
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const nameStyle = {
    color: '#1890FF',
    cursor: 'pointer',
};

const EditTargetAlert = (props) => {
    const {
        form: {getFieldDecorator, validateFields, getFieldValue}, dataSource = {},
        visible, onCancel, onSave, metricStoreList = {}, tagsList = [], getTaskMetricAsync,
        listParams, loading, setLoading, callBack, initTagsFun, initMetricFun, tagsValueList,
        getTagsValueAsync, tagsParams, initTagsKeysFun, tagsPage,
    } = props;
    const {metricFilter = {}, tagsFilter = [],} = dataSource;
    const [dimensionList, setDimensionList] = useFetchState([
        {
            id: guid(),
            key: undefined,
            compare: undefined,
            value: undefined,
        }
    ]);
    const [typesFilter, setTypesFilter] = useFetchState([]);

    useEffect(() => {
        if (!!tagsFilter && !!tagsFilter.length) {
            setDimensionList(prev => {
                return tagsFilter.map(item => Object.assign({}, item, {id: guid()}))
            })
        }
    }, [])

    useEffect(() => {
        setTypesFilter(prev => {
            return dimensionList.map(item => item.key);
        });
    }, [dimensionList]);

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
        })
    }

    const ifError = useMemo(() => {
        let error = false;
        try {
            dimensionList.forEach(item => {
                const {key, compare, value} = item;
                if (!key || (!!key && !!compare && !!value)) {
                    return false
                } else {
                    error = true
                    throw Error();
                }
            })
        } catch (err) {
            console.log(err)
        }
        return error
    }, [dimensionList])

    return (
        <Modal
            visible={visible}
            destroyOnClose={true}
            onOk={() => {
                if (!ifError) {
                    const params = Object.assign({id: guid(),}, dataSource,
                        (getFieldValue('metric') && getFieldValue('metric').length) ? {
                            metricFilter: {
                                compare: getFieldValue('metric').length === 1 ? 'E' : 'IN',
                                value: getFieldValue('metric').length === 1 ? getFieldValue('metric')[0] : getFieldValue('metric'),
                            },
                            tagsFilter: dimensionList
                        } : (dimensionList.length ? {
                            metricFilter: {},
                            tagsFilter: dimensionList
                        } : {}))
                    onSave(params)
                } else {
                    error(IntlFormatMessage('laboratory.anomaly.dimensionComplete'))
                }
            }}
            onCancel={() => onCancel()}
            title={!!Object.keys(dataSource).length ? IntlFormatMessage('laboratory.anomaly.editMetric') : IntlFormatMessage('task.detail.addmetric')}
            className={[styles["edit-target-modal"], styles["edit-target-alert"]]}
        >
            <Form>
                <FormItem
                    label={IntlFormatMessage('task.create.seladdmetric')}
                    className="metric-box"
                >
                    {getFieldDecorator('metric', {
                        initialValue: metricFilter.value ?
                            (typeof metricFilter.value === 'string' ? [metricFilter.value] : metricFilter.value)
                            : undefined,
                    })(
                        <ScrollSelect
                            onPopupScroll={(e) => {
                                if (metricStoreList.content.length === metricStoreList.totalSize) {
                                    return;
                                }
                                setLoading(true);
                                const params = Object.assign({}, listParams.metricListParam, {
                                    pageNum: metricStoreList.pageNum,
                                })
                                getTaskMetricAsync(params, callBack)
                            }}
                            scrollLoading={loading}
                            // onDropdownVisibleChange={(open) => {
                            onFocus={(open) => {
                                if (!open) {
                                    initMetricFun()
                                }
                            }}
                            onSearch={(value) => {
                                const param = toJS(listParams.metricListParam);
                                const params = Object.assign({}, param, {
                                    pageNum: metricStoreList.pageNum,
                                    query: Object.assign({}, param.query, {
                                        filters: Object.assign({}, param.query.filters, {
                                            metricFilter: {
                                                compare: 'LIKE',
                                                value: value
                                            }
                                        })
                                    })
                                })
                                getTaskMetricAsync(params, callBack)
                            }}
                            mode={'multiple'}
                            optionFilterProp={'name'}
                            getPopupContainer={(triggerNode) => triggerNode.parentNode}
                            onChange={(value) => {
                                setDimensionList([{
                                    id: guid(),
                                    key: undefined,
                                    compare: undefined,
                                    value: undefined,
                                }])
                            }}
                            placeholder={IntlFormatMessage('task.detail.selectmetric')}
                        >
                            {(metricStoreList.content || []).map((metric) => (
                                <Option
                                    key={metric}
                                    value={metric}
                                    name={metric}
                                >
                                    {metric}
                                </Option>
                            ))}
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
                        }])
                    }}> {IntlFormatMessage('task.create.reset')}</Button>
                </div>
                <div className="dimension-box">
                    <div className='demension-filter'>
                        {IntlFormatMessage('task.detail.dimensionfilter')}</div>
                    <div className='demension-wrapper'>
                        <FormItem className='demension-formadd'>
                            {
                                (dimensionList || []).map((item, index) => {
                                    return <div key={index}>
                                        <div className="dimension-item">
                                            <p className="dimension-item-title">{`${IntlFormatMessage('task.create.condition')}${index + 1}`}</p>
                                            <div className="dimension-item-right">
                                                <div className="dimension-item-margin">
                                                    <ScrollSelect
                                                        showSearch
                                                        value={item.key}
                                                        scrollLoading={loading}
                                                        loading={loading}
                                                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                                        placeholder={IntlFormatMessage('task.create.selectdimension')}
                                                        onChange={(value) => {
                                                            onTargetChange(value, 'key', item.id)
                                                            onTargetChange(undefined, 'value', item.id)
                                                        }}
                                                        onPopupScroll={() => {
                                                            if (tagsPage.total === tagsList.length) {
                                                                return;
                                                            }
                                                            setLoading(true);
                                                            initTagsKeysFun(tagsPage)
                                                        }}
                                                        onFocus={e => {
                                                            initTagsKeysFun()
                                                        }}
                                                    >
                                                        {toJS(tagsList).map((tag) => (
                                                            <Option
                                                                key={tag}
                                                                value={tag}
                                                            >
                                                                <Tooltip title={tag} placement={'topLeft'}>
                                                                    {tag}
                                                                </Tooltip>
                                                            </Option>
                                                        ))}
                                                    </ScrollSelect>
                                                </div>
                                                <Select
                                                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                                    placeholder={IntlFormatMessage('task.create.selecttype')}
                                                    style={{width: 'calc(40% - 64px)'}}
                                                    value={item.compare}
                                                    onChange={(value) => {
                                                        onTargetChange(value, 'compare', item.id)
                                                        onTargetChange(undefined, 'value', item.id)
                                                    }}
                                                >
                                                    {Object.entries(OperatorList).map((res) => {
                                                        const item = res[1];
                                                        return (
                                                            <Option key={item.key} value={item.key}>
                                                                {IntlFormatMessage(item.value)}
                                                            </Option>
                                                        )
                                                    })}
                                                </Select>
                                                <div className="dimension-item-margin">
                                                    {
                                                        ['LIKE', 'NLIKE'].includes(item.compare) ?
                                                            <Input
                                                                value={item.value}
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    onTargetChange(value, 'value', item.id)
                                                                }}
                                                            />
                                                            :
                                                            <ScrollSelect
                                                                showSearch
                                                                value={item.value}
                                                                scrollLoading={loading}
                                                                loading={loading}
                                                                mode={['IN', 'NIN'].includes(item.compare) ? 'multiple' : ''}
                                                                optionFilterProp={'name'}
                                                                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                                                placeholder={IntlFormatMessage('task.create.selectdimensionvalue')}
                                                                onChange={(value) => {
                                                                    onTargetChange(value, 'value', item.id)
                                                                }}
                                                                onPopupScroll={() => {
                                                                    if (tagsPage.total === tagsValueList.length) {
                                                                        return;
                                                                    }
                                                                    setLoading(true);
                                                                    initTagsKeysFun()
                                                                }}
                                                                onSearch={(searchValue) => {
                                                                    if (item?.key && item?.key?.length) {
                                                                        getTagsValueAsync(
                                                                            {
                                                                                pageNum: 1,
                                                                                pageSize: 100,
                                                                                query: Object.assign({}, tagsParams, {
                                                                                    filters: Object.assign({}, tagsParams.filters, {
                                                                                        metricTagsKey: item.key,
                                                                                        metricTagsValue: searchValue
                                                                                    })
                                                                                })
                                                                            },
                                                                            callBack,
                                                                        );
                                                                    }
                                                                }}
                                                                onFocus={e => {
                                                                    if (item?.key && item?.key?.length) {
                                                                        getTagsValueAsync(
                                                                            {
                                                                                pageNum: 1,
                                                                                pageSize: 100,
                                                                                query: Object.assign({}, tagsParams, {
                                                                                    filters: Object.assign({}, tagsParams.filters, {
                                                                                        metricTagsKey: item.key,
                                                                                    })
                                                                                })
                                                                            },
                                                                            callBack,
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
                                                                            {tag}
                                                                        </Option>
                                                                    )
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
                                                                          return prev.filter((i, cIndex) => i.id !== item.id)
                                                                      })
                                                                  }}/>
                                                        </Tooltip>
                                                        : null
                                                }
                                            </div>
                                        </div>
                                        {
                                            (index + 1) < dimensionList.length ? IntlFormatMessage('task.create.and') : ''
                                        }
                                    </div>
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
                                    }])
                                })
                            }}>{IntlFormatMessage('laboratory.anomaly.add')}</Button>
                    </div>
                </div>
            </Form>
        </Modal>
    )
}

export default connect(({taskManagementStore, dataSourceStore}) => {
    return {
        metricStoreList: taskManagementStore.metricList,
        tagsList: taskManagementStore.tagsList,
        getTaskMetricAsync: taskManagementStore.getTaskMetricAsync,
        listParams: taskManagementStore.listParams,
        tagsValueList: taskManagementStore.tagsValueList,
        getTagsValueAsync: taskManagementStore.getTagsValueAsync,
    };
})(EditTargetAlert);