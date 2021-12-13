<template>
  <div></div>
</template>

<script lang='ts'>
import { reactive, toRefs, onMounted } from "vue";
export default {
  name: "",
  setup() {
    const state = reactive({});
    onMounted(() => {
      console.log("111");
    });
    return {
      ...toRefs(state),
    };
  },
};
</script>
<style scoped lang='scss'>
</style>