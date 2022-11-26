import React, {Fragment, useEffect,} from 'react';
import {Form, Input, Button, Select, Tooltip, Icon, Radio, Spin, Row, Col,} from '@chaoswise/ui';
import {connect, toJS} from '@chaoswise/cw-mobx';
import styles from './index.less';
import ScrollSelect from '@/components/ScrollSelect/index';
import IconTooltip from "@/components/IconTooltip";
import {useFetchState} from "@/components/HooksState";
import {IntlFormatMessage} from "@/utils/util";
import EditTable from "@/components/EditTable";

const {Item} = Form;
const {Option} = Select;
const formLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 15}
};

function FiledSet(props) {

    const {
        form,
        updateOffFiledInfo,
        offFiledSetData,
        getDodbDataList,
        dodbList,
        sourceSchemaConf = {},
        setOpen,
        getSchemList,
        updateSourceSchemaConf, updateAddList,
    } = props;

    const {getFieldDecorator, setFieldsValue, getFieldError, isFieldTouched, getFieldsValue} = form;
    const {pageInfo = {}} = offFiledSetData;

    const {schemaConf = {}} = sourceSchemaConf;
    const [loading, setLoading] = useFetchState(false);
    const [searchValue, setSearchValue] = useFetchState(null);

    const {fieldDescs = []} = schemaConf;
    const callBack = () => {
        setLoading(false);
    };

    useEffect(() => {
        setLoading(true);
        getDodbDataList({
            pageNum: 1,
            pageSize: 50,
            query: {
                dataStoreName: null,
            }
        }, callBack);
    }, []);

    useEffect(() => {
        if (offFiledSetData.chart) {
            getSchemList(offFiledSetData.chart.value, {
                cb: (res) => {
                    updateSourceSchemaConf(res.data);
                }
            });
        }
    }, [offFiledSetData.chart]);

    const onScroll = (e) => {
        if (dodbList.length === pageInfo.total) {
            return;
        }
        setLoading(true);
        getDodbDataList({
            pageNum: pageInfo.pageNum,
            pageSize: pageInfo.pageSize,
            query: {
                dataStoreName: null,
            }
        }, callBack, searchValue);
    };
    const onDropdownVisibleChange = (open) => {
        // setOpen(open);
        if (!open) {
            setLoading(false);
            setSearchValue(null);
        }
    };

    const renderOption = () => {
        const {type = '', chart = '', ...rest} = getFieldsValue();
        return Object.values(rest || {}).filter(item => !!item) || [];
    };

    const AllClear = () => {
        if (offFiledSetData.type === 'NODE_RELATION') {
            updateOffFiledInfo('fromModel', undefined);
            updateOffFiledInfo('value', undefined);
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
            'value':undefined,
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
                                        onChange={(e) => {
                                            updateOffFiledInfo('type', e);
                                            updateOffFiledInfo('chart', undefined);
                                            setFieldsValue({chart: undefined});
                                            AllClear();
                                        }}
                                        placeholder={IntlFormatMessage('datasource.create.selecttimecolumn')}
                                        className="item-width-tighten"
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
                                            },].map((item, index) => {
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
                {/*<div className={styles['offline-radio']}>*/}
                {/*    {IntlFormatMessage('datasource.create.typeDescription')}*/}
                {/*</div>*/}
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

export default connect(({dataSourceStore, store}) => {
    return {
        basicData: dataSourceStore.basicData,
        updateBasicInfo: dataSourceStore.updateBasicInfo,
        getTagsInfo: dataSourceStore.getTagsInfo,
        tags: dataSourceStore.tags,
        updateFiledSetInfo: dataSourceStore.updateFiledSetInfo,
        updateOffFiledInfo: dataSourceStore.updateOffFiledInfo,
        offFiledSetData: dataSourceStore.offFiledSetData,
        getDodbDataList: dataSourceStore.getDodbDataList,
        dodbList: dataSourceStore.dodbList,
        sourceSchemaConf: dataSourceStore.sourceSchemaConf,
        getSchemList: dataSourceStore.getSchemList,
        updateAddList: dataSourceStore.updateAddList,
        updateSourceSchemaConf: dataSourceStore.updateSourceSchemaConf
    };
})(FiledSet);
