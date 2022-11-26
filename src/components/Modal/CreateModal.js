import React from 'react';
import { Modal } from '@chaoswise/ui';
import styles from './createModal.less';

const CreateMOdal = (props) => {
    const {
        match = {},
        history,
        dataSourceType,
        bodyTitle='',
        createSingle,
    } = props;
    const {path = ""} = match;



    const openCreateDatasource = (item)=>{
        const { type } =item;
        if(createSingle){
            createSingle(type);
        }else{
            history.push(`${path}/create/type/${type}`);
        }
    };
    return (
        <Modal 
            {...props}
        >
            <div className={styles['create-datasource-title']}>{bodyTitle}</div>
            <div className={styles["create-datasource-box"]}>
                {
                   dataSourceType.map((item) => {
                        return (
                            <div key={item.type} className={styles["create-datasource-item"]}>
                                <div className={styles['create-datasource-main']} onClick={()=>openCreateDatasource(item)}>
                                    {item.title}
                                </div>
                                <p className={styles["item-info"]}>
                                    {item.title}
                                </p>
                            </div>
                        );
                    })
                }
            </div>
        </Modal>
    );
};

export default CreateMOdal;

