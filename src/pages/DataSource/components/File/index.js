import React, {Fragment, useEffect,} from 'react';
import {Form, Input, Button, Select, Upload, Col, BasicLayout, Row, message, Progress, Spin} from '@chaoswise/ui';
import CreateTag from '../KafkaSource/CreateTag';
import {connect, toJS} from '@chaoswise/cw-mobx';
import {success, error} from "@/utils/tip";
import styles from './index.less';
import {useFetchState} from "@/components/HooksState";
import {IntlFormatMessage} from "@/utils/util";

const publicpath = process.env.PUBLIC_PATH || '/';
const {Item} = Form;
const {TextArea} = Input;
const {Option} = Select;
const Footer = BasicLayout.Footer;
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

function FileSource(props) {
    const {
        form,
        basicData,
        getTagsInfo,
        tags,
        history,
        addFileDataSource,
        basicInfoAddTage
    } = props;

    let basicInfo = toJS(basicData);
    const {getFieldDecorator, getFieldsError, setFieldsValue, getFieldValue, getFieldsValue} = form;

    const [fileList, setFileList] = useFetchState([]);
    const [percent, setPercent] = useFetchState(0);
    const [loading, setLoading] = useFetchState(false);

    useEffect(() => {
        //获取标签信息
        getTagsInfo();
    }, []);

    //下一步
    const handleNextStep = () => {
        form.validateFields((err, values) => {
            if (!err) {
                if (fileList.length === 0) {
                    return error(IntlFormatMessage('task.common.uploadFile'));
                }
                setLoading(true);
                addFileDataSource({
                    params: {
                        dataSourceName: values.dataSourceName,
                        dataSourceTags: values.dataSourceTags || [],
                        description: values.dataSourceDes || null,
                    },
                    file: fileList,
                    cb: () => {
                        setLoading(false);
                        success(IntlFormatMessage('laboratory.anomaly.dataSourceAdded'));
                        history.push('/datasource');
                    },
                    err: () => {
                        setLoading(false);
                    }
                });

            }
        });

    };


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
    //取消
    const handleCancel = () => {
        history.push('/datasource');
    };
    const beforeUpload = (file) => {
        // const fileSize = file.size / 1024 / 1024;
        setFileList([file]);
        return false;
    };
    const onRemove = () => {
        setFileList([]);
    };
    return (
        <div className={styles['file-create-box']}>
            <Spin spinning={loading} tip="正在上传文件">
                <Form>
                    <Item label={IntlFormatMessage('datasource.list.name')}
                          {...formLayout}>
                        {
                            getFieldDecorator('dataSourceName', {
                                // initialValue: basicInfo.dataSourceName || undefined
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
                    <Item label={IntlFormatMessage('datasource.create.file')}
                          {...formLayout}>
                        <Col className='upload-file'>
                            <Upload
                                openMethod='clickButton'
                                showUploadList={true}
                                showUploadModal={false}
                                fileList={fileList}
                                beforeUpload={beforeUpload}
                                // onChange={onChange}
                                accept={'text/csv'}
                                onRemove={onRemove}
                                customRequest={true}
                                clickContent={<Fragment>
                                    <Button icon='cloud-upload'>
                                        {IntlFormatMessage('datasource.create.uploadfile')}
                                    </Button>
                                </Fragment>}
                            >
                            </Upload>
                            <span style={{marginLeft: 16, position: 'absolute', left: 154}}>
                                {IntlFormatMessage('datasource.create.onlyaCSVfile')}<a
                                href={`${publicpath}csv/Example.csv`} download
                                style={{cursor: 'pointer'}}>
                                {IntlFormatMessage('datasource.create.downloadtemplate')}</a></span>

                        </Col>
                    </Item>
                    <Item label= {IntlFormatMessage('datasource.create.tag')}
                          {...formLayout}>
                        {
                            getFieldDecorator('dataSourceTags', {
                                // initialValue: basicInfo.dataSourceTags || []
                                // rules: [
                                //     checkoutChartName(),
                                // ],
                            })(
                                <Select
                                    mode="tags"
                                    getPopupContainer={triggerNode => triggerNode.parentNode}
                                    className="item-width-tighten"
                                    optionFilterProp='search'
                                    placeholder={IntlFormatMessage('datasource.create.entertag')}
                                >
                                    {
                                        tags.map(item => {
                                            return <Select.Option
                                                key={item.id}
                                                search={item.name}
                                                value={item.id}
                                            >
                                                {item.name}
                                            </Select.Option>;
                                        })
                                    }
                                </Select>
                            )
                        }
                        <CreateTag addTags={addTag}/>
                    </Item>
                    <Item label= {IntlFormatMessage('datasource.detail.description')}
                          {...formLayout}>
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
                                    placeholder={IntlFormatMessage('datasource.create.enterdescription')}
                                    className="item-width-tighten"
                                />
                            )
                        }
                    </Item>
                    <Footer>
                        <Button style={{marginRight: 8}} onClick={handleCancel}>{
                            IntlFormatMessage('common.explore.setting.modal.cancel')
                        }</Button>
                        <Button type='primary' onClick={handleNextStep}>{
                            IntlFormatMessage('common.explore.setting.modal.determine')
                        }</Button>
                    </Footer>
                </Form>
            </Spin>
        </div>
    );
}

export default connect(({dataSourceStore, store}) => {
    return {
        basicData: dataSourceStore.basicData,
        updateBasicInfo: dataSourceStore.updateBasicInfo,
        getTagsInfo: dataSourceStore.getTagsInfo,
        tags: dataSourceStore.tags,
        addFileDataSource: dataSourceStore.addFileDataSource,
        basicInfoAddTage: dataSourceStore.basicInfoAddTage
    };
})(Form.create()(FileSource));
