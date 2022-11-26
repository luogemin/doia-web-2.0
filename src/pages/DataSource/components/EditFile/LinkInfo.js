import React, {useEffect, Fragment} from 'react';
import {connect, toJS} from '@chaoswise/cw-mobx';
import {Form, Input, Radio, Select, Tooltip, Row, Col,} from '@chaoswise/ui';
import styles from './index.less';
import ScrollSelect from '@/components/ScrollSelect/index';
import IconTooltip from "@/components/IconTooltip";
import {useFetchState} from "@/components/HooksState";
import {guid, IntlFormatMessage} from "@/utils/util";
import EditTable from "@/components/EditTable";

const {Item} = Form;
const formLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 12}
};
const {Option} = Select;

function checkoutChartName() {
    return {
        pattern: /^.{0,200}$/,
        message: IntlFormatMessage('laboratory.anomaly.charactersMaximum')
    };
}

function LinkInfo(props) {
    const {
        id,
        form,
        getDodbDataList,
        dodbList = [],
        dataInfo,
        type,
        getSchemList,
        offFiledSetData,
        sourceSchemaConf,
        updateOffFiledInfo,
        updateSourceSchemaConf, updateAddList,
    } = props;
    const {getFieldDecorator, setFieldsValue, getFieldValue, setFields, getFieldsValue} = form;
    const [fieldDescs, setFieldDescs] = useFetchState([]);
    const [pageInfo, setPageInfo] = useFetchState({
        pageNum: 1,
        pageSize: 100,
        total: 0
    });
    const [loading, setLoading] = useFetchState(false);
    const [searchValue, setSearchValue] = useFetchState(null);

    useEffect(() => {
        if (type === 'DODB') {
            const {
                dataType = '',
                sourceConfig = {},
                fieldConfig = {}
            } = dataInfo;
            const {extendFields = []} = fieldConfig;
            updateAddList(extendFields.map(item => Object.assign({}, item, {id: guid(),})));

            setTimeout(() => {
                setFieldsValue({
                    type: dataType,
                    chart: {
                        value: ((!!sourceConfig.dataStoreId || sourceConfig.dataStoreId === 0) ?
                            sourceConfig.dataStoreId : sourceConfig.dataSourceId),
                        label: (sourceConfig.dataStoreName || sourceConfig.tableName)
                    },
                    model: fieldConfig.model,
                    time: fieldConfig.time,
                    target: fieldConfig.target,
                    metric: fieldConfig.metric,
                    tags: fieldConfig.tags,
                    value: fieldConfig.value
                });
            });
        }
    }, [dataInfo, id]);
    useEffect(() => {
        const id = getFieldValue('chart');
        if (id) {
            getSchemList(id.value, {
                cb: (data) => {
                    const {schemaConf = {}} = data.data || {};
                    const {fieldDescs = []} = schemaConf;
                    setFieldDescs(fieldDescs);
                    updateSourceSchemaConf(data.data);
                }
            });
        }
    }, [getFieldValue('chart')]);
    useEffect(() => {
        setLoading(true);
        getDodbDataList({
            pageNum: 1,
            pageSize: 50
        }, callBack);
    }, []);
    const callBack = (resp) => {
        setLoading(false);
        setPageInfo({
            ...pageInfo,
            total: resp.totalCount
        });
    };
    const renderOption = () => {
        const {type = '', chart = '', ...rest} = getFieldsValue();
        return Object.values(rest || {}).filter(item => !!item) || [];
    };

    const onScroll = (e) => {
        if (dodbList.length === pageInfo.total) {
            return;
        }
        setLoading(true);
        getDodbDataList({
            pageNum: pageInfo.pageNum + 1,
            pageSize: pageInfo.pageSize,
        }, callBack, searchValue);
    };
    const onDropdownVisibleChange = (open) => {
        if (!open) {
            setLoading(false);
            setSearchValue(null);
        }
    };

    const AllClear = () => {
        if (offFiledSetData.type === 'NODE_RELATION') {
            updateOffFiledInfo('fromModel', undefined);
            updateOffFiledInfo('fromTarget', undefined);
            updateOffFiledInfo('toModel', undefined);
            updateOffFiledInfo('toTarget', undefined);
            updateOffFiledInfo('relationship', undefined);
        } else if (offFiledSetData.type === 'TIME_SERIES') {
            updateOffFiledInfo('time', undefined);
            updateOffFiledInfo('value', undefined);
            updateOffFiledInfo('model', undefined);
            updateOffFiledInfo('target', undefined);
            updateOffFiledInfo('metric', undefined);
            updateOffFiledInfo('tags', undefined);
        } else {
            updateOffFiledInfo('time', undefined);
            updateOffFiledInfo('originLog', undefined);
            updateOffFiledInfo('message', undefined);
            updateOffFiledInfo('grok', undefined);
            updateOffFiledInfo('host', undefined);
            updateOffFiledInfo('loglevel', undefined);
            updateOffFiledInfo('source', undefined);
            updateOffFiledInfo('extendFields', []);
        }
        setFieldsValue({
            'time': undefined,
            'value': undefined,
            'originLog': undefined,
            'message': undefined,
            'grok': undefined,
            'host': undefined,
            'loglevel': undefined,
            'source': undefined,
            'extendFields': [],

            'targetValue': undefined,
            'model': undefined,
            'target': undefined,
            'metric': undefined,
            'tags': undefined,

            'fromModel': undefined,
            'fromTarget': undefined,
            'toModel': undefined,
            'toTarget': undefined,
            'relationship': undefined,
        });
        updateAddList([]);
    };

    return (
        <Fragment>
            <Item label={IntlFormatMessage('datasource.create.tabletype')}
                  {...formLayout}>
                <Row>
                    <Col span={12}>
                        <Item>
                            {
                                getFieldDecorator('type', {
                                    initialValue: offFiledSetData.type || 'TIME_SERIES',
                                    rules: [
                                        {required: true, message: '请选择数据表类型'},
                                    ],
                                })(
                                    <Select
                                        placeholder={IntlFormatMessage('datasource.create.selecttimecolumn')}
                                        className="item-width-tighten"
                                        onChange={(e) => {
                                            updateOffFiledInfo('type', e);
                                            updateOffFiledInfo('chart', undefined);
                                            setFieldsValue({chart: undefined});
                                            AllClear();
                                        }}
                                    >
                                        {
                                            [{
                                                key: 'TIME_SERIES',
                                                id: 'datasource.create.datatable.type'
                                            }, {
                                                key: 'NODE_RELATION',
                                                id: 'datasource.detail.relationaldatasource'
                                            }, {
                                                key: 'LOG',
                                                id: 'datasource.detail.logparsing'
                                            }].map((item, index) => {
                                                return <Option
                                                    value={item.key}
                                                    key={`${index}${item.key}`}
                                                >
                                                    {IntlFormatMessage(item.id)}
                                                </Option>;
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </Item>
                    </Col>
                    <Col span={12}>
                        <Item>
                            {
                                getFieldDecorator('chart', {
                                    initialValue: offFiledSetData.chart || undefined,
                                    rules: [
                                        {required: true, message: IntlFormatMessage('datasource.create.selectdatatable')},
                                    ],
                                })(
                                    <ScrollSelect
                                        placeholder={IntlFormatMessage('datasource.create.selectdatatable')}
                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                        showSearch
                                        className="item-width-tighten"
                                        labelInValue={true}
                                        // optionFilterProp='search'
                                        filterOption={false}
                                        onPopupScroll={onScroll}
                                        scrollLoading={loading}
                                        loading={loading}
                                        onDropdownVisibleChange={onDropdownVisibleChange}
                                        onChange={(value) => {
                                            updateOffFiledInfo('chart', value);
                                            AllClear();
                                        }}
                                        onSearch={(searchValue) => {
                                            setSearchValue(searchValue);
                                            updateOffFiledInfo('pageInfo', {
                                                pageNum: 1,
                                                pageSize: 50,
                                                total: 0
                                            });
                                            getDodbDataList({
                                                pageNum: 1,
                                                pageSize: 50,
                                                query: {
                                                    dataStoreName: searchValue,
                                                }
                                            }, callBack, searchValue);
                                        }}
                                        onBlur={() => {
                                            updateOffFiledInfo('pageInfo', {
                                                pageNum: 1,
                                                pageSize: 50,
                                                total: 0
                                            });
                                            getDodbDataList({
                                                pageNum: 1,
                                                pageSize: 50,
                                                query: {
                                                    dataStoreName: null,
                                                }
                                            }, callBack);
                                        }}
                                        style={{width: '100%'}}
                                    >
                                        {
                                            (dodbList || []).map(item => {
                                                return <Option value={item.id} search={item.name} key={item.id}>
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
            <Item label={IntlFormatMessage('datasource.detail.fieldsettings')} {...formLayout}>
                <EditTable
                    updateOffFiledInfo={updateOffFiledInfo}
                    fieldDescs={fieldDescs}
                    renderOption={renderOption}
                    form={form}
                />
            </Item>
        </Fragment>
    );
}


export default connect(({store, dataSourceStore}) => {
    return {
        getDodbDataList: dataSourceStore.getDodbDataList,
        dodbList: dataSourceStore.dodbList,
        type: dataSourceStore.type,
        getSchemList: dataSourceStore.getSchemList,
        offFiledSetData: dataSourceStore.offFiledSetData,
        sourceSchemaConf: dataSourceStore.sourceSchemaConf,
        updateOffFiledInfo: dataSourceStore.updateOffFiledInfo,
        updateSourceSchemaConf: dataSourceStore.updateSourceSchemaConf,
        updateAddList: dataSourceStore.updateAddList,
    };
})(LinkInfo);