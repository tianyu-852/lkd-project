
FROM node:12 as build-deps
ARG version
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
# RUN yarn config set registry https://registry.npm.taobao.org/ \
#  && yarn
RUN yarn config set registry https://registry.npmmirror.com \
    && yarn
COPY . ./
RUN yarn build:${version}


FROM nginx:1.21-alpine
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

EXPOSE 80

COPY nginx.conf /etc/nginx/
COPY --from=build-deps /usr/src/app/dist /www
CMD ["nginx", "-g", "daemon off;"]
