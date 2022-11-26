import React, { Fragment, useEffect } from 'react';
import { Form, Input, Button, Select, BasicLayout } from '@chaoswise/ui';
import CreateTag from './CreateTag';
import { connect, toJS } from '@chaoswise/cw-mobx';
import {IntlFormatMessage} from "@/utils/util";

const { Item } = Form;
const { TextArea } = Input;
const Footer = BasicLayout.Footer;
const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 15 }
};
function checkoutChartName() {
    return {
        pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]{0,30}$/,
        message: '仅支持中英文名称，不超过30个字符'
    };
}

function BasicInfo(props) {
    const {
        form,
        handleNext,
        basicData,
        updateBasicInfo,
        getTagsInfo,
        tags,
    } = props;

    let basicInfo = toJS(basicData);
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched, getFieldsValue } = form;

    useEffect(() => {
        //获取标签信息
        getTagsInfo();
    }, []);

    const handleNextStep = () => {
        form.validateFields((err, values) => {
            if (!err) {
                updateBasicInfo(values);
                handleNext();
            }
        });

    };
    return (
        <Fragment>
            <Item label='来源' {...formLayout}>
                <div>Kafka数据源</div>
            </Item>
            <Item label='数据源名称' {...formLayout}>
                {
                    getFieldDecorator('dataSourceName', {
                        initialValue: basicInfo.dataSourceName || undefined,
                        rules: [
                            { required: true, message: IntlFormatMessage('datasource.searchby.datasourcename')},
                            checkoutChartName(),
                        ],
                    })(
                        <Input
                            placeholder={IntlFormatMessage('datasource.searchby.datasourcename')}
                            onChange={(e)=>updateBasicInfo('dataSourceName',e.target.value)}
                            className="item-width-tighten"
                        />
                    )
                }
            </Item>
            <Item label='新建标签' {...formLayout}>
                {
                    getFieldDecorator('dataSourceTags', {
                        initialValue: basicInfo.dataSourceTags || []
                    })(
                        <Select
                            mode="multiple"
                            className="item-width-tighten"
                            optionFilterProp='search'
                            placeholder={IntlFormatMessage('datasource.create.entertag')}
                            onChange={(value)=>updateBasicInfo('dataSourceTags',value)}

                        >
                            {
                                tags.map(item => {
                                    return <Select.Option key={item.id} search={item.name} value={item.id}>{item.name}</Select.Option>;
                                })
                            }
                        </Select>
                    )
                }
                <CreateTag/>
            </Item>
            <Item label={IntlFormatMessage('datasource.detail.description')} {...formLayout}>
                {
                    getFieldDecorator('dataSourceDes', {
                        initialValue: basicInfo.dataSourceDes || undefined
                    })(
                        <TextArea
                            autoSize={{minRows: 4}}
                            placeholder='请输入'
                            onChange={(value)=>updateBasicInfo('dataSourceDes',value.target.value)}
                            className="item-width-tighten"
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
        tags: dataSourceStore.tags
    };
})(BasicInfo);
