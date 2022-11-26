import React, {useEffect, useMemo, useCallback} from 'react';
import {
    Button,
    Form,
    Icon,
    Input,
    BasicLayout,
    message,
    Select,
    Tooltip,
    Upload,
    Cascader,
    Col,
    Row
} from '@chaoswise/ui';
import {connect, toJS} from "@chaoswise/cw-mobx";
import styles from '@/pages/MultiTenancy/components/CreateForm/index.less';
import {useHistory, useParams} from "react-router";
import {formatType, labelLayout} from "@/globalConstants";
import {error, success} from "@/utils/tip";
import {guid, IntlFormatMessage} from "@/utils/util";
import DimensionBox from "@/components/DimensionBox";
import {useFetchState} from "@/components/HooksState";

const FormItem = Form.Item;
const Option = Select.Option;
const {Dragger} = Upload;
const Footer = BasicLayout.Footer;

const CreateForm = (props) => {
    const {
        addMultiTenancyAsync, getMultiTenancyDetailAsync, modifyMultiTenancyAsync, searchGroupBySceneAsync,
        form: {getFieldDecorator, validateFields, setFieldsValue}, current, clearCurrentReducer, activeTab,
        getGroupBySceneAsync, dashboard = [],
    } = props;
    const {builtinDisplayNames, name, description, algorithms = []} = toJS(current);

    const {push, go, location} = useHistory();
    const {pathname = ""} = location;
    const {typeId = ''} = useParams();

    const [scenes, setScenes] = useFetchState([{
        id: guid(),
        scene: undefined,
        algorithmNames: undefined
    }]);
    const [selectAlog, setSelectAlog] = useFetchState('');
    const [algorithmList, setAlgorithmList] = useFetchState({});
    const [typesFilter, setTypesFilter] = useFetchState([]);
    const [saveLoading, setSaveLoading] = useFetchState(false);

    useEffect(() => {
        if (!window.DOIA_CONFIG.dataSceneTypeList.length) {
            getGroupBySceneAsync();
        }
    }, [window.DOIA_CONFIG.dataSceneTypeList]);

    useEffect(() => {
        if (typeId) {
            getMultiTenancyDetailAsync(typeId);
            return () => {
                clearCurrentReducer();
            };
        }
    }, [typeId]);

    useEffect(() => {
        if (!!algorithms && !!algorithms.length) {
            const algorithmsObj = [].concat(algorithms).reduce((t, c, index) => {
                return Object.assign({}, t, {
                    [c.scene]: t[c.scene] ? t[c.scene].concat(c.algorithm) : [].concat(c.algorithm)
                });
            }, {});
            const result = (Object.entries(algorithmsObj) || []).map(res => {
                return {
                    id: guid(),
                    scene: res[0],
                    algorithmNames: res[1]
                };
            });
            Object.keys(algorithmsObj).forEach(item => {
                setTimeout(() => {
                    setSelectAlog(item);
                }, 100);
            });
            setScenes(result);
        }
    }, [current]);

    useEffect(() => {
        if (selectAlog) {
            searchGroupBySceneAsync({
                scenes: [selectAlog],
                includeAlgorithmGenericCount: true
            }, (res) => {
                setAlgorithmList(toJS(res));
            });
        }
    }, [selectAlog]);

    const sceneChange = (type, value, id) => {
        setScenes(prev => {
            return prev.map((item) => {
                if (item.id === id) {
                    return Object.assign({}, item, {
                        [type]: value,
                    });
                }
                return item;
            });
        });
    };

    useEffect(() => {
        setTypesFilter(prev => {
            return scenes.map(item => item.scene);
        });
    }, [scenes]);

    const callback = () => {
        setSaveLoading(false);
    };

    const saveFormHandler = () => {
        validateFields((err, values) => {
            if (!err) {
                setSaveLoading(true);
                const {name, description} = values;
                let algorithmNames = [];
                scenes.forEach(item => {
                    algorithmNames = algorithmNames.concat(item.algorithmNames);
                });
                const params = {
                    name, description,
                    algorithmNames,
                };

                if (typeId) {
                    modifyMultiTenancyAsync(Object.assign({}, params, {id: typeId}), (response) => {
                        if (response && response.status == "success") {
                            success(IntlFormatMessage('laboratory.anomaly.scenarioEdited'));
                            go(-1);
                        } else {
                            error(response.msg || IntlFormatMessage('laboratory.anomaly.scenarioFails'));
                        }
                        callback();
                    });
                } else {
                    addMultiTenancyAsync(params, (response) => {
                        if (response && response.status == "success") {
                            success(IntlFormatMessage('laboratory.anomaly.scenarioCeated'));
                            go(-1);
                        } else {
                            error(response.msg || IntlFormatMessage('laboratory.anomaly.scenarioFailsCreated'));
                        }
                        callback();
                    });
                }
            }
        });
    };

    return (
        <div className={styles['multiTenancy-create-form']}>
            <Form>
                <FormItem
                    label={
                        <span style={{
                            whiteSpace: 'normal'
                        }}>
                         {IntlFormatMessage('multitenancy.detail.name')}
                        </span>
                    }
                    {...labelLayout}
                >
                    {getFieldDecorator('name', {
                        initialValue: builtinDisplayNames || name || undefined,
                        rules: [
                            {
                                required: true,
                                message: IntlFormatMessage('task.create.enterScenarioName'),
                            },
                        ],
                    })(
                        <Input
                            placeholder={IntlFormatMessage('multitenancy.detail.enterscenarioname')}
                            // disabled={toJS(activeTab) === '0'}
                            className="item-width-tighten"
                        />
                    )}
                </FormItem>
                <FormItem label={IntlFormatMessage('multitenancy.detail.description')}
                          {...labelLayout}>
                    {getFieldDecorator('description', {
                        rules: [
                            {
                                max: 500,
                                message: IntlFormatMessage('laboratory.anomaly.maximumFive'),
                            },
                        ],
                        initialValue: description || undefined,
                    })(
                        <Input.TextArea
                            autoSize={{minRows: 4}}
                            // disabled={toJS(activeTab) === '0'}
                            className="item-width-tighten"
                        />
                    )}
                </FormItem>
                <FormItem label={<span className="title">{IntlFormatMessage('task.create.algorithm')}</span>} {...labelLayout}>
                    {
                        (scenes || []).map((scene, index) => {
                            return (
                                <div key={index} className="scene-box">
                                    <Row className="scene-box-left item-width-tighten">
                                        <Col span={12}>
                                            <FormItem className="need-margin-right">
                                                {getFieldDecorator(`scene-${scene.id}`, {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: IntlFormatMessage('task.create.selectScenario'),
                                                        },
                                                    ],
                                                    initialValue: scene.scene || undefined,
                                                })(
                                                    <Select
                                                        // allowClear
                                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                                        // style={{width: '100%'}}
                                                        placeholder={IntlFormatMessage('task.create.selectScenario')}
                                                        onChange={(value) => {
                                                            sceneChange('scene', value, scene.id);
                                                            sceneChange('algorithmNames', value, scene.id);
                                                            setSelectAlog(value);
                                                            setFieldsValue({
                                                                [`algorithmNames-${scene.id}`]: undefined
                                                            });
                                                        }}
                                                        width={{width: '100%'}}
                                                    >
                                                        {
                                                            (window.DOIA_CONFIG.dataSceneTypeList.length ? window.DOIA_CONFIG.dataSceneTypeList :
                                                                toJS(dashboard)).map(item => {
                                                                return (
                                                                    <Option
                                                                        value={item.type} key={item.type}
                                                                        disabled={typesFilter.includes(item.type)}
                                                                    >
                                                                        {item.title}
                                                                    </Option>
                                                                );
                                                            })
                                                        }
                                                    </Select>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem>
                                                {getFieldDecorator(`algorithmNames-${scene.id}`, {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: IntlFormatMessage('multitenancy.detail.selectalgorithm'),
                                                        },
                                                    ],
                                                    initialValue: scene.algorithmNames,
                                                })(
                                                    <Select
                                                        showSearch
                                                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                                        placeholder={IntlFormatMessage('multitenancy.detail.selectalgorithm')}
                                                        mode="multiple"
                                                        onChange={(value) => {
                                                            sceneChange('algorithmNames', value, scene.id);
                                                        }}
                                                        width={{width: '100%'}}
                                                    >
                                                        {(algorithmList[scene.scene || selectAlog] && algorithmList[scene.scene || selectAlog].algorithmNames || []).map((item, index) => {
                                                            return <Option
                                                                key={item.name}
                                                                value={item.name}
                                                            >
                                                                {item.displayNames || item.name}
                                                            </Option>;
                                                        })}
                                                    </Select>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Icon className="deleteBtn" type="delete" onClick={() => {
                                        setScenes(prev => {
                                            return prev.filter(item => item.id !== scene.id);
                                        });
                                    }}/>
                                </div>
                            );
                        })
                    }
                    {
                        scenes.length < window.DOIA_CONFIG.dataSceneTypeList.length ?
                            <Button onClick={() => {
                                setScenes(prev => {
                                    return prev.concat({
                                        id: guid(),
                                        scene: undefined,
                                        algorithmNames: undefined
                                    });
                                });
                            }}>{IntlFormatMessage('laboratory.anomaly.add')}</Button>
                            : null
                    }
                </FormItem>
            </Form>
            <Footer>
                <Button onClick={() => go(-1)} style={{marginRight: 8}}>{
                    IntlFormatMessage('common.explore.setting.modal.cancel')
                }</Button>
                <Button type="primary" loading={saveLoading} onClick={saveFormHandler}>{
                    IntlFormatMessage('common.explore.setting.modal.determine')
                }</Button>
            </Footer>
        </div>
    );
};

export default connect(({multiTenancyStore, dashboardStore,}) => {
    return {
        searchGroupBySceneAsync: multiTenancyStore.searchGroupBySceneAsync,
        algorithmList: multiTenancyStore.algorithmList,
        addMultiTenancyAsync: multiTenancyStore.addMultiTenancyAsync,
        modifyMultiTenancyAsync: multiTenancyStore.modifyMultiTenancyAsync,
        getMultiTenancyDetailAsync: multiTenancyStore.getMultiTenancyDetailAsync,
        current: multiTenancyStore.current,
        activeTab: multiTenancyStore.activeTab,
        clearCurrentReducer: multiTenancyStore.clearCurrentReducer,

        dashboard: dashboardStore.dashboard,
        getGroupBySceneAsync: dashboardStore.getGroupBySceneAsync,
    };
})(Form.create()(CreateForm));
