import React, {Fragment, useEffect} from 'react';
import {Form, Input, Select} from '@chaoswise/ui';
import CreateTag from '../KafkaSource/CreateTag';
import {connect, toJS} from '@chaoswise/cw-mobx';
import {IntlFormatMessage} from "@/utils/util";
import {useHistory} from "react-router";

const {Item} = Form;
const {TextArea} = Input;
const formLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 15}
};

function checkoutChartName() {
    return {
        pattern: /^.{1,200}$/,
        message: IntlFormatMessage('laboratory.anomaly.charactersMaximum')
    };
}

const formatType = {
    'outline': 'DODB',
    'iotdb': 'IOTDB'
};

function BasicInfo(props) {
    const {
        form,
        handleNext,
        updateOffBasicInfo,
        getTagsInfo,
        tags,
        offBasicData,
        basicInfoAddTage
    } = props;
    let offBasicInfo = toJS(offBasicData);
    const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched, getFieldsValue, setFieldsValue} = form;

    const {push, go, location} = useHistory();
    const {pathname = ""} = location;

    useEffect(() => {
        const type = pathname.slice(pathname.indexOf('type') + 5);
        updateOffBasicInfo('type', formatType[type]);
        //请求标签下拉框信息
        getTagsInfo();
    }, []);

    const addTag = (tagsValue, callback) => {
        basicInfoAddTage(tagsValue, {
            cb: (id) => {
                callback();
                setFieldsValue({
                    dataSourceTags: offBasicData.dataSourceTags.concat(id)
                });
                updateOffBasicInfo('dataSourceTags', offBasicData.dataSourceTags.concat(id));
            }
        });
    };

    const handleNextStep = () => {
        form.validateFields((err, values) => {
            if (!err) {
                updateOffBasicInfo(values);
                handleNext();
            }
        });
    };
    return (
        <Fragment>
            <Item label={IntlFormatMessage('datasource.list.name')}
                  {...formLayout}>
                {
                    getFieldDecorator('dataSourceName', {
                        initialValue: offBasicInfo.dataSourceName || undefined,
                        rules: [
                            {required: true, message: IntlFormatMessage('datasource.searchby.datasourcename')},
                            checkoutChartName(),
                        ],
                    })(
                        <Input
                            onChange={(e) => updateOffBasicInfo('dataSourceName', e.target.value)}
                            placeholder={IntlFormatMessage('datasource.searchby.datasourcename')}
                            className="item-width-tighten"
                        />
                    )
                }
            </Item>
            <Item label={IntlFormatMessage('datasource.create.tag')}
                  {...formLayout}>
                {
                    getFieldDecorator('dataSourceTags', {
                        initialValue: offBasicInfo.dataSourceTags || []
                    })(
                        <Select
                            mode="multiple"
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                            onChange={(value) => updateOffBasicInfo('dataSourceTags', value)}
                            placeholder={IntlFormatMessage('datasource.create.entertag')}
                            className="item-width-tighten"
                            optionFilterProp='search'
                        >
                            {
                                tags.map(item => {
                                    return <Select.Option key={item.id} search={item.value}
                                                          value={item.id}>{item.name}</Select.Option>;
                                })
                            }
                        </Select>
                    )
                }
                <CreateTag addTags={addTag}/>
            </Item>
            <Item label={IntlFormatMessage('datasource.detail.description')}
                  {...formLayout}>
                {
                    getFieldDecorator('dataSourceDes', {
                        initialValue: offBasicInfo.dataSourceDes || undefined,
                        rules: [
                            {
                                max: 200,
                                message: IntlFormatMessage('laboratory.anomaly.charactersMaximumTwo'),
                            },
                        ],
                    })(
                        <TextArea
                            autoSize={{minRows: 4}}
                            onChange={(e) => updateOffBasicInfo('dataSourceDes', e.target.value)}
                            placeholder={IntlFormatMessage('datasource.create.enterdescription')}
                            className="item-width-tighten"
                        />
                    )
                }
            </Item>
        </Fragment>
    );
}

export default connect(({dataSourceStore, store}) => {
    return {
        basicData: dataSourceStore.basicData,
        updateOffBasicInfo: dataSourceStore.updateOffBasicInfo,
        getTagsInfo: dataSourceStore.getTagsInfo,
        tags: dataSourceStore.tags,
        offBasicData: dataSourceStore.offBasicData,
        basicInfoAddTage: dataSourceStore.basicInfoAddTage
    };
})(BasicInfo);
