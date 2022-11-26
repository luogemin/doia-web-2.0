FROM harbor.cloudwise.com/base/alpine:3.14.1-tengine

# 作者
MAINTAINER wilr.zhang@yunzhihui.com

# 添加压缩包 ${package}
COPY --chown=commonuser:commonuser doiaWeb /data/app/doiaWeb

# 修改目录权限
RUN ln -sfn /data/app/doiaWeb/* /data/app/tengine/html

USER commonuser


