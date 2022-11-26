import React, {useMemo, useEffect} from "react";
import {Button, Modal, Icon, Input, Tooltip, Form, Select} from "@chaoswise/ui";
import {labelLayout} from "@/globalConstants";
import {connect, toJS} from "@chaoswise/cw-mobx";
import styles from "@/pages/TaskManagement/assets/index.less";
import {useFetchState} from "@/components/HooksState";
import {IntlFormatMessage} from "@/utils/util";

const FormItem = Form.Item;
const {Option} = Select;


const ArithmeticSelectModal = (props) => {
    const {
        form: {getFieldDecorator, validateFields},
        visible,
        onCancel,
        onSave,
        dataSource = {},
        addGenericityList,
        genericityList,
        genericityData,
        modifyGenericityList
    } = props;
    const {eid = '', algorithmId = ''} = dataSource;

    const [selectAlog, setSelectAlog] = useFetchState('');

    const [parameter, setParamter] = useFetchState([{
        name: '',
        id: '',
        parameters: []
    }]);
    useEffect(() => {
        if (eid) {
            setSelectAlog(eid);
            setParamter([{
                name: dataSource.name,
                id: dataSource.id,
                algorithmId: dataSource.algorithmId,
                algorithmName: dataSource.algorithmName,
                algorithmVersion: dataSource.algorithmVersion,
                algorithmGenericId: dataSource.id,
                parameters: dataSource.parameters
            }]);
        }

    }, [dataSource]);


    const onOk = () => {
        validateFields((err, value) => {
            if (!err) {
                let newValue = value;
                let newPara = [];
                delete newValue.algorithmId;
                for (var i in newValue) {
                    newPara = newPara.concat({
                        name: i,
                        value: newValue[i]
                    });
                }
                if (eid) {
                    modifyGenericityList(eid, {
                        ...parameter[0],
                        parameters: newPara,
                        value: newValue
                    });
                } else {
                    addGenericityList({
                        ...parameter[0],
                        parameters: newPara,
                        value: newValue
                    });
                }
                setParamter([{
                    name: '',
                    id: '',
                    parameters: []
                }]);
                onCancel();
            }
        });
    };

    return (
        <Modal
            className={styles["edit-target-modal"]}
            visible={visible}
            destroyOnClose={true}
            onOk={onOk}
            centered={true}
            onCancel={() => {
                setParamter([{
                    name: '',
                    id: '',
                    parameters: []
                }]);
                onCancel();
            }
            }
            onSave={() => onSave()}
            bodyStyle={{maxHeight: 500}}
            title={Object.keys(dataSource).length ? IntlFormatMessage('laboratory.detail.editgenericity')
                : IntlFormatMessage('laboratory.detail.create')}
        >
            <Form>
                <FormItem label={IntlFormatMessage('laboratory.detail.genericity')} {...labelLayout}>
                    {getFieldDecorator('algorithmId', {
                        initialValue: algorithmId || undefined,
                        rules: [
                            {
                                required: true,
                                message: IntlFormatMessage('laboratory.detail.selectgenericity'),
                            },
                        ],
                    })(
                        <Select
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                            style={{width: '100%'}}
                            placeholder={IntlFormatMessage('laboratory.detail.selectgenericity')}
                            onChange={(value) => {
                                setSelectAlog(value);
                                setParamter(genericityData.filter(item => value === item.algorithmId).map(item => {
                                    return {
                                        name: item.name,
                                        id: item.id,
                                        algorithmId: item.algorithmId,
                                        algorithmName: item.algorithmName,
                                        algorithmVersion: item.algorithmVersion,
                                        algorithmGenericId: item.id,
                                        parameters: item.parameters || []
                                    };
                                }));
                            }}
                        >
                            {genericityData.map((item) => {
                                    return (
                                        <Option value={item.algorithmId} key={item.algorithmId}>
                                            {item.name}
                                        </Option>
                                    );
                                }
                            )}
                        </Select>
                    )}
                </FormItem>
                {
                    selectAlog &&
                    parameter[0].parameters.map((item) => {
                        if (item.name) {
                            return (
                                <FormItem
                                    key={item.name}
                                    label={item.name}
                                    {...labelLayout}
                                >
                                    {getFieldDecorator(item.name, {
                                        initialValue: item.value,
                                        rules: [
                                            {
                                                required: false,
                                                message: IntlFormatMessage('laboratory.anomaly.cannotParameter'),
                                            },
                                        ],
                                    })(<Input disabled={!item.value} autoComplete="off"/>)}
                                </FormItem>
                            );
                        }
                    })
                }
            </Form>
        </Modal>
    );
};

export default connect(({laboratoryStore}) => {
    return {
        addGenericityList: laboratoryStore.addGenericityList,
        genericityData: laboratoryStore.genericityData,
        genericityList: laboratoryStore.genericityList,
        modifyGenericityList: laboratoryStore.modifyGenericityList
    };
})(Form.create()(ArithmeticSelectModal));