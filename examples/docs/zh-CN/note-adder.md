## Note Adder 添加笔记 <el-tag>1.5.58</el-tag>

给一段文本添加笔记。

### 限制
1. 文本的直接父标签，不管是div、p还是span，必须设置id，格式为 `note_adder_<数字序列>` ，
   <span style="color:red; font-weight: bold;">“数字序列”请保证唯一和不变（强制要求）。</span>
   <span style="color:orange; font-weight: bold;">“数字序列”不要求连续，但需要保证是递增的（强制要求）。</span>
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

> 注：下面例子中最后一段文字的id设置错误，所以无法添加笔记。

:::demo
```html
<template>
  <div>
     <el-note-adder ref="noteAdderRef" :ranges="ranges" :notes="notes" :is-copy="isCopy" :is-ai="isAi" :idea-list-width="900" :idea-list-top="200" :idea-list-left="100" :is-shortcut-key-close="isShortcutKeyClose" />

     <p fmp_c="0">
          <span id="note_adder_1">为进一步加强公开募集证券投资基金（以下简称基金）证券交易费用管理，规范基金管理人证券交易佣金及分配管理，保护基金份额持有人合法权益，abc 123提升证券公司机构投资者服务能力，根据</span>
          <span class="laws-quote__link" data-id="24181902543271093" fmp_c="0" style="color: #1990fe; cursor: pointer;">《证券投资基金法》</span>
          <span class="laws-quote__link" data-id="458629827246292824" fmp_c="0" style="color: #1990fe; cursor: pointer;">《证券法》</span>
          <span id="note_adder_2">等法律、行政法规和中国证监会的规定，制定本规定。</span>

         <el-dropdown trigger="click">
          <a id="note_adder_3" href="https://www.baidu.com" @click.prevent="handleClickLink('note_adder_3')"
          class="el-dropdown-link">《证券投资基金法》</a>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="openLink">打开超链接</el-dropdown-item>
                <el-dropdown-item @click.native="openNotes">查看笔记</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
        <a href="https://www.baidu.com">《证券法》</a>
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
<style>
   .el-dialog.pop-dialog {
      width: 200px !important;
   }
   .el-dialog.pop-dialog > div.el-dialog__header {
      display: none !important;
   }
</style>
<script>
    export default {
        data() {
            return {
               dialogVisible: false,
                id: '',
                isCopy: true,
                isAi: true,
               isShortcutKeyClose: true,
                ranges: [
                   {
                      "id": "1",
                      "marks": [
                         {
                            "ideaIds": [
                               "cf179c3e-805f-4843-a4bf-39a0492cdf12"
                            ],
                            "start": 20,
                            "end": 25
                         },
                         {
                            "ideaIds": [
                               "51b90f43-525d-4dc8-9941-bbfc1389348a"
                            ],
                            "start": 25,
                            "end": 29
                         },
                         {
                            "ideaIds": [
                               "94bf10ae-893f-431f-951b-b2f514ac3593"
                            ],
                            "start": 29,
                            "end": 34
                         },
                         {
                            "ideaIds": [
                               "62fe4300-1661-4015-8df1-db0415e83578"
                            ],
                            "start": 34,
                            "end": 38
                         },
                         {
                            "ideaIds": [
                               "0543c126-4838-44af-9cec-27d7c5d5da39"
                            ],
                            "start": 38,
                            "end": 45
                         }
                      ]
                   },
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
                      "id": "3",
                      "marks": [
                         {
                            "ideaIds": [
                               "50fda894-3f1f-49eb-b8c8-1498f4320e32"
                            ],
                            "start": 0,
                            "end": 9
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
                              "lineStyle": 1,
                              "lineColor": "#FF0000",
                              "bgColor": "#87CEFA",
                              "ideaIds": [
                                 "f9a404f9-f4ac-47df-b141-3aa546fca2e2"
                              ],
                              "start": 178,
                              "end": 185
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
                        content: '为进一步加强证券公司监管，推动证券公司两类子公司合规展业，防范金融风险，\n 提升服务实体经济质效，协会在广泛征求各方意见的基础上，修订形成了《证券公司另类投资子公司管理规范（2024年修订）》和《证券公司私募投资基金子公司管理规范（2024年修订）》（合称两部规范），经协会第七届理事会第二十一次会议表决通过，并向中国证监会备案。',
                        updateTime: '2024-05-28 09:09:09'
                    },
                    {
                        id: '9a6daac7-b493-4d9e-8b2d-7f3c3aff551b',
                        title: '构合理',
                        content: 'bb',
                        updateTime: '2024-05-28 11:49:09'
                    },
                   {
                      "id": "f9a404f9-f4ac-47df-b141-3aa546fca2e2",
                      "title": "易用的产品。 ",
                      "content": "edddd",
                      "updateTime": "2024-06-04 10:09:43"
                   },
                    {
                        id: '0be75588-1c4c-4fd1-8fb3-a2e4dbfaea13',
                        title: '主题编辑器，可视化定制和管理站点主题、组件样式',
                        content: 'cc',
                        updateTime: '2024-05-28 15:59:09'
                    },
                   {
                      "id": "50fda894-3f1f-49eb-b8c8-1498f4320e32",
                      "title": "《证券投资基金法》",
                      "content": "qazxs\n1111",
                      "updateTime": "2024-06-04 15:09:17"
                   },
                   {
                      "id": "cf179c3e-805f-4843-a4bf-39a0492cdf12",
                      "title": "称基金）证",
                      "content": "aa",
                      "updateTime": "2024-06-12 10:44:20"
                   },
                   {
                      "id": "51b90f43-525d-4dc8-9941-bbfc1389348a",
                      "title": "券交易费",
                      "content": "bb",
                      "updateTime": "2024-06-12 10:44:52"
                   },
                   {
                      "id": "94bf10ae-893f-431f-951b-b2f514ac3593",
                      "title": "用管理，规",
                      "content": "cc",
                      "updateTime": "2024-06-12 10:45:13"
                   },
                   {
                      "id": "62fe4300-1661-4015-8df1-db0415e83578",
                      "title": "范基金管",
                      "content": "ddddd",
                      "updateTime": "2024-06-12 10:45:37"
                   },
                   {
                      "id": "0543c126-4838-44af-9cec-27d7c5d5da39",
                      "title": "理人证券交易佣",
                      "content": "ffffff",
                      "updateTime": "2024-06-12 10:45:53"
                   }
                ]
            }
        },
        methods: {
            saveNotes() {
                console.log(this.$refs.noteAdderRef.signs, this.$refs.noteAdderRef.ideas)
            },
           handleClickLink(id) {
              const noteAdder = this.$refs.noteAdderRef;
              if (noteAdder.checkIfIdeaExist(id)) {
              console.log(3333333333333);
                this.id = id;
              } else {
                this.openLink();
              }
           },
           openLink() {
              window.location.href = 'https://www.baidu.com/';
           },
           openNotes() {
               this.dialogVisible = false;
              this.$refs.noteAdderRef.directShowIdeaList(this.id);
           }
        }
    }
</script>
```
:::

### 属性
| 参数                         | 说明                                                                   | 类型      | 可选值          | 默认值                                                                                                                                                                                                                      |
|----------------------------|----------------------------------------------------------------------|---------|--------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ranges                     | 笔记信息数组，每个元素是对象，字段说明，详见下表                                             | Array   | —            | []                                                                                                                                                                                                                       |
| notes                      | 想法信息数组，每个元素是对象，字段说明，详见下表                                             | Array   | —            | []                                                                                                                                                                                                                       |
| is-copy                    | 是否开启复制功能                                                             | Boolean | true / false | true                                                                                                                                                                                                                     |
| is-bg                      | 是否开启添加背景色功能                                                          | Boolean | true / false | true                                                                                                                                                                                                                     |
| is-wavy                    | 是否开启添加波浪下划线功能                                                        | Boolean | true / false | true                                                                                                                                                                                                                     |
| is-straight                | 是否开启添加直线下划线功能                                                        | Boolean | true / false | true                                                                                                                                                                                                                     |
| is-idea                    | 是否开启写想法功能                                                            | Boolean | true / false | true                                                                                                                                                                                                                     |
| is-ai                      | 是否开启知易功能                                                             | Boolean | true / false | true                                                                                                                                                                                                                     |
| is-clear                   | 是否开启清除功能：对选中的文本进行笔记清除（不包括想法，想法需要手动删除）                                | Boolean | true / false | true                                                                                                                                                                                                                     |
| background-colors          | 背景色使用的颜色数组                                                           | Array   | -            | `['#FF00FF', '#87CEFA', '#90EE90', '#FFFFE0', '#EE82EE', '#FFB6C1']` 或 `['rgba(242,172,38,0.3)', 'rgba(73,183,247,0.3)', 'rgba(87,111,234,0.3)', 'rgba(245,97,213,0.3)', 'rgba(255,81,81,0.3)', 'rgba(139,210,83,0.3)']` |
| wavy-line-colors           | 波浪下划线使用的颜色数组                                                         | Array   | -            | `['#FF0000', '#0000FF', '#008000', '#FFFF00', '#800080', '#FF1493']` 或 `['rgb(242,172,38)', 'rgb(73,183,247)', 'rgb(87,111,234)', 'rgb(245,97,213)', 'rgb(255,81,81)', 'rgb(139,210,83)']`                               |
| straight-line-colors       | 直线下划线使用的颜色数组                                                         | Array   | -            | `['#FF0000', '#0000FF', '#008000', '#FFFF00', '#800080', '#FF1493']` 或 `['rgb(242,172,38)', 'rgb(73,183,247)', 'rgb(87,111,234)', 'rgb(245,97,213)', 'rgb(255,81,81)', 'rgb(139,210,83)']`                               |
| idea-line-color            | 写想法组件使用的下划线颜色  <el-tag>1.5.63</el-tag>                               | string  | -            | `#000`                                                                                                                                                                                                                   |
| copy-text-shortcut-key     | 复制功能快捷键                                                              | string  | -            | `Ctrl+Shift+C`                                                                                                                                                                                                           |
| background-shortcut-key    | 背景色功能快捷键                                                             | string  | -            | `Ctrl+Shift+H`                                                                                                                                                                                                           |
| wavy-line-shortcut-key     | 波浪下划线功能快捷键                                                           | string  | -            | `Ctrl+Shift+L`                                                                                                                                                                                                           |
| straight-line-shortcut-key | 直线下划线功能快捷键                                                           | string  | -            | `Ctrl+Shift+R`                                                                                                                                                                                                           |
| clear-note-shortcut-key    | 清除功能快捷键                                                              | string  | -            | `Ctrl+Shift+J`                                                                                                                                                                                                           |
| idea-write-shortcut-key    | 写想法功能快捷键 <el-tag>1.5.65</el-tag>                                     | string  | -            | `Ctrl+Shift+K`                                                                                                                                                                                                           |
| idea-list-width            | 想法列表弹窗宽度 <el-tag>1.5.65</el-tag>                                     | Number  | -            | 800                                                                                                                                                                                                                      |
| idea-list-top              | 想法列表距离浏览器窗口上端的距离，单位px，请与`idea-list-left`一起配置 <el-tag>1.5.65</el-tag> | Number  | -            | -                                                                                                                                                                                                                        |
| idea-list-left             | 想法列表距离浏览器窗口左端的距离，单位px，请与`idea-list-top`一起配置 <el-tag>1.5.65</el-tag>  | Number  | -            | -                                                                                                                                                                                                                        |
| idea-list-body-max-height  | 想法列表内容区域的最大高度，单位px <el-tag>1.5.65</el-tag>                           | Number  | -            | 500                                                                                                                                                                                                                      |
| is-shortcut-key-close      | 快捷键功能是否关闭 <el-tag>1.5.67</el-tag>                                    | Boolean | -            | true                                                                                                                                                                                                                     |

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
| 参数        | 说明                              | 类型     | 可选值                                       | 默认值 |
|-----------|---------------------------------|--------|-------------------------------------------|-----|
| id        | 想法的唯一标识，自动生成（`uuid`）            | string | —                                         | -   |
| title     | 写想法时选中的文本                       | string | —                                         | -   |
| content   | 想法内容                            | string | —                                         | -   |
| updateTime   | 创建或更新时间 <el-tag>1.5.63</el-tag> | string | —                                         | -   |
