import React, {useEffect, useMemo, useCallback, Fragment} from 'react';
import {Button, Form, Icon, Input, BasicLayout, InputNumber, Select, Tooltip, Upload} from '@chaoswise/ui';
import {connect, toJS} from "@chaoswise/cw-mobx";
import styles from '@/pages/AlgorithmicGenerics/components/CreateForm/index.less';
import {useHistory, useParams} from "react-router";
import {formatType, labelLayout, dataStoreType} from "@/globalConstants";
import {success, error} from "@/utils/tip";
import IconTooltip from "@/components/IconTooltip";
import {useFetchState} from "@/components/HooksState";
import {IntlFormatMessage} from "@/utils/util";

const FormItem = Form.Item;
const Option = Select.Option;
const {Dragger} = Upload;
const Footer = BasicLayout.Footer;

const CreateForm = (props) => {
    const {
        addAlgorithmAsync, getListAsync, algorithmList = [],
        form: {getFieldDecorator, validateFields}, name, title,
    } = props;

    const {push, go, location} = useHistory();
    const {pathname = ""} = location;
    const {storeId = '', typeId = ''} = useParams();

    const [loading, setLoading] = useFetchState(false);
    const [imgList, setImgList] = useFetchState([]);
    const [selectAlog, setSelectAlog] = useFetchState('');

    useEffect(() => {
        getListAsync({
            scenes: [typeId],
            includeAlgorithmGenericCount: true
        });
    }, []);

    const alogParams = useMemo(() => {
        return toJS(algorithmList).reduce((t, c) => {
            return Object.assign({}, t, {
                [c.id + '']: c
            });
        }, {});
    }, [algorithmList]);

    /**
     * 上传图片之前的钩子函数
     * @param file
     * @returns {boolean}
     */
    const uploadProps = {
        showUploadList: false,
        multiple: true,
        //上传文件之前的钩子
        beforeUpload: (file) => {
            if (imgList.length < 10) {
                setLoading(true);
                const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                if (!isJpgOrPng) {
                    error(IntlFormatMessage('task.common.fileFormat'));
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    error(IntlFormatMessage('task.common.cannotGreater'));
                }
                if (isJpgOrPng && isLt2M) {
                    getBase64(file, imageUrl => {
                        setImgList(prev => prev.concat({
                            imageUrl, file,
                        }));
                    });
                }
                setLoading(false);
            } else {
                error(IntlFormatMessage('task.common.sketchesOnly'));
            }
        },
    };

    /**
     * 把上传的图片转为base64
     * @param img
     * @param callback
     */
    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const saveFormHandler = () => {
        validateFields((err, values) => {
            if (!err) {
                const {scene, name, description, viewpicture, algorithmId, ...rest} = values;
                const alogNameList = (alogParams[algorithmId].parameters || []).reduce((prev, cent) => {
                    return Object.assign({}, prev, {
                        [cent.name]: cent,
                    });
                }, {});
                const parameters = Object.entries(rest).map(res => {
                    const name = res[0];
                    const item = (res[1] || res[1] === 0) ? res[1] : null;
                    return Object.assign({}, alogNameList[name], {
                        value: item
                    });
                });
                const params = {
                    scene: typeId,
                    algorithmId, name, description, //viewpicture,
                    parameters: parameters
                };
                addAlgorithmAsync(params, (res) => {
                    success(IntlFormatMessage('laboratory.anomaly.genericityWin'));
                    go(-1);
                });
            }
        });
    };

    return (
        <div className={styles['genercs-create-form']}>
            <Form>
                <div
                    className='title-label-box title-label-box-margin-bottom24'>{IntlFormatMessage('generics.create.basicinformation')}</div>
                <FormItem
                    label={IntlFormatMessage('generics.create.algorithmscenario')}
                    {...labelLayout}
                >
                    {getFieldDecorator('scene', {
                        initialValue: typeId,
                    })(
                        <Select
                            disabled={true}
                            className="item-width-tighten"
                            placeholder='请选择算法场景'
                        >
                            {
                                dataStoreType[0].children.map((item, index) => {
                                    return (
                                        <Option
                                            key={item.id}
                                            value={item.id}
                                        >
                                            {IntlFormatMessage(item.name)}
                                        </Option>
                                    );
                                })
                            }
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    label={
                        <span style={{
                            whiteSpace: 'normal'
                        }}>
                            {IntlFormatMessage('generics.info.name')}
                        </span>
                    }
                    {...labelLayout}
                >
                    {getFieldDecorator('name', {
                        initialValue: name || undefined,
                        rules: [
                            {
                                required: true,
                                message: IntlFormatMessage('generics.list.searchbar.genericsname'),
                            },
                        ],
                    })(
                        <Input
                            placeholder={IntlFormatMessage('generics.list.searchbar.genericsname')}
                            className="item-width-tighten"
                        />
                    )}
                    <IconTooltip
                        style={{marginLeft: '8px'}}
                        title={IntlFormatMessage('generics.info.thegenericityissaved')}
                    />
                </FormItem>
                <FormItem label={IntlFormatMessage('generics.create.description')}
                          {...labelLayout}>
                    {getFieldDecorator('description', {
                        rules: [
                            {
                                max: 500,
                                message: IntlFormatMessage('laboratory.anomaly.maximumFive'),
                            },
                        ],
                        initialValue: '',
                    })(
                        <Input.TextArea
                            autoSize={{minRows: 4}}
                            className="item-width-tighten"
                        />
                    )}
                </FormItem>
                {/*<FormItem label="效果图" {...labelLayout}>*/}
                {/*    {getFieldDecorator('viewpicture', {*/}
                {/*        rules: [],*/}
                {/*        initialValue: '',*/}
                {/*    })(*/}
                {/*        <div className="viewpic-box">*/}
                {/*            {(imgList || []).map((img, index) => {*/}
                {/*                const {imageUrl, file} = img;*/}
                {/*                return <div className="viewpic-box-pic" key={index}>*/}
                {/*                    <Zmage src={imageUrl} alt="图片"/>*/}
                {/*                    <Icon type='close' className='viewpic-box-pic-delete' onClick={() => {*/}
                {/*                        setImgList(prev => {*/}
                {/*                            return prev.filter((i, cIndex) => cIndex !== index);*/}
                {/*                        });*/}
                {/*                    }}/>*/}
                {/*                </div>;*/}
                {/*            })}*/}
                {/*            <div className="viewpic-box-pic viewpic-box-upload">*/}
                {/*                <Dragger*/}
                {/*                    {...uploadProps}*/}
                {/*                    customRequest={() => {*/}
                {/*                    }}*/}
                {/*                    disabled={loading}*/}
                {/*                >*/}
                {/*                    <div>*/}
                {/*                        <Icon type={loading ? 'loading' : 'plus'}/>*/}
                {/*                        <div>上传图片</div>*/}
                {/*                    </div>*/}
                {/*                </Dragger>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    )}*/}
                {/*</FormItem>*/}
                <div
                    className='title-label-box title-label-box-margin-bottom32'>{IntlFormatMessage('generics.create.algorithmgenericity')}</div>
                <FormItem label={IntlFormatMessage('generics.create.algorithm')}
                          {...labelLayout}>
                    {getFieldDecorator('algorithmId', {
                        initialValue: selectAlog || undefined,
                        rules: [
                            {
                                required: true,
                                message: IntlFormatMessage('task.create.selectAlgorithm'),
                            },
                        ],
                    })(
                        <Select
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                            // style={{width: '100%'}}
                            placeholder={IntlFormatMessage('generics.info.selectalgorithm')}
                            onChange={(value) => {
                                setSelectAlog(value);
                            }}
                            className="item-width-tighten"
                        >
                            {(Object.entries(alogParams) || []).map(res => {
                                    const item = res[1];
                                    return (
                                        <Option value={item.id + ''} key={item.id + ''}>
                                            {`${item.displayNames || (item.name || '')} ${item.version}`}
                                        </Option>
                                    );
                                }
                            )}
                        </Select>
                    )}
                </FormItem>

                {
                    !!alogParams[selectAlog] && !!alogParams[selectAlog].parameters &&
                    (alogParams[selectAlog].parameters || []).filter(param => param.name !== 'stream_mode').map((item, index) => {
                        const {name, value, nameZhDescription, type = '', descriptions} = item;
                        return (
                            <FormItem
                                key={name}
                                label={
                                    <Fragment>
                                        <Tooltip title={name}>
                                            <span className="label-name">
                                                {name}
                                            </span>
                                        </Tooltip>
                                    </Fragment>
                                }
                                {...labelLayout}
                            >
                                {getFieldDecorator(`${name}`, {
                                    initialValue: (typeof value === 'number' ? JSON.stringify(value) : value) || null,
                                    rules: (type === 'int') ? [
                                        {
                                            pattern: /^-?[0-9]\d*$/,
                                            message: IntlFormatMessage('laboratory.anomaly.anIntegerEnter'),
                                        },
                                        {
                                            validator: (rule, value, callback) => {
                                                if (value !== 0 && !value) {
                                                    return callback(`${IntlFormatMessage('laboratory.anomaly.cannotParameter')}`);
                                                }
                                                if (value < -1) {
                                                    return callback(IntlFormatMessage('task.common.cannotSmaller'));
                                                }
                                                callback();
                                            }
                                        }
                                    ] : [
                                        // {
                                        //     pattern: /^[^\s]*$/,
                                        //     message: '禁止输入空格',
                                        // },
                                    ],
                                })(
                                    (type === 'int') ?
                                        <InputNumber
                                            autoComplete="off"
                                            className="item-width-tighten"
                                        />
                                        :
                                        <Input
                                            autoComplete="off"
                                            className="item-width-tighten"
                                        />
                                )}
                                <Tooltip title={descriptions || ''}>
                                    <Icon type="question-circle" style={{marginLeft: '8px', fontSize: 16}}/>
                                </Tooltip>
                            </FormItem>
                        );
                    })
                }
            </Form>
            <Footer>
                <Button onClick={() => go(-1)} style={{marginRight: 8}}>{
                    IntlFormatMessage('common.explore.setting.modal.cancel')
                }</Button>
                <Button type="primary" onClick={saveFormHandler}>{
                    IntlFormatMessage('common.explore.setting.modal.determine')
                }</Button>
            </Footer>
        </div>
    );
};

export default connect(({tagStore, genericsStore, store, dashboardStore}) => {
    return {
        getListAsync: dashboardStore.getListAsync,
        algorithmList: dashboardStore.list,
        addAlgorithmAsync: genericsStore.addAlgorithmAsync,
        getAlgorithmDetailAsync: genericsStore.getAlgorithmDetailAsync,
        current: genericsStore.current,
    };
})(Form.create()(CreateForm));
