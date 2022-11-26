import React,{ useRef } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
const defaultStyle = {
    height: "100%",
    width: "100%",
    overflowX: "hidden"
}

const BasicScrollBar = ({ children, style, onScroll, handleScroll, autoHide = true, ...rest }) => {
    const scrollRef = useRef(null);

    const newStyle = Object.assign({},defaultStyle, style);

    const onScrollStop = () => {
        onScroll && onScroll(scrollRef.current.getScrollTop(), scrollRef.current.getClientHeight())
    }
    return (
        <Scrollbars
            autoHide={autoHide}
            autoHideTimeout={1000}
            autoHideDuration={200}
            style={newStyle}
            thumbMinSize={0}
            ref={scrollRef}
            onScrollStop={onScrollStop}
            onScroll={handleScroll}
            renderTrackHorizontal={({ style, ...props }) => {
                const finalStyle = {
                    ...style,
                    right: 2,
                    bottom: 2,
                    left: 2,
                    borderRadius: 3
                };

                return newStyle.overflowX === "hidden" ? <div /> : <div style={finalStyle} {...props} />;
            }}

            {...rest}

        >
            {children}
        </Scrollbars>
    )
}


export default BasicScrollBar;
