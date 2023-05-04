<template>
	<view>
		<web-view :src="data.privacy_policy"></web-view>
	</view>
</template>

<script>
	import { getUserProtocol} from "../../api/apis.js"
	export default {
		data() {
			return {
				data:{}
			}
		},
		methods: {
			getUserProtocol(){
				getUserProtocol().then(res=>{
					this.$set(this,"data",res.data.data)
					console.log(this.data)
				})
			}
		},
		onLoad() {
			this.getUserProtocol();
		}
	}
</script>

<style>

</style>
