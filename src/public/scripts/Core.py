# -*- coding: utf-8 -*-
import os
import sys
import pwd
import shutil
import json
import argparse
import base64
import subprocess
import re


# 异常输出
def _execption(msg):
    """异常退出
    退出码 3
    """
    if sys.exc_info()[2]:
        f = sys.exc_info()[2].tb_frame.f_back
        print("Exception: {}".format(msg.strip()))
        print("{} {} {}".format(f.f_code.co_filename, f.f_code.co_name, f.f_lineno))
    else:
        print("Exception: {}".format(msg.strip()))
    sys.exit(3)


# path join
def _path_join(*args):
    """os.path.join"""
    return os.path.join(*args)


# path abs
def _path_abs(path):
    """os.path.abspath"""
    return os.path.abspath(path)


# path dirname
def _path_dirname(path):
    """os.path.dirname"""
    return os.path.dirname(path)


class Core(object):
    """核心类 解析 data.json 获取占位符值
    参数: 节点内网IP地址, data.json文件位置, 服务名

    内部变量:

    _local_ip                       ->  该节点内网通信IP

    _json_path                      ->  data.json 的绝对路径

    _service_name                   ->  服务名

    _config                         ->  data.json 字典

    _config_common                  ->  data.json 中 common 数据字典

    _config_current_service         ->  data.json 中 该自研服务的 数据字典

    _config_current_basic           ->  data.json 中 该基础组件的 数据字典
    """

    def __init__(self, local_ip, json_path, service_name):
        self._local_ip = local_ip
        self._json_path = json_path
        self._service_name = service_name
        self.exception = _execption
        self.path_join = _path_join
        self.path_abs = _path_abs
        self.path_dirname = _path_dirname
        error, result = self._load_config_from_file()
        if not error:
            _execption(result)
        else:
            self._config = result
            error, result = self._check_current_service_exist()
            if not error:
                _execption(result)
            self._config_common = self._get_current_config("common")
            self._config_current_service = self._get_current_config("services")
            self._config_current_basic = self._get_current_config("basics")
            self._config_external = self._get_current_config("external")
            # 用户 root -> CW_RUN_USER or current username
            self._user = self._get_user()
            # 规范目录路径
            self._depend_path_app = self.get_config_common_value("CW_INSTALL_APP_DIR")
            self._depend_path_logs = self.get_config_common_value("CW_INSTALL_LOGS_DIR")
            self._depend_path_data = self.get_config_common_value("CW_INSTALL_DATA_DIR")
            # 需部署的自研服务列表
            self._self_service_list = self._get_self_service_list()

    # 内部方法

    def _get_value(self, data, key):
        try:
            value = data[key]
            return value
        except Exception:
            _execption("KeyError: {} not in {}".format(key, data))

    def _get_user(self):
        """解析用户名

        root  -> CW_RUN_USER

        other -> username
        """
        if os.getuid() == 0:
            return self._config_common["CW_RUN_USER"]
        else:
            return pwd.getpwuid(os.getuid()).pw_name

    def _load_config_from_file(self):
        """内部方法 加载解析 data.json 文件"""
        if not os.path.isfile(self._json_path):
            return False, "No such file or directory {}".format(self._json_path)
        with open(self._json_path) as f:
            try:
                return True, json.load(f)
            except Exception:
                return False, "No JSON object could be decoded {}".format(
                    self._json_path
                )

    def _get_self_service_list(self):
        self_service_set = set()
        for service in self._config["services"]:
            self_service_set.add(service["name"])
        return self_service_set

    def _check_current_service_exist(self):
        """检查自研服务配置是否存在"""
        exist_flag = 0
        basic_service_set = set()
        for service in self._config["basics"]:
            basic_service_set.add(service["name"])
        if self._service_name in basic_service_set:
            return True, True
        for service in self._config["services"]:
            if (
                service["name"] == self._service_name
                and service["local_ip"] == self._local_ip
            ):
                exist_flag = 1
        if exist_flag == 0:
            return False, "service {}@{} not exist in {}".format(
                self._service_name, self._local_ip, self._json_path
            )
        return True, True

    def _get_current_config(self, config_type):
        if config_type == "common" or config_type == "external":
            return self._config[config_type]
        for service in self._config[config_type]:
            if (
                service["name"] == self._service_name
                and service["local_ip"] == self._local_ip
            ):
                return service

    # 通过服务类型，服务名称，获取当前ip相应key的value,仅支持 非common,external类型
    def get_current_ip_config(self, config_type, service_name, key):
        for service in self._config[config_type]:
            if (
                service["name"] == service_name
                and service["local_ip"] == self._local_ip
            ):
                return self._get_value(service, key)

    # 通过服务类型，服务名称，获取key的value,仅支持 非common,external类型
    def get_config_service_value(self, config_type, service_name, key):
        for service in self._config[config_type]:
            if service["name"] == service_name:
                return self._get_value(service, key)

    # 通过服务类型，获取安装的产品列表,仅支持 非common,external类型
    def get_config_product_value_str(self, config_type, key):
        """
        # 获取基础组件集群IP:PORT列表
        Return string "product,product"
        """
        service_product_list = []
        for service in self._config[config_type]:
            service_product_list.append(self._get_value(service, key))

        service_product_list = list(set(service_product_list))
        result = ""
        for item in service_product_list:
            result += item + ","
        return result.strip(",")

    # 获取基础组件集群连接信息
    def get_service_ip_port_list_str(self, service_name, port_name):
        """
        # 获取基础组件集群IP:PORT列表
        Return string "ip:port,ip:port"
        """
        service_ip_port_list = []
        for service in self.get_config_basics_list():
            if (
                service["name"] == service_name
                and self._service_name in service["used_for"]
            ):
                service_ip_port_list.append(
                    "{}:{}".format(service["local_ip"], service[port_name])
                )
        if len(service_ip_port_list) == 0:
            for service in self.get_config_basics_list():
                if service["name"] == service_name and "default" in service["used_for"]:
                    service_ip_port_list.append(
                        "{}:{}".format(service["local_ip"], service[port_name])
                    )
        result = ""
        for item in service_ip_port_list:
            result += item + ","
        return result.strip(",")

    # 获取自研组件集群连接信息

    def get_self_service_ip_port_list_str(self, service_name, port_name):
        """
        # 获取自研组件集群IP:PORT列表
        Return string "ip:port,ip:port"
        """
        service_ip_port_list = []
        for service in self.get_config_services_list():
            if service["name"] == service_name:
                service_ip_port_list.append(
                    "{}:{}".format(service["local_ip"], service[port_name])
                )
        if len(service_ip_port_list) == 0:
            service_ip_port_list.append("127.0.0.1:1024")
        result = ""
        for item in service_ip_port_list:
            result += item + ","
        return result.strip(",")

    # kafka
    # def get_kafka_service_ip_port_list(self):
    #     """
    #     # 获取kafka基础组件集群IP:PORT列表
    #     Return string "kafka_ip:kafka_port,kafka_ip:kafka_port"
    #     """
    #     service_ip_port_list = []
    #     for service in self.get_config_basics_list():
    #         if service["name"] == "kafka" and self._service_name in service["used_for"]:
    #             service_ip_port_list.append("{}:{}".format(
    #                 service["local_ip"], service["service_port"]))
    #     if len(service_ip_port_list) == 0:
    #         for service in self.get_config_basics_list():
    #             if service["name"] == "kafka" and "default" in service["used_for"]:
    #                 service_ip_port_list.append("{}:{}".format(
    #                     service["local_ip"], service["service_port"]))
    #     result = ""
    #     for item in service_ip_port_list:
    #         result += item + ","
    #     return result.strip(",")

    # nacos
    def get_nacos_service_ip_port_list(self):
        """
        # 获取nacos基础组件集群IP:PORT列表
        Return string "nacos_ip:nacos_port,nacos_ip:nacos_port"
        """
        service_ip_port_list = []
        for service in self.get_config_basics_list():
            if service["name"] == "nacos" and self._service_name in service["used_for"]:
                service_ip_port_list.append(
                    "{}:{}".format(service["local_ip"], service["service_port"])
                )
        if len(service_ip_port_list) == 0:
            for service in self.get_config_basics_list():
                if service["name"] == "nacos" and "default" in service["used_for"]:
                    service_ip_port_list.append(
                        "{}:{}".format(service["local_ip"], service["service_port"])
                    )
        result = ""
        for item in service_ip_port_list:
            result += item + ","
        return result.strip(",")

    # arangodb

    def get_arangodb_service_ip_list_with_port(self, port_name):
        """
        # 获取arangodb基础组件集群IP:PORT列表
        Return list [arangodb_ip:arangodb_port,arangodb_ip:arangodb_port]
        """
        service_ip_list = []
        for service in self.get_config_basics_list():
            if (
                service["name"] == "arangodb"
                and self._service_name in service["used_for"]
            ):
                service_ip_list.append(
                    "{}:{}".format(service["local_ip"], service[port_name])
                )
        if len(service_ip_list) == 0:
            for service in self.get_config_basics_list():
                if service["name"] == "arangodb" and "default" in service["used_for"]:
                    service_ip_list.append(
                        "{}:{}".format(service["local_ip"], service[port_name])
                    )
        return service_ip_list

    # end 获取基础组件集群连接信息

    # 通过服务名获取basic服务集群节点
    # return ["10.5.194.106", "10.5.194.107"]

    def get_service_node_ip_list(self, service_name):
        used_for = self._service_name
        all_basics = self.get_config_basics_list()
        node_ip_list = []
        for service in all_basics:
            if service["name"] == service_name and used_for in service["used_for"]:
                node_ip_list.append(service["local_ip"])

        return node_ip_list

    # 通过服务名获取basic服务集群节点
    # return "10.5.194.106:10086,10.5.194.107:10086"
    def get_service_node_hosts(self, service_name, port):
        _SERVER = [
            "{0}:{1}".format(i, port)
            for i in self.get_service_node_ip_list(service_name)
        ]
        return ",".join(_SERVER)

    # data.json 相关数据获取接口
    def get_config(self):
        """获取 data.json 字典

        Return: dict
        """
        return self._config

    def get_config_common(self):
        """获取 公共配置 数据字典"""
        return self._config_common

    def get_config_common_value(self, key):
        """获取 data.json common 中 key 的值

        Return: value
        """
        return self._get_value(self._config_common, key)

    def get_config_current_service(self):
        """获取 该自研服务的 数据字典

        Return: dict
        """
        return self._config_current_service

    def get_config_current_service_value(self, key):
        """获取 当前自研服务 配置字典 key 的值

        Return: value
        """
        return self._get_value(self._config_current_service, key)

    def get_config_services_list(self):
        """获取 data.json 中的自研服务列表
        Return: list
        """
        return self._get_value(self._config, "services")

    def get_config_current_basic(self):
        """获取 该基础组件的 数据字典

        Return: dict
        """
        return self._config_current_basic

    def get_config_current_basic_value(self, key):
        """获取当前基础服务配置项字典 key 的值
        Return: value
        """
        return self._get_value(self._config_current_basic, key)

    def get_config_basics_list(self):
        """获取 data.json 中的基础服务列表

        Return: list
        """
        return self._config["basics"]

    def get_installed_product_set(self):
        """获取安装产品列表"""
        product_set = set()
        for service in self.get_config_services_list():
            if "product" in service:
                product_set.add(service["product"])
        return product_set

    def get_user(self):
        """用户名
        root  -> CW_RUN_USER

        other -> username
        """
        return self._user

    @staticmethod
    def is_root():
        """当前执行脚本的用户是否为 root"""
        if os.getuid() == 0:
            return True
        else:
            return False

    # 创建相关目录

    def make_dir(self, path):
        """创建目录 并 修改目录权限

        root 调用脚本 则目录属主属组为 定义的普通用户

        普通用户 调用脚本 不做任务权限调整
        """
        if not os.path.isdir(path):
            try:
                shutil.os.makedirs(path)
            except Exception:
                pass
        if os.getuid() == 0:
            try:
                current_user = pwd.getpwnam(self._user)
                shutil.os.chown(path, current_user.pw_uid, current_user.pw_gid)
            except Exception:
                self.exception("invalid user {}".format(self._user))

    def make_depend_dir(self):
        """创建规范的依赖目录

        /data/app
        /data/app/scripts
        /data/logs
        /data/logs/service
        /data/appData
        /data/appData/tmp
        """
        self.make_dir(self._depend_path_app)
        self.make_dir(self._depend_path_logs)
        self.make_dir(self._depend_path_data)
        self.make_dir(_path_join(self._depend_path_app, "scripts"))
        self.make_dir(_path_join(self._depend_path_app, self._service_name, "scripts"))
        self.make_dir(_path_join(self._depend_path_logs, self._service_name))
        self.make_dir(_path_join(self._depend_path_data, "tmp"))

    # 启动脚本软链
    def make_script_link(self):
        """创建自研服务启动脚本软链
        基础组件启动脚本软链
        """
        # 自研服务 bin/service -> app/scripts/service scripts/service
        if self._service_name in self._self_service_list:
            script_path = _path_join(
                self._depend_path_app, self._service_name, "bin", self._service_name
            )
            if not os.path.isfile(script_path):
                _execption("No such file {}".format(script_path))
            script_link_1 = _path_join(
                self._depend_path_app, self._service_name, "scripts", self._service_name
            )
            script_link_2 = _path_join(
                self._depend_path_app, "scripts", self._service_name
            )
            if not os.path.exists(script_link_1):
                shutil.os.symlink(script_path, script_link_1)

            if not os.path.exists(script_link_2):
                shutil.os.symlink(script_path, script_link_2)
        # 基础组件 scripts/service -> app/scripts/service
        else:
            script_path = _path_join(
                self._depend_path_app, self._service_name, "scripts", self._service_name
            )
            if not os.path.isfile(script_path):
                _execption("No such file {}".format(script_path))
            script_link_2 = _path_join(
                self._depend_path_app, "scripts", self._service_name
            )
            if not os.path.exists(script_link_2):
                shutil.os.symlink(script_path, script_link_2)

    # 占位符替换
    @staticmethod
    def replace_placeholder(path, placeholder_list):
        """配置文件占位符替换
        参数: path 要替换的文件路径, 占位符字典列表 [{"key":"value"}]
        """
        if not os.path.isfile(path):
            _execption("No such file {}".format(path))
        with open(path, "r") as f:
            data = f.read()
            for item in placeholder_list:
                for k, v in item.items():
                    placeholder = "${{{}}}".format(k)
                    data = data.replace(placeholder, str(v))
        with open(path, "w") as f:
            f.write(data)

    # 字符跨行替换，支持正则
    # sed -i "s#^user .*##g" ${CW_INSTALL_APP_DIR}/tengine/conf/nginx.conf
    @staticmethod
    def replace_str(re_pattern, new_str, file_name):
        content = ""
        with open(file_name, "r") as fp:
            conf_server = fp.readlines()
            for i in conf_server:
                conf_server = re.sub(re_pattern, new_str, i)
                content = content + conf_server
        with open(file_name, "w") as fp:
            fp.write(content)

    # 文件末尾追加内容
    @staticmethod
    def append_file(path, data):
        # 判断要添加的内容是否已经在文件中存在
        is_exist = False
        with open(path, "r") as f:
            if str(data) in f.read():
                is_exist = True
        if not is_exist:
            with open(path, "a") as f:
                f.write(str(data))

    # 清空文件写入

    @staticmethod
    def clean_write_file(path, data):
        with open(path, "w") as f:
            f.write(str(data))

    # 执行 shell 命令
    @staticmethod
    def run_shell(cmd):
        p = subprocess.Popen(
            cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True
        )
        stdout, stderr = p.communicate()
        if p.returncode != 0:
            return _execption("{}\ncmd: {}".format(stderr.strip(), cmd))
        else:
            return stdout.strip()

    # 执行内部 bash 脚本
    @staticmethod
    def run_inner_shell_script(script, args):
        """调用 kit/bash 内的脚本
        参数: 脚本名称 参数
        """
        shell_script = _path_join(
            _path_dirname(os.path.abspath(__file__)), "bash", script
        )
        cmd = "bash {} {}".format(shell_script, args)
        p = subprocess.Popen(
            cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True
        )
        stdout, stderr = p.communicate()
        if p.returncode != 0:
            return _execption(stderr.strip())
        else:
            return stdout.strip()

    #
    @staticmethod
    def encrypt(s):
        return base64.urlsafe_b64encode(s)

    @staticmethod
    def decrypt(s):
        return base64.urlsafe_b64decode(s)


# 脚本传参解析


def init_argparse():
    parser = argparse.ArgumentParser(description="kit script")
    parser.add_argument(
        "local_ip", metavar="local_ip", type=str, help="local ip address"
    )
    parser.add_argument(
        "json_path", metavar="json_path", type=str, help="data.json path"
    )
    return parser.parse_args()


# 升级脚本参数解析
def init_argparse_upgrade():
    parser = argparse.ArgumentParser(description="kit script")
    parser.add_argument(
        "local_ip", metavar="local_ip", type=str, help="local ip address"
    )
    parser.add_argument(
        "json_path", metavar="json_path", type=str, help="data.json path"
    )
    parser.add_argument(
        "version", metavar="version", type=str, help="service version"
    )
    return parser.parse_args()