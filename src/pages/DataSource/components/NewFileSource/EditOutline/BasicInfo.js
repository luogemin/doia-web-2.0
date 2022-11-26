import React, {useEffect, Fragment} from 'react';
import {Form, Select, Input, Col, Upload, Button, BasicLayout} from '@chaoswise/ui';
import {connect, toJS} from '@chaoswise/cw-mobx';
import CreateTag from '../../KafkaSource/CreateTag';
import {call} from '@/utils/effects';
import {useFetchState} from "@/components/HooksState";
import {IntlFormatMessage} from "@/utils/util";


const {TextArea} = Input;
const Footer = BasicLayout.Footer;
const {Item} = Form;
const formLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 15}
};

function checkoutChartName() {
    return {
        pattern: /^.{0,200}$/,
        message: IntlFormatMessage('laboratory.anomaly.charactersMaximum')
    };
}

function BasicInfo(props) {
    const {
        id,
        form,
        tags,
        basicInfoAddTage,
        type,
        dataInfo,
        getTagsInfo
    } = props;
    const {getFieldDecorator, setFieldsValue, getFieldValue, setFields, getFieldsValue} = form;

    const [filename, setFilename] = useFetchState('');


    const addTag = (value, callback) => {
        basicInfoAddTage(value, {
            cb: (id) => {
                callback();
                setFieldsValue({
                    dataSourceTags: (getFieldValue('dataSourceTags') || []).concat(id)
                });
            }
        });
    };

    useEffect(() => {
        setFieldsValue({
            dataSourceName: dataInfo.name,
            dataSourceTags: (dataInfo.dataTags || []).map(item => item.id),
            dataSourceDes: dataInfo.description
        });
        setFilename(dataInfo.sourceConfig && dataInfo.sourceConfig.fileName || '');
    }, [dataInfo, id]);

    useEffect(() => {
        getTagsInfo();
    }, []);

    return (
        <Fragment>
            <Item label={IntlFormatMessage('datasource.list.name')} {...formLayout}>
                {
                    getFieldDecorator('dataSourceName', {
                        rules: [
                            {required: true, message: IntlFormatMessage('datasource.searchby.datasourcename')},
                            checkoutChartName(),
                        ],
                    })(
                        <Input
                            placeholder={IntlFormatMessage('datasource.searchby.datasourcename')}
                            className="item-width-tighten"
                        />
                    )
                }
            </Item>
            <Item label={IntlFormatMessage('datasource.create.fileBtn')} {...formLayout}>
                <Col style={{display: 'flex'}}>
                    {filename}
                </Col>
            </Item>
            <Item label={IntlFormatMessage('datasource.create.tag')} {...formLayout}>
                {
                    getFieldDecorator('dataSourceTags', {
                        // initialValue: basicInfo.dataSourceTags || []
                    })(
                        <Select
                            mode="multiple"
                            className="item-width-tighten"
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                            placeholder={IntlFormatMessage('datasource.create.entertag')}
                            optionFilterProp='search'
                        >
                            {
                                tags.map(item => {
                                    return <Select.Option search={item.name} key={item.id}
                                                          value={item.id}>{item.name}</Select.Option>;
                                })
                            }
                        </Select>
                    )
                }
                <CreateTag addTags={addTag}/>
            </Item>
            <Item label={IntlFormatMessage('datasource.detail.description')} {...formLayout}>
                {
                    getFieldDecorator('dataSourceDes', {
                        rules: [
                            {
                                max: 200,
                                message: IntlFormatMessage('laboratory.anomaly.charactersMaximumTwo'),
                            },
                        ],
                    })(
                        <TextArea
                            autoSize={{minRows: 4}}
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
        updateBasicInfo: dataSourceStore.updateBasicInfo,
        getTagsInfo: dataSourceStore.getTagsInfo,
        tags: dataSourceStore.tags,
        basicInfoAddTage: dataSourceStore.basicInfoAddTage,
    };
})(BasicInfo);
