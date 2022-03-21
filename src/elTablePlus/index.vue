<template>
  <div class="cl-filter-plus" ref="filterPlusRef">
    <filterPlus
      v-if="filterConfig.filterList && filterConfig.filterList.length"
      v-model:list-query="listQuery"
      :filter-config="filterConfig"
      @filterBtnClick="filterBtnClick"
    ></filterPlus>
  </div>
  <div class="cl-table-plus">
    <!-- 按钮组件 -->
    <btn-plus
      ref="btnPlusRef"
      v-model:isTable="isTable"
      :btn-config="btnConfig"
      :table-config="tableConfigs"
      :multiple-selection="multipleSelection"
      @functionBtnChange="functionBtnChange"
    ></btn-plus>
    <!-- 表格组件 -->
    <table-plus
      v-if="isTable"
      ref="tablePlusRef"
      :computed-table-height="computedTableHeight"
      :table-config="tableConfigs"
      :table-list="tableList"
      @handleSelectionChange="handleSelectionChange"
      @switchChange="switchChange"
      @buttonClick="buttonClick"
    >
      <template
        v-for="(item, i) in tableConfigs.headerList"
        :key="i"
        v-slot:[item.slotName]="{ slotData, index }"
      >
        <div v-if="item.slotName">
          <slot
            :name="item.slotName"
            :slotData="slotData"
            :index="index"
          ></slot>
        </div>
      </template>
    </table-plus>
    <!-- 卡片组件 -->
    <tabsPlus
      v-else
      ref="tabsPlusRef"
      :computed-table-height="computedTableHeight"
      :table-config="tableConfigs"
      :table-list="tableList"
      @handleSelectionChangeTab="handleSelectionChangeTab"
      @switchChange="switchChange"
      @buttonClick="buttonClick"
    >
      <template
        v-for="(item, i) in tableConfigs.headerList"
        :key="i"
        v-slot:[item.slotName]="{ slotData, index }"
      >
        <div v-if="item.slotName">
          <slot
            :name="item.slotName"
            :slotData="slotData"
            :index="index"
          ></slot>
        </div>
      </template>
    </tabsPlus>
    <div
      class="cl-pagination"
      ref="paginationRef"
      :style="{
        justifyContent:
          pageConfig.align === 'left'
            ? 'flex-start'
            : pageConfig.align === 'center'
            ? pageConfig.align
            : '',
      }"
    >
      <el-pagination
        v-if="pageConfig.total"
        background
        v-model:current-page="listQuery.currentPage"
        v-model:page-size="listQuery.pageSize"
        :small="pageConfig.small || false"
        :layout="pageConfig.layout || 'total, sizes,prev, pager, next,jumper'"
        :pager-count="pageConfig.pagerCount || 7"
        :page-sizes="pageConfig.pageSizes"
        :total="pageConfig.total || 0"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script lang='ts'>
import {
  ref,
  reactive,
  toRefs,
  watch,
  computed,
  onMounted,
  onBeforeMount,
  nextTick,
} from "vue";
import { Local } from "@/utils/storage";
import { ElMessageBox, ElMessage } from "element-plus";
import filterPlus from "./filterPlus/filterPlus.vue";
import btnPlus from "./btnPlus/btnPlus.vue";
import tablePlus from "./tablePlus/tablePlus.vue";
import tabsPlus from "./tablePlus/tabsPlus.vue";
export default {
  name: "elTablePlus",
  components: { filterPlus, btnPlus, tablePlus, tabsPlus },
  props: {
    // 搜索栏参数
    filterConfig: {
      type: Object,
      default: () => {
        null;
      },
    },
    // 搜索栏参数
    listQuery: {
      type: Object,
      default: () => {},
    },
    // 当前页
    currentPage: {
      type: Number,
      default: 1,
    },
    // 每页记录数
    pageSize: {
      type: Number,
      default: 10,
    },
    // 按钮的配置数据
    btnConfig: {
      type: Object,
      default: () => {},
    },
    // 表格的配置数据
    tableConfig: {
      type: Object,
      default: () => {},
    },
    // 表格数据
    tableList: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["getList", "searchClick", "tableRowClick", "filterBtnClick"],
  setup(props: any, { emit }: any) {
    const filterPlusRef = ref();
    const btnPlusRef = ref();
    const tablePlusRef = ref();
    const paginationRef = ref();
    const state = reactive({
      multipleSelection: [] as any[], // 当前选择的数据集合
      tableConfigs: {},
      pageConfig: {}, // 分页器的配置数据
      isPC: Local.get("isPC"),
      isTable: Local.get("isPC"),
    });
    onMounted(() => {
      console.log("sss");
    });

    const filterBtnClick = (res: any, query: any) => {
      if (res.effect === "search") {
        emit("searchClick", query);
      } else if (res.effect === "reset") {
        emit("filterBtnClick", { effect: "reset" });
        // refs[filterForm].resetFields()
      } else {
        emit("filterBtnClick", res, props.listQuery);
      }
    };

    const functionBtnChange = () => {
      nextTick(() => {
        tablePlusRef.value && tablePlusRef.value.tableDoLayout();
      });
    };
    /**
     * 当选择项发生变化时会触发该事件
     * @param res 选择的行数据
     */
    const handleSelectionChange = (res: Object[]) => {
      state.multipleSelection = res;
      console.log(state.multipleSelection);
      emit("tableRowClick", res, { effect: "selection" });
    };
    const handleSelectionChangeTab = (res: Object[]) => {
      // TODO
      // state.multipleSelection = res;
      console.log(state.multipleSelection);
      // emit("tableRowClick", res, { effect: "selection" });
    };
    /**
     * 修改开关的回调事件
     * @param rowData 当前行数据
     * @param prop 该开关的prop值
     * @param active switch 打开时的值，默认为1(number)
     * @param inactive switch 关闭时的值，默认为0(number)
     * @param index 当前行的下标值
     */
    const switchChange = (
      rowData: any,
      prop: string,
      active: number | string | boolean,
      inactive: number | string | boolean,
      index: number
    ) => {
      ElMessageBox.confirm("此操作将修改该数据内容, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          emit("tableRowClick", rowData, { effect: "switch" });
        })
        .catch(() => {
          rowData[prop] = rowData[prop] === active ? inactive : active;
        });
    };
    /**
     * 按钮的点击事件
     * @param rowData 当前行数据
     * @param item 当前按钮数据
     * @param index 当前行下标值
     */
    const buttonClick = (rowData: any, item: object | any, index: number) => {
      if (item.effect === "remove") {
        ElMessageBox.confirm("是否要进行删除操作, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          cancelButtonClass: "cancelButton",
          confirmButtonClass: "confirmButton",
          type: "warning",
        })
          .then((response) => {
            emit("tableRowClick", rowData, item, index);
          })
          .catch((err) => {
            // console.log('取消删除', err);
          });
      } else {
        emit("tableRowClick", rowData, item, index);
      }
    };
    // watch(() => [state.province, state.country], ([newprovince,newcountry],[oldprovince,oldcountry]) => {
    watch(
      () => [props.tableConfig],
      ([newTableConfig, oldTableConfig]) => {
        state.tableConfigs = newTableConfig;
        state.pageConfig = newTableConfig.pageConfig;
      },
      { immediate: true, deep: true }
    );

    // 获取动态表格高度
    const { computedTableHeight, getBodyHeight, initResize } = getTableHight(
      filterPlusRef,
      btnPlusRef,
      paginationRef
    );

    // 获取分页相应的数据和方法
    const { page, limit, handleSizeChange, handleCurrentChange } = pagination(
      props,
      emit
    );

    onMounted(() => {
      getBodyHeight(); // 获取整个屏幕高度
      initResize(); // 监听屏幕大小变化
    });
    // 页面加载前
    onBeforeMount(() => {});
    return {
      // 搜索栏
      filterPlusRef,
      filterBtnClick,

      // 按钮
      btnPlusRef,
      functionBtnChange,

      // 表格
      tablePlusRef,
      handleSelectionChange,
      handleSelectionChangeTab,
      switchChange,
      buttonClick,

      // 分页
      page,
      limit,
      paginationRef,
      handleSizeChange,
      handleCurrentChange,

      ...toRefs(state),
      computedTableHeight,
    };
  },
};

/**
 * 计算表格高度函数
 * @params store vuex
 * @params filterPlusRef 搜索组件ref
 * @params btnPlusRef 表头头部按钮组件ref
 * @params paginationRef 分页组件ref
 */
function getTableHight(
  filterPlusRef: any,
  btnPlusRef: any,
  paginationRef: any
) {
  const heightState = reactive({
    bodyHeight: 0, // 页面高度
    filterHeight: 0,
    btnHeight: 0,
    paginationHeight: 0,
  });
  // 计算表格默认高度
  const computedTableHeight = computed(() => {
    // return heightState.bodyHeight - heightState.btnHeight - heightState.filterHeight - heightState.paginationHeight - 112;
    return heightState.bodyHeight - heightState.filterHeight - 240;
  });
  // 获取页面的宽度
  const getBodyHeight = () => {
    heightState.bodyHeight = document.documentElement.clientHeight;
    heightState.filterHeight = filterPlusRef.value.offsetHeight || 0;
    heightState.paginationHeight = paginationRef.value.offsetHeight || 0;
    heightState.btnHeight = btnPlusRef.value.offsetHeight || 0;
  };
  // 监听页面高度度改变
  const initResize = () => {
    window.addEventListener("resize", () => {
      getBodyHeight();
    });
  };
  return {
    computedTableHeight,
    getBodyHeight,
    initResize,
  };
}

function pagination(props: any, emit: any) {
  // 分页begin
  const page = computed({
    get() {
      return props.currentPage;
    },
    set(val) {
      emit("update:currentPage", val);
    },
  });
  const limit = computed({
    get() {
      return props.pageSize;
    },
    set(val) {
      emit("update:pageSize", val);
    },
  });
  // 分页
  const handleSizeChange = (val: number) => {
    emit("getList");
  };
  const handleCurrentChange = (val: number) => {
    emit("getList");
  };
  // 分页end
  return {
    page,
    limit,
    handleSizeChange,
    handleCurrentChange,
  };
}
</script>
<style scoped lang='scss'>
</style>