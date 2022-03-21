
export const filterConfig = {
  labelWidth: "100px",
  filterList: [{
    prop: 'goodsName',
    type: 'input',
    label: '商品名称'
  }, {
    prop: 'createTime',
    type: 'dateTimePicker',
    datePickerType: 'datetimerange',
    label: '时间'
  }, {
    prop: 'type',
    type: 'select',
    label: '统计类型',
    options: [{
      value: 'record',
      label: '明细报表'
    }, {
      value: 'product',
      label: '商品报表'
    }, {
      value: 'supplier',
      label: '供应商报表'
    }, {
      value: 'car',
      label: '车辆报表'
    }, {
      value: 'supAndPro',
      label: '供应商及货物报表'
    }, {
      value: 'byDay',
      label: '日汇总报表'
    }]
  }],
  btnList: [{
    tip: '统计',
    effect: 'statistics',
    type: 'primary',
    icon: 'DataLine'
  }]
}

export const btnConfig = {
  // hidden: 'none',
  btnList: [{
    name: '新增',
    auth: '',
    operateType: '',
    effect: 'add',
    type: '',
    icon: 'Plus'
  }, {
    name: '修改',
    auth: '',
    operateType: 'single',
    effect: 'add',
    type: 'primary',
    icon: 'Edit'
  }, {
    name: '批量删除',
    auth: '',
    operateType: 'batch',
    effect: 'add',
    type: 'danger',
    icon: 'Delete'
  }]
}

export const tableConfig = {
  selection: true,
  showSummary: true,
  summaryProp: ['sum'],
  sumToFixed: 3,
  // height: 'none',
  headerList: [
    {
      label: '图片',
      width: '120',
      props: {
        prop: 'image',
        type: 'image',
        params: {
          fit: 'fill',
          style: {
            width: '100px',
            height: '50px',
            borderRadius: '5px'
          },
          preview: true
        }
      }
    },
    {
      label: '类型类型类型',
      width: 120,
      props: {
        prop: 'option',
        type: 'filter',
        options: {
          '1': '类型1',
          '2': '类型2',
          '3': '类型3',
          '4': '类型4',
          '5': '类型5'
        }
      }
    },
    // {
    //   label: '动态插入列',
    //   props: {
    //     type: 'slot',
    //     slotName: 'slots',
    //     prop: 'image',
    //   }
    // },
    {
      filters: true,
      label: '类型',
      props: {
        prop: 'tag',
        type: 'tag',
        options: [{
          value: '1',
          label: '类型1',
          tag: 'success'
        }, {
          value: '2',
          label: '类型2',
          tag: ''
        }, {
          value: '3',
          label: '类型3',
          tag: 'warning'
        }, {
          value: '4',
          label: '类型4',
          tag: 'danger'
        }, {
          value: '5',
          label: '类型5',
          tag: 'info'
        }]
      }
    }, {
      filters: true,
      label: '姓名',
      props: {
        prop: 'name',
        type: 'editable',
        editType: 'input',
        params: {
          prepend: '123',
          append: 'abc'
        }
      }
    },
    {
      filters: true,
      filtersType: 'date',
      label: '多数据类型',
      style: {
        display: 'flex'
      },
      props: [{
        prop: 'date'
      }, {
        prop: 'sum'
      }],
    },
    {
      filters: true,
      label: '类型',
      props: {
        prop: 'option',
        type: 'editable',
        editType: 'select',
        options: [{
          value: '1',
          label: '类型1'
        }, {
          value: '2',
          label: '类型2'
        }, {
          value: '3',
          label: '类型3'
        }, {
          value: '4',
          label: '类型4'
        }, {
          value: '5',
          label: '类型5'
        }]
      }
    }, {
      filters: true,
      filtersType: 'date',
      label: '日期',
      props: {
        prop: 'date',
      }
    }, {
      filters: true,
      label: '开关',
      props: {
        type: 'switch',
        prop: 'switch',
        params: {
          activeValue: '1',
          inactiveValue: '0'
        }
      }
    }, {
      label: '余额(元)',
      props: {
        prop: 'sum',
      }
    },
    {
      label: '操作',
      fixed: 'right',
      width: 240,
      mobileWidth: 70,
      overflowTooltip: false,
      props: {
        type: 'button',
        buttonType: 'group',
        params: [{
          text: ['设置', '保存'],
          effect: 'editable',
          auth: '',
          icon: ['Edit', 'Select'],
          emit: 'edit',
          mobileShowOut: true
        }, {
          text: '更多',
          type: 'primary',
          icon: 'MoreFilled',
          btnList: [{
            text: '修改',
            auth: '',
            effect: 'update',
            type: 'primary',
            icon: 'Edit'
          }, {
            text: '提货',
            auth: '',
            effect: 'update',
            type: 'primary',
            icon: 'Edit'
          }, {
            text: '发货',
            auth: '',
            effect: 'update',
            type: 'primary',
            icon: 'Edit'
          }]
        }, {
          text: '删除',
          auth: '',
          effect: 'remove',
          type: 'danger',
          icon: 'Delete',
          filter: [{
            prop: 'option',
            value: '1,2'
          }, {
            prop: 'tag',
            value: '1,3'
          }]
        }],
        mobileBtnParams: {
          text: '',
          type: 'primary',
          icon: 'MoreFilled',
          style: {
            fontSize: '22px'
          }
        },
      }
    }
  ],
  pageConfig: {
    total: 1000
  }
}