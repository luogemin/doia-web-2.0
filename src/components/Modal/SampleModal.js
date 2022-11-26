import React, {Component} from 'react';
import {Modal, Input, Button} from '@chaoswise/ui';
import ConfirmModal from './ConfirmModal';
import styles from './index.less';
import {IntlFormatMessage} from "@/utils/util";

class SampleModal extends Component {
  constructor() {
    super();
    this.state = {
      errorModal: false,
      errorMsg: ""
    };

    this.sampleInput = null;
  }

  parseSample = () => {
    const self = this;
    const {
      formatStreamSampleHandle,
      updateDataStructHandle,
      handleCancelModal
    } = self.props;

    const element = this.sampleInput, error = this.error;
    const value = element ? element.state.value : null;

    if (value) {
      //提示是否覆盖样本
      ConfirmModal({
        title: IntlFormatMessage('common.sample.modal.sample.analysis.tips'),
        content: IntlFormatMessage('common.sample.modal.sample.analysis.results'),
        onOk: () => {
          //解析样本
          formatStreamSampleHandle(value, (res) => {
            //覆盖数据结构
            updateDataStructHandle(res);
            //修改错误状态
            this.setState({
              errorModal: false,
              errorMsg: ""
            }, () => {
              handleCancelModal();
            });
          });
        }
      });


    } else {
      this.setState({
        errorModal: true,
        errorMsg: IntlFormatMessage('common.sample.modal.sample.cannot.empty')
      });
    }
  }

  render() {
    const {
      handleCancelModal
    } = this.props;
    return (
      <Modal
        className={`${styles["customModal"]} ${styles["sampleModal"]} ${(this.state.errorModal ? styles["errorModal"] : "")}`}
        title={IntlFormatMessage('common.sample.modal.input.sample')}
        visible
        onOk={this.parseSample}
        onCancel={handleCancelModal}
        okText={IntlFormatMessage('common.sample.modal.input.json.analysis')}
        cancelText={IntlFormatMessage('common.explore.setting.modal.cancel')}
        closable={false}
        size={'large'}
      >
        <Input.TextArea
          ref={(id) => this.sampleInput = id}
          autoSize={{minRows: 4}}
          placeholder={IntlFormatMessage('common.sample.modal.input.json.data')}
          className={this.state.errorModal ? "ant-input-error" : ""}
        />
        <div ref={(grid) => {
          this.error = grid;
        }} className={"error"}>{this.state.errorMsg}</div>
      </Modal>
    );
  }
}

export default SampleModal;
