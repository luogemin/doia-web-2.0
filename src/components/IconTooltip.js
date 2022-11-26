import React, {Fragment,} from 'react';
import {Form, Icon, Tooltip} from "@chaoswise/ui";
import BasicTooltip from "@/components/BasicTooltip";


const IconTooltip = (props) => {
    const {title = '', style = null, type = "question-circle"} = props;

    return <BasicTooltip title={title}>
        <Icon type={type} style={Object.assign({}, {
            fontSize: 16,
            color: 'rgba(0,0,0,0.45)',
        }, style)}/>
    </BasicTooltip>;
};

export default IconTooltip;