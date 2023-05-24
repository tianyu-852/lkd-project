docker build -t registry.cn-hangzhou.aliyuncs.com/baixing_lawyer/nginx:h5 --build-arg version=h5 .
docker push registry.cn-hangzhou.aliyuncs.com/baixing_lawyer/nginx:h5

docker build -t registry.cn-hangzhou.aliyuncs.com/baixing_lawyer/nginx:h5dev --build-arg version=h5dev .
docker push registry.cn-hangzhou.aliyuncs.com/baixing_lawyer/nginx:h5dev