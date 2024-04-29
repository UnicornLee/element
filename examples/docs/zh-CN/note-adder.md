## Note Adder 添加笔记 <el-tag>1.5.29</el-tag>

给一段文本添加笔记。

### 基本用法

:::demo
```html
<template>
  <div>
      <el-note-adder :ranges="ranges" :notes="notes" />
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
  </div>
</template>
<script>
    export default {
        data() {
            return {
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
                                "color": "#87CEFA",
                                "lineStyle": 1,
                                "lineColor": "#FF0000",
                                "ideaIds": [],
                                "start": 90,
                                "end": 166
                            },
                            {
                                "color": "#87CEFA",
                                "lineStyle": 1,
                                "lineColor": "#FF0000",
                                "ideaIds": [
                                    "72989757-1015-464b-a40b-5dc3866ee353"
                                ],
                                "start": 166,
                                "end": 172
                            },
                            {
                                "color": "#87CEFA",
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
                                "lineStyle": 1,
                                "lineColor": "#FF0000",
                                "ideaIds": [
                                    "72989757-1015-464b-a40b-5dc3866ee353"
                                ],
                                "start": 175,
                                "end": 178
                            },
                            {
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
                                "lineStyle": 1,
                                "lineColor": "#FF0000",
                                "ideaIds": [],
                                "start": 0,
                                "end": 183
                            }
                        ]
                    }
                ],
                notes: [
                    {
                        id: '72989757-1015-464b-a40b-5dc3866ee353',
                        title: '第三条',
                        content: 'aa'
                    },
                    {
                        id: '9a6daac7-b493-4d9e-8b2d-7f3c3aff551b',
                        title: '第三条',
                        content: 'bb'
                    }
                ]
            }
        }
    }
</script>
```
:::

### 属性
| 参数      | 说明                 | 类型      | 可选值                           | 默认值   |
|---------- |--------------------|---------- |--------------------------------  |-------|
| ranges | 样式数组，每个元素是对象，字段说明，详见下表  | Array | — | []    |

### 事件
无

### ranges 属性
| 参数         | 说明     | 类型     | 可选值                                       | 默认值 |
|------------|--------|--------|-------------------------------------------|-----|
| id         | 样式标识   | string | —                                         | -   |
| start      | 文字开始索引 | number | —                                         | -   |
| end        | 文字结束索引 | number | —                                         | -   |
| text       | 文本内容   | string | —                                         | -   |
| lineStyle       | 线的类型   | string | 1--波浪线，2--直线，3--背景色，4--背景色+波浪线，5--背景色+直线 | -   |
| lineColor       | 线的颜色   | string | -                                         | -   |
| bgColor | 背景色    | string | -                                         | -   |
