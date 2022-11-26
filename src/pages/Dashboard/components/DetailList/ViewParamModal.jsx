import {Button, Modal, Icon, Input, Col, InputNumber, Tooltip, Form, Select} from "@chaoswise/ui";
import React, {Fragment, useEffect} from "react";
import {labelLayout, paramsModalLabelLayout} from "@/globalConstants";
import styles from '@/pages/Dashboard/components/DetailList/index.less';
import BasicTooltip from "@/components/BasicTooltip";
import TooltipDiv from "@/components/TooltipDiv";
import {IntlFormatMessage} from "@/utils/util";

const FormItem = Form.Item;
const Option = Select.Option;

const ViewParamModal = (props) => {
    const {
        form: {getFieldDecorator}, dataSource, showFooter = true,
    } = props;
    const {displayNames, parameters = [],} = dataSource;

    return (
        <MocalHeader {...props}>
            <div className="flex-box">
                <div className="title-box">{IntlFormatMessage('dashboard.detail.algorithmname')}：</div>
                <div>{displayNames}</div>
            </div>
            <div className="parameters-box">
                {(parameters || []).map((item,index) => {
                    const {descriptions, type = '', name, value} = item;
                    return (
                        <div className="flex-box" key={index}>
                            <div className="title-box">
                                <TooltipDiv title={name} placement={'topRight'}>
                                    {name}
                                </TooltipDiv>
                                ：
                            </div>
                            <div className="info-box">
                                <div className="info-box-value">{value}</div>
                                <BasicTooltip
                                    title={descriptions}>
                                    <Icon type="question-circle" className="info-box-icon"/>
                                </BasicTooltip>
                            </div>
                        </div>
                    )
                })}
            </div>
        </MocalHeader>
    )
}

const MocalHeader = (props) => {
    const {
        children, visible, onCancel, onSave, title = '', showFooter = true,
    } = props;
    if (!!showFooter) {
        return (
            <Modal
                visible={visible}
                destroyOnClose={true}
                onOk={() => onSave()}
                onCancel={() => onCancel()}
                title={title}
                className={styles["view-param-modal"]}
            >
                {children}
            </Modal>
        )
    } else {
        return (
            <Modal
                visible={visible}
                destroyOnClose={true}
                footer={null}
                onCancel={() => onCancel()}
                title={title}
                className={styles["view-param-modal"]}
            >
                {children}
            </Modal>
        )
    }
}

export default (ViewParamModal);