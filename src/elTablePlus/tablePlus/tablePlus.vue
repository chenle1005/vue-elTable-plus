<template>
  <div class="table-plus">
    <!-- <div>{{ computedTableHeight }}</div> -->
    <el-table
      ref="multipleTable"
      :data="tableLists"
      :height="tableConfig.height || computedTableHeight"
      :stripe="tableConfig.stripe || false"
      :border="tableConfig.border === undefined ? true : tableConfig.border"
      :size="tableConfig.size || 'mini'"
      :empty-text="tableConfig.emptyText || '暂无数据'"
      :show-summary="tableConfig.showSummary"
      :summary-method="
        tableConfig.sumMethod ? tableConfig.sumMethod : summaryMethod
      "
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-if="tableConfig.selection || false"
        align="center"
        fixed="left"
        type="selection"
        width="50"
      />
      <el-table-column
        align="center"
        v-if="
          tableConfig.openIndex === undefined ? true : tableConfig.openIndex
        "
        label="序号"
        type="index"
        width="50"
      ></el-table-column>
      <el-table-column
        v-for="(hItem, hIndex) in headerLists"
        :key="hItem.label + hIndex"
        :align="hItem.align || 'center'"
        :fixed="hItem.fixed || false"
        :sortable="hItem.sortable || false"
        :header-align="hItem.headerAlign || 'center'"
        :show-overflow-tooltip="
          hItem.overflowTooltip === undefined ? true : hItem.overflowTooltip
        "
        :prop="hItem.prop"
        :label="hItem.label"
        :min-width="hItem.minWidth || 100"
        :width="(isPC ? hItem.width : hItem.mobileWidth) || ''"
      >
        <template v-if="hItem.filters" #header>
          <ExpandSelect
            v-if="
              computedFilterProp(hItem).options ||
              computedFilterProp(hItem).type === 'switch'
            "
            :header-data="hItem"
            :prop-data="computedFilterProp(hItem)"
            @headerFilterChange="headerFilterChange"
          ></ExpandSelect>
          <ExpandDatePicker
            v-else-if="hItem.filtersType === 'date'"
            :header-data="hItem"
            :prop-data="computedFilterProp(hItem)"
            @headerFilterChange="headerFilterChange"
          ></ExpandDatePicker>
          <ExpandInput
            v-else
            :header-data="hItem"
            :prop-data="computedFilterProp(hItem)"
            @headerFilterChange="headerFilterChange"
          ></ExpandInput>
        </template>
        <template #default="scope">
          <div :style="hItem.style">
            <div v-for="(pItem, pIndex) in computedProp(hItem)" :key="pIndex">
              <!-- 图片组件 -->
              <ExpandImage
                v-if="pItem.type === 'image'"
                :prop-data="pItem"
                :row-data="scope.row"
              ></ExpandImage>
              <!-- 插槽 -->
              <div v-else-if="pItem.type === 'slot'" class="text-hidden">
                <slot
                  :name="pItem.slotName"
                  :slotData="scope.row"
                  :index="scope.$index"
                ></slot>
              </div>
              <!-- filter过滤 -->
              <ExpandFilter
                v-else-if="pItem.type === 'filter'"
                :prop-data="pItem"
                :row-data="scope.row"
              ></ExpandFilter>
              <!-- tag标签 -->
              <ExpandTag
                v-else-if="pItem.type === 'tag'"
                :prop-data="pItem"
                :row-data="scope.row"
              ></ExpandTag>
              <!-- switch开关 -->
              <ExpandSwitch
                v-else-if="pItem.type == 'switch'"
                :prop-data="pItem"
                :row-data="scope.row"
                :state="state"
                :index="scope.$index"
                @switchChange="switchChange"
              ></ExpandSwitch>
              <!-- 可编辑单元格 -->
              <ExpandEditable
                v-else-if="pItem.type === 'editable' || pItem.type === 'tag'"
                :prop-data="pItem"
                :row-data="scope.row"
                :state="state"
                :index="scope.$index"
              ></ExpandEditable>
              <!-- Pc端button按钮 -->
              <ExpandButton
                v-else-if="pItem.type == 'button' && isPC"
                :prop-data="pItem"
                :row-data="scope.row"
                :state="state"
                :index="scope.$index"
                @buttonClick="buttonClick"
              ></ExpandButton>
              <!-- Mobile端button按钮 -->
              <ExpandMobileButton
                v-else-if="pItem.type == 'button' && !isPC"
                :prop-data="pItem"
                :row-data="scope.row"
                :state="state"
                :index="scope.$index"
                @buttonClick="buttonClick"
              ></ExpandMobileButton>
              <ExpandText
                v-else
                :prop-data="pItem"
                :row-data="scope.row"
              ></ExpandText>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang='ts'>
import {
  ref,
  reactive,
  toRefs,
  onMounted,
  onBeforeMount,
  computed,
  watch,
  onUpdated,
  nextTick,
} from "vue";
import ExpandImage from "./components/ExpandImage";
import ExpandFilter from "./components/ExpandFilter";
import ExpandTag from "./components/ExpandTag";
import ExpandSwitch from "./components/ExpandSwitch";
import ExpandEditable from "./components/ExpandEditable";
import ExpandButton from "./components/ExpandButton";
import ExpandMobileButton from "./components/ExpandMobileButton";
import ExpandText from "./components/ExpandText";
import { Local } from "@/utils/storage";
import ExpandSelect from "./filters/ExpandSelect";
import ExpandInput from "./filters/ExpandInput";
import ExpandDatePicker from "./filters/ExpandDatePicker";
import { useComputed } from "./hook/useComputed";
import { useFilters } from "./hook/useFilters";
import { useMethod } from "./hook/useMethod";
export default {
  name: "table-plus",
  components: {
    ExpandImage,
    ExpandFilter,
    ExpandTag,
    ExpandSwitch,
    ExpandEditable,
    ExpandButton,
    ExpandMobileButton,
    ExpandText,
    ExpandSelect,
    ExpandInput,
    ExpandDatePicker,
  },
  props: {
    // 表格的配置数据
    computedTableHeight: {
      type: Number,
      default: 0,
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
  setup(props: any, { emit }: any) {
    const multipleTable = ref();
    const state = reactive({
      visible: false,
      headerList: [],
      tableLists: [] as any,
      editableIndex: -1, // 可编辑单元格的下标标识
      isPC: Local.get("isPC"),
    });
    // 过滤被隐藏的列
    const headerLists = computed(() => {
      return state.headerList.filter((column: any) => !column.hidden);
    });

    // 表格组件和卡片组件的计算属性hook
    const { computedFilterProp, computedProp } = useComputed();

    // 局部过滤hook
    const { headerFilterChange } = useFilters(state, props);

    // 表格组件和卡片组件的公共方法（包括点击事件及组件的回调事件）
    const { handleSelectionChange, switchChange, buttonClick, summaryMethod } =
      useMethod(state, props, emit);

    watch(
      () => [props.tableConfig, props.tableList],
      ([newTableConfig, newTableList]) => {
        state.headerList = newTableConfig.headerList;
        state.tableLists = newTableList;
      },
      { immediate: true, deep: true }
    );
    const tableDoLayout = () => {
      nextTick(() => {
        multipleTable.value.doLayout();
      });
    };
    onMounted(() => {});
    onUpdated(() => {
      tableDoLayout();
    });
    // 页面加载前
    onBeforeMount(() => {});
    return {
      // renderHeader,
      headerLists,
      multipleTable,
      handleSelectionChange,

      computedFilterProp,
      computedProp,

      headerFilterChange,

      switchChange,
      buttonClick,
      summaryMethod,
      tableDoLayout,
      ...toRefs(state),
      state,
    };
  },
};
</script>
<style scoped lang='scss'>
</style>