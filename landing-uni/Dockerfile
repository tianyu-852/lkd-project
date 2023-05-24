FROM node:12 as build-deps

WORKDIR /usr/src/app
COPY . ./
ARG version
RUN yarn config set registry https://registry.npmmirror.com \
    && yarn
RUN yarn build:${version}


FROM nginx:1.21-alpine
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

ARG version

EXPOSE 80

COPY nginx.conf /etc/nginx/

COPY --from=build-deps /usr/src/app/dist/h5 /www
COPY --from=build-deps /usr/src/app/src/cert/* /www/

CMD ["nginx", "-g", "daemon off;"]
