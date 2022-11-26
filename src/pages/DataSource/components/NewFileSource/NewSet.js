import React, {Fragment, useEffect,} from 'react';
import {Form, Input, Button, Select, Tooltip, Icon, Radio, Spin} from '@chaoswise/ui';
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
    labelCol: {span: 5},
    wrapperCol: {span: 16}
};

const NewSet = (props) => {
    const {
        form,
        updateOffFiledInfo,
        offFiledSetData,
        getSchemListByTableType,
        updateSourceSchemaConf,
        sourceSchemaConf = {},
        csvSelectList = [],
    } = props;
    const {getFieldDecorator, setFieldsValue, getFieldError, isFieldTouched, getFieldsValue} = form;
    const {pageInfo = {}} = offFiledSetData;
    const {schemaConf = {}} = sourceSchemaConf;
    const {fieldDescs = []} = schemaConf;

    useEffect(() => {
        getSchemListByTableType(offFiledSetData.type, {
            cb: (res) => {
                updateSourceSchemaConf(res.data);
            }
        });
    }, []);

    const renderOption = () => {
        const {type = '', chart = '', ...rest} = getFieldsValue();
        return Object.values(rest || {}).filter(item => !!item) || [];
    };

    return (
        <Fragment>
            <Item label={IntlFormatMessage('datasource.detail.fieldsettings')} {...formLayout}>
                <EditTable
                    updateOffFiledInfo={updateOffFiledInfo}
                    fieldDescs={csvSelectList}
                    renderOption={renderOption}
                    form={form}
                    csvFile
                />
            </Item>
        </Fragment>
    );
};

export default connect(({dataSourceStore, store}) => {
    return {
        updateOffFiledInfo: dataSourceStore.updateOffFiledInfo,
        offFiledSetData: dataSourceStore.offFiledSetData,
        getSchemListByTableType: dataSourceStore.getSchemListByTableType,
        updateSourceSchemaConf: dataSourceStore.updateSourceSchemaConf,
        sourceSchemaConf: dataSourceStore.sourceSchemaConf,
    };
})(NewSet);