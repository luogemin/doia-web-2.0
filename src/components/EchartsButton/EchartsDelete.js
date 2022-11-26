import React, {Fragment,} from 'react';
import {Form, Icon, Tooltip} from "@chaoswise/ui";
import BasicTooltip from "@/components/BasicTooltip";
import styles from './index.less';
import {IntlFormatMessage} from "@/utils/util";

const EchartsDelete = (props) => {
    const {onClick} = props;

    return <BasicTooltip title={IntlFormatMessage('laboratory.anomaly.genericityDelete')} placement={'bottom'}>
        <Icon
            type="delete"
            onClick={onClick}
            className={styles["echarts-btn"]}
        />
    </BasicTooltip>;
};

export default EchartsDelete;