## Note Adder 添加笔记 <el-tag>1.5.58</el-tag>

给一段文本添加笔记。

### 限制
1. 文本的直接父标签，不管是div、p还是span，必须设置id，格式为 `note_adder_<数字序列>` ，**“数字序列”请保证唯一和不变（强制要求）。** “数字序列”不要求连续，但最好保证是递增的（非强制要求）。
    - 唯一：该数字唯一，才能保证`note_adder_<数字序列>`是唯一的，即文本的直接父标签的id唯一。
    - 不变：我们需要保存的笔记数据是通过该“数字序列”与文本进行关联的，如果该“数字序列”发生变化，则之前保存的笔记数据与文本的关联会出现问题。

例如：
```html
<p id="note_adder_1">
  了解设计指南，帮助产品设计人员搭建逻辑清晰、结构合理且高效易用的产品。
  了解设计指南，帮助产品设计人员搭建逻辑清晰、结构合理且高效易用的产品。
  了解设计指南，帮助产品设计人员搭建逻辑清晰、结构合理且高效易用的产品。
  了解设计指南，帮助产品设计人员搭建逻辑清晰、结构合理且高效易用的产品。
  了解设计指南，帮助产品设计人员搭建逻辑清晰、结构合理且高效易用的产品。
</p>
<div>
  <p id="note_adder_2">
	  使用组件 Demo 快速体验交互细节；使用前端框架封装的代码帮助工程师快速开发。
	  使用组件 Demo 快速体验交互细节；使用前端框架封装的代码帮助工程师快速开发。
	  使用组件 Demo 快速体验交互细节；使用前端框架封装的代码帮助工程师快速开发。
	  用组件 Demo 快速体验交互细节；使用前端框架封装的代码帮助工程师快速开发。
	  用组件 Demo 快速体验交互细节；使用前端框架封装的代码帮助工程师快速开发。
  </p>
</div>
<div id="note_adder_5">
  在线主题编辑器，可视化定制和管理站点主题、组件样式
  在线主题编辑器，可视化定制和管理站点主题、组件样式
  在线主题编辑器，可视化定制和管理站点主题、组件样式
  在线主题编辑器，可视化定制和管理站点主题、组件样式
  在线主题编辑器，可视化定制和管理站点主题、组件样式
</div>
<p id="note_adder_7">
  下载相关资源，用其快速搭建页面原型或高保真视觉稿，提升产品设计效率。
  下载相关资源，用其快速搭建页面原型或高保真视觉稿，提升产品设计效率。
  下载相关资源，用其快速搭建页面原型或高保真视觉稿，提升产品设计效率。
  下载相关资源，用其快速搭建页面原型或高保真视觉稿，提升产品设计效率。
  下载相关资源，用其快速搭建页面原型或高保真视觉稿，提升产品设计效率。
</p>
```

2. 每一块文本必须是纯文本，不能包含任何标签。

例如：
```html
<p id="note_adder_1">
  了解设计指南，帮助产品设计人员搭建逻辑清晰、结构合理且高效易用的产品1。
  了解设计指南，帮助产品设计人员搭建逻辑清晰、结构合理且高效易用的产品2。
  <img src="../../image.png" />
  了解设计指南，帮助产品设计人员搭建逻辑清晰、结构合理且高效易用的产品3。
  了解设计指南，帮助产品设计人员搭建逻辑清晰、结构合理且高效易用的产品4。
  了解设计指南，帮助产品设计人员搭建逻辑清晰、结构合理且高效易用的产品5。
</p>
```
文本内包含了`img`标签，必须改成下面这样：
```html
<p id="note_adder_1">
  了解设计指南，帮助产品设计人员搭建逻辑清晰、结构合理且高效易用的产品1。
  了解设计指南，帮助产品设计人员搭建逻辑清晰、结构合理且高效易用的产品2。
</p>
<img src="../../image.png" />
<p id="note_adder_2">
  了解设计指南，帮助产品设计人员搭建逻辑清晰、结构合理且高效易用的产品4。
  了解设计指南，帮助产品设计人员搭建逻辑清晰、结构合理且高效易用的产品5。
  了解设计指南，帮助产品设计人员搭建逻辑清晰、结构合理且高效易用的产品6。
</p>
```

对于包含文本和span标签的p标签，p标签下的文本都需要用span标签包裹并设置id。
对于超链接，如果没有设置id，即使被选中也不会添加笔记。如果加了id，也能添加笔记，笔记样式会与原来超链接的样式叠加。

例如：
```html
<p fmp_c="0">
  为进一步加强公开募集证券投资基金（以下简称基金）证券交易费用管理，规范基金管理人证券交易佣金
  及分配管理，保护基金份额持有人合法权益，提升证券公司机构投资者服务能力，根据
  <span class="laws-quote__link" data-id="24181902543271093" fmp_c="0" style="color: #1990fe; cursor: pointer;">《证券投资基金法》</span>
  <span class="laws-quote__link" data-id="458629827246292824" fmp_c="0" style="color: #1990fe; cursor: pointer;">《证券法》</span>
  等法律、行政法规和中国证监会的规定，制定本规定。
</p>
```
需要改成下面这样：
```html
<p fmp_c="0">
  <span id="note_adder_1">为进一步加强公开募集证券投资基金（以下简称基金）证券交易费用管理，规范基金管理人证券交易佣金
  及分配管理，保护基金份额持有人合法权益，提升证券公司机构投资者服务能力，根据
  </span>
  <span class="laws-quote__link" data-id="24181902543271093" fmp_c="0" style="color: #1990fe; cursor: pointer;">《证券投资基金法》</span>
  <span class="laws-quote__link" data-id="458629827246292824" fmp_c="0" style="color: #1990fe; cursor: pointer;">《证券法》</span>
  <span id="note_adder_2">等法律、行政法规和中国证监会的规定，制定本规定。</span>
</p>
```

3. 对于不需要添加笔记的内容，请不要按照1中的要求设置id，这样，即使被选中也无法添加笔记。

### 基本用法

数据保存在组件的`signs`和`ideas`变量中，请使用该组件的应用手动获取这两个变量并保存。
`signs`与`ranges`属性的字段完全一致，请参照下面`ranges`的属性说明。
`ideas`与`notes`属性的字段完全一致，请参照下面`notes`的属性说明。

:::demo
```html
<template>
  <div>
      <el-note-adder ref="noteAdderRef" :ranges="ranges" :notes="notes" :is-copy="isCopy" :is-ai="isAi" />
      <p fmp_c="0">
          <span id="note_adder_1">为进一步加强公开募集证券投资基金（以下简称基金）证券交易费用管理，规范基金管理人证券交易佣金及分配管理，保护基金份额持有人合法权益，abc 123提升证券公司机构投资者服务能力，根据</span>
          <span class="laws-quote__link" data-id="24181902543271093" fmp_c="0" style="color: #1990fe; cursor: pointer;">《证券投资基金法》</span>
          <span class="laws-quote__link" data-id="458629827246292824" fmp_c="0" style="color: #1990fe; cursor: pointer;">《证券法》</span>
          <span id="note_adder_2">等法律、行政法规和中国证监会的规定，制定本规定。</span>
      </p>
      <p id="note_adder_4">
          了解设计指南，帮助产品设计人员搭建逻辑清晰、结构合理且高效易用的产品。
          了解设计指南，帮助产品设计人员搭建逻辑清晰、结构合理且高效易用的产品。
          了解设计指南，帮助产品设计人员搭建逻辑清晰、结构合理且高效易用的产品。
          了解设计指南，帮助产品设计人员搭建逻辑清晰、结构合理且高效易用的产品。
          了解设计指南，帮助产品设计人员搭建逻辑清晰、结构合理且高效易用的产品。
      </p>
      <div>
          <p id="note_adder_6">
              使用组件 Demo 快速体验交互细节；使用前端框架封装的代码帮助工程师快速开发。
              使用组件 Demo 快速体验交互细节；使用前端框架封装的代码帮助工程师快速开发。
              使用组件 Demo 快速体验交互细节；使用前端框架封装的代码帮助工程师快速开发。
              用组件 Demo 快速体验交互细节；使用前端框架封装的代码帮助工程师快速开发。
              用组件 Demo 快速体验交互细节；使用前端框架封装的代码帮助工程师快速开发。
          </p>
      </div>
      <p id="note_adder_8">
          在线主题编辑器，可视化定制和管理站点主题、组件样式
          在线主题编辑器，可视化定制和管理站点主题、组件样式
          在线主题编辑器，可视化定制和管理站点主题、组件样式
          在线主题编辑器，可视化定制和管理站点主题、组件样式
          在线主题编辑器，可视化定制和管理站点主题、组件样式
      </p>
      <p note_adder_id="9">
          下载相关资源，用其快速搭建页面原型或高保真视觉稿，提升产品设计效率。
          下载相关资源，用其快速搭建页面原型或高保真视觉稿，提升产品设计效率。
          下载相关资源，用其快速搭建页面原型或高保真视觉稿，提升产品设计效率。
          下载相关资源，用其快速搭建页面原型或高保真视觉稿，提升产品设计效率。
          下载相关资源，用其快速搭建页面原型或高保真视觉稿，提升产品设计效率。
      </p>
      <el-button type="primary" @click="saveNotes">保存笔记</el-button>
  </div>
</template>
<script>
    export default {
        data() {
            return {
                isCopy: false,
                isAi: false,
                ranges: [
                    {
                        "id": "2",
                        "marks": [
                            {
                                "lineStyle": 1,
                                "lineColor": "#FF0000",
                                "ideaIds": [],
                                "start": 14,
                                "end": 24
                            }
                        ]
                    },
                    {
                        "id": "4",
                        "marks": [
                            {
                                "lineStyle": 1,
                                "lineColor": "#FF0000",
                                "ideaIds": [],
                                "start": 0,
                                "end": 90
                            },
                            {
                                "lineStyle": 1,
                                "lineColor": "#FF0000",
                                "ideaIds": [],
                                "start": 90,
                                "end": 166
                            },
                            {
                                "lineStyle": 1,
                                "lineColor": "#FF0000",
                                "ideaIds": [
                                    "72989757-1015-464b-a40b-5dc3866ee353"
                                ],
                                "start": 166,
                                "end": 172
                            },
                            {
                                "bgColor": "#87CEFA",
                                "lineStyle": 1,
                                "lineColor": "#FF0000",
                                "ideaIds": [
                                    "72989757-1015-464b-a40b-5dc3866ee353",
                                    "9a6daac7-b493-4d9e-8b2d-7f3c3aff551b"
                                ],
                                "start": 172,
                                "end": 173
                            },
                            {
                                "bgColor": "#87CEFA",
                                "lineStyle": 1,
                                "lineColor": "#FF0000",
                                "ideaIds": [
                                    "72989757-1015-464b-a40b-5dc3866ee353",
                                    "9a6daac7-b493-4d9e-8b2d-7f3c3aff551b"
                                ],
                                "start": 173,
                                "end": 175
                            },
                            {
                                "bgColor": "#87CEFA",
                                "lineStyle": 1,
                                "lineColor": "#FF0000",
                                "ideaIds": [
                                    "72989757-1015-464b-a40b-5dc3866ee353"
                                ],
                                "start": 175,
                                "end": 178
                            },
                            {
                                "bgColor": "#87CEFA",
                                "lineStyle": 1,
                                "lineColor": "#FF0000",
                                "ideaIds": [],
                                "start": 178,
                                "end": 237
                            }
                        ]
                    },
                    {
                        "id": "6",
                        "marks": [
                            {
                                "bgColor": "#87CEFA",
                                "lineStyle": 1,
                                "lineColor": "#FF0000",
                                "ideaIds": [],
                                "start": 0,
                                "end": 37
                            },
                            {
                                "lineStyle": 1,
                                "lineColor": "#FF0000",
                                "ideaIds": [],
                                "start": 37,
                                "end": 183
                            }
                        ]
                    },
                    {
                        "id": "8",
                        "marks": [
                            {
                                "ideaIds": [
                                    "0be75588-1c4c-4fd1-8fb3-a2e4dbfaea13"
                                ],
                                "start": 157,
                                "end": 187
                            }
                        ]
                    }
                ],
                notes: [
                    {
                        id: '72989757-1015-464b-a40b-5dc3866ee353',
                        title: '逻辑清晰、结构合理且高效',
                        content: 'aa'
                    },
                    {
                        id: '9a6daac7-b493-4d9e-8b2d-7f3c3aff551b',
                        title: '构合理',
                        content: 'bb'
                    },
                    {
                        id: '0be75588-1c4c-4fd1-8fb3-a2e4dbfaea13',
                        title: '主题编辑器，可视化定制和管理站点主题、组件样式',
                        content: 'cc'
                    }
                ]
            }
        },
        methods: {
            saveNotes() {
                console.log(this.$refs.noteAdderRef.signs, this.$refs.noteAdderRef.ideas)
            }
        }
    }
</script>
```
:::

### 属性
| 参数                         | 说明                                    | 类型      | 可选值          | 默认值                                                                                                                                                                         |
|----------------------------|---------------------------------------|---------|--------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ranges                     | 笔记信息数组，每个元素是对象，字段说明，详见下表              | Array   | —            | []                                                                                                                                                                          |
| notes                      | 想法信息数组，每个元素是对象，字段说明，详见下表              | Array   | —            | []                                                                                                                                                                          |
| is-copy                    | 是否开启复制功能                              | Boolean | true / false | true                                                                                                                                                                        |
| is-bg                      | 是否开启添加背景色功能                           | Boolean | true / false | true                                                                                                                                                                        |
| is-wavy                    | 是否开启添加波浪下划线功能                         | Boolean | true / false | true                                                                                                                                                                        |
| is-straight                | 是否开启添加直线下划线功能                         | Boolean | true / false | true                                                                                                                                                                        |
| is-idea                    | 是否开启写想法功能                             | Boolean | true / false | true                                                                                                                                                                        |
| is-ai                      | 是否开启知易功能                              | Boolean | true / false | true                                                                                                                                                                        |
| is-clear                   | 是否开启清除功能：对选中的文本进行笔记清除（不包括想法，想法需要手动删除） | Boolean | true / false | true                                                                                                                                                                        |
| background-colors          | 背景色使用的颜色数组                            | Array   | -            | `[{name: '红', val: '#FF00FF'},{name: '蓝', val: '#87CEFA'},{name: '绿', val: '#90EE90'},{name: '黄', val: '#FFFFE0'},{name: '紫', val: '#EE82EE'},{name: '粉', val: '#FFB6C1'}]` |
| wavy-line-colors           | 波浪下划线使用的颜色数组                          | Array   | -            | `[{name: '红', val: '#FF0000'},{name: '蓝', val: '#0000FF'},{name: '绿', val: '#008000'},{name: '黄', val: '#FFFF00'},{name: '紫', val: '#800080'},{name: '粉', val: '#FF1493'}]` |
| straight-line-colors       | 直线下划线使用的颜色数组                          | Array   | -            | `[{name: '红', val: '#FF0000'},{name: '蓝', val: '#0000FF'},{name: '绿', val: '#008000'},{name: '黄', val: '#FFFF00'},{name: '紫', val: '#800080'},{name: '粉', val: '#FF1493'}]` |
| dotted-line-color          | 写想法组件使用的点线颜色                          | string  | -            | `#A9A9A9`                                                                                                                                                                   |
| copy-text-shortcut-key     | 复制功能快捷键                               | string  | -            | `Ctrl+Shift+C`                                                                                                                                                              |
| background-shortcut-key    | 背景色功能快捷键                              | string  | -            | `Ctrl+Shift+H`                                                                                                                                                              |
| wavy-line-shortcut-key     | 波浪下划线功能快捷键                            | string  | -            | `Ctrl+Shift+L`                                                                                                                                                              |
| straight-line-shortcut-key | 直线下划线功能快捷键                            | string  | -            | `Ctrl+Shift+R`                                                                                                                                                              |
| clear-note-shortcut-key    | 清除功能快捷键                               | string  | -            | `Ctrl+Shift+J`                                                                                                                                                              |

### 事件
无

### ranges 属性
| 参数         | 说明                                 | 类型     | 可选值                                      | 默认值 |
|------------|------------------------------------|--------|------------------------------------------|-----|
| id         | 文本所属标签id的数字序列                      | number | —                                        | -   |
| marks      | 当前文本的笔记数组，每个元素是对象，字段说明，详见`marks`属性 | Array  | —                                        | -   |

### marks 属性
| 参数         | 说明                               | 类型     | 可选值                                      | 默认值 |
|------------|----------------------------------|--------|------------------------------------------|-----|
| start      | 笔记开始索引                           | number | —                                        | -   |
| end        | 笔记结束索引                           | number | —                                        | -   |
| lineStyle       | 线的类型                             | string | 1--波浪线，2--直线 | -   |
| lineColor       | 线的颜色                             | string | -                                        | -   |
| bgColor | 背景色                              | string | -                                        | -   |
| ideaIds | 想法id数组，每个元素是字符串，与`notes`属性中的`id`对应 | Array  | -                                        | -   |

### notes 属性
| 参数        | 说明                 | 类型     | 可选值                                       | 默认值 |
|-----------|--------------------|--------|-------------------------------------------|-----|
| id        | 想法的唯一标识，自动生成（`uuid`） | string | —                                         | -   |
| title     | 写想法时选中的文本          | string | —                                         | -   |
| content   | 想法内容               | string | —                                         | -   |
