# -*- coding: utf-8 -*-
from Core import init_argparse_upgrade
from install import install


if __name__ == "__main__":
  args = init_argparse_upgrade()
  install(args.local_ip, args.json_path)
  print("安装成功")