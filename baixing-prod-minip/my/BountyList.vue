<template>
	<view>
		
	</view>
</template>

<script>
	import { getBountyList} from "../api/apis.js"
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			getBountyList(){
				getBountyList({
					
				}).then(res=>{
					
				})
			}
		},
		onLoad() {
			getBountyList();
		}
	}
</script>

<style lang="scss">

</style>
