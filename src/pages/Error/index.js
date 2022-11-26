import React from 'react';
import ErrorSvg404 from './assets/404.svg';
import styles from './assets/index.less';
import {IntlFormatMessage} from "@/utils/util";

const Error = () => {
    return (
        <div className={styles['error-board']}>
            <img src={ErrorSvg404} alt="404"/>
            <p>{IntlFormatMessage('task.common.error')}</p>
        </div>
    );
};
export default Error;