import React, {Fragment,} from 'react';
import {Form, Icon, Tooltip} from "@chaoswise/ui";
import BasicTooltip from "@/components/BasicTooltip";
import styles from './index.less';
import {IntlFormatMessage} from "@/utils/util";

const EchartsReset = (props) => {
    const {onClick} = props;

    return <BasicTooltip title={IntlFormatMessage('task.common.reset')} placement={'bottom'}>
        <Icon
            type="sync"
            onClick={onClick}
            className={styles["echarts-btn"]}
        />
    </BasicTooltip>;
};

export default EchartsReset;