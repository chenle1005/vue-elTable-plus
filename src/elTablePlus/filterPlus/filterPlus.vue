<template>
  <div ref="filterPlusDom" class="filter-plus">
    <el-form
      ref="filterForm"
      :model="listQuery"
      :rules="filterConfig.rules || {}"
      :inline="filterConfig.inline || true"
      :label-position="filterConfig.labelPosition || isPC ? 'right' : 'top'"
      :label-width="filterConfig.labelWidth || ''"
      :label-suffix="filterConfig.labelSuffix || ''"
      :hide-required-asterisk="filterConfig.hideRequiredAsterisk || false"
      :show-message="filterConfig.showMessage || true"
      :inline-message="filterConfig.inlineMessage || false"
      :status-icon="filterConfig.statusIcon || false"
      :validate-on-rule-change="filterConfig.validateOnRuleChange || true"
      :size="filterConfig.size || 'mini'"
      :disabled="filterConfig.disabled || false"
    >
      <template v-for="(fItem, fIndex) in filterList" :key="fIndex">
        <el-form-item
          :label="(fItem.label || '输入搜索') + '：'"
          :label-width="fItem.labelWidth || ''"
          :required="fItem.required || false"
          :rules="fItem.rules || {}"
          :error="fItem.error || ''"
          :show-message="fItem.showMessage || true"
          :inline-message="fItem.inlineMessage || false"
          :size="fItem.size || 'mini'"
        >
          <template v-if="fItem.type == 'select'">
            <el-select
              v-model="listQuery[fItem.prop]"
              :filterable="fItem.filterable || true"
              :placeholder="'请选择' + fItem.label"
              :size="fItem.selectSize || 'mini'"
              :disabled="fItem.disabled || false"
              :clearable="fItem.clearable || true"
              class="filter-item"
              :class="isPC ? 'w-200' : 'w100'"
              @change="handlerSelectChange($event, fItem)"
            >
              <el-option
                v-for="(item, index) in fItem.options"
                :key="index"
                :label="fItem.labelName ? item[fItem.labelName] : item.label"
                :value="fItem.valueName ? item[fItem.valueName] : item.value"
                :disabled="item.disabled || false"
              />
            </el-select>
          </template>
          <template v-else-if="fItem.type == 'datePicker'">
            <el-date-picker
              v-model="listQuery[fItem.prop]"
              :disabled="fItem.disabled || false"
              :editable="fItem.editable || true"
              :clearable="fItem.clearable || true"
              :size="fItem.datePickerSize || 'mini'"
              :placeholder="fItem.placeholder || '选择日期'"
              :start-placeholder="fItem.startPlaceholder || '选择开始日期'"
              :end-placeholder="fItem.endPlaceholder || '选择结束日期'"
              :type="fItem.datePickerType || 'date'"
              :format="fItem.format || 'YYYY 年 MM 月 DD 日'"
              :value-format="fItem.valueFormat || 'YYYY-MM-DD'"
              :align="fItem.align || 'left'"
              :range-separator="fItem.rangeSeparator || '-'"
              :default-value="fItem.defaultValue"
              :default-time="fItem.defaultTime"
              :name="fItem.name"
              :unlink-panels="fItem.unlinkPanels || false"
              :prefix-icon="fItem.prefixIcon"
              :clear-icon="fItem.clearIcon"
              :validate-event="fItem.validateEvent || true"
              :class="[
                'filter-item',
                fItem.datePickerType !== 'date' ? 'w-310' : 'w-200',
              ]"
            />
          </template>
          <template v-else-if="fItem.type == 'dateTimePicker'">
            <el-date-picker
              v-model="listQuery[fItem.prop]"
              :readonly="fItem.readonly || false"
              :disabled="fItem.disabled || false"
              :editable="fItem.editable || true"
              :clearable="fItem.clearable || true"
              :size="fItem.datePickerSize || 'mini'"
              :placeholder="fItem.placeholder || '选择日期'"
              :start-placeholder="fItem.startPlaceholder || '选择开始日期'"
              :end-placeholder="fItem.endPlaceholder || '选择结束日期'"
              :type="fItem.datePickerType || 'datetime'"
              :format="fItem.format || 'YYYY-MM-DD HH:mm:ss'"
              :value-format="fItem.valueFormat || 'YYYY-MM-DD HH:mm:ss'"
              :range-separator="fItem.rangeSeparator || '-'"
              :default-value="fItem.defaultValue"
              :default-time="fItem.defaultTime || defaultTime"
              :name="fItem.name"
              :unlink-panels="fItem.unlinkPanels || false"
              :prefix-icon="fItem.prefixIcon"
              :clear-icon="fItem.clearIcon"
              :validate-event="fItem.validateEvent || true"
              :class="[
                'filter-item',
                fItem.datePickerType !== 'date' ? 'w-310' : 'w-200',
              ]"
            />
          </template>
          <template v-else-if="fItem.type == 'input'">
            <el-input
              v-model="listQuery[fItem.prop]"
              :placeholder="'请输入' + fItem.label || '关键词'"
              :disabled="fItem.disabled || false"
              :clearable="fItem.clearable || true"
              :suffix-icon="fItem.suffixIcon || ''"
              :prefix-icon="fItem.prefixIcon || ''"
              :size="fItem.inputSize || 'mini'"
              :maxlength="fItem.maxlength || ''"
              class="filter-item"
              :class="isPC ? 'w-200' : 'w100'"
            />
          </template>
        </el-form-item>
      </template>
      <el-button-group :class="isPC ? 'filter-item' : 'filter-item-mobile'">
        <el-button
          :style="searchParams.style || {}"
          style="padding: 7px 10px"
          :icon="searchParams.icon || 'Search'"
          :disabled="searchParams.disabled || false"
          :type="searchParams.type || 'primary'"
          :size="searchParams.size || 'mini'"
          @click="btnChange({ effect: 'search' }, 'filterForm')"
        >
          {{ searchParams.name || "搜索" }}
        </el-button>
        <el-button
          :style="resetParams.style || {}"
          style="padding: 7px 10px"
          :icon="resetParams.icon || 'Refresh'"
          :disabled="resetParams.disabled || false"
          :type="resetParams.type || 'primary'"
          :size="resetParams.size || 'mini'"
          @click="btnChange({ effect: 'reset' }, 'filterForm')"
        >
          {{ resetParams.name || "重置" }}
        </el-button>
        <template v-for="(bItem, bIndex) in btnList" :key="bIndex">
          <el-button
            :style="bItem.style || {}"
            style="padding: 7px 10px"
            :icon="bItem.icon || ''"
            :disabled="bItem.disabled || false"
            :type="bItem.type"
            :size="bItem.size || 'mini'"
            @click="btnChange(bItem, 'filterForm')"
          >
            {{ bItem.tip }}
          </el-button>
        </template>
      </el-button-group>
    </el-form>
    <slot name="adjustPrice" />
  </div>
</template>

<script lang='ts'>
import { ref, reactive, toRefs, onMounted, watch } from "vue";
import { Local } from "@/utils/storage";
export default {
  name: "",
  components: {},
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
  },
  setup(props: any, { emit }: any) {
    const filterPlusDom = ref();
    const state = reactive({
      filterList: [],
      searchParams: {},
      resetParams: {},
      btnList: [],
      defaultTime: [
        new Date(2000, 1, 1, 0, 0, 0),
        new Date(2000, 2, 1, 23, 59, 59),
      ],
      isPC: Local.get("isPC"),
    });
    const handlerSelectChange = (value: any, item: any) => {
      if (item.emit) {
        let vName = item.valueName ? item.valueName : item.value;
        let obj = item.options.filter((v: any) => v[vName] === value)[0];
        emit(item.emit, value, obj);
      }
    };
    const btnChange = (res: any, filterForm: any) => {
      if (res.effect === "search") {
        emit("filterBtnClick", { effect: "search" }, props.listQuery);
      } else if (res.effect === "reset") {
        emit("filterBtnClick", { effect: "reset" });
        // refs[filterForm].resetFields()
      } else {
        emit("filterBtnClick", res, props.listQuery);
      }
    };
    watch(
      () => [props.filterConfig],
      ([newfilterConfig, oldfilterConfig]) => {
        state.filterList = newfilterConfig.filterList || [];
        state.searchParams = newfilterConfig.searchParams || {};
        state.resetParams = newfilterConfig.resetParams || {};
        state.btnList = newfilterConfig.btnList || [];
      },
      { immediate: true, deep: true }
    );
    onMounted(() => {});
    return {
      filterPlusDom,
      ...toRefs(state),
      handlerSelectChange,
      btnChange,
    };
  },
};
</script>
<style scoped lang='scss'>
</style>