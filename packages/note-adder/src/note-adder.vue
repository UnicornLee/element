<template>
  <div>
    <el-popover
        ref="noteActionPopover"
        placement="top"
        offset="10"
        trigger="manual"
        v-model="visible"
        visible-arrow
        class="note-action-popover"
    >
      <div class="note-actions">
        <note-action title="复制" type="copy" icon-name="document-copy" :shortcut-key="copyTextShortcutKey"
                     :click-handler="copyText" />
        <note-action title="背景" type="background" icon-name="house" :shortcut-key="backgroundShortcutKey"
                     :colors="backgroundColors" :last-used="backgroundLastUsed" is-dropdown
                     @action-color-selected="selectColor" />
        <note-action title="波浪线" type="wavy" icon-name="house" :shortcut-key="wavyLineShortcutKey"
                     :colors="wavyLineColors":last-used="wavyLineLastUsed" is-dropdown
                     @action-color-selected="selectColor" />
        <note-action title="直线" type="straight" icon-name="house" :shortcut-key="straightLineShortcutKey"
                     :colors="straightLineColors" :last-used="straightLineLastUsed" is-dropdown
                     @action-color-selected="selectColor" />
        <note-action title="写想法" type="idea" icon-name="edit" @action-idea-written="showIdeaWrite" />
        <note-action title="知易" type="ai" icon-name="magic-stick" />
        <note-action title="清除" type="clear" icon-name="delete" :shortcut-key="clearNoteShortcutKey" />
      </div>
    </el-popover>
    <idea-write :visible="ideaWriteVisible" @idea-written="writeIdea" />
    <idea-list :visible="ideaListVisible" :notes="currentIdeas" @ideas-show-close="closeIdeas" @idea-delete="deleteIdea" />
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import NoteAction from './note-action';
import IdeaList from './idea-list';
import IdeaWrite from './idea-write.vue';

export default {
  name: 'ElNoteAdder',

  componentName: 'ElNoteAdder',
  components: {
    IdeaWrite,
    NoteAction,
    IdeaList
  },
  props: {
    ranges: {
      type: Array,
      default: () => []
    },
    notes: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      visible: false,
      backgroundColors: [
        {name: '红', val: '#FF00FF'},
        {name: '蓝', val: '#87CEFA'},
        {name: '绿', val: '#90EE90'},
        {name: '黄', val: '#FFFFE0'},
        {name: '紫', val: '#EE82EE'},
        {name: '粉', val: '#FFB6C1'}
      ],
      wavyLineColors: [
        {name: '红', val: '#FF0000'},
        {name: '蓝', val: '#0000FF'},
        {name: '绿', val: '#008000'},
        {name: '黄', val: '#FFFF00'},
        {name: '紫', val: '#800080'},
        {name: '粉', val: '#FF1493'}
      ],
      straightLineColors: [
        {name: '红', val: '#FF0000'},
        {name: '蓝', val: '#0000FF'},
        {name: '绿', val: '#008000'},
        {name: '黄', val: '#FFFF00'},
        {name: '紫', val: '#800080'},
        {name: '粉', val: '#FF1493'}
      ],
      copyTextShortcutKey: 'Ctrl+Shift+C',
      backgroundShortcutKey: 'Ctrl+Shift+H',
      wavyLineShortcutKey: 'Ctrl+Shift+W',
      straightLineShortcutKey: 'Ctrl+Shift+S',
      clearNoteShortcutKey: 'Ctrl+Shift+C',
      backgroundLastUsed: {
        name: '红',
        val: '#FF00FF'
      },
      wavyLineLastUsed: {
        name: '红',
        val: '#FF0000'
      },
      straightLineLastUsed: {
        name: '红',
        val: '#FF0000'
      },
      dottedLineColor: '#A9A9A9',
      signs: this.ranges || [],
      ideas: this.notes || [],
      currentIdeas: [],
      ideaWriteVisible: false,
      ideaListVisible: false
    };
  },
  computed: {
    hasPopup() {
      return this.visible || this.ideaWriteVisible || this.ideaListVisible;
    }
  },
  watch: {
    hasPopup(val) {
      setTimeout(() => {
        if (val) {
          console.log('ideaListVisible: ', val);
          console.log('ideaListVisible: ', new Date());
          document.removeEventListener('mouseup', this.handleSelection);
          document.removeEventListener('mousedown', this.handleClick);
        } else {
          console.log('ideaListVisible: ', val);
          console.log('ideaListVisible: ', new Date());
          document.addEventListener('mouseup', this.handleSelection);
          document.addEventListener('mousedown', this.handleClick);
        }
      }, 500);
    }
  },
  mounted() {
    document.addEventListener('mouseup', this.handleSelection);
    document.addEventListener('mousedown', this.handleClick);
  },
  beforeDestroy() {
    document.removeEventListener('mouseup', this.handleSelection);
    document.removeEventListener('mousedown', this.handleClick);
  },
  methods: {
    handleSelection() {
      if (!this.visible) {
        requestAnimationFrame(() => {
          const selection = window.getSelection();
          if (selection && selection.type) {
            console.log('63  selection.type: ', selection.type);
            console.log('handleSelection: ', new Date());
            // console.log('63  selection.ranges: ', JSON.stringify(selection.ranges));
            console.log('63  selection.getRangeAt(0): ', selection.getRangeAt(0));
            if (selection.type === 'Range' && selection.rangeCount > 0 && !selection.isCollapsed &&
                selection.toString().length > 0 && selection.toString().trim() !== '' &&
                selection.toString() !== '{}') {
              this.range = selection.getRangeAt(0).cloneRange();
              // 校验信息
              const {commonAncestorContainer, startContainer, endContainer} = selection.getRangeAt(0);
              // 获取选中文本的所有直接父标签信息
              let textNodes = [];
              // 起始和结束节点，或者在范围内的节点，如果是文本节点则收集起来
              // let range = document.createRange();
              // range.setStart(startContainer, 0);
              // range.setEnd(endContainer, 0);
              this.walk(commonAncestorContainer, (node) => {
                if (node === startContainer || node === endContainer || this.range.isPointInRange(node, 0)) {
                  const nodeType = node.nodeType;
                  console.log('143  nodeType: ', nodeType);
                  if (nodeType === 3) {
                    textNodes.push(node);
                  }
                }
              });
              this.textNodes = textNodes;
              // console.log('66  textNodes: ', JSON.stringify(textNodes));
              this.selectedText = selection.toString();
              // console.log('66  note-adder: ', selectedText);
              // 当选区非空时，处理选中文本
              console.log('163  this.visible: ', this.visible);
              this.visible = true;
              console.log('165  this.visible: ', this.visible);
            } else if (selection.type === 'Caret') {
              // 处理鼠标点击选中文本
              console.log('note-adder: handleSelection: Caret');
              console.log('handleSelection: ', new Date());
              const { startContainer } = selection.getRangeAt(0);
              if (startContainer && startContainer.parentNode && startContainer.parentNode.className) {
                const className = startContainer.parentNode.className;
                let classList = className.split(' ');
                let ideas = [];
                classList.forEach((className) => {
                  if (className.startsWith('idea-id-')) {
                    const ideaId = className.replace('idea-id-', '');
                    ideas.push(this.ideas.find((idea) => idea.id === ideaId));
                  }
                });
                ideas = ideas.filter((idea) => idea);
                if (ideas.length > 0) {
                  console.log('note-adder: handleSelection: ideas: ', ideas);
                  this.currentIdeas = ideas;
                  this.ideaListVisible = true;
                }
              }
            }
          }
        });
      }
    },
    walk(node, callback = () => {
    }) {
      callback(node);
      if (node && node.childNodes) {
        for (let i = 0; i < node.childNodes.length; i++) {
          this.walk(node.childNodes[i], callback);
        }
      }
    },
    handleClick(event) {
      if (this.visible) {
        // 判断点击事件是否发生在Popover外部
        const popoverEl = this.$refs.noteActionPopover.$el;
        if (!popoverEl.contains(event.target)) {
          // 点击的是Popover外部，关闭Popover
          this.visible = false;
        }
      }
    },
    copyText() {
      // 获取文本内容
      const selection = window.getSelection();
      // 将文本内容写入剪贴板
      navigator.clipboard.writeText(selection.toString());
      // 弹出提示信息
      this.$message({
        showClose: true,
        message: '复制成功',
        type: 'success'
      });
      // 关闭Popover
      this.visible = false;
    },
    showIdeaWrite() {
      this.ideaWriteVisible = true;
      this.visible = false;
    },
    writeIdea(content) {
      console.log('note-adder: writeIdea: ', content);
      this.ideaWriteVisible = false;
      this.ideaId = uuidv4();
      this.mark(4);
      this.ideas.push({
        id: this.ideaId,
        title: this.selectedText,
        content: content,
        creatTime: new Date().toLocaleString()
      });
    },
    selectColor(actionColor) {
      document.addEventListener('mousedown', this.handleClick);
      console.log('note-adder: selectColor: ', JSON.stringify(actionColor));
      const {type, color} = actionColor;
      if (color) {
        if (type === 'background') {
          this.backgroundLastUsed = color;
          this.mark(3, color.val);
        } else if (type === 'wavy') {
          this.wavyLineLastUsed = color;
          this.mark(1, color.val);
        } else if (type === 'straight') {
          this.straightLineLastUsed = color;
          this.mark(2, color.val);
        }
      } else {
        if (type === 'background') {
          this.mark(3);
        } else if (type === 'wavy') {
          this.mark(1);
        } else if (type === 'straight') {
          this.mark(2);
        }
      }
      this.visible = false;
      this.deselectText();
    },
    deselectText() {
      if (window.getSelection) { // 标准浏览器
        window.getSelection().removeAllRanges();
      } else if (document.selection) { // IE <= 10
        document.selection.empty();
      }
    },
    getTextOffset(node) {
      let offset = 0;
      let parNode = node;
      // 遍历直到外层第一个非划线元素
      while (parNode && parNode.classList.contains('el-text-edit__line')) {
        // 获取前面的兄弟元素的总字符数
        offset += this.getPrevSiblingOffset(parNode);
        parNode = parNode.parentNode;
      }
      return offset;
    },
    getPrevSiblingOffset(node) {
      let offset = 0;
      let prevNode = node.previousSibling;
      while (prevNode) {
        offset +=
            prevNode.nodeType === 3 ? prevNode.nodeValue.length : prevNode.textContent.length;
        prevNode = prevNode.previousSibling;
      }
      return offset;
    },
    mark(type, color) {
      console.log('259  note-adder: mark: ', type, color);
      this.handleTextNodes(type, color);
    },
    handleTextNodes(type, color) {
      let textNodeIds = [];
      // 遍历文本节点
      this.textNodes.forEach((node) => {
        // 范围的首尾元素需要判断一下偏移量，用来截取字符
        let startOffset = 0;
        let endOffset = node.nodeValue.length;
        if (node === this.range.startContainer && this.range.startOffset !== 0) {
          startOffset = this.range.startOffset;
        }
        if (node === this.range.endContainer && this.range.endOffset !== 0) {
          endOffset = this.range.endOffset;
        }
        let parentNodeId = '';
        console.log('*************node: ', node);
        console.log('*************node.parentNode: ', node.parentNode);
        if (node.parentNode && node.parentNode.attributes && node.parentNode.attributes.id) {
          parentNodeId = node.parentNode.attributes.id.value;
        }
        let parentNodeClassName = '';
        if (node.parentNode && node.parentNode.className) {
          parentNodeClassName = node.parentNode.className;
        }
        console.log('*************parentNodeId: ', parentNodeId);
        if (parentNodeId.startsWith('note_adder_') || parentNodeClassName.includes('el-note-action')) {
          // 替换该文本节点
          this.replaceTextNode(node, parentNodeId, startOffset, endOffset, type, color);
          if (parentNodeId.startsWith('note_adder_')) {
            textNodeIds.push(parentNodeId);
          } else {
            if (node.parentNode.parentNode && node.parentNode.parentNode.attributes &&
                node.parentNode.parentNode.attributes.id) {
              const parentParentNodeId = node.parentNode.parentNode.attributes.id.value;
              if (parentParentNodeId.startsWith('note_adder_')) {
                textNodeIds.push(parentParentNodeId);
              }
            }
          }
        }
      });
      let updateSigns = [];
      let ids = [];
      console.log('356  textNodeIds: ', textNodeIds);
      textNodeIds.forEach((nodeId) => {
        let updateSign = {};
        const id = nodeId.replace('note_adder_', '').trim();
        ids.push(id);
        updateSign.id = id;
        const signedNode = document.getElementById(nodeId);
        let updateMarks = [];
        console.log('366  signedNode.childNodes: ', signedNode.childNodes);
        this.walk(signedNode.childNodes, (node) => {
          console.log('366  node: ', node);
          let mark = {};
          let isSigned = false;
          if (node.attributes && node.attributes.style) {
            const style = node.attributes.style.value;
            console.log('355  style: ', style);
            const styleList = style.split(';').filter(item => item.trim() !== '');
            styleList.forEach((item) => {
              if (item.startsWith('--wavy-line-color')) {
                mark.lineStyle = 1;
                mark.lineColor = item.replace('--wavy-line-color:', '').trim();
                isSigned = true;
              } else if (item.startsWith('--straight-line-color')) {
                mark.lineStyle = 2;
                mark.lineColor = item.replace('--straight-line-color:', '').trim();
                isSigned = true;
              } else if (item.startsWith('--mark-bg-color')) {
                mark.color = item.replace('--mark-bg-color:', '').trim();
                isSigned = true;
              }
            });
          }
          let ideaIds = [];
          if (node.className && node.className.includes('idea-id-')) {
            const classList = node.className.split(' ').filter(item => item.trim() !== '');
            classList.forEach((className) => {
              if (className.startsWith('idea-id-')) {
                ideaIds.push(className.replace('idea-id-', '').trim());
                isSigned = true;
              }
            });
          }
          if (isSigned) {
            const currentOffset = this.getPrevSiblingOffset(node);
            mark.start = currentOffset;
            mark.end = currentOffset + node.textContent.length;
            updateMarks.push(mark);
          }
        });
        if (updateMarks.length > 0) {
          updateSign.marks = updateMarks;
          updateSigns.push(updateSign);
        }
      });
      console.log('408  ids: ', ids);
      this.signs = this.signs.filter(sign => !ids.includes(sign.id));
      console.log('409  updateSigns: ', JSON.stringify(updateSigns));
      this.signs.push(...updateSigns);
      if (this.signs.length > 0) {
        this.signs.sort((a, b) => a.id - b.id);
      }
      console.log('409  this.signs: ', JSON.stringify(this.signs));
    },
    replaceTextNode(node, parentNodeId, startOffset, endOffset, type, color) {
      // 创建一个文档片段用来替换文本节点
      let fragment = document.createDocumentFragment();
      let startNode = null;
      let endNode = null;
      if (parentNodeId.startsWith('note_adder_')) {
        // 如果没有加笔记，点击取消操作，什么也不做。
        if (!color && type !== 4) {
          return;
        }
        // 截取前一段不需要划线的文本
        if (startOffset !== 0) {
          startNode = document.createTextNode(node.nodeValue.slice(0, startOffset));
        }

        // 截取后一段不需要划线的文本
        if (endOffset < node.nodeValue.length) {
          endNode = document.createTextNode(node.nodeValue.slice(endOffset));
        }
        startNode && fragment.appendChild(startNode);

        // 改成直接包裹整块文本
        let textNode = document.createElement('span');
        textNode.textContent = node.nodeValue.slice(startOffset, endOffset);
        textNode.className = this.getClassName(type, color);
        textNode.setAttribute('style', this.getStyle(type, color));
        fragment.appendChild(textNode);

        endNode && fragment.appendChild(endNode);

        // 替换文本节点
        node.parentNode.replaceChild(fragment, node);
      } else {
        const className = node.parentNode.className;
        const style = node.parentNode.attributes.style.value;
        // 截取前一段不需要划线的文本
        if (startOffset !== 0) {
          startNode = document.createElement('span');
          startNode.textContent = node.nodeValue.slice(0, startOffset);
          startNode.className = className;
          startNode.setAttribute('style', style);
        }
        // 截取后一段不需要划线的文本
        if (endOffset < node.nodeValue.length) {
          endNode = document.createElement('span');
          endNode.textContent = node.nodeValue.slice(endOffset);
          endNode.className = className;
          endNode.setAttribute('style', style);
        }
        startNode && fragment.appendChild(startNode);

        // 改成直接包裹整块文本
        const newClassName = this.getClassName(type, color, className);
        if (newClassName.trim() === '') {
          let textNode = document.createTextNode(node.nodeValue.slice(startOffset, endOffset));
          fragment.appendChild(textNode);
        } else {
          let textNode = document.createElement('span');
          textNode.textContent = node.nodeValue.slice(startOffset, endOffset);
          textNode.className = this.getClassName(type, color, className);
          textNode.setAttribute('style', this.getStyle(type, color, style));
          fragment.appendChild(textNode);
        }

        endNode && fragment.appendChild(endNode);

        // 替换文本节点
        node.parentNode.parentNode.replaceChild(fragment, node.parentNode);
      }
    },
    getClassName(type, color, className) {
      let classList = className ? className.split(' ').filter(item => item.trim() !== '') : ['el-note-action'];
      let index = -1;
      switch (type) {
        case 1: // 波浪线
          if (color) {
            index = classList.indexOf('el-note-action__straight-line');
            if (index !== -1) {
              classList.splice(index, 1);
            }
            if (!classList.includes('el-note-action__wavy-line')) {
              classList.push('el-note-action__wavy-line');
            }
          } else {
            index = classList.indexOf('el-note-action__wavy-line');
            if (index !== -1) {
              classList.splice(index, 1);
            }
            if (classList.length === 1 && classList[0] === 'el-note-action') {
              classList = [];
            }
          }
          return classList.join(' ');
        case 2: // 直线
          index = classList.indexOf('el-note-action__wavy-line');
          if (color) {
            if (index !== -1) {
              classList.splice(index, 1);
            }
            if (!classList.includes('el-note-action__straight-line')) {
              classList.push('el-note-action__straight-line');
            }
          } else {
            index = classList.indexOf('el-note-action__straight-line');
            if (index !== -1) {
              classList.splice(index, 1);
            }
            if (classList.length === 1 && classList[0] === 'el-note-action') {
              classList = [];
            }
          }
          return classList.join(' ');
        case 3: // 背景色
          if (color) {
            if (!classList.includes('el-note-action__mark-bg')) {
              classList.push('el-note-action__mark-bg');
            }
          } else {
            index = classList.indexOf('el-note-action__mark-bg');
            if (index !== -1) {
              classList.splice(index, 1);
            }
            if (classList.length === 1 && classList[0] === 'el-note-action') {
              classList = [];
            }
          }
          return classList.join(' ');
        case 4: // 写想法
          index = classList.indexOf('el-note-action__dashed-line');
          if (index === -1) {
            classList.push('el-note-action__dashed-line');
          }
          classList.push(`idea-id-${this.ideaId}`);
          return classList.join(' ');
        default:
          return className;
      }
    },
    getStyle(type, color, style) {
      const styleArr = style ? style.split(';').filter(item => item.trim() !== '') : [];
      console.log('523  getStyle: ', styleArr);
      let newStyle = '';
      switch (type) {
        case 1: // 波浪线
          if (color) {
            newStyle += '--wavy-line-color:' + color + ';';
            for (const item of styleArr) {
              if (!item.trim().startsWith('--wavy-line-color') && !item.trim().startsWith('--straight-line-color')) {
                newStyle += item.trim() + ';';
              }
            }
          } else {
            for (const item of styleArr) {
              if (!item.trim().startsWith('--wavy-line-color')) {
                newStyle += item.trim() + ';';
              }
            }
          }
          return newStyle;
        case 2: // 直线
          if (color) {
            newStyle += '--straight-line-color:' + color + ';';
            for (const item of styleArr) {
              if (!item.trim().startsWith('--wavy-line-color') && !item.trim().startsWith('--straight-line-color')) {
                newStyle += item.trim() + ';';
              }
            }
          } else {
            for (const item of styleArr) {
              if (!item.trim().startsWith('--straight-line-color')) {
                newStyle += item.trim() + ';';
              }
            }
          }
          return newStyle;
        case 3: // 背景色
          if (color) {
            newStyle += '--mark-bg-color:' + color + ';';
            for (const item of styleArr) {
              if (!item.trim().startsWith('--mark-bg-color')) {
                newStyle += item.trim() + ';';
              }
            }
          } else {
            for (const item of styleArr) {
              if (!item.trim().startsWith('--mark-bg-color')) {
                newStyle += item.trim() + ';';
              }
            }
          }
          return newStyle;
        case 4: // 写想法
          if (style && style.includes('--dotted-line-color')) {
            newStyle = style;
          } else {
            for (const item of styleArr) {
              newStyle += item.trim() + ';';
            }
            newStyle += `--dotted-line-color: ${this.dottedLineColor};`;
          }
          return newStyle;
        default:
          return style;
      }
    },
    closeIdeas(updateNotes) {
      this.ideaListVisible = false;
      this.currentIdeas = [];
      console.log('note-adder: closeIdeas: ', updateNotes);
    },
    deleteIdea(ideaId) {
      console.log('note-adder: deleteIdea: ', ideaId);
      // 1. 删除想法
      this.ideas = this.ideas.filter(idea => idea.id !== ideaId);
      // 2. 获取包含该想法的文本id，并删除与文本关联的该笔记id
      let signIds = [];
      let newSigns = [];
      for (let i = 0; i < this.signs.length; i++) {
        let sign = this.signs[i];
        let marks = [];
        for (let j = 0; j < sign.marks.length; j++) {
          const mark = sign.marks[j];
          if (mark.ideaIds.length > 0) {
            if (mark.ideaIds.includes(ideaId)) {
              signIds.push(sign.id);
              mark.ideaIds = mark.ideaIds.filter(id => id !== ideaId);
              if (mark.ideaIds.length > 0) {
                marks.push(mark);
              }
            } else {
              marks.push(mark);
            }
          }
        }
        if (marks.length > 0) {
          sign.marks = marks;
          newSigns.push(sign);
        }
      }
      console.log('note-adder: deleteIdea: this.signs: ', JSON.stringify(this.signs));
      this.signs = newSigns;
      console.log('note-adder: deleteIdea: newSigns: ', JSON.stringify(newSigns));
      // 3. 遍历文本节点，删除该笔记id
      signIds.forEach(index => {
        const signedNode = document.getElementById(`note_adder_${index}`);
        this.walk(signedNode.childNodes, (node) => {
          if (node.className) {
            let className = node.className;
            console.log('587  className: ', className);
            if (className.includes('idea-id-' + ideaId)) {
              if (className.count('idea-id-') === 1) {
                className = className.replace('idea-id-' + ideaId, '').trim();
                className = className.replace('el-note-action__dashed-line', '').trim();
                if (className.count('el-note-action__') > 0) {
                  let newNode = node.cloneNode(true);
                  newNode.className = className;
                  node.parentNode.replaceChild(newNode, node);
                } else {
                  let textNode = document.createTextNode(node.nodeValue);
                  node.parentNode.replaceChild(textNode, node);
                }
              } else {
                let newNode = node.cloneNode(true);
                newNode.className = className.replace('idea-id-' + ideaId, '').trim();
                node.parentNode.replaceChild(newNode, node);
              }
            }
          }
        });
      });
    }
  }
};
</script>

<style scoped lang="scss">
.note-action-popover {
  position: relative;
  user-select: none;
}
.note-actions {
  display: flex;
}
</style>
