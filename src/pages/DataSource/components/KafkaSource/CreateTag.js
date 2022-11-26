import React, {Fragment,} from 'react';
import {Icon, Modal, Tooltip, Input, message} from '@chaoswise/ui';
import {connect, toJS} from '@chaoswise/cw-mobx';
import {success, error} from "@/utils/tip";
import {useFetchState} from "@/components/HooksState";
import {IntlFormatMessage} from "@/utils/util";

function CreateTag(props) {
    const {
        basicInfoAddTage,
        addTags
    } = props;
    const [visible, setVisible] = useFetchState(false);
    const [tagsValue, setTagsValue] = useFetchState('');

    const showAddTagModal = () => {
        setVisible(true);
    };
    const addTag = () => {
        if (!tagsValue || !tagsValue.trim()) {
            return error(IntlFormatMessage('datasource.create.entertagname'));
        }
        const callback = () => {
            setTagsValue('');
            setVisible(false);
        };
        //编辑页面的新建标签
        if (addTags) {
            addTags(tagsValue, callback);
        } else {
            //新增页面的新建标签
            basicInfoAddTage(tagsValue, 'createDataSource', {
                cb: () => {
                    callback();
                }
            });
        }
    };

    const handleCancelTag = () => {
        setTagsValue('');
        setVisible(false);
    };

    const onChange = (e) => {
        setTagsValue(e.target.value);
    };
    return (
        <Fragment>
            <Tooltip title={IntlFormatMessage('datasource.create.tag')}>
                <Icon
                    type="plus-circle-o"
                    style={{
                        fontSize: 16,
                        color: 'rgba(0,0,0,0.45)',
                        cursor: "pointer",
                        marginLeft: "8px"
                    }}
                    onClick={showAddTagModal}
                />
            </Tooltip>
            <Modal
                title={IntlFormatMessage('datasource.create.tag')}
                visible={visible}
                onOk={addTag}
                onCancel={handleCancelTag}
                okText={IntlFormatMessage('common.explore.setting.modal.determine')}
                cancelText={IntlFormatMessage('common.explore.setting.modal.cancel')}
                destroyOnClose={true}
                size={'small'}
            >
                <Input
                    type="text"
                    placeholder={IntlFormatMessage('datasource.create.entertagname')}
                    value={tagsValue}
                    onChange={onChange}
                />
            </Modal>
        </Fragment>

    );
}

export default connect(({dataSourceStore}) => {
    return {
        basicInfoAddTage: dataSourceStore.basicInfoAddTage
    };
})(CreateTag);