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
        dataInfo,
        sourceSchemaConf,
        updateOffFiledInfo, updateAddList,
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
        const {
            dataType = '',
            sourceConfig = {},
            fieldConfigDisplay = {}
        } = dataInfo;
        const {extendFields = []} = fieldConfigDisplay;
        updateAddList(extendFields.map(item => Object.assign({}, item, {id: guid(),})));

        setTimeout(() => {
            setFieldsValue({
                type: dataType,
                chart: sourceConfig.fileName,
                fromModel: fieldConfigDisplay.fromModel,
                fromTarget: fieldConfigDisplay.fromTarget,
                toModel: fieldConfigDisplay.toModel,
                toTarget: fieldConfigDisplay.toTarget,
                relationship: fieldConfigDisplay.relationship,
            });
        });
    }, [dataInfo, id]);


    const renderOption = () => {
        const {type = '', chart = '', ...rest} = getFieldsValue();
        return Object.values(rest || {}).filter(item => !!item) || [];
    };

    return (
        <Fragment>
            {/*<Item label={IntlFormatMessage('datasource.create.tabletype')}*/}
            {/*      {...formLayout}>*/}
            {/*    <Row>*/}
            {/*        <Col span={12}>*/}
            {/*            <Item>*/}
            {/*                {*/}
            {/*                    getFieldDecorator('type', {*/}
            {/*                        // initialValue: 'TIME_SERIES',*/}
            {/*                        rules: [*/}
            {/*                            {required: true, message: '请选择数据表类型'},*/}
            {/*                        ],*/}
            {/*                    })(*/}
            {/*                        <Select*/}
            {/*                            disabled*/}
            {/*                            placeholder={IntlFormatMessage('datasource.create.selecttimecolumn')}*/}
            {/*                            className="item-width-tighten"*/}
            {/*                        >*/}
            {/*                            {*/}
            {/*                                [{*/}
            {/*                                    key: 'TIME_SERIES',*/}
            {/*                                    id: 'datasource.create.datatable.type'*/}
            {/*                                }, {*/}
            {/*                                    key: 'NODE_RELATION',*/}
            {/*                                    id: 'datasource.detail.relationaldatasource'*/}
            {/*                                }, {*/}
            {/*                                    key: 'LOG',*/}
            {/*                                    id: 'datasource.detail.logparsing'*/}
            {/*                                }].map((item, index) => {*/}
            {/*                                    return <Option*/}
            {/*                                        value={item.key}*/}
            {/*                                        key={`${index}${item.key}`}*/}
            {/*                                    >*/}
            {/*                                        {IntlFormatMessage(item.id)}*/}
            {/*                                    </Option>;*/}
            {/*                                })*/}
            {/*                            }*/}
            {/*                        </Select>*/}
            {/*                    )*/}
            {/*                }*/}
            {/*            </Item>*/}
            {/*        </Col>*/}
            {/*        <Col span={12}>*/}
            {/*            <Item>*/}
            {/*                {*/}
            {/*                    getFieldDecorator('chart', {*/}
            {/*                        // initialValue: offFiledSetData.chart || undefined,*/}
            {/*                        rules: [*/}
            {/*                            {required: true, message: '请选择数据表'},*/}
            {/*                        ],*/}
            {/*                    })(*/}
            {/*                        <Input*/}
            {/*                            disabled*/}
            {/*                        />*/}
            {/*                    )*/}
            {/*                }*/}
            {/*            </Item>*/}
            {/*        </Col>*/}
            {/*    </Row>*/}
            {/*</Item>*/}
            <Item label={IntlFormatMessage('datasource.detail.fieldsettings')} {...formLayout}>
                <EditTable
                    updateOffFiledInfo={updateOffFiledInfo}
                    fieldDescs={fieldDescs}
                    renderOption={renderOption}
                    form={form}
                    csvFile
                    disabled
                />
            </Item>
        </Fragment>
    );
}


export default connect(({store, dataSourceStore}) => {
    return {
        getDodbDataList: dataSourceStore.getDodbDataList,
        dodbList: dataSourceStore.dodbList,
        getSchemList: dataSourceStore.getSchemList,
        offFiledSetData: dataSourceStore.offFiledSetData,
        sourceSchemaConf: dataSourceStore.sourceSchemaConf,
        updateOffFiledInfo: dataSourceStore.updateOffFiledInfo,
        updateSourceSchemaConf: dataSourceStore.updateSourceSchemaConf,
        updateAddList: dataSourceStore.updateAddList,
    };
})(LinkInfo);