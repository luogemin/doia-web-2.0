import React, {forwardRef} from 'react';
import {Select, Spin} from '@chaoswise/ui';
import {IntlFormatMessage} from "@/utils/util";

let timer = null;
/*eslint-disable*/
const ScrollSelect = forwardRef((props, ref) => {
    const {
        onPopupScroll: _onPopupScroll = () => {
        },
        scrollLoading = false,
        onSearch,
        onChange,
        labelInValue = false,
        ...rest
    } = props;
    const onScroll = (e) => {
        if (e.target.scrollTop + e.target.offsetHeight === e.target.scrollHeight) {
            _onPopupScroll(e);
        }
    };
    return (
        <Select
            dropdownRender={(menu) => {
                return <div>
                    {menu}
                    {
                        scrollLoading &&
                        <div style={{textAlign: 'center'}}><Spin size="small" style={{marginRight: 10}}/>
                            {/* 数据加载中 */}
                            {IntlFormatMessage('task.common.loading')}
                        </div>
                    }
                </div>
            }}
            labelInValue={labelInValue}
            onPopupScroll={onScroll}
            onSearch={(value) => {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    onSearch(value)
                }, 500)
            }}
            onChange={(value, option) => {
                if (labelInValue) {
                    onChange(Object.assign({}, value, !!value ? {
                        value: value.key,
                    } : {}), option);
                } else {
                    onChange(value, option);
                }
            }}
            ref={ref}
            {...rest}
        />
    );
});
/*eslint-disable*/
export default ScrollSelect;
