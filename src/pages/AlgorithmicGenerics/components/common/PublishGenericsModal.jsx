import {Button, Modal, Icon, Input, Col, Tooltip, Form, Select} from "@chaoswise/ui";
import React, {useEffect} from "react";
import styles from '@/pages/AlgorithmicGenerics/assets/index.less';
import {formatType} from "@/globalConstants";
import {IntlFormatMessage} from "@/utils/util";

const PublishGenericsModal = (props) => {
    const {
        form: {getFieldDecorator},
        visible, onCancel, onSave, dataSource = {}, title = '',
    } = props;

    const {name = '', scene = ''} = dataSource;

    return (
        <Modal
            visible={visible}
            className={styles["publish-generics-modal"]}
            destroyOnClose={true}
            onOk={() => onSave()}
            onCancel={() => onCancel()}
            title={title}
        >
            <div className="publish-generics-modal-box">
                <Icon type="exclamation-circle" theme="filled" className="publish-generics-modal-icon"/>
                <div>
                    <h4 style={{marginBottom: 24}}>{IntlFormatMessage('generics.create.correspondingalgorithm')}</h4>
                    <p>{IntlFormatMessage('generics.create.algorithmscenario')}：{IntlFormatMessage(formatType(scene))}</p>
                    <p>{IntlFormatMessage('generics.list.name')}：{name}</p>
                </div>
            </div>
        </Modal>
    )
}

export default Form.create()(PublishGenericsModal);