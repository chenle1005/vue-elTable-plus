<template>
  <div>app.vue</div>
</template>

<script lang='ts'>
import { reactive, toRefs, onMounted } from "vue";
export default {
  name: "",
  setup() {
    const state = reactive({});
    onMounted(() => {});
    return {
      ...toRefs(state),
    };
  },
};
</script>
<style scoped lang='scss'>
</style>