import ConfirmModal from './ConfirmModal';
import AddTagModal from './AddTagModal';
import CopyModelApiModal from './CopyModelApi';
import CopyDataSourceApiModal from './CopyDataSourceApi';
import SampleModal from './SampleModal';

import './index.less';


export { default as ConfirmModal } from './ConfirmModal';
export { default as AddTagModal } from './AddTagModal';
export { default as CopyModelApiModal } from './CopyModelApi';
export { default as CopyDataSourceApiModal } from './CopyDataSourceApi';
export { default as SampleModal } from './SampleModal';

const modal = {
    ConfirmModal,
    AddTagModal,
    CopyModelApiModal,
    CopyDataSourceApiModal,
    SampleModal
};
export default modal;