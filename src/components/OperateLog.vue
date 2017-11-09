<template>
	<div>
		<iframe id="operateLog" style="{height: tHeight}" :src="iframeUrl"></iframe>
	</div>
	
</template>

<script>
	export default {
		data() {
			return {
				tHeight: "0px"
			}
		},
		computed: {
			iframeUrl() {
				return "./static/operateLog/index.html?systemid=" + this.$iHomed("config", "systemid") + "&token=" + this.$iHomed("config", "token");
			}
		},
		mounted() {

			let _this = this;

			autoResize();

			window.onresize = autoResize;

			function autoResize() {
				let wh = +window.innerHeight;
			
				_this.tHeight = (wh - 40) + "px";						

			};
		},
	}
</script>

<style>
	iframe{
		width:100%;
		height:750px;
	}
	
</style>