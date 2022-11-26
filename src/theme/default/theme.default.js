/*
 * @Author: authur.wang
 * @Date: 2018-05-18 20:17:59
 * @Last Modified by: authur.wang
 * @Last Modified time: 2018-10-30 14:53:19
 * antd修正样式库
 */

module.exports = function(publicRootPath=""){
    return {
        // "@icon-url":'"~ant-font-git/font_148784_v4ggb6wrjmkotj4i"',
        "@icon-url":'"../' + publicRootPath + 'public/fonts/font_148784_v4ggb6wrjmkotj4i"',
        // "@icon-url":publicRootPath + 'public/fonts/font_148784_v4ggb6wrjmkotj4i"',
        // "@public-url":'"/'+publicRootPath+'public"',
        // "@public-url":publicRootPath+'public"',
        "@blue-6":"#008DFF",
        "@red-6":"#D0280D",
        "@green-6":"#000000",
        "@body-background": "#313944",
        // "@component-background": "#252C31",
        "@heading-color": "fade(#000000, 85%)",
        "@text-color": "fade(#000000, 65%)",
        "@text-color-secondary": "fade(#000000, 45%)",
        // "@btn-default-bg":"@component-background",
        "@ant-layout-header-background":"",
        "@input-placeholder-color":"fade(#000000, 45%)",
        '@border-radius-base':"2px",
        // "@layout-body-background": "#313944"
    }
}
