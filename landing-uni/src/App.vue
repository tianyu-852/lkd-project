<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "uview-ui/index.scss";
	
	.width32{
		width: 32rpx;
	}
	.width44{
		width: 44rpx;
	}
	.width80{
		width: 80rpx;
	}
	.widthAll{
		width: 100%;
	}
	.marlr32{
		margin: 0 32rpx;
	}
	.marlr52{
		margin: 0 52rpx;
	}
	.top8{
		margin-top: 8rpx;
	}
	.top12{
		margin-top: 12rpx;
	}
	.top20{
		margin-top: 20rpx;
	}
	.top32{
		margin-top: 32rpx;
	}
	.top36{
		margin-top: 36rpx;
	}
	.top40{
		margin-top: 40rpx;
	}
	.top50{
		margin-top: 50rpx;
	}
	.left8{
		margin-left: 8rpx;
	}
	.left12{
		margin-left: 12rpx;
	}
	.left32{
		margin-left: 32rpx;
	}
	.left48{
		margin-left: 48rpx;
	}
	.bottom12{
		margin-bottom: 12rpx;
	}
	.bottom32{
		margin-bottom: 32rpx;
	}
	.bottom40{
		margin-bottom: 40rpx;
	}
	.bottom56{
		margin-bottom: 56rpx;
	}
	.left16{
		margin-left: 16rpx;
	}
	.left20{
		margin-left: 20rpx;
	}
	.font22{
		font-size: 22rpx;
	}
	.font26{
		font-size: 26rpx;
	}
	.font28{
		font-size: 28rpx;
	}
	.font30{
		font-size: 30rpx;
	}
	.font32{
		font-size: 32rpx;
	}
	.font34{
		font-size: 34rpx;
	}
	.font36{
		font-size: 36rpx;
	}
	.color6E7695{
		color: #6E7695;
	}
	.bold{
		font-weight: bold;
	}
	.heavy{
		font-weight: 900;
	}
	.absolute{
	    position: absolute;
	}
	.relative{
	    position: relative;
	}
	.fixed {
	    position: fixed;
	}
	.flex {
	    display: flex;
	    flex-wrap: wrap;
	}
	.flex-row{
	    display: flex;
	    flex-wrap: wrap;
	    flex-direction:row;
	}
	.flex-column{
		display: flex;
		flex-direction:column;
		align-items: center;
		justify-content: center;
	}
	.flex1{
		flex: 1;
	}
	.center{
		text-align: center;
	}
	.between {
	    justify-content: space-between;
	}
	.around {
	    justify-content: space-around
	}
	.baseline {
	    align-items: baseline
	}
	.hcenter {
	    align-items: center;
	}
	.flexcenter {
	    justify-content: center;
	}
	.flexend {
	    justify-content: flex-end;
	}
	.hidden{
		overflow: hidden;
	}
	.color0061FF{
		color: #0061FF;
	}
	.color888D98{
		color: #888D98;
	}
	.backfff{
		background-color: #fff;
	}
</style>
