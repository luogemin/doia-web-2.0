import React, {Fragment,} from 'react';
import {Form, Icon, Tooltip} from "@chaoswise/ui";
import BasicTooltip from "@/components/BasicTooltip";
import styles from './index.less';
import {IntlFormatMessage} from "@/utils/util";

const EchartsEditGenerics = (props) => {
    const {onClick} = props;

    return <BasicTooltip title={IntlFormatMessage('laboratory.detail.editgenericity')} placement={'bottom'}>
        <Icon
            type="edit"
            onClick={onClick}
            className={styles["echarts-btn"]}
        />
    </BasicTooltip>;
};

export default EchartsEditGenerics;