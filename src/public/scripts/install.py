#!/usr/bin/env python
# -*- coding: utf-8 -*-

from Core import Core, init_argparse

# 服务名称，按需修改
SERVICE_NAME = "doiaWeb"

def install(local_ip, json_path):
    core = Core(local_ip, json_path, SERVICE_NAME)

    ###### 解析占位符 移动目录 ######
    # 服务部署路径
    CW_INSTALL_APP_DIR = core.get_config_common_value("CW_INSTALL_APP_DIR")
    # 服务相关路径
    app_path = core.path_join(CW_INSTALL_APP_DIR, SERVICE_NAME)
    web_path = core.path_join(CW_INSTALL_APP_DIR, 'portalWeb')
    # 创建相关目录
    core.make_dir(web_path)
    # 移动 doiaWeb 到portalWeb/ 下
    core.run_shell('mv {0} {1}'.format(app_path, web_path))


if __name__ == '__main__':
    args = init_argparse()
    install(args.local_ip, args.json_path)
    print("安装成功")