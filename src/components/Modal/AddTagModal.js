import React, {Component} from 'react';
import {Modal, Input} from '@chaoswise/ui';
import styles from './index.less';
import {IntlFormatMessage} from "@/utils/util";

const maxTagLength = 20;

class AddTagModal extends Component {
  constructor() {
    super();
    this.state = {
      errorModal: false,
      errorMsg: ""
    };
    this.tagInput = null;
  }

  addTag = () => {
    const {handleAddTag} = this.props;
    const element = this.tagInput, error = this.error;

    const value = element ? element.input.value : null;

    if (value && value.length) {
      if (value.length <= maxTagLength) {
        handleAddTag(value);
        this.setState({
          errorModal: false,
          errorMsg: ""
        });
      } else {
        this.setState({
          errorModal: true,
          errorMsg: `${IntlFormatMessage('task.common.maximumLength')}${maxTagLength}${IntlFormatMessage('task.common.currentLength')}${value.length}${IntlFormatMessage('task.common.currentLengthZero')}`
        });
      }

    } else {
      this.setState({
        errorModal: true,
        errorMsg: IntlFormatMessage('task.common.cannotEmpty')
      });
    }
  }

  render() {
    const {
      handleAddTag,
      handleCancelTag
    } = this.props;
    return (
      <Modal
        className={`${styles["customModal"]} ${this.state.errorModal ? styles["errorModal"] : ""}`}
        title="添加标签"
        visible
        onOk={this.addTag}
        onCancel={handleCancelTag}
        okText={IntlFormatMessage('common.explore.setting.modal.determine')}
        cancelText={IntlFormatMessage('common.explore.setting.modal.cancel')}
        size={'small'}
      >
        <Input
          ref={(id) => this.tagInput = id}
          type="text"
          placeholder={IntlFormatMessage('datasource.create.entertagname')}
          className={this.state.errorModal ? styles["ant-input-error"] : ""}
        />
        <div ref={(grid) => {
          this.error = grid;
        }} className={styles["error"]}>{this.state.errorMsg}</div>
      </Modal>
    );
  }
}

export default AddTagModal;
