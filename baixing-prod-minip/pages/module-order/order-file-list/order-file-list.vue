<template>
  <view class="main">
    <!-- #ifndef MP-TOUTIAO -->
    <u-navbar :border-bottom="false" title="文件列表" :title-size="36" title-color="#333" title-bold />
    <!-- #endif -->

    <!-- 文件列表 -->
    <view class="file-module">
      <u-swipe-action
        v-for="(fItem, fIndex) in cloudFileList"
        :key="fIndex"
        :index="fIndex"
        :show="fItem.isShow"
        :options="teamOptions"
        vibrate-short
        @open="onSwipeActionOpen"
        @click="onSwipeActionClick"
      >
        <view class="file-item" @click="chooseFileItem(fIndex)">
          <view class="file-middle">
            <view class="file-nameWrap">
              <view class="file-name">{{ fItem.basename }}</view>
            </view>
            <view class="file-time">
              <text style="margin-right: 20rpx;">{{ fItem.file_size }}</text>
              <text>{{ fItem.created_at }}上传</text>
            </view>
          </view>
          <view class="file-right">
            <view class="radio" :class="{ 'radio-active': fItem.isChecked }">
              <u-icon v-if="fItem.isChecked" name="checkbox-mark" :color="fItem.isChecked ? '#fff' : '#999'" size="28" />
            </view>
          </view>
        </view>
      </u-swipe-action>
    </view>

    <!-- 删除文件 modal -->
    <u-modal
      v-model="isShowDelFileModal"
      title="是否确认删除"
      :content-style="{ color: '#333', fontSize: '32rpx' }"
      show-cancel-button
      confirm-text="删除"
      confirm-color="#0085FF"
      :content="cloudFileList[selectedDelFileIndex].basename"
      @confirm="onDelFileModalConfirmEvt"
      @cancel="onDelFileModalCancelEvt"
    />

    <view class="bottom-btns">
      <!-- 添加按钮 -->
      <view class="plus-btn" @click="chooseFile">
        <image class="icon-plus" mode="aspectFill" src="../static/icon-team-plus.png" />
        <text>添加文件</text>
      </view>
      <!-- 确认按钮 -->
      <view class="confirm-btn" @click="confirmChooseFile">
        <text>确认选择</text>
      </view>
    </view>
  </view>
</template>

<script>
import fileUtil from '@/common/utils/fileUtil';

export default {
  name: 'OrderFileList',
  data() {
    return {
      prevedCloudFileList: [], // 上传递文件列表
      teamOptions: [{ text: '删除', style: { backgroundColor: '#FE5F48', fontSize: '32rpx' } }],
      isShowDelFileModal: false, // 是否显示删除 modal
      selectedDelFileIndex: - 1, // 选中的待删除文件下标

      cloudFileList: [], // 云文件列表
      cloudFilePage: 1, // 云文件页数
      cloudFileTotal: 0, // 云文件总数
      isNextLoading: false, // 是否加载下一页
    };
  },
  onLoad(query) {
    // 上次已选中的文件
    const eventChannel = this.getOpenerEventChannel();
    Object.keys(eventChannel).length && eventChannel.on('cloudFileEvt', data => {
      this.prevedCloudFileList = data.prevedCloudFileList;
      this._getCloudStorageFileList();
    });
  },
  onReachBottom() {
    const { cloudFileList, cloudFileTotal } = this;
    if (cloudFileList.length >= cloudFileTotal) return;
    this._getCloudStorageFileList(++this.cloudFilePage);
  },
  methods: {
    /**
     * 获取云盘文件列表
     */
    async _getCloudStorageFileList(page = 1) {
      if (this.isNextLoading) return;
      this.isNextLoading = true;

      const param = { page };

      page === 1 && uni.showLoading({ title: '加载中', mask: true });
      page === 1 && (this.cloudFileList = []); // 请求第一页，先清空数组

      try {
        const { data: cloudFileData } = await this.$api.getCloudStorageFileListApi(param);
        // 添加是否选中状态
        cloudFileData.items.forEach(item => {
          item.isShow = false;
          item.isChecked = this.prevedCloudFileList.map(itm => itm.file_url).includes(item.file_url);
        });

        this.cloudFileList.push(...cloudFileData.items);
        this.cloudFileTotal = cloudFileData.total;
        this.isNextLoading = false;
        uni.stopPullDownRefresh();
      } catch (error) {
        this.isNextLoading = false;
        console.log(error);
      }
    },
    /**
     * 上传文件
     */
    async chooseFile() {
      const [error, resResult] = await uni.chooseMessageFile({ count: 9, type: 'file' });
      if (error) return;
      uni.showLoading({ title: '上传中', mask: true });

      const tempFiles = resResult.tempFiles;

      for (const fItem of tempFiles) {
        console.log(fItem);
        // 上传文件到 oss
        const fileUrl = await fileUtil.uploadFile(fItem.path);
        const param = { basename: fItem.name, file_size: fItem.size, url: fileUrl, };
        const { data } = await this.$api.postCloudStorageFileApi(param);
        console.log(data);
      }

      this._getCloudStorageFileList();
    },
    /**
     * SwipeAction 组件触发打开状态时
     */
    onSwipeActionOpen(index) {
      // 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
      // 原本为'false'，再次设置为'false'会无效
      this.cloudFileList[index].isShow = true;
      this.cloudFileList.map((val, idx) => {
        if (index !== idx) this.cloudFileList[idx].isShow = false;
      });
    },
    /**
     * SwipeAction 组件点击时触发
     */
    onSwipeActionClick(fIndex) {
      this.selectedDelFileIndex = fIndex;
      this.isShowDelFileModal = true;
    },
    /**
     * 监听删除文件 modal 确认事件
     */
    async onDelFileModalConfirmEvt() {
      if (this.selectedDelFileIndex < 0) return;
      const fileId = this.cloudFileList[this.selectedDelFileIndex].cloud_file_id;
      uni.showLoading({ title: '删除中', mask: true });
      const param = { cloud_file_id: fileId };

      try {
        const data = await this.$api.delCloudStorageFileApi(param);
        this.cloudFileList.splice(this.selectedDelFileIndex, 1)[0];
        this.$u.toast('删除成功');
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 监听删除文件 modal 取消事件
     */
    onDelFileModalCancelEvt() {
      this.cloudFileList[this.selectedDelFileIndex].isShow = false;
      this.selectedDelFileIndex = -1;
    },
    /**
     * 选择文件项
     */
    chooseFileItem(fIndex) {
      this.cloudFileList[fIndex].isChecked = !this.cloudFileList[fIndex].isChecked;
    },
    /**
     * 确认选择文件
     */
    confirmChooseFile() {
      const { cloudFileList } = this;
      const filterCloudFile = cloudFileList.filter(item => item.isChecked);
      if (!filterCloudFile.length) return this.$u.toast('请选择文件');
      if (filterCloudFile.length > 9) return this.$u.toast('最多选择9个文件');

      this.$commonUtil.backPage();
      // 触发 云盘文件确定 事件
      uni.$emit('cloudFileConfirmEvt', { cloudFileList: filterCloudFile });
    }
  }
};
</script>

<style>
page {
  background: #fff;
}
</style>

<style lang="scss" scoped>
  @import './style.scss';
</style>
