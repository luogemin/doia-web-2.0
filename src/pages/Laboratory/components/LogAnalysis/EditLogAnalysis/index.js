import React, {useEffect, Fragment} from 'react';
import {Tabs, BasicLayout, Form, Card, Button, message} from '@chaoswise/ui';
import BasicInfo from '@/pages/Laboratory/components/SingleCheck/BasicInfo';
import DataSetting from '@/pages/Laboratory/components/LogAnalysis/DataSetting';
import AlgorithmSelect from '@/pages/Laboratory/components/SingleCheck/ArithmeticSelect';
import {connect, toJS} from "@chaoswise/cw-mobx";
import moment from 'moment';
import styles from './index.less';
import {useFetchState} from "@/components/HooksState";
import {useHistory} from "react-router";
import {success} from "@/utils/tip";
import {IntlFormatMessage} from "@/utils/util";

const {TabPane} = Tabs;
const Footer = BasicLayout.Footer;


function EditLogAnalysis(props) {
    const {
        match = {},
        form,
        getTbDetail,
        modifyTb,
        genericityList,
        modifyGeneric,
        updateDataSetInfo,
        setDataSetInfo,
        deleteDataSetInfo,
        setDimensionalList,
    } = props;
    const {params = {}} = match;
    const {typeId = '', id = ''} = params;
    const {push, go, location} = useHistory();

    const [activeTabKey, setActiveTabKey] = useFetchState('basicInfo');
    const [dataInfo, setDataInfo] = useFetchState({});

    useEffect(() => {
        if (id) {
            getTbDetail(id, {
                cb: (data = {}) => {
                    const {
                        taskName = '', description = undefined, scene = 'anomaly_detection',
                        aggConfig = {}, startTime = 0, endTime = 0, dataSourceList = [],
                    } = toJS(data);
                    const {aggFunc = '', aggTimeUnit = '', aggTimeNumber = undefined} = aggConfig;
                    const dataSourceRelation = dataSourceList[0] || {};
                    const {dataSource = {}} = dataSourceRelation;
                    const params = {
                        taskName: taskName,
                        description,
                        scene,
                        dataSourceType: dataSource.type,
                        datasourceId: {value: dataSourceRelation.dataSourceId, label: dataSource.name},
                        method: aggFunc,
                        aggTimeUnit: aggTimeUnit,
                        number: aggTimeNumber,
                        time: [moment(startTime), moment(endTime)],
                    };
                    setDataSetInfo(params);
                    setDataInfo(params);
                    updateDataSetInfo('scene', scene);
                }
            });
        }

        return () => {
            deleteDataSetInfo();
        };
    }, [id, activeTabKey]);

    const handleSubmit = () => {
        if (activeTabKey === 'arithmetic') {
            let taskPublicGenericList = [];
            if (genericityList.length > 0) {
                taskPublicGenericList = genericityList.map(item => {
                    const {id} = item;
                    return {
                        id,
                        algorithmGenericId: item.genericId,
                        algorithmId: item.algorithmId,
                        algorithmName: item.algorithmName,
                        algorithmVersion: item.algorithmVersion,
                        algorithmParams: item.algorithmParams.map(item => {
                            if (item.value || item.value === 0) {
                                return item;
                            }
                            return {
                                name: item.name,
                                value: null
                            };
                        }),
                        algorithmNameZh: item.algorithmNameZh,
                        genericName: item.genericityname,
                        isOverwriteForecastParams: !!(typeId === 'forecasting' && item.checked)
                    };
                });
            }
            return modifyGeneric({
                taskId: id,
                taskPublicGenericList
            }, {
                cb: () => {
                    success(IntlFormatMessage('laboratory.anomaly.edited'));
                }
            });
        }
        form.validateFields((err, value) => {
            if (!err) {
                if (activeTabKey === 'basicInfo') {
                    modifyTb({
                        id,
                        taskName: value.taskName,
                        description: value.description || null,
                    }, {
                        cb: () => {
                            success(IntlFormatMessage('laboratory.anomaly.edited'));
                        }
                    });
                }
            }
        });
    };
    return (
        <Fragment>
            <Form style={{height: '100%',}}>
                <Tabs
                    style={{height: '100%', overflowY: 'auto'}}
                    className={styles['arithmetic-tabs']}
                    activeKey={activeTabKey}
                    onChange={key => setActiveTabKey(key)}
                >
                    <TabPane tab={IntlFormatMessage('laboratory.create.basicinformation')} key="basicInfo">
                        <PaddingDiv>
                            <BasicInfo form={form}/>
                        </PaddingDiv>
                    </TabPane>
                    <TabPane tab={IntlFormatMessage('laboratory.detail.datasettings')} key="dataset">
                        <div style={{padding: '0 32px'}}>
                            <DataSetting form={form} disableEdit={true}/>
                        </div>
                    </TabPane>
                    <TabPane tab={IntlFormatMessage('laboratory.detail.algorithmsettings')} key="arithmetic">
                        <div style={{padding: '0 32px'}}>
                            <AlgorithmSelect typeId={typeId}/>
                        </div>
                    </TabPane>
                </Tabs>
            </Form>
            {
                activeTabKey !== 'dataset' &&
                <Footer>
                    <Button onClick={() => go(-1)} style={{marginRight: 8}}>{
                        IntlFormatMessage('common.explore.setting.modal.cancel')
                    }</Button>
                    <Button type='primary' onClick={handleSubmit}>{
                        IntlFormatMessage('common.explore.setting.modal.determine')
                    }</Button>
                </Footer>
            }
        </Fragment>
    );
}

const PaddingDiv = (props) => {
    const {children, style = {}} = props;
    return <div style={Object.assign({}, {padding: '0 32px'}, style)}>
        {children}
    </div>;
};

export default connect(({laboratoryStore}) => {
    return {
        getTbDetail: laboratoryStore.getTbDetail,
        modifyTb: laboratoryStore.modifyTb,
        genericityList: laboratoryStore.genericityList,
        modifyGeneric: laboratoryStore.modifyGeneric,
        updateDataSetInfo: laboratoryStore.updateDataSetInfo,
        setDataSetInfo: laboratoryStore.setDataSetInfo,
        deleteDataSetInfo: laboratoryStore.deleteDataSetInfo,
        setDimensionalList: laboratoryStore.setDimensionalList,
    };
})(Form.create()(EditLogAnalysis));
