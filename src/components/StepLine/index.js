import React, {Fragment, useEffect, } from 'react';
import {Icon} from "@chaoswise/ui";
import styles from "./index.less";

const StepLine = (props) => {
    const {steps = [], current = 0} = props;

    return <div className={styles['step-box']}>
        {
            (steps || []).map((item, index) => {
                return <div className="step-item alignFlex" key={index}>
                    <div className={`step-item-icon allFlex ${current >= index?'icon-select':''}`}>{index + 1}</div>
                    <p className={`step-item-title ${current >= index?'title-select':''}`}>{item.title}</p>
                    {
                        (index + 1 < steps.length) ?
                            <Icon type="right" className="step-right-icon"/> : null
                    }
                </div>;
            })
        }
    </div>;
};

export default StepLine;