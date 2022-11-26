import React, { Fragment, useEffect } from 'react';
import { Form, Input, Button, Select, BasicLayout } from '@chaoswise/ui';
import CreateTag from './CreateTag';
import { connect, toJS } from '@chaoswise/cw-mobx';
import {IntlFormatMessage} from "@/utils/util";


const { Item } = Form;
const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 15 }
};

function FiledSet(props) {

    const {
        form,
        updateFiledSetInfo,
        filedSetData
    } = props;

    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched, getFieldsValue } = form;


    return (
        <Fragment>
            <Item label={IntlFormatMessage('datasource.create.model')}
                  {...formLayout}>
                {
                    getFieldDecorator('model', {
                        initialValue: filedSetData.model || undefined,
                        rules: [
                            // { required: true, message: '请输入数据源名称' },
                        ],
                    })(
                        <Input
                            placeholder='请输入模型表字名称，如merdh_hagd'
                            onChange={(e)=>updateFiledSetInfo('model',e.target.value)}
                        />
                    )
                }
            </Item>
            <Item label='对象名称' {...formLayout}>
                {
                    getFieldDecorator('objName', {
                        initialValue: filedSetData.objName || undefined,
                        rules: [
                            // { required: true, message: '请输入数据源名称' },
                        ],
                    })(
                        <Input
                            placeholder='请输入对象名称，如merdh_hagd'
                            onChange={(e)=>updateFiledSetInfo('objName',e.target.value)}
                            
                        />
                    )
                }
            </Item>
            <Item label='指标名称' {...formLayout}>
                {
                    getFieldDecorator('targetName', {
                        initialValue: filedSetData.targetName || undefined,
                        rules: [
                            // { required: true, message: '请输入数据源名称' },
                        ],
                    })(
                        <Input
                            onChange={(e)=>updateFiledSetInfo('targetName',e.target.value)}
                            placeholder='请输入指标名称，如merdh_hagd'
                        />
                    )
                }
            </Item>
            <Item label={IntlFormatMessage('laboratory.anomaly.timeBtn')} {...formLayout}>
                {
                    getFieldDecorator('time', {
                        initialValue: filedSetData.time || undefined,
                        rules: [
                            { required: true, message: '请输入指标的时间戳，如time' },
                        ],
                    })(
                        <Input
                            onChange={(e)=>updateFiledSetInfo('time',e.target.value)}
                            placeholder='请输入指标的时间戳，如time'
                        />
                    )
                }
            </Item>
            <Item label='指标值' {...formLayout}>
                {
                    getFieldDecorator('targetValue', {
                        initialValue: filedSetData.targetValue || undefined,
                        rules: [
                            { required: true, message: '请输入指标值，如merdh' },
                        ],
                    })(
                        <Input
                            onChange={(e)=>updateFiledSetInfo('targetValue',e.target.value)}
                            placeholder='请输入指标值，如merdh'
                        />
                    )
                }
            </Item>
            <Item label='维度' {...formLayout}>
                {
                    getFieldDecorator('dimension', {
                        initialValue: filedSetData.dimension || undefined,
                        rules: [
                            // { required: true, message: '请输入数据源名称' },
                        ],
                    })(
                        <Input
                            onChange={(e)=>updateFiledSetInfo('dimension',e.target.value)}
                            placeholder='请输入维度，如merdh_hagd'
                        />
                    )
                }
            </Item>
        </Fragment>
    );
}

export default connect(({ dataSourceStore, store }) => {
    return {
        basicData: dataSourceStore.basicData,
        updateBasicInfo: dataSourceStore.updateBasicInfo,
        getTagsInfo: dataSourceStore.getTagsInfo,
        tags: dataSourceStore.tags,
        updateFiledSetInfo: dataSourceStore.updateFiledSetInfo,
        filedSetData: dataSourceStore.filedSetData
    };
})(FiledSet);
