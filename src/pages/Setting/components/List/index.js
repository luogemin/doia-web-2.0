import React, {Fragment, useEffect,} from 'react';
import {Icon, Input, Tag, Tabs, Modal, Tooltip, Button, Empty, Form} from '@chaoswise/ui';
import styles from '../../assets/index.less';
import {formatType,} from "@/globalConstants";
import {connect, toJS} from "@chaoswise/cw-mobx";
import {error, success} from "@/utils/tip";
import TooltipDiv from "@/components/TooltipDiv";
import {IntlFormatMessage, IsInternationalization, strlen, unique} from "@/utils/util";
import {useFetchState} from "@/components/HooksState";
import IconTooltip from "@/components/IconTooltip";
import BasicTooltip from "@/components/BasicTooltip";
import CreateTypeModal from "@/components/CreateTypeModal";

const {TabPane} = Tabs;

const SettingList = (props) => {
    let {
        form, match = {}, history, setBackTitle, setActiveTabsReducer, activeTab, rootCauseResetAsync,
    } = props;
    let {path = ""} = match;

    const [resetVisible, setResetlVisible] = useFetchState(false);

    const handelReset = () => {
        rootCauseResetAsync((res) => {
            if (res && res.status === "success") {
                success(IntlFormatMessage('laboratory.anomaly.reset'));
            } else {
                error(IntlFormatMessage('laboratory.anomaly.resetFailed'));
            }
        });
        setResetlVisible(false);
    };

    return (
        <div className={styles['setting']}>
            <div style={{height: 'calc(100% - 1px)'}}>
                <Tabs defaultActiveKey={toJS(activeTab)} onChange={(key) => {
                    setActiveTabsReducer(key);
                }}>
                    <TabPane tab={IntlFormatMessage('task.root.name')} key="0"/>
                </Tabs>
                <div className={"data-store_right"}>
                    <div className="flex-box">{IntlFormatMessage('laboratory.detail.algorithmScenarioRCA')}:
                        &nbsp;
                        <TooltipDiv onClick={() => setResetlVisible(true)}>{IntlFormatMessage('laboratory.detail.resetAlgorithmModel')}</TooltipDiv>
                        <IconTooltip
                            style={{marginLeft: '8px'}}
                            title={IntlFormatMessage('laboratory.anomaly.resetAlgorithmModel')}
                        />
                    </div>
                </div>
            </div>

            {
                resetVisible &&
                <Modal
                    className={styles["reset-modal"]}
                    title={IntlFormatMessage('common.note')}
                    visible={resetVisible}
                    centered={true}
                    onCancel={() => setResetlVisible(false)}
                    onOk={() => {
                        handelReset();
                    }}
                >
                    <div className="reset-modal-body">
                        <Icon type="exclamation-circle" theme="filled" style={{
                            fontSize: 24,
                            color: 'rgba(250,173,20,1)',
                            marginRight: 8
                        }}/>
                        {IntlFormatMessage('laboratory.anomaly.resetAlgorithmModel')}
                    </div>
                </Modal>
            }
        </div>
    );
};

export default connect(({settingStore, laboratoryStore, store}) => {
    return {
        setBackTitle: store.setBackTitle,
        setActiveTabsReducer: settingStore.setActiveTabsReducer,
        activeTab: settingStore.activeTab,
        rootCauseResetAsync: laboratoryStore.rootCauseResetAsync,
    };
})(Form.create()(SettingList));
