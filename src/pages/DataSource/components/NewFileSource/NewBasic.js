import React, {Fragment, useEffect} from 'react';
import {Form, Input, Button, Select, Upload, Col, BasicLayout, Row, Radio, Progress, Spin} from '@chaoswise/ui';
import CreateTag from '../KafkaSource/CreateTag';
import {connect, toJS} from '@chaoswise/cw-mobx';
import {IntlFormatMessage} from "@/utils/util";
import {useHistory} from "react-router";
import Papa from "papaparse";
import styles from "@/pages/DataSource/components/File/index.less";

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

const formatType = {
    'outline': 'DODB',
    'file': 'FILE',
    'iotdb': 'IOTDB'
};
const NewBasic = (props) => {
    const {
        form,
        offBasicData,
        getTagsInfo,
        tags,
        history,
        addFileDataSource,
        basicInfoAddTage,
        updateOffBasicInfo,
        updateOffFiledInfo,
        fileList, setFileList, loading, setCsvSelectList, updateAddList,
    } = props;
    let offBasicInfo = toJS(offBasicData);
    const {getFieldDecorator, getFieldsError, setFieldsValue, getFieldValue, getFieldsValue} = form;
    const {push, go, location} = useHistory();
    const {pathname = ""} = location;

    useEffect(() => {
        const type = pathname.slice(pathname.indexOf('type') + 5);
        updateOffBasicInfo('type', formatType[type]);
        !offBasicInfo.dataType && updateOffBasicInfo('dataType', 'TIME_SERIES');
        //请求标签下拉框信息
        getTagsInfo();
    }, []);

    useEffect(() => {
        if (!fileList.length && !!offBasicInfo.file && !!offBasicInfo.file.length) {
            setFileList(offBasicInfo.file);
        }
    }, [offBasicInfo.file]);

    const addTag = (value, callback) => {
        basicInfoAddTage(value, {
            cb: (id) => {
                callback();
                const result = (getFieldValue('dataSourceTags') || []).concat(id);
                updateOffBasicInfo('dataSourceTags', result);
                setFieldsValue({
                    dataSourceTags: result
                });
            }
        });
    };
    const beforeUpload = (file) => {
        clearAll();
        setFileList([file]);
        updateOffBasicInfo('file', [file]);
        Papa.parse(file, {
            header: true, //包含第一行
            skipEmptyLines: true, //过滤空行
            fastMode: true, //极速模式
            step: function (results, parser) {

                //DO MY THING HERE

                parser.abort();

            },
            complete: function (results) {
                console.log(results?.meta?.fields);
                setCsvSelectList(results?.meta?.fields||[]);
            }
        });
        return false;
    };
    const onRemove = () => {
        clearAll();
        setFileList([]);
        updateOffBasicInfo('file', []);
    };

    const clearAll = () => {
        updateOffFiledInfo('fromModel', undefined);
        updateOffFiledInfo('fromTarget', undefined);
        updateOffFiledInfo('toModel', undefined);
        updateOffFiledInfo('toTarget', undefined);
        updateOffFiledInfo('relationship', undefined);
        updateOffFiledInfo('time', undefined);
        updateOffFiledInfo('value', undefined);
        updateOffFiledInfo('model', undefined);
        updateOffFiledInfo('target', undefined);
        updateOffFiledInfo('metric', undefined);
        updateOffFiledInfo('tags', undefined);
        updateAddList([]);
    };
    return (
        <div className={styles['file-create-box']}>
            <Spin spinning={loading} tip={IntlFormatMessage('task.common.uploading')}>
                <Form>
                    <Item label={IntlFormatMessage('datasource.create.tabletype')}
                          {...formLayout}>
                        {
                            getFieldDecorator('dataType', {
                                initialValue: offBasicInfo.dataType || 'TIME_SERIES',
                                rules: [
                                    {required: true, message: '请选择数据表类型'},
                                ],
                            })(
                                <Select
                                    placeholder={IntlFormatMessage('datasource.create.selecttimecolumn')}
                                    className="item-width-tighten"
                                    onChange={(e) => {
                                        updateOffBasicInfo('dataType', e);
                                        setFileList([]);
                                        setCsvSelectList([]);
                                        updateOffBasicInfo('file', []);
                                        clearAll();
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
                                    placeholder={IntlFormatMessage('datasource.searchby.datasourcename')}
                                    className="item-width-tighten"
                                    onChange={(e) => updateOffBasicInfo('dataSourceName', e.target.value)}
                                />
                            )
                        }
                    </Item>
                    <Item label={IntlFormatMessage('laboratory.anomaly.fileType')}
                          {...formLayout}>
                        {
                            getFieldDecorator('fileType', {
                                initialValue: offBasicInfo.fileType || 'csv',
                                rules: [
                                    {required: true, message: IntlFormatMessage('task.common.fileSelect')},
                                ],
                            })(
                                <Radio.Group
                                    onChange={(e) => updateOffBasicInfo('fileType', e.target.value)}
                                >
                                    <Radio value="csv">{IntlFormatMessage('laboratory.anomaly.fileCSV')}</Radio>
                                    {/*<Radio value="jason">jason文件</Radio>*/}
                                </Radio.Group>
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
                                    <Button icon='cloud-upload' id="webUpload-btn">
                                        {IntlFormatMessage('datasource.create.uploadfile')}
                                    </Button>
                                </Fragment>}
                            >
                            </Upload>
                            <span style={{marginLeft: 16, position: 'absolute', left: 154}}>
                                {IntlFormatMessage('datasource.create.onlyaCSVfile')}<a
                                href={`${publicpath}csv/${getFieldValue('dataType') === 'TIME_SERIES' ?
                                    'Example' :
                                    getFieldValue('dataType') === 'NODE_RELATION' ?
                                        'relationExample' :
                                        'logExample'
                                }.csv`}
                                download
                                style={{cursor: 'pointer'}}>
                                {IntlFormatMessage('datasource.create.downloadtemplate')}</a></span>

                        </Col>
                    </Item>
                    <Item label={IntlFormatMessage('datasource.create.tag')}
                          {...formLayout}>
                        {
                            getFieldDecorator('dataSourceTags', {
                                initialValue: offBasicInfo.dataSourceTags || []
                                // rules: [
                                //     checkoutChartName(),
                                // ],
                            })(
                                <Select
                                    mode="multiple"
                                    getPopupContainer={triggerNode => triggerNode.parentNode}
                                    className="item-width-tighten"
                                    optionFilterProp='search'
                                    placeholder={IntlFormatMessage('datasource.create.entertag')}
                                    onChange={(value, option) => {
                                        updateOffBasicInfo('dataSourceTags', value);
                                    }}
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
                    <Item label={IntlFormatMessage('datasource.detail.description')}
                          {...formLayout}>
                        {
                            getFieldDecorator('dataSourceDes', {
                                initialValue: offBasicInfo.dataSourceDes || undefined,
                                rules: [
                                    {required: false, message: IntlFormatMessage('datasource.create.enterdescription')},
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
                                    onChange={(e) => updateOffBasicInfo('dataSourceDes', e.target.value)}
                                />
                            )
                        }
                    </Item>
                </Form>
            </Spin>
        </div>
    );
};

export default connect(({dataSourceStore, store}) => {
    return {
        basicData: dataSourceStore.basicData,
        updateBasicInfo: dataSourceStore.updateBasicInfo,
        getTagsInfo: dataSourceStore.getTagsInfo,
        tags: dataSourceStore.tags,
        addFileDataSource: dataSourceStore.addFileDataSource,
        basicInfoAddTage: dataSourceStore.basicInfoAddTage,
        updateOffBasicInfo: dataSourceStore.updateOffBasicInfo,
        updateOffFiledInfo: dataSourceStore.updateOffFiledInfo,
        offBasicData: dataSourceStore.offBasicData,
        updateAddList: dataSourceStore.updateAddList,
    };
})(NewBasic);