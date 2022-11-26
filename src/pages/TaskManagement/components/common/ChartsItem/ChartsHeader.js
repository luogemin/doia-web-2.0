import React, {Fragment, useEffect, useMemo} from "react";
import {Spin, message, Tooltip, Button, Icon, Empty, Badge} from '@chaoswise/ui';
import styles from "@/pages/TaskManagement/components/common/ChartsItem/index.less";
import {IntlFormatMessage} from "@/utils/util";

const statusObj = {
    'error': {
        title: IntlFormatMessage('task.detail.failed'),
        class: 'charts_ctrl_box_items_error',
        icon: 'exclamation-circle',
        badge: <Badge status="error"/>
    },
    'warning': {
        title: IntlFormatMessage('task.detail.trained'),
        class: 'charts_ctrl_box_items_warning',
        icon: 'exclamation-circle',
        badge: <Badge status="success"/>,
    },
    'success': {
        title: IntlFormatMessage('task.detail.trained'),
        class: 'charts_ctrl_box_items_success',
        icon: 'exclamation-circle',
        badge: <Badge status="success"/>,
    },
    '': {
        title: IntlFormatMessage('task.detail.untrainedvalue'),
        badge: <Badge status="default"/>
    },
    'nodata': {
        title: IntlFormatMessage('task.common.noData'),
        // class: 'charts_ctrl_box_items_error',
        // icon: 'question-circle',
    },
};

const ChartsHeader = (props) => {
    const {saveFun, editFun, errorMsg = {}, item = {}} = props;
    const {genericId = ''} = item;

    return (
        <div className={styles["charts-header-box"]}>
            <div className="charts-header-box-left">
                {
                    statusObj[errorMsg.status] ?
                        <Fragment>
                            {statusObj[errorMsg.status].badge}
                            {`${IntlFormatMessage('task.list.status')}:  ${statusObj[errorMsg.status].title}`}
                            {
                                errorMsg.messageZH ?
                                    <Tooltip title={errorMsg.messageZH}>
                                        <Icon
                                            type={statusObj[errorMsg.status].icon}
                                            theme="filled"
                                            className={`charts_ctrl_box_items_icon ${statusObj[errorMsg.status].class}`}
                                        />
                                    </Tooltip>
                                    : null
                            }
                        </Fragment>
                        : null
                }
            </div>
        </div>
    );
};

export default ChartsHeader;