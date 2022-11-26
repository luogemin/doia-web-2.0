import {Button, Modal, Icon, Input, Row, Col, message, Tooltip, Form, Select} from "@chaoswise/ui";
import React, {Fragment, useEffect, useMemo,} from "react";
import styles from '@/pages/TaskManagement/assets/index.less';
import rootStyles from './index.less';
import {connect, toJS} from "@chaoswise/cw-mobx";
import moment from 'moment';
import {guid, IntlFormatMessage, numberParseChina} from "@/utils/util";
import {OperatorList} from "@/globalConstants";
import ScrollSelect from '@/components/ScrollSelect';
import {data} from "jquery";
import {useFetchState} from "@/components/HooksState";
import {error} from "@/utils/tip";

const labelLayout = {
    labelCol: {span: 5},
    wrapperCol: {span: 19},
};
const nameStyle = {
    color: '#1890FF',
    width: '40px',
};
const FormItem = Form.Item;
const Option = Select.Option;

const EditTargetAlert = (props) => {
    const {
        form: {getFieldDecorator, validateFields, getFieldValue, setFieldsValue,},
        visible, onSave, onClose, loading, setLoading, dataSource = {}, editId,
        modelPage, setModelPage, objPage, setObjPage, metricPage, setMetricPage,
        getListRoot, getModel, getObjList, getMetricList, getTagsList, getDimensionRoot,
        getTaskModelAsync, getTaskTargetAsync, getTaskMetricAsync, getTaskTagsAsync,
        modelList, objList, metricList, tagsList,
        getDataSourceList, setDataSourcePage, dataSourcePage, dataSourceList, dimensionalList,
        updateDataSetInfo, getTagsKeysAsync, getTagsValueAsync, tagsValueList, dataSetInfo,
    } = props;
    const {filtersConfig = {}} = dataSource;
    const {time, scene, nowDate,} = toJS(dataSetInfo);
    const {modelFilter = {}, targetFilter = {}, metricAndTagFilters = []} = filtersConfig;
    const {metricFilter = {}, tagsFilter = []} = metricAndTagFilters.length ? metricAndTagFilters[0] : {};

    const [dimensionList, setDimensionList] = useFetchState(tagsFilter.length ? tagsFilter : [
        {
            id: guid(),
            key: undefined,
            compare: undefined,
            value: undefined,
        }
    ]);
    const [searchValue, setSearchValue] = useFetchState(null);
    const [typesFilter, setTypesFilter] = useFetchState([]);
    const [metricLoading, setMetricLoading] = useFetchState(false);
    const [modelLoading, setModelLoading] = useFetchState(false);
    const [objLoading, setObjLoading] = useFetchState(false);
    const [tagsLoading, setTagsLoading] = useFetchState(false);
    const [tagsPage, setTagsPage] = useFetchState({
        pageNum: 1,
        pageSize: 100,
        total: 0
    });

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

    const filterParams=useMemo(() => {
        return {
            modelFilter: (getFieldValue('model')?.length && getFieldValue('model')[0]) ? {
                compare: getFieldValue('model').length > 1 ? 'IN' : 'E',
                value: getFieldValue('model').length > 1 ? getFieldValue('model') : getFieldValue('model')[0]
            } : {},
            targetFilter: (getFieldValue('obj')?.length && getFieldValue('obj')[0]) ? {
                compare: getFieldValue('obj').length > 1 ? 'IN' : 'E',
                value: getFieldValue('obj').length > 1 ? getFieldValue('obj') : getFieldValue('obj')[0]
            } : {},
            metricFilter: (getFieldValue('metric')?.length && getFieldValue('metric')[0]) ? {
                compare: getFieldValue('metric').length > 1 ? 'IN' : 'E',
                value: getFieldValue('metric').length > 1 ? getFieldValue('metric') : getFieldValue('metric')[0]
            } : {},
        };
    },[getFieldValue('model'),getFieldValue('obj'),getFieldValue('metric')]);
    const cannotSelectSource = useMemo(() => {
        return toJS(dimensionalList).map(dim => {
            return dim.dataSourceName;
        });
    }, [dimensionalList]);

    const dataSourceId = useMemo(() => {
        return getFieldValue('datasourceId') || dataSource.dataSourceId;
    }, [getFieldValue('datasourceId'), dataSource.dataSourceId]);
    const dataSourceType = useMemo(() => {
        return getFieldValue('dataSourceType') || dataSource.dataSourceType;
    }, [getFieldValue('dataSourceType'), dataSource.dataSourceType]);
    const model = useMemo(() => {
        return getFieldValue('model') || (modelFilter ? modelFilter.value : []);
    }, [getFieldValue('model'), modelFilter]);
    const obj = useMemo(() => {
        return getFieldValue('obj') || (targetFilter ? targetFilter.value : []);
    }, [getFieldValue('obj'), targetFilter]);

    //进入默认拉取file类型的数据源
    useEffect(() => {
        // handleChangeDataSourceType(dataSource.dataSourceType || 'FILE', {
        //     pageNum: 1,
        //     pageSize: 100
        // });

        // if (dataSource.dataSourceId) {
        //     if (dataSource.dataSourceType === 'FILE') {
        //         getModel(dataSource.dataSourceId, {
        //             pageNum: 1,
        //             pageSize: 100
        //         }, modelCallBack);
        //         getObjList(dataSource.dataSourceId, modelFilter ? modelFilter.value : [], {
        //             pageNum: 1,
        //             pageSize: 100
        //         }, objCallBack);
        //         getMetricList(dataSource.dataSourceId, modelFilter ? modelFilter.value : [], targetFilter ? targetFilter.value : [], {
        //             pageNum: 1,
        //             pageSize: 100
        //         }, metricCallBack);
        //         getTagsList(dataSource.dataSourceId, modelFilter ? modelFilter.value : [], targetFilter ? targetFilter.value : [],{
        //             pageNum: 1,
        //             pageSize: 100
        //         }, tagsCallBack);
        //         getMetricList(
        //             dataSource.dataSourceId,
        //             modelFilter ? modelFilter.value : [],
        //             targetFilter ? targetFilter.value : [],
        //             {
        //                 pageNum: 1,
        //                 pageSize: 100
        //             },
        //             metricCallBack,
        //         );
        //     } else {
        //         const params = {
        //             dataSourceId: dataSource.dataSourceId,
        //             modelValue: modelFilter ? modelFilter.value : [],
        //             targetValue: targetFilter ? targetFilter.value : [],
        //             metricValue: [],
        //         };
        //
        //         getTaskModelAsync(params, {
        //             pageNum: 1,
        //             pageSize: 100
        //         }, modelCallBack);
        //         getTaskTargetAsync(params, {
        //             pageNum: 1,
        //             pageSize: 100
        //         }, objCallBack);
        //         getTaskMetricAsync(params, {
        //             pageNum: 1,
        //             pageSize: 100
        //         }, metricCallBack);
        //         getTaskTagsAsync(params, {
        //             pageNum: 1,
        //             pageSize: 100
        //         });
        //         getTaskMetricAsync(params, {
        //             pageNum: 1,
        //             pageSize: 100
        //         }, metricCallBack);
        //     }
        //
        //     getListRoot('model', {dataSourceId, dataSourceType, value: targetFilter ? targetFilter.value : null}, {
        //         pageNum: 1,
        //         pageSize: 100
        //     }, objCallBack);
        // }

        return () => {
            updateDataSetInfo('datasourceId-model');
        };
    }, []);

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
                type: e,
                dataType: 'TIME_SERIES',
            },
            pageNum: page.pageNum,
            pageSize: page.pageSize
        }, callBack);
    };

    useEffect(() => {
        handleChangeDataSourceType(dataSource.dataSourceType || 'FILE', {
            pageNum: 1,
            pageSize: 100
        });
    }, [dataSource.dataSourceType]);

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
                type: dataSourceType,
            },
            pageNum: dataSourcePage.pageNum + 1,
            pageSize: dataSourcePage.pageSize
        }, callback);
    };
    const modelCallBack = (page) => {
        setModelPage({
            pageNum: page.pageNum,
            pageSize: page.pageSize,
            total: page.totalSize
        });
        setLoading(false);
        setModelLoading(false);
    };

    const objCallBack = (page) => {
        setObjPage({
            pageNum: page.pageNum,
            pageSize: page.pageSize,
            total: page.totalSize
        });
        setLoading(false);
        setObjLoading(false);
    };
    const metricCallBack = (page) => {
        setMetricPage({
            pageNum: page.pageNum,
            pageSize: page.pageSize,
            total: page.totalSize
        });
        setLoading(false);
        setMetricLoading(false);
    };
    const onScrollModel = () => {
        if (modelList.length === modelPage.total) {
            return;
        }
        if (dataSourceId) {
            setLoading(true);
            if (dataSourceType === 'DODB') {
                getTaskModelAsync({
                    dataSourceId,
                    metricValue: [],
                    modelValue: [],
                    targetValue: []
                }, {
                    pageNum: dataSourcePage.pageNum + 1,
                    pageSize: dataSourcePage.pageSize
                }, modelCallBack, searchValue);
            } else {
                getModel(dataSourceId,
                    {pageNum: modelPage.pageNum + 1, pageSize: modelPage.pageSize},
                    modelCallBack, searchValue
                );
            }
        }
    };
    const onScrollObj = () => {
        if (objList.length === objPage.total) {
            return;
        }
        if (dataSourceId) {
            setLoading(true);
            if (dataSourceType === 'DODB') {
                getTaskTargetAsync({
                    dataSourceId,
                    metricValue: [],
                    modelValue: model,
                    targetValue: []
                }, {
                    pageNum: dataSourcePage.pageNum + 1,
                    pageSize: dataSourcePage.pageSize
                }, objCallBack, searchValue);
            } else {
                getObjList(
                    dataSourceId,
                    model || [],
                    {pageNum: objPage.pageNum + 1, pageSize: objPage.pageSize},
                    objCallBack, searchValue);
            }
        }
    };

    const onDropdownVisibleChange = (open, type) => {
        if (!open) {
            setLoading(false);
            setSearchValue(null);
            if (dataSourceId) {
                if (type && type === 'model') {
                    // delBlurModelList()
                    setModelPage({
                        pageNum: 1,
                        pageSize: 100,
                        total: 0
                    });
                    if (dataSourceType === 'FILE') {
                        getModel(dataSourceId, {
                            pageNum: 1,
                            pageSize: 100
                        }, modelCallBack);
                    } else {
                        getTaskModelAsync({
                            dataSourceId,
                            metricValue: [],
                            modelValue: [],
                            targetValue: []
                        }, {
                            pageNum: 1,
                            pageSize: 100
                        }, modelCallBack);
                    }
                }
                if (type && type === 'obj') {
                    // delBlurObjList()
                    setObjPage({
                        pageNum: 1,
                        pageSize: 100,
                        total: 0
                    });
                    if (dataSourceType === 'FILE') {
                        getObjList(dataSourceId,
                            model || [],
                            {pageNum: 1, pageSize: 100},
                            modelCallBack);
                    } else {
                        getTaskTargetAsync({
                            dataSourceId,
                            metricValue: [],
                            modelValue: model,
                            targetValue: []
                        }, {
                            pageNum: 1,
                            pageSize: 100
                        }, objCallBack);
                    }
                }
            }
        }
    };

    useEffect(() => {
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

    const onScrollMetric = () => {
        if (metricPage.total === metricList.length) {
            return;
        }
        if (dataSourceId) {
            setLoading(true);
            if (dataSourceType === 'DODB') {
                getTaskMetricAsync({
                        dataSourceId,
                        targetValue: obj,
                        modelValue: model,
                        metricValue: []
                    }, {
                        pageNum: metricPage.pageNum + 1,
                        pageSize: metricPage.pageSize
                    },
                    metricCallBack, searchValue
                );
            } else {
                getMetricList(
                    dataSourceId,
                    model || [],
                    obj || [],
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
                updateDataSetInfo('datasourceId-model');
                onClose();
            }}
            onOk={() => {
                validateFields((err, values) => {
                    if (!err) {
                        if (!ifError) {
                            const {metric, model, obj,} = values;
                            const dataSourceObj = (toJS(dataSourceList) || []).reduce((prev, cent) => {
                                return Object.assign({}, prev, {
                                    [cent.id]: cent,
                                });
                            }, {});
                            const params = {
                                dataSourceType: dataSourceType,
                                dataSourceId: dataSourceId,
                                dataSourceName: dataSourceObj[dataSourceId] ? dataSourceObj[dataSourceId].name : dataSource.dataSourceName,
                                relationshipType: dataSourceObj[dataSourceId] ? dataSourceObj[dataSourceId].dataType : dataSource.relationshipType,
                            };
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
                                const filtersConfig = {
                                    modelFilter: (!!model && model.length > 0) ? {
                                        key: 'model',
                                        compare: (!!model && model.length > 0) ? 'IN' : 'E',
                                        value: (!!model && model.length > 0) ? model : '',
                                    } : null,
                                    targetFilter: (!!obj && obj.length > 0) ? {
                                        key: 'target',
                                        compare: (!!obj && obj.length > 0) ? 'IN' : 'E',
                                        value: (!!obj && obj.length > 0) ? obj : '',
                                    } : null,
                                    metricAndTagFilters: [{
                                        metricFilter: (!!metric && metric.length > 0) ? {
                                            compare: (!!metric && metric.length > 0) ? 'IN' : 'E',
                                            value: (!!metric && metric.length > 0) ? metric : '',
                                        } : null,
                                        tagsFilter: (!!dimensionList && dimensionList.length > 0) ?
                                            dimensionList.filter(item => !!item.compare) : null
                                    }],
                                };
                                params['filtersConfig'] = filtersConfig;
                                onSave(params, editId, {
                                    cb: () => {
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
            className={[styles["edit-target-modal"], styles["edit-target-alert"], rootStyles["add-modal-target"]]}
        >
            <Form>
                <FormItem label={
                    <span className="requird-before">
                        {IntlFormatMessage('laboratory.list.datasource')}
                    </span>} {...labelLayout} className="noBottomBox">
                    <Row className="item-width-tighten">
                        <Col span={12}>
                            <FormItem className="need-margin-right">
                                {
                                    getFieldDecorator('dataSourceType', {
                                        initialValue: dataSource.dataSourceType || 'FILE',
                                        rules: [
                                            {
                                                required: true,
                                                message: IntlFormatMessage('datasource.select.datasourcetype')
                                            },
                                        ],
                                    })(
                                        <Select
                                            placeholder={IntlFormatMessage('laboratory.detail.selectdatasourcetype')}
                                            getPopupContainer={triggerNode => triggerNode.parentNode}
                                            style={{width: '100%'}}
                                            onChange={(value) => {
                                                setFieldsValue({
                                                    datasourceId: undefined,
                                                    model: undefined,
                                                    obj: undefined,
                                                    metric: undefined,
                                                });
                                                setDimensionList([{
                                                    id: guid(),
                                                    key: undefined,
                                                    compare: undefined,
                                                    value: undefined,
                                                }]);
                                                setDataSourcePage({
                                                    pageNum: 1,
                                                    pageSize: 100,
                                                    total: 0
                                                });
                                            }}
                                        >

                                            <Option value="FILE">{
                                                IntlFormatMessage('laboratory.detail.createofflinedata')
                                            }</Option>
                                            <Option value="DODB">{
                                                IntlFormatMessage('laboratory.detail.adddatasource')
                                            }</Option>
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem>
                                {
                                    getFieldDecorator('datasourceId', {
                                        initialValue: dataSource.dataSourceId || undefined,
                                        rules: [
                                            {
                                                required: true,
                                                message: IntlFormatMessage('task.create.selectdatasource')
                                            },
                                        ],
                                    })(
                                        <ScrollSelect
                                            placeholder={IntlFormatMessage('laboratory.detail.selectdatasource')}
                                            allowClear
                                            style={{width: '100%'}}
                                            showSearch
                                            scrollLoading={loading}
                                            loading={loading}
                                            // onDropdownVisibleChange={onDropdownVisibleChange}
                                            optionFilterProp='search'
                                            onPopupScroll={onScroll}
                                            getPopupContainer={triggerNode => triggerNode.parentNode}
                                            onChange={(e) => {
                                                setFieldsValue({
                                                    model: undefined,
                                                    obj: undefined,
                                                    metric: undefined,
                                                });
                                                setDimensionList([{
                                                    id: guid(),
                                                    key: undefined,
                                                    compare: undefined,
                                                    value: undefined,
                                                }]);
                                                // if (e) {
                                                //     if (!e) {
                                                //         return;
                                                //     }
                                                //     setModelLoading(true);
                                                //     setObjLoading(true);
                                                //     setMetricLoading(true);
                                                //     if (dataSourceType === 'FILE') {
                                                //         getModel(e, {
                                                //             pageNum: 1,
                                                //             pageSize: 100
                                                //         }, modelCallBack);
                                                //         getObjList(e, model || [], {
                                                //             pageNum: 1,
                                                //             pageSize: 100
                                                //         }, objCallBack);
                                                //         getMetricList(e, model || [], obj || [], {
                                                //             pageNum: 1,
                                                //             pageSize: 100
                                                //         }, metricCallBack);
                                                //         getTagsList(e, model || [], obj || [],{
                                                //             pageNum: 1,
                                                //             pageSize: 100
                                                //         }, tagsCallBack);
                                                //     } else if (dataSourceType === 'DODB') {
                                                //         const params = {
                                                //             dataSourceId: e,
                                                //             metricValue: [],
                                                //             modelValue: model || [],
                                                //             targetValue: obj || [],
                                                //         };
                                                //         //根因CH数据源是单独的接口
                                                //         getTaskModelAsync(params, {
                                                //             pageNum: 1,
                                                //             pageSize: 100
                                                //         }, modelCallBack);
                                                //         getTaskTargetAsync(params, {
                                                //             pageNum: 1,
                                                //             pageSize: 100
                                                //         }, objCallBack);
                                                //         getTaskMetricAsync(params, {
                                                //             pageNum: 1,
                                                //             pageSize: 100
                                                //         }, metricCallBack);
                                                //         getTaskTagsAsync(params, {
                                                //             pageNum: 1,
                                                //             pageSize: 100
                                                //         },tagsCallBack);
                                                //     }
                                                // }
                                            }}
                                            onFocus={e => {
                                                handleChangeDataSourceType(getFieldValue('dataSourceType'), {
                                                    pageNum: 1,
                                                    pageSize: 100
                                                });
                                            }}
                                        >
                                            {
                                                toJS(dataSourceList).map(item => {
                                                    let disable = false;
                                                    if (cannotSelectSource.includes(item.name) || item.isDeleted === 2) {
                                                        disable = true;
                                                    }
                                                    return <Option
                                                        value={item.id}
                                                        key={item.id}
                                                        search={item.name}
                                                        disabled={disable}
                                                    >
                                                        <Tooltip title={item.name}>{item.name}</Tooltip>
                                                    </Option>;
                                                })
                                            }
                                        </ScrollSelect>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label={IntlFormatMessage('laboratory.detail.model')} {...labelLayout}
                          className="noBottomBox">
                    <Row className="item-width-tighten">
                        <Col span={12}>
                            <FormItem className="need-margin-right">
                                {
                                    getFieldDecorator('model', {
                                        initialValue: modelFilter ? modelFilter.value : [],
                                        rules: [
                                            // { required: true, message: '请输入模型' },
                                            // checkoutChartName(),
                                        ],
                                    })(
                                        <ScrollSelect
                                            placeholder={IntlFormatMessage('laboratory.anomaly.allModels')}
                                            getPopupContainer={triggerNode => triggerNode.parentNode}
                                            style={{width: '100%'}}
                                            mode='multiple'
                                            filterOption={false}
                                            scrollLoading={loading}
                                            loading={modelLoading}
                                            onPopupScroll={onScrollModel}
                                            onSearch={(searchValue) => {
                                                setSearchValue(searchValue);
                                                setModelPage({
                                                    pageNum: 1,
                                                    pageSize: 100,
                                                    total: 0
                                                });
                                                if (dataSourceType === 'FILE') {
                                                    getModel(dataSourceId, {
                                                        pageNum: 1,
                                                        pageSize: 100
                                                    }, modelCallBack, searchValue);
                                                } else {
                                                    getTaskModelAsync({
                                                        dataSourceId,
                                                        metricValue: [],
                                                        modelValue: [],
                                                        targetValue: []
                                                    }, {
                                                        pageNum: 1,
                                                        pageSize: 100
                                                    }, modelCallBack, searchValue);
                                                }
                                            }}
                                            // optionFilterProp='search'
                                            // onDropdownVisibleChange={(e) => onDropdownVisibleChange(e, 'model')}
                                            onChange={(e) => {
                                                setFieldsValue({
                                                    obj: undefined,
                                                    metric: undefined,
                                                });
                                                setDimensionList([{
                                                    id: guid(),
                                                    key: undefined,
                                                    compare: undefined,
                                                    value: undefined,
                                                }]);
                                                // setObjLoading(true);
                                                // getListRoot('model', {dataSourceId, dataSourceType, value: e}, {
                                                //     pageNum: 1,
                                                //     pageSize: 100
                                                // }, objCallBack);
                                                setFieldsValue({
                                                    obj: undefined
                                                });
                                            }}
                                            onFocus={e => {
                                                if (getFieldValue('datasourceId')) {
                                                    if (getFieldValue('dataSourceType') === 'FILE') {
                                                        getModel(getFieldValue('datasourceId'), {
                                                            pageNum: 1,
                                                            pageSize: 100
                                                        }, modelCallBack);
                                                    } else {
                                                        const params = {
                                                            dataSourceId: getFieldValue('datasourceId'),
                                                        };
                                                        getTaskModelAsync(params, {
                                                            pageNum: 1,
                                                            pageSize: 100
                                                        }, modelCallBack);
                                                    }

                                                    // getListRoot('model', {dataSourceId, dataSourceType, value: targetFilter ? targetFilter.value : null}, {
                                                    //     pageNum: 1,
                                                    //     pageSize: 100
                                                    // }, objCallBack);
                                                }
                                            }}
                                        >
                                            {
                                                (toJS(modelList) || []).map(item => {
                                                    return <Option key={item} search={item}
                                                                   value={item}>{item}</Option>;
                                                })
                                            }
                                        </ScrollSelect>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem>
                                {
                                    getFieldDecorator('obj', {
                                        initialValue: targetFilter ? targetFilter.value : [],
                                        rules: [
                                            // { required: true, message: '请输入对象' },
                                            // checkoutChartName(),
                                        ],
                                    })(
                                        <ScrollSelect
                                            placeholder={IntlFormatMessage('laboratory.anomaly.allObjects')}
                                            style={{width: '100%'}}
                                            scrollLoading={loading}
                                            loading={objLoading}
                                            onPopupScroll={onScrollObj}
                                            filterOption={false}
                                            // onDropdownVisibleChange={(e) => onDropdownVisibleChange(e, 'obj')}
                                            getPopupContainer={triggerNode => triggerNode.parentNode}
                                            mode='multiple'
                                            onSearch={(searchValue) => {
                                                setSearchValue(searchValue);
                                                setObjPage({
                                                    pageNum: 1,
                                                    pageSize: 100,
                                                    total: 0
                                                });
                                                if (dataSourceType === 'FILE') {
                                                    getObjList(dataSourceId,
                                                        model || [],
                                                        {pageNum: 1, pageSize: 100},
                                                        modelCallBack,
                                                        searchValue);
                                                } else {
                                                    getTaskTargetAsync({
                                                        dataSourceId,
                                                        metricValue: [],
                                                        modelValue: model,
                                                        targetValue: []
                                                    }, {
                                                        pageNum: 1,
                                                        pageSize: 100
                                                    }, objCallBack, searchValue);
                                                }
                                            }}
                                            // optionFilterProp='search'
                                            onChange={(e) => {
                                                setFieldsValue({
                                                    metric: undefined,
                                                });
                                                setDimensionList([{
                                                    id: guid(),
                                                    key: undefined,
                                                    compare: undefined,
                                                    value: undefined,
                                                }]);
                                                // getListRoot('obj', {dataSourceId, value: e}, {
                                                //     pageNum: 1,
                                                //     pageSize: 100
                                                // }, metricCallBack);
                                            }}
                                            onFocus={e => {
                                                if (getFieldValue('datasourceId')) {
                                                    if (getFieldValue('dataSourceType') === 'FILE') {
                                                        getObjList(getFieldValue('datasourceId'), getFieldValue('model'), {
                                                            pageNum: 1,
                                                            pageSize: 100
                                                        }, objCallBack);
                                                    } else {
                                                        const params = {
                                                            dataSourceId: getFieldValue('datasourceId'),
                                                            modelValue: getFieldValue('model'),
                                                        };
                                                        getTaskTargetAsync(params, {
                                                            pageNum: 1,
                                                            pageSize: 100
                                                        }, objCallBack);
                                                    }
                                                }
                                            }}
                                        >
                                            {
                                                (toJS(objList) || []).map(item => {
                                                    return <Option key={item} search={item}
                                                                   value={item}>{item}</Option>;
                                                })
                                            }
                                        </ScrollSelect>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem
                    label={IntlFormatMessage('laboratory.detail.selmetric')}
                    className="item-width-tighten"
                    {...labelLayout}
                >
                    {getFieldDecorator('metric', {
                        initialValue: metricFilter ? metricFilter.value : undefined,
                        rules: [
                            {required: false, message: '请选择指标'},
                        ],
                    })(
                        <ScrollSelect
                            placeholder={IntlFormatMessage('laboratory.detail.selectmetric')}
                            // onDropdownVisibleChange={(open) => {
                            //     onDropdownVisibleChange(open);
                            //     if (!open) {
                            //         setSearchValue(null);
                            //         // delMetricList();
                            //         setMetricPage({
                            //             pageNum: 1,
                            //             pageSize: 100,
                            //             total: 0
                            //         });
                            //         if (dataSourceId) {
                            //             if (dataSourceType === 'FILE') {
                            //                 getMetricList(
                            //                     dataSourceId,
                            //                     model || [],
                            //                     obj || [],
                            //                     {
                            //                         pageNum: 1,
                            //                         pageSize: 100
                            //                     },
                            //                     metricCallBack,
                            //                 );
                            //             } else {
                            //                 getTaskMetricAsync({
                            //                         dataSourceId,
                            //                         targetValue: obj,
                            //                         modelValue: model,
                            //                         metricValue: []
                            //                     }, {
                            //                         pageNum: 1,
                            //                         pageSize: 100
                            //                     },
                            //                     metricCallBack
                            //                 );
                            //             }
                            //         }
                            //     }
                            // }}
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                            scrollLoading={loading}
                            loading={metricLoading}
                            filterOption={false}
                            onSearch={(searchValue) => {
                                setSearchValue(searchValue);
                                setMetricPage({
                                    pageNum: 1,
                                    pageSize: 100,
                                    total: 0
                                });
                                if (dataSourceId) {
                                    if (dataSourceType === 'FILE') {
                                        getMetricList(
                                            dataSourceId,
                                            model || [],
                                            obj || [],
                                            {
                                                pageNum: 1,
                                                pageSize: 100
                                            },
                                            metricCallBack,
                                            searchValue
                                        );
                                    } else {
                                        getTaskMetricAsync({
                                                dataSourceId,
                                                targetValue: obj,
                                                modelValue: model,
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
                                // getDimensionRoot({dataSourceType, dataSourceId, model, obj, value: e});
                                setDimensionList([{
                                    id: guid(),
                                    key: undefined,
                                    compare: undefined,
                                    value: undefined,
                                }]);
                            }}
                            onFocus={e => {
                                if (getFieldValue('datasourceId')) {
                                    if (getFieldValue('dataSourceType') === 'FILE') {
                                        getMetricList(
                                            getFieldValue('datasourceId'),
                                            getFieldValue('model') || [],
                                            getFieldValue('obj') || [],
                                            {
                                                pageNum: 1,
                                                pageSize: 100
                                            },
                                            metricCallBack,
                                        );
                                    } else {
                                        const params = {
                                            dataSourceId: getFieldValue('datasourceId'),
                                            modelValue: getFieldValue('model') || [],
                                            targetValue: getFieldValue('obj') || [],
                                        };
                                        getTaskMetricAsync(params, {
                                            pageNum: 1,
                                            pageSize: 100
                                        }, metricCallBack);
                                    }
                                }
                            }}
                            mode='multiple'
                        >
                            {
                                (toJS(metricList) || []).map(item => {
                                    return <Option
                                        key={item}
                                        value={item}
                                    >
                                        {item}
                                    </Option>;
                                })
                            }
                        </ScrollSelect>
                    )}
                </FormItem>
                <FormItem label={IntlFormatMessage('laboratory.detail.dimensionfilter')}
                          {...labelLayout} className="noBottomBox"
                >
                    {
                        (dimensionList || []).map((item, index) => {
                            return <div key={index} className="root-dimension-box">
                                <Row className="item-width-tighten">
                                    <Col span={8}>
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
                                                            dataSourceId: getFieldValue('datasourceId'),
                                                            dataSourceRelationId: (dataSetInfo.datasourceId) instanceof Object ? dataSetInfo.datasourceId.value : dataSetInfo.datasourceId,
                                                            scene,
                                                            nowDate,
                                                            taskType: 1,
                                                            filters: {
                                                                modelFilter: (getFieldValue('model')?.length && getFieldValue('model')[0]) ? {
                                                                    compare: getFieldValue('model').length > 1 ? 'IN' : 'E',
                                                                    value: getFieldValue('model').length > 1 ? getFieldValue('model') : getFieldValue('model')[0]
                                                                } : {},
                                                                targetFilter: (getFieldValue('obj')?.length && getFieldValue('obj')[0])? {
                                                                    compare: getFieldValue('obj').length > 1 ? 'IN' : 'E',
                                                                    value: getFieldValue('obj').length > 1 ? getFieldValue('obj') : getFieldValue('obj')[0]
                                                                } : {},
                                                                metricFilter: (getFieldValue('metric')?.length && getFieldValue('metric')[0]) ? {
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
                                                setLoading(true);
                                                getTagsKeysAsync(
                                                    {
                                                        pageNum: 1,
                                                        pageSize: 100,
                                                        query: {
                                                            dataSourceId: getFieldValue('datasourceId'),
                                                            dataSourceRelationId: (dataSetInfo.datasourceId) instanceof Object ? dataSetInfo.datasourceId.value : dataSetInfo.datasourceId,
                                                            scene,
                                                            nowDate,
                                                            taskType: 1,
                                                            filters: {
                                                                modelFilter: (getFieldValue('model')?.length && getFieldValue('model')[0]) ? {
                                                                    compare: getFieldValue('model').length > 1 ? 'IN' : 'E',
                                                                    value: getFieldValue('model').length > 1 ? getFieldValue('model') : getFieldValue('model')[0]
                                                                } : {},
                                                                targetFilter: (getFieldValue('obj')?.length && getFieldValue('obj')[0])? {
                                                                    compare: getFieldValue('obj').length > 1 ? 'IN' : 'E',
                                                                    value: getFieldValue('obj').length > 1 ? getFieldValue('obj') : getFieldValue('obj')[0]
                                                                } : {},
                                                                metricFilter: (getFieldValue('metric')?.length && getFieldValue('metric')[0]) ? {
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
                                    </Col>
                                    <Col span={8}>
                                        <Select
                                            allowClear
                                            style={{width: 'calc(100% - 8px)'}}
                                            getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                            placeholder={IntlFormatMessage('laboratory.detail.selecttype')}
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
                                                        {IntlFormatMessage(item.value)}
                                                    </Option>
                                                );
                                            })}
                                        </Select>
                                    </Col>
                                    <Col span={8}>
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
                                                    allowClear
                                                    value={item.value}
                                                    scrollLoading={loading}
                                                    loading={tagsLoading}
                                                    mode={['IN', 'NIN'].includes(item.compare) ? 'multiple' : ''}
                                                    optionFilterProp={'name'}
                                                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                                    placeholder={IntlFormatMessage('laboratory.detail.selectdimensionvalue')}
                                                    onChange={(value) => {
                                                        onTargetChange(value, 'value', item.id);
                                                    }}
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
                                                                    dataSourceId: getFieldValue('datasourceId'),
                                                                    dataSourceRelationId: (dataSetInfo.datasourceId) instanceof Object ? dataSetInfo.datasourceId.value : dataSetInfo.datasourceId,
                                                                    scene,
                                                                    nowDate,
                                                                    taskType: 1,
                                                                    filters: Object.assign({},filterParams,{
                                                                        metricTagsKey: item.key,
                                                                    })
                                                                }
                                                            },
                                                            tagsCallBack,
                                                        );
                                                    }}
                                                    onSearch={(searchValue) => {
                                                        if (item?.key && item?.key?.length) {
                                                            getTagsValueAsync(
                                                                {
                                                                    pageNum: 1,
                                                                    pageSize: 100,
                                                                    query: {
                                                                        dataSourceId: getFieldValue('datasourceId'),
                                                                        dataSourceRelationId: (dataSetInfo.datasourceId) instanceof Object ? dataSetInfo.datasourceId.value : dataSetInfo.datasourceId,
                                                                        scene,
                                                                        nowDate,
                                                                        taskType: 1,
                                                                        filters: Object.assign({},filterParams,{
                                                                            metricTagsKey: item.key,
                                                                            metricTagsValue:searchValue
                                                                        })
                                                                    }
                                                                },
                                                                tagsCallBack,
                                                            );
                                                        }
                                                    }}
                                                    onFocus={e => {
                                                        if (item?.key && item?.key?.length) {
                                                            getTagsValueAsync(
                                                                {
                                                                    pageNum: 1,
                                                                    pageSize: 100,
                                                                    query: {
                                                                        dataSourceId: getFieldValue('datasourceId'),
                                                                        dataSourceRelationId: (dataSetInfo.datasourceId) instanceof Object ? dataSetInfo.datasourceId.value : dataSetInfo.datasourceId,
                                                                        scene,
                                                                        nowDate,
                                                                        taskType: 1,
                                                                        filters: Object.assign({},filterParams,{
                                                                            metricTagsKey: item.key,
                                                                        })
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
                                                                {tag}
                                                            </Option>
                                                        );
                                                    })}
                                                </ScrollSelect>
                                        }
                                    </Col>
                                </Row>
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
                            </div>;
                        })
                    }
                    <Button
                        className='demension-button item-width-tighten'
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
                </FormItem>
            </Form>
        </Modal>
    );
};

export default connect(({laboratoryStore}) => {
    return {
        modelPage: laboratoryStore.modelPage,
        objPage: laboratoryStore.objPage,
        metricPage: laboratoryStore.metricPage,
        setObjPage: laboratoryStore.setObjPage,
        setModelPage: laboratoryStore.setModelPage,
        setMetricPage: laboratoryStore.setMetricPage,

        modelList: laboratoryStore.modelList,
        objList: laboratoryStore.objList,
        metricList: laboratoryStore.metricList,
        tagsList: laboratoryStore.tagsList,
        getModel: laboratoryStore.getModel,
        getListRoot: laboratoryStore.getListRoot,
        getObjList: laboratoryStore.getObjList,
        getMetricList: laboratoryStore.getMetricList,
        getTagsList: laboratoryStore.getTagsList,
        getDimensionRoot: laboratoryStore.getDimensionRoot,

        getTaskTargetAsync: laboratoryStore.getTaskTargetAsync,
        getTaskModelAsync: laboratoryStore.getTaskModelAsync,
        getTaskMetricAsync: laboratoryStore.getTaskMetricAsync,
        getTaskTagsAsync: laboratoryStore.getTaskTagsAsync,

        getDataSourceList: laboratoryStore.getDataSourceList,
        setDataSourcePage: laboratoryStore.setDataSourcePage,
        dataSourcePage: laboratoryStore.dataSourcePage,
        dataSourceList: laboratoryStore.dataSourceList,
        dimensionalList: laboratoryStore.dimensionalList,
        updateDataSetInfo: laboratoryStore.updateDataSetInfo,
        getTagsKeysAsync: laboratoryStore.getTagsKeysAsync,
        getTagsValueAsync: laboratoryStore.getTagsValueAsync,
        tagsValueList: laboratoryStore.tagsValueList,
        dataSetInfo: laboratoryStore.dataSetInfo,

    };
})(Form.create()(EditTargetAlert));