import React, {Fragment, } from "react";
import {Tooltip} from 'antd';
import styles from './index.less';
import {IEVersion} from "@/utils/util";

const BasicTooltip = (props) => {
    const {title = '', placement = 'topLeft', children,} = props;
    const isIE = () => {
        let Browser = IEVersion();
        return (Browser === 10) || (Browser === 11);
    };
    if (isIE()) {
        let tooltipVisible = false;
        const tooltipItem = document.createElement('div');
        tooltipItem.className = 'cw-tooltip-item';
        tooltipItem.innerText = title;
        tooltipItem.style.visibility = 'hidden';
        document.body.appendChild(tooltipItem);
        const showTooltip = (e) => {
            if (!tooltipVisible) {
                tooltipVisible = true;
                tooltipItem.style.visibility = 'visible';
            }
            tooltipItem.style.left = e.clientX + 0 + 'px';
            tooltipItem.style.top = e.clientY + 16 + 'px';
        };
        const hideTooltip = () => {
            tooltipVisible = false;
            tooltipItem.style.visibility = 'hidden';
        };

        return (
            <div className={styles['cw-tooltip-box']}
                 onMouseMove={(e) => showTooltip(e)}
                 onMouseOut={() => hideTooltip()}>
                {children}
            </div>
        );
    } else {
        return <Tooltip {...props}>
            {children}
        </Tooltip>;
    }
};

export default BasicTooltip;