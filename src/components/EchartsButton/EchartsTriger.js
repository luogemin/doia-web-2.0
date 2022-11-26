import React, {Fragment,} from 'react';
import {Form, Icon, Tooltip} from "@chaoswise/ui";
import BasicTooltip from "@/components/BasicTooltip";
import styles from './index.less';
import {IntlFormatMessage} from "@/utils/util";

const EchartsTriger = (props) => {
    const {onClick} = props;

    return <BasicTooltip title={IntlFormatMessage('laboratory.anomaly.calculate')} placement={'bottom'}>
        <Icon
            type="calculator"
            onClick={onClick}
            className={styles["echarts-btn"]}
        />
    </BasicTooltip>;
};

export default EchartsTriger;