import React, {Fragment, useEffect,} from 'react';
import {Icon, Input, Select, CWTable as Table, Tooltip, Dropdown, Modal, Popover, Button, InputNumber} from '@chaoswise/ui';
import styles from './index.less';

const TooltipDiv = (props) => {
    const {title = '', style = {}, children = null, placement = 'topLeft', onClick = null, className = ''} = props;
    return <Header {...props}>
        <div className={`${styles['toolTip-div']} ${className}`} style={Object.assign({}, onClick ? {
            cursor: 'pointer',
            color: '#1890FF',
        } : {}, style)} onClick={onClick}>
            {children}
        </div>
    </Header>;
};

const Header = (props) => {
    const {children, title = '', placement = 'topLeft',} = props;
    if (title) {
        return <Tooltip title={title} placement={placement}>
            {children}
        </Tooltip>;
    } else {
        return <Fragment>
            {children}
        </Fragment>;
    }
};

export default TooltipDiv;
