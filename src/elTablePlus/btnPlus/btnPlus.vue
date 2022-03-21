<template>
  <div
    ref="clBtnPlus"
    :class="[
      btnConfig.hidden === 'none' ? 'hidden' : '',
      isPC ? 'cl-btn-plus' : 'cl-btn-plus-mobile',
    ]"
  >
    <el-button-group
      class="filter-item"
      :class="btnConfig.hidden === 'left' ? 'hidden' : ''"
    >
      <template v-for="(item, btnIndex) in btnList" :key="btnIndex">
        <el-button
          :size="item.size || 'mini'"
          :type="item.type"
          :icon="item.icon"
          :style="item.style || {}"
          :disabled="item.disabled || btnDisabled(item)"
          @click="batchOperate('left', item)"
        >
          {{ item.name }}
        </el-button>
      </template>
    </el-button-group>
    <el-button-group
      class="filter-item"
      :class="btnConfig.hidden === 'right' ? 'hidden' : ''"
    >
      <template v-for="(item, index) in functionBtnList" :key="index">
        <el-tooltip
          class="each"
          effect="dark"
          :content="item.name"
          placement="top"
        >
          <el-button
            :key="index"
            :size="item.size || 'mini'"
            :type="item.type || 'primary'"
            :icon="item.icon"
            @click="batchOperate('right', item)"
          />
        </el-tooltip>
      </template>
      <el-dropdown trigger="click" :hide-on-click="false">
        <el-tooltip class="each" effect="dark" content="列" placement="top">
          <el-button
            size="mini"
            type="info"
            icon="Grid"
            @click="
              batchOperate('right', {
                effect: 'columns',
                name: '列',
                type: 'info',
                icon: 'Grid',
              })
            "
          />
        </el-tooltip>
        <template #dropdown>
          <el-dropdown-menu>
            <div class="dropdown-table" style="padding: 10px">
              <el-table
                :data="headerDatas"
                height="350"
                border
                highlight-current-row
                size="mini"
              >
                <el-table-column
                  align="center"
                  prop="label"
                  label="列名"
                  width="100"
                  show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                  align="center"
                  label="显/隐"
                  width="80"
                  show-overflow-tooltip
                >
                  <template #default="scope">
                    <el-switch
                      v-model="scope.row.hidden"
                      :active-value="false"
                      :inactive-value="true"
                      @change="functionBtnChange($event, scope.row)"
                    ></el-switch>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  label="筛选"
                  width="80"
                  show-overflow-tooltip
                >
                  <template #default="scope">
                    <el-switch
                      v-model="scope.row.filters"
                      @change="functionBtnChange($event, scope.row)"
                    ></el-switch>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-button-group>
  </div>
</template>

<script lang='ts'>
import { ref, reactive, toRefs, onMounted, watch, computed } from "vue";
import { Local } from "@/utils/storage";
export default {
  name: "btnPlus",
  props: {
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
    // 表格当前选择的数据集合
    multipleSelection: {
      type: Array,
      default: () => [],
    },
    // 判断是否为移动端
    isTable: Boolean,
  },
  emits: ["update:isTable", "functionBtnChange"],
  setup(props: any, { emit }: any) {
    const clBtnPlus = ref();
    const state = reactive({
      btnHeight: 0,
      btnList: [],
      headerData: [],
      functionBtnList: [
        {
          effect: "refresh",
          name: "刷新",
          type: "info",
          icon: "Refresh",
        },
        {
          effect: "switch",
          name: "切换",
          type: "info",
          icon: "Document",
        },
      ],
      isPC: Local.get("isPC"),
    });
    // 过滤被隐藏的列
    const headerDatas = computed(() => {
      let arr = [];
      arr = state.headerData.filter((item: any) => item.label !== "操作");
      return arr;
    });
    /**
     * 判断按钮是否禁用
     * @param item 当前按钮数据
     * item.operateType 操作类型：none(默认) => 不需要选择数据；single => 有且只能操作一条数据；batch => 批量操作数据(至少选择一条数据以上)
     */
    const btnDisabled = computed(() => (item: any) => {
      let flag = false;
      // 默认不需要操作数据
      if (!item.operateType) return false;
      if (
        item.operateType === "single" &&
        props.multipleSelection.length !== 1
      ) {
        flag = true;
      } else if (
        item.operateType === "batch" &&
        props.multipleSelection.length < 1
      ) {
        flag = true;
      }
      return flag;
    });
    const functionBtnChange = (value: boolean, row: object) => {
      // console.log(value, row);
      emit("functionBtnChange");
    };
    const batchOperate = (type: string, item: any) => {
      if (type === "left") {
      } else {
        if (item.effect === "switch") {
          emit("update:isTable", !props.isTable);
        }
      }
    };
    onMounted(() => {
      state.btnHeight = clBtnPlus.value.offsetHeight;
    });
    watch(
      () => [props.btnConfig, props.tableConfig],
      ([newBtnConfig, newTableConfig]: any) => {
        state.btnList = newBtnConfig.btnList;
        state.headerData = newTableConfig.headerList;
      },
      { immediate: true, deep: true }
    );
    onMounted(() => {});
    return {
      headerDatas,
      clBtnPlus,
      btnDisabled,
      functionBtnChange,
      batchOperate,
      ...toRefs(state),
    };
  },
};
</script>
<style lang='scss'>
.hidden {
  display: none !important;
}
</style>