<template>
  <div>
    <ElTablePlus
      v-model:list-query="listQuery"
      :filter-config="filterConfig"
      :btnConfig="btnConfig"
      :tableConfig="tableConfig"
      :tableList="tableList"
      @searchClick="searchClick"
      @getList="getList"
    >
      <template #slots="{ slotData, index }"
        >{{ index }}{{ slotData }}</template
      >
    </ElTablePlus>
  </div>
</template>

<script lang='ts'>
import { reactive, toRefs, onMounted, nextTick } from "vue";
import { filterConfig, btnConfig, tableConfig } from "./indexData";
import ElTablePlus from "@/elTablePlus/index.vue";
import { Local } from "./utils/storage";
export default {
  name: "",
  components: { ElTablePlus },
  setup() {
    const state = reactive({
      filterConfig: filterConfig,
      btnConfig: btnConfig,
      tableConfig: tableConfig,
      listQuery: {
        currentPage: 1,
        pageSize: 10,
        goodsName: undefined,
        createTime: undefined,
        type: undefined,
      },
      tableList: [
        {
          image:
            "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
          option: "1",
          tag: "1",
          date: "2021-08-19 12:00:00",
          select: "1",
          name: "王小虎",
          switch: "0",
          sum: "123",
        },
        {
          image:
            "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
          option: "2",
          tag: "2",
          date: "2021-08-19",
          select: "2",
          name: "王二虎",
          switch: "1",
          sum: "123",
        },
        {
          // image: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
          option: "3",
          tag: "3",
          date: "2016-05-01",
          select: "3",
          name: "王三虎",
          switch: "0",
          sum: "123",
        },
        {
          // image: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
          option: "4",
          tag: "4",
          date: "2016-05-03",
          select: "4",
          name: "王小虎",
          switch: "1",
          sum: "123",
        },
        {
          // image: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
          option: "5",
          tag: "5",
          date: "2016-05-03",
          select: "5",
          name: "王二虎",
          switch: "0",
          sum: "123",
        },
        // {
        // 	image: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        // 	option: '1',
        // 	tag: '1',
        // 	date: '2016-05-02',
        // 	select: '1',
        // 	name: '王小虎',
        // 	switch: '0',
        // sum: '123',
        // },
        // {
        // 	image: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        // 	option: '2',
        // 	tag: '2',
        // 	date: '2016-05-04',
        // 	select: '2',
        // 	name: '王小虎',
        // 	switch: '1',
        // sum: '123',
        // },
        // {
        // 	image: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        // 	option: '3',
        // 	tag: '3',
        // 	date: '2016-05-01',
        // 	select: '3',
        // 	name: '王小虎',
        // 	switch: '0',
        // sum: '123',
        // },
        // {
        // 	image: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        // 	option: '4',
        // 	tag: '4',
        // 	date: '2016-05-03',
        // 	select: '4',
        // 	name: '王小虎',
        // 	switch: '1',
        // sum: '123',
        // },
        // {
        // 	image: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        // 	option: '5',
        // 	tag: '5',
        // 	date: '2016-05-03',
        // 	select: '5',
        // 	name: '王小虎',
        // 	switch: '0',
        // sum: '123',
        // },
        // {
        // 	image: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        // 	option: '1',
        // 	tag: '1',
        // 	date: '2016-05-02',
        // 	select: '1',
        // 	name: '王小虎',
        // 	switch: '0',
        // sum: '123',
        // },
        // {
        // 	image: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        // 	option: '2',
        // 	tag: '2',
        // 	date: '2016-05-04',
        // 	select: '2',
        // 	name: '王小虎',
        // 	switch: '1',
        // sum: '123',
        // },
        // {
        // 	image: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        // 	option: '3',
        // 	tag: '3',
        // 	date: '2016-05-01',
        // 	select: '3',
        // 	name: '王小虎',
        // 	switch: '0',
        // sum: '123',
        // },
        // {
        // 	image: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        // 	option: '4',
        // 	tag: '4',
        // 	date: '2016-05-03',
        // 	select: '4',
        // 	name: '王小虎',
        // 	switch: '1',
        // sum: '123',
        // },
        // {
        // 	image: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        // 	option: '5',
        // 	tag: '5',
        // 	date: '2016-05-03',
        // 	select: '5',
        // 	name: '王小虎',
        // 	switch: '0',
        // sum: '123',
        // },
        // {
        // 	image: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        // 	option: '1',
        // 	tag: '1',
        // 	date: '2016-05-02',
        // 	select: '1',
        // 	name: '王小虎',
        // 	switch: '0',
        // sum: '123',
        // },
        // {
        // 	image: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        // 	option: '2',
        // 	tag: '2',
        // 	date: '2016-05-04',
        // 	select: '2',
        // 	name: '王小虎',
        // 	switch: '1',
        // sum: '123',
        // },
        // {
        // 	image: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        // 	option: '3',
        // 	tag: '3',
        // 	date: '2016-05-01',
        // 	select: '3',
        // 	name: '王小虎',
        // 	switch: '0',
        // sum: '123',
        // },
        // {
        // 	image: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        // 	option: '4',
        // 	tag: '4',
        // 	date: '2016-05-03',
        // 	select: '4',
        // 	name: '王小虎',
        // 	switch: '1',
        // sum: '123',
        // },
        // {
        // 	image: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        // 	option: '5',
        // 	tag: '5',
        // 	date: '2016-05-03',
        // 	select: '5',
        // 	name: '王小虎',
        // 	switch: '0',
        // sum: '123',
        // },
        // {
        // 	image: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        // 	option: '1',
        // 	tag: '1',
        // 	date: '2016-05-02',
        // 	select: '1',
        // 	name: '王小虎',
        // 	switch: '0',
        // sum: '123',
        // },
        // {
        // 	image: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        // 	option: '2',
        // 	tag: '2',
        // 	date: '2016-05-04',
        // 	select: '2',
        // 	name: '王小虎',
        // 	switch: '1',
        // sum: '123',
        // },
        // {
        // 	image: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        // 	option: '3',
        // 	tag: '3',
        // 	date: '2016-05-01',
        // 	select: '3',
        // 	name: '王小虎',
        // 	switch: '0',
        // sum: '123',
        // },
        // {
        // 	image: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        // 	option: '4',
        // 	tag: '4',
        // 	date: '2016-05-03',
        // 	select: '4',
        // 	name: '王小虎',
        // 	switch: '1',
        // sum: '123',
        // },
        // {
        // 	image: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        // 	option: '5',
        // 	tag: '5',
        // 	date: '2016-05-03',
        // 	select: '5',
        // 	name: '王小虎',
        // 	switch: '0',
        // sum: '123',
        // },
      ],
    });
    const getList = () => {
      console.log(state.listQuery);
    };
    const searchClick = (query: any) => {
      console.log("query", query);
    };
    const isMobile = () => {
      const flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      );
      return flag;
    };
    // 页面加载时
    onMounted(() => {
      nextTick(() => {
        // 判断是PC端还是移动端
        Local.set("isPC", true);
        if (isMobile()) Local.set("isPC", false);
        console.log(Local.get("isPC"));
      });
    });
    return {
      getList,
      searchClick,
      isMobile,
      ...toRefs(state),
    };
  },
};
</script>
<style scoped lang='scss'>
</style>