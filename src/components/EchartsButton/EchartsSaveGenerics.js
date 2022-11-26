import React, {Fragment,} from 'react';
import {Form, Icon, Tooltip} from "@chaoswise/ui";
import BasicTooltip from "@/components/BasicTooltip";
import styles from './index.less';
import {IntlFormatMessage} from "@/utils/util";

const EchartsSaveGenerics = (props) => {
    const {onClick} = props;

    return <BasicTooltip title={IntlFormatMessage('common.savegenericity')} placement={'bottom'}>
        <Icon
            type="save"
            onClick={onClick}
            className={styles["echarts-btn"]}
        />
    </BasicTooltip>;
};

export default EchartsSaveGenerics;