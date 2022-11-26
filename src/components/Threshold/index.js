import React from 'react';
import {InputNumber, Switch} from '@chaoswise/ui';
import styles from './index.less';
import {IntlFormatMessage} from "@/utils/util";

export default function Threshold(props) {
    const {
        upValue,
        lowValue,
        upValueChange,
        lowValueChange,
        checked = false,
        checkedChange,
        setSettingLine,
    } = props;
    const onUpValueChange = (value) => {
        upValueChange && upValueChange(value);
    };
    const onLowValueChange = (value) => {
        lowValueChange && lowValueChange(value);
    };
    const onCheckChange = (check) => {
        checkedChange && checkedChange(check);
    };
    return (
        <div className={styles['threshold-box']} onMouseLeave={() => setSettingLine(false)}>
            <div style={{marginBottom: '12px'}}>{IntlFormatMessage('common.threshold')}</div>
            <div style={{marginBottom: '8px'}}>
                <span>{IntlFormatMessage('common.upper')}：</span>
                <InputNumber value={upValue} onChange={onUpValueChange}/>
            </div>
            <div style={{marginBottom: '8px'}}>
                <span>{IntlFormatMessage('common.lower')}：</span>
                <InputNumber value={lowValue} onChange={onLowValueChange}/>
            </div>
            <div>
                <span>{IntlFormatMessage('laboratory.anomaly.display')}：</span>
                <Switch checked={checked} onChange={onCheckChange}/>
            </div>
        </div>
    );
}
