import { Modal } from '@chaoswise/ui';
import {IntlFormatMessage} from "@/utils/util";
const confirm = Modal.confirm;

export default function customComfirm(options={}){
    const defaultOptions = {
        okText:IntlFormatMessage('common.explore.setting.modal.determine'),
        cancelText:IntlFormatMessage('common.explore.setting.modal.cancel'),
        className:"customModal"
    };

    return confirm(Object.assign({},defaultOptions,options));
}
