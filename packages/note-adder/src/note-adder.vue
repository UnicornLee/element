<template>
  <div>
    <el-dialog
        ref="noteActionPopover"
        id="noteActionPopover"
        :visible.sync="visible"
        class="note-action-popover"
        :modal="false"
    >
      <div class="note-actions">
        <note-action v-if="isCopy" title="复制" type="copy"
                     :is-shortcut-key-close="isShortcutKeyClose"
                     :shortcut-key="copyTextShortcutKey"
                     :click-handler="copyText" />
        <note-action v-if="isBg" title="背景" type="background" is-dropdown
                     :is-shortcut-key-close="isShortcutKeyClose"
                     :shortcut-key="backgroundShortcutKey"
                     :colors="backgroundColors"
                     :selected-colors="selectedBgColors"
                     :last-used="backgroundLastUsed"
                     @action-color-selected="selectColor" />
        <note-action v-if="isWavy" title="波浪线" type="wavy" is-dropdown
                     :is-shortcut-key-close="isShortcutKeyClose"
                     :shortcut-key="wavyLineShortcutKey"
                     :colors="wavyLineColors"
                     :selected-colors="selectedWavyLineColors"
                     :last-used="wavyLineLastUsed"
                     @action-color-selected="selectColor" />
        <note-action v-if="isStraight" title="直线" type="straight" is-dropdown
                     :is-shortcut-key-close="isShortcutKeyClose"
                     :shortcut-key="straightLineShortcutKey"
                     :colors="straightLineColors"
                     :selected-colors="selectedStraightLineColors"
                     :last-used="straightLineLastUsed"
                     @action-color-selected="selectColor" />
        <note-action v-if="isIdea && isShortcutKeyClose" title="写想法" type="idea" @action-idea-written="showIdeaWrite" />
        <el-tooltip v-if="isIdea && !isShortcutKeyClose" class="item" effect="dark" :content="ideaWriteShortcutKey" placement="top">
          <note-action title="写想法" type="idea" @action-idea-written="showIdeaWrite" />
        </el-tooltip>
        <note-action v-if="isAi" title="知易" type="ai" :click-handler="askAI" />
        <el-divider v-if="isShowClear" direction="vertical"></el-divider>
        <note-action v-if="isShowClear && isShortcutKeyClose" title="清除" type="clear" :shortcut-key="clearNoteShortcutKey"
                     @action-clear="clearSigns" />
        <el-tooltip v-if="isShowClear && !isShortcutKeyClose" class="item" effect="dark" :content="`清除样式（${clearNoteShortcutKey}）`" placement="top">
          <note-action title="清除" type="clear" :shortcut-key="clearNoteShortcutKey"
                       @action-clear="clearSigns" />
        </el-tooltip>
      </div>
    </el-dialog>
    <idea-write :visible="ideaWriteVisible" :title="selectedText" @idea-written="writeIdea" />
    <idea-list :visible="ideaListVisible" :notes="currentIdeas"
               :idea-list-width="ideaListWidth" :idea-list-top="ideaListTop"
               :idea-list-left="ideaListLeft" :idea-list-body-max-height="ideaListBodyMaxHeight"
               @ideas-show-close="closeIdeas" @idea-edit="editIdea" @idea-delete="deleteIdea" />
  </div>
</template>

<script>
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import NoteAction from './note-action';
import IdeaList from './idea-list';
import IdeaWrite from './idea-write';
import {formatDate} from '/src/utils/date-util';

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
    },
    isCopy: {
      type: Boolean,
      default: true
    },
    isBg: {
      type: Boolean,
      default: true
    },
    isWavy: {
      type: Boolean,
      default: true
    },
    isStraight: {
      type: Boolean,
      default: true
    },
    isClear: {
      type: Boolean,
      default: true
    },
    isIdea: {
      type: Boolean,
      default: true
    },
    isAi: {
      type: Boolean,
      default: true
    },
    backgroundColors: {
      type: Array,
      default: () =>['rgba(242,172,38,0.3)', 'rgba(73,183,247,0.3)', 'rgba(87,111,234,0.3)', 'rgba(245,97,213,0.3)', 'rgba(255,81,81,0.3)', 'rgba(139,210,83,0.3)']
    },
    wavyLineColors: {
      type: Array,
      default: () => ['#F2AC26', '#49B7F7', '#576FEA', '#F561D5', '#FF5151', '#8BD253']
    },
    straightLineColors: {
      type: Array,
      default: () => ['#F2AC26', '#49B7F7', '#576FEA', '#F561D5', '#FF5151', '#8BD253']
    },
    isShortcutKeyClose: {
      type: Boolean,
      default: true
    },
    copyTextShortcutKey: {
      type: String,
      default: 'Ctrl+Shift+C'
    },
    backgroundShortcutKey: {
      type: String,
      default: 'Ctrl+Shift+H'
    },
    wavyLineShortcutKey: {
      type: String,
      default: 'Ctrl+Shift+L'
    },
    straightLineShortcutKey: {
      type: String,
      default: 'Ctrl+Shift+R'
    },
    clearNoteShortcutKey: {
      type: String,
      default: 'Ctrl+Shift+J'
    },
    ideaWriteShortcutKey: {
      type: String,
      default: 'Ctrl+Shift+K'
    },
    ideaLineColor: {
      type: String,
      default: '#666'
    },
    ideaListWidth: {
      type: Number,
      default: 800
    },
    ideaListTop: {
      type: Number,
      default: 0
    },
    ideaListLeft: {
      type: Number,
      default: 0
    },
    ideaListBodyMaxHeight: {
      type: Number,
      default: 500
    }
  },
  data() {
    return {
      visible: false,
      backgroundLastUsed: this.backgroundColors[0],
      wavyLineLastUsed: this.wavyLineColors[0],
      straightLineLastUsed: this.straightLineColors[0],
      signs: [],
      ideas: [],
      currentIdeas: [],
      ideaWriteVisible: false,
      ideaListVisible: false,
      selectedText: '',
      selectedBgColors: [],
      selectedWavyLineColors: [],
      selectedStraightLineColors: [],
      left: 0,
      top: 0
    };
  },
  created() {
    this.signs = _.cloneDeep(this.ranges);
    this.ideas = _.cloneDeep(this.notes);
  },
  computed: {
    hasPopup() {
      return this.ideaWriteVisible || this.ideaListVisible;
    },
    isShowClear() {
      if (this.isClear) {
        return this.selectedBgColors.length + this.selectedWavyLineColors.length + this.selectedStraightLineColors.length > 0;
      } else {
        return false;
      }
    }
  },
  watch: {
    hasPopup(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.lastPopupChangeTime = Date.now();
      }
    },
    ranges: {
      handler(val) {
        this.signs = val;
      },
      deep: true
    },
    notes: {
      handler(val) {
        this.ideas = val;
      },
      deep: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initNotes();
    });
    document.addEventListener('mouseup', this.handleSelection);
    document.addEventListener('mousedown', this.getMousePosition);
    if (!this.isShortcutKeyClose) {
      document.addEventListener('keydown', this.handleKeyDown);
    }
  },
  beforeDestroy() {
    document.removeEventListener('mouseup', this.handleSelection);
    document.removeEventListener('mousedown', this.getMousePosition);
    if (!this.isShortcutKeyClose) {
      document.removeEventListener('keydown', this.handleKeyDown);
    }
  },
  methods: {
    handleKeyDown(event) {
      if (this.textNodes && this.textNodes.length === 0) {
        return;
      }
      const pressedKeys = [];
      // 检查是否同时按下了 Ctrl 键（在大多数浏览器中，Meta 键也适用于 Mac 的 Command 键）
      const isCtrlPressed = event.ctrlKey || event.metaKey;
      if (isCtrlPressed) {
        pressedKeys.push('CTRL');
      }
      const isAltPressed = event.altKey;
      if (isAltPressed) {
        pressedKeys.push('ALT');
      }
      const isShiftPressed = event.shiftKey;
      if (isShiftPressed) {
        pressedKeys.push('SHIFT');
      }
      const key = event.key;
      if (key) {
        pressedKeys.push(key.toUpperCase());
      }
      const copyTextShortcutKeys = this.copyTextShortcutKey.split('+').map(key => key && key.toUpperCase());
      const backgroundShortcutKeys = this.backgroundShortcutKey.split('+').map(key => key && key.toUpperCase());
      const wavyLineShortcutKeys = this.wavyLineShortcutKey.split('+').map(key => key && key.toUpperCase());
      const straightLineShortcutKeys = this.straightLineShortcutKey.split('+').map(key => key && key.toUpperCase());
      const clearNoteShortcutKeys = this.clearNoteShortcutKey.split('+').map(key => key && key.toUpperCase());
      const ideaWriteShortcutKeys = this.ideaWriteShortcutKey.split('+').map(key => key && key.toUpperCase());
      if (pressedKeys.length > 1) {
        let isCopy = copyTextShortcutKeys.length === pressedKeys.length;
        let isBg = backgroundShortcutKeys.length === pressedKeys.length;
        let isWavy = wavyLineShortcutKeys.length === pressedKeys.length;
        let isStraight = straightLineShortcutKeys.length === pressedKeys.length;
        let isClear = clearNoteShortcutKeys.length === pressedKeys.length;
        let isIdeaWrite = ideaWriteShortcutKeys.length === pressedKeys.length;
        for (let i = 0; i < copyTextShortcutKeys.length; i++) {
          if (isCopy && !pressedKeys.includes(copyTextShortcutKeys[i])) {
            isCopy = false;
          }
        }
        for (let i = 0; i < backgroundShortcutKeys.length; i++) {
          if (isBg && !pressedKeys.includes(backgroundShortcutKeys[i])) {
            isBg = false;
          }
        }
        for (let i = 0; i < wavyLineShortcutKeys.length; i++) {
          if (isWavy && !pressedKeys.includes(wavyLineShortcutKeys[i])) {
            isWavy = false;
          }
        }
        for (let i = 0; i < straightLineShortcutKeys.length; i++) {
          if (isStraight && !pressedKeys.includes(straightLineShortcutKeys[i])) {
            isStraight = false;
          }
        }
        for (let i = 0; i < clearNoteShortcutKeys.length; i++) {
          if (isClear && !pressedKeys.includes(clearNoteShortcutKeys[i])) {
            isClear = false;
          }
        }
        for (let i = 0; i < ideaWriteShortcutKeys.length; i++) {
          if (isIdeaWrite && !pressedKeys.includes(ideaWriteShortcutKeys[i])) {
            isIdeaWrite = false;
          }
        }
        if (isCopy) {
          event.preventDefault();
          this.copyText();
        } else if (isBg) {
          event.preventDefault();
          this.mark(3, this.backgroundLastUsed);
          this.visible = false;
        } else if (isWavy) {
          event.preventDefault();
          this.mark(1, this.wavyLineLastUsed);
          this.visible = false;
        } else if (isStraight) {
          event.preventDefault();
          this.mark(2, this.straightLineLastUsed);
          this.visible = false;
        } else if (isClear) {
          event.preventDefault();
          this.mark(0);
          this.visible = false;
        } else if (isIdeaWrite) {
          event.preventDefault();
          this.visible = false;
          this.ideaWriteVisible = true;
        }
      }
    },
    getMousePosition(event) {
      this.mousePosition = {
        x: event.clientX,
        y: event.clientY
      };
    },
    handleSelection(event) {
      if (!this.visible && !this.hasPopup) {
        requestAnimationFrame(() => {
          const selection = window.getSelection();
          if (selection && selection.type) {
            if (selection.type === 'Range' && selection.rangeCount > 0 && !selection.isCollapsed &&
                selection.toString().length > 0 && selection.toString().trim() !== '' &&
                selection.toString() !== '{}') {
              this.range = selection.getRangeAt(0).cloneRange();
              // 校验信息
              const {commonAncestorContainer, startContainer, endContainer} = selection.getRangeAt(0);
              // 获取选中文本的所有直接父标签信息
              let textNodes = [];
              this.walk(commonAncestorContainer, (node) => {
                if (node === startContainer || node === endContainer || this.range.isPointInRange(node, 0)) {
                  const nodeType = node.nodeType;
                  if (nodeType === 3) {
                    textNodes.push(node);
                  }
                }
              });
              this.checkTextNodes(textNodes);
              if (this.textNodes.length === 0) return;
              this.selectedText = selection.toString();
              const { selectedBgColors, selectedWavyLineColors, selectedStraightLineColors } = this.getSelectedColors();
              let allSelectedColors = selectedBgColors;
              selectedWavyLineColors.forEach(color => {
                if (!allSelectedColors.includes(color)) {
                  allSelectedColors.push(color);
                }
              });
              selectedStraightLineColors.forEach(color => {
                if (!allSelectedColors.includes(color)) {
                  allSelectedColors.push(color);
                }
              });
              this.selectedBgColors = allSelectedColors;
              this.selectedWavyLineColors = allSelectedColors;
              this.selectedStraightLineColors = allSelectedColors;
              const browserViewWidth = window.innerWidth;
              const noteActionObj = document.getElementById('noteActionPopover');
              const {left, top, width, right} = selection.getRangeAt(0).getBoundingClientRect();
              if (this.mousePosition && this.mousePosition.x && this.mousePosition.y && left <= this.mousePosition.x <= right && Math.abs(this.mousePosition.y - top) <= 10) {
                this.left = Math.round(this.mousePosition.x - 485 / 2);
                this.top = Math.round(top);
              } else {
                this.left = Math.round(left + (width - 485) / 2);
                this.top = Math.round(top);
              }
              if (this.top >= 68) {
                this.top = this.top - 68;
              } else {
                this.top = 0;
              }
              if (this.left < 0) {
                this.left = 0;
              } else if (this.left + 485 - 6 > browserViewWidth) {
                if (browserViewWidth - 485 - 6 >= 0) {
                  this.left = Math.round(browserViewWidth - 485 - 6);
                } else {
                  this.left = 0;
                }
              }
              noteActionObj.style.left = `${this.left}px`;
              noteActionObj.style.top = `${this.top}px`;
              // 当选区非空时，处理选中文本
              this.visible = true;
            } else if (selection.type === 'Caret') {
              event.preventDefault();
              if (this.lastPopupChangeTime && Date.now() - this.lastPopupChangeTime < 500) {
                return;
              }
              if (event.target && event.target.attributes &&
                  event.target.attributes.getNamedItem('class') &&
                  event.target.attributes.getNamedItem('class').value) {
                const className = event.target.attributes.getNamedItem('class').value;
                if (!className.includes('idea-id-')) return;
                let classList = className.split(' ');
                let ideaIds = [];
                classList.forEach((className) => {
                  if (className.startsWith('idea-id-')) {
                    const ideaId = className.replace('idea-id-', '');
                    let signIds = [];
                    let matchMarks = [];
                    for (let i = 0; i < this.signs.length; i++) {
                      for (let j = 0; j < this.signs[i].marks.length; j++) {
                        const mark = this.signs[i].marks[j];
                        if (mark.ideaIds && mark.ideaIds.includes(ideaId)) {
                          if (!signIds.includes(this.signs[i].id)) {
                            signIds.push(this.signs[i].id);
                          }
                          matchMarks.push(mark);
                        }
                      }
                    }
                    for (let i = 0; i < this.signs.length; i++) {
                      const sign = this.signs[i];
                      for (let j = 0; j < sign.marks.length; j++) {
                        const mark = sign.marks[j];
                        if (mark.ideaIds && (mark.ideaIds.includes(ideaId) ||
                            (signIds.length && matchMarks.length &&
                                ((signIds[0] === sign.id && matchMarks[0].start === mark.end) ||
                                    (signIds[signIds.length - 1] === sign.id && matchMarks[matchMarks.length - 1].end === mark.start))))) {
                          mark.ideaIds.forEach((id) => {
                            if (!ideaIds.includes(id)) {
                              ideaIds.push(id);
                            }
                          });
                        }
                      }
                    }
                  }
                });
                ideaIds = this.recursionCollectIdeaIds(ideaIds);
                let ideas = [];
                ideaIds.forEach((ideaId) => {
                  const findIdea = this.ideas.find((idea) => idea.id === ideaId);
                  if (findIdea) {
                    ideas.push(findIdea);
                  }
                });
                if (ideas.length > 0) {
                  ideas.sort((a, b) => a.updateTime > b.updateTime ? 1 : -1);
                  this.currentIdeas = ideas;
                  if (event.target.parentNode.nodeName === 'A' && event.target.parentNode.getAttribute('href') !== '') {
                    return;
                  }
                  this.ideaListVisible = true;
                }
              }
            }
          }
        });
      } else if (this.visible) {
        const actionPopover = document.getElementById('noteActionPopover').children[0].children[1];
        if (this.isElementInside(actionPopover, event.target)) {
          event.preventDefault();
        }
      }
    },
    isElementInside(elementA, elementB) {
      const rectA = elementA.getBoundingClientRect();
      const rectB = elementB.getBoundingClientRect();

      return (rectA.left <= rectB.left &&
          rectB.right <= rectA.right &&
          rectA.top <= rectB.top &&
          rectB.bottom <= rectA.bottom
      );
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
    recursionCollectIdeaIds(currentIdeaIds, deep = 0) {
      if (!currentIdeaIds || currentIdeaIds.length === 0) {
        return currentIdeaIds;
      }
      let resultIdeaIds = [...currentIdeaIds];
      currentIdeaIds.forEach((ideaId) => {
        let signIds = [];
        let matchMarks = [];
        for (let i = 0; i < this.signs.length; i++) {
          for (let j = 0; j < this.signs[i].marks.length; j++) {
            const mark = this.signs[i].marks[j];
            if (mark.ideaIds && mark.ideaIds.includes(ideaId)) {
              if (!signIds.includes(this.signs[i].id)) {
                signIds.push(this.signs[i].id);
              }
              matchMarks.push(mark);
            }
          }
        }
        for (let i = 0; i < this.signs.length; i++) {
          const sign = this.signs[i];
          for (let j = 0; j < sign.marks.length; j++) {
            const mark = sign.marks[j];
            if (mark.ideaIds && (mark.ideaIds.includes(ideaId) ||
                (signIds.length && matchMarks.length &&
                    ((signIds[0] === sign.id && matchMarks[0].start === mark.end) ||
                        (signIds[signIds.length - 1] === sign.id && matchMarks[matchMarks.length - 1].end === mark.start))))) {
              mark.ideaIds.forEach((id) => {
                if (!resultIdeaIds.includes(id)) {
                  resultIdeaIds.push(id);
                }
              });
            }
          }
        }
      });
      if (currentIdeaIds.length === resultIdeaIds.length) {
        return resultIdeaIds;
      } else {
        return this.recursionCollectIdeaIds(resultIdeaIds, deep + 1);
      }
    },
    askAI() {
      this.$message({
        message: '该功能尚未开发，敬请期待！',
        type: 'warning'
      });
    },
    copyText() {
      // 将文本内容写入剪贴板
      navigator.clipboard.writeText(this.selectedText);
      // 弹出提示信息
      this.$message({
        message: '复制成功',
        type: 'success'
      });
      this.deselectText();
      // 关闭Popover
      this.visible = false;
    },
    clearSigns() {
      this.mark(0, null, []);
      this.visible = false;
      this.deselectText();
    },
    showIdeaWrite() {
      this.ideaWriteVisible = true;
      this.visible = false;
      this.deselectText();
    },
    writeIdea(content) {
      this.deselectText();
      this.ideaWriteVisible = false;
      if (content) {
        const ideaId = uuidv4();
        this.mark(4, null, [ideaId]);
        this.ideas.push({
          id: ideaId,
          title: this.selectedText,
          content: content,
          updateTime: formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss')
        });
      }
    },
    selectLastUsedColor(type, color) {
      this.selectColor({type, color});
    },
    selectColor(actionColor) {
      const {type, color, actionClose, isColorSelect} = actionColor;
      if (isColorSelect) {
        if (color) {
          if (type === 'background') {
            this.backgroundLastUsed = color;
            this.mark(3, color);
          } else if (type === 'wavy') {
            this.wavyLineLastUsed = color;
            this.mark(1, color);
          } else if (type === 'straight') {
            this.straightLineLastUsed = color;
            this.mark(2, color);
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
      }
      if (actionClose) {
        this.visible = false;
        this.deselectText();
      }
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
    mark(type, color, ideaIds) {
      this.handleTextNodes(type, color, ideaIds);
    },
    initNotes() {
      this.signs.forEach((sign) => {
        const node = document.getElementById(`note_adder_${sign.id}`);
        if (node && sign.marks.length > 0) {
          let fragment = document.createDocumentFragment();
          for (let i = 0; i < sign.marks.length; i++) {
            const {start, end, lineStyle, lineColor, bgColor, ideaIds} = sign.marks[i];
            if (i === 0 && start > 0) {
              const startNode = document.createTextNode(node.textContent.slice(0, start));
              startNode && fragment.appendChild(startNode);
            }
            let textNode = document.createElement('span');
            textNode.textContent = node.textContent.slice(start, end);
            let className = '';
            let style = '';
            if (lineStyle === 1 || lineStyle === 2) {
              className += this.getClassName(lineStyle, lineColor);
              style += this.getStyle(lineStyle, lineColor);
            }
            if (bgColor && bgColor !== '') {
              if (!className.endsWith(' ')) {
                className += ' ';
              }
              className += this.getClassName(3, bgColor);
              style += this.getStyle(3, bgColor);
            }
            if (ideaIds && ideaIds.length > 0) {
              if (!className.endsWith(' ')) {
                className += ' ';
              }
              className += this.getClassName(4, null, ideaIds);
              style += this.getStyle(4, null, style);
            }
            textNode.className = className;
            textNode.setAttribute('style', style);
            fragment.appendChild(textNode);
            if (i === sign.marks.length - 1 && end < node.textContent.length) {
              const endNode = document.createTextNode(node.textContent.slice(end + 1));
              endNode && fragment.appendChild(endNode);
            }
          }
          // 替换文本节点
          node.replaceChild(fragment, node.childNodes[0]);
        }
      });
    },
    getSelectedColors() {
      let selectedBgColors = [];
      let selectedWavyLineColors = [];
      let selectedStraightLineColors = [];
      // 遍历文本节点
      this.textNodes.forEach((node) => {
        if (node.parentNode && node.parentNode.attributes.style) {
          const style = node.parentNode.attributes.style.value;
          const styleArr = style ? style.split(';').filter(item => item.trim() !== '') : [];
          styleArr.forEach((item) => {
            if (item.startsWith('--mark-bg-color')) {
              let color = item.replace('--mark-bg-color:', '').trim();
              if (color.startsWith('rgba')) {
                const colors = color.substring(5, color.length - 1).split(',');
                color = this.rgbToHex(colors[0], colors[1], colors[2]);
              } else if (color.startsWith('rgb')) {
                const colors = color.substring(4, color.length - 1).split(',');
                color = this.rgbToHex(colors[0], colors[1], colors[2]);
              }
              if (!selectedBgColors.includes(color)) {
                selectedBgColors.push(color);
              }
            } else if (item.startsWith('--wavy-line-color')) {
              let color = item.replace('--wavy-line-color:', '').trim();
              if (color.startsWith('rgba')) {
                const colors = color.substring(5, color.length - 1).split(',');
                color = this.rgbToHex(colors[0], colors[1], colors[2]);
              } else if (color.startsWith('rgb')) {
                const colors = color.substring(4, color.length - 1).split(',');
                color = this.rgbToHex(colors[0], colors[1], colors[2]);
              }
              if (!selectedWavyLineColors.includes(color)) {
                selectedWavyLineColors.push(color);
              }
            } else if (item.startsWith('--straight-line-color')) {
              let color = item.replace('--straight-line-color:', '').trim();
              if (color.startsWith('rgba')) {
                const colors = color.substring(5, color.length - 1).split(',');
                color = this.rgbToHex(colors[0], colors[1], colors[2]);
              } else if (color.startsWith('rgb')) {
                const colors = color.substring(4, color.length - 1).split(',');
                color = this.rgbToHex(colors[0], colors[1], colors[2]);
              }
              if (!selectedStraightLineColors.includes(color)) {
                selectedStraightLineColors.push(color);
              }
            }
          });
        }
      });
      return {
        selectedBgColors,
        selectedWavyLineColors,
        selectedStraightLineColors
      };
    },
    rgbToHex(r, g, b) {
      r = Number(r);
      g = Number(g);
      b = Number(b);
      return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    },
    hexToRgb(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    },
    checkTextNodes(allTextNodes) {
      let textNodes = [];
      let textNodeIds = [];
      // 遍历文本节点
      allTextNodes.forEach((node) => {
        let parentNodeId = '';
        if (node.parentNode && node.parentNode.attributes && node.parentNode.attributes.id) {
          parentNodeId = node.parentNode.attributes.id.value;
        }
        let parentNodeClassName = '';
        if (node.parentNode && node.parentNode.className) {
          parentNodeClassName = node.parentNode.className;
        }
        if (parentNodeId.startsWith('note_adder_') || parentNodeClassName.includes('el-note-action')) {
          // 收集操作文本的id
          if (parentNodeId.startsWith('note_adder_') && textNodeIds.indexOf(parentNodeId) === -1) {
            textNodeIds.push(parentNodeId);
          } else {
            if (node.parentNode.parentNode && node.parentNode.parentNode.attributes &&
                node.parentNode.parentNode.attributes.id) {
              const parentParentNodeId = node.parentNode.parentNode.attributes.id.value;
              if (parentParentNodeId.startsWith('note_adder_') && textNodeIds.indexOf(parentParentNodeId) === -1) {
                textNodeIds.push(parentParentNodeId);
              }
            }
          }
          textNodes.push(node);
        }
      });
      this.textNodes = textNodes;
      this.textNodeIds = textNodeIds;
    },
    handleTextNodes(type, color, ideaIds) {
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
        if (node.parentNode && node.parentNode.attributes && node.parentNode.attributes.id) {
          parentNodeId = node.parentNode.attributes.id.value;
        }
        // 替换该文本节点
        this.replaceTextNode(node, parentNodeId, startOffset, endOffset, type, color, ideaIds);
      });

      // 更新需要保存的数据
      let updateSigns = [];
      let ids = [];
      this.textNodeIds.forEach((nodeId) => {
        let updateSign = {};
        const id = nodeId.replace('note_adder_', '').trim();
        ids.push(id);
        updateSign.id = id;
        const signedNode = document.getElementById(nodeId);
        let updateMarks = [];
        this.walk(signedNode, (node) => {
          let mark = {};
          let isSigned = false;
          if (node.attributes && node.attributes.style) {
            const style = node.attributes.style.value;
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
                mark.bgColor = item.replace('--mark-bg-color:', '').trim();
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
            mark.ideaIds = ideaIds;
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
      this.signs = this.signs.filter(sign => !ids.includes(sign.id));
      this.signs.push(...updateSigns);
      if (this.signs.length > 0) {
        this.signs.sort((a, b) => a.id - b.id);
      }
    },
    replaceTextNode(node, parentNodeId, startOffset, endOffset, type, color, ideaIds) {
      // 创建一个文档片段用来替换文本节点
      let fragment = document.createDocumentFragment();
      let startNode = null;
      let endNode = null;
      if (parentNodeId.startsWith('note_adder_')) {
        // 如果没有加笔记，点击取消操作，什么也不做。
        // 0：清除；4：写想法；3：背景色；1：波浪线；2：直线
        if (type === 0) {
          // 清除操作，什么也不做
          return;
        }
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
        textNode.className = this.getClassName(type, color, ideaIds);
        textNode.setAttribute('style', this.getStyle(type, color));
        fragment.appendChild(textNode);

        endNode && fragment.appendChild(endNode);

        // 替换文本节点
        node.parentNode.replaceChild(fragment, node);
      } else {
        const className = node.parentNode.className;
        const style = node.parentNode.attributes.style.value;
        // 生成前一段需要保持原样式的span
        if (startOffset !== 0) {
          startNode = document.createElement('span');
          startNode.textContent = node.nodeValue.slice(0, startOffset);
          startNode.className = className;
          startNode.setAttribute('style', style);
        }
        // 生成后一段需要保持原样式的span
        if (endOffset < node.nodeValue.length) {
          endNode = document.createElement('span');
          endNode.textContent = node.nodeValue.slice(endOffset);
          endNode.className = className;
          endNode.setAttribute('style', style);
        }
        startNode && fragment.appendChild(startNode);

        // 生成需要修改样式的文本或span
        const newClassName = this.getClassName(type, color, ideaIds, className);
        if (newClassName.trim() === '') {
          let textNode = document.createTextNode(node.nodeValue.slice(startOffset, endOffset));
          fragment.appendChild(textNode);
        } else {
          let textNode = document.createElement('span');
          textNode.textContent = node.nodeValue.slice(startOffset, endOffset);
          textNode.className = this.getClassName(type, color, ideaIds, className);
          textNode.setAttribute('style', this.getStyle(type, color, style));
          fragment.appendChild(textNode);
        }

        endNode && fragment.appendChild(endNode);

        // 替换文本节点
        node.parentNode.parentNode.replaceChild(fragment, node.parentNode);
      }
    },
    getClassName(type, color, ideaIds, className) {
      let classList = className ? className.split(' ').filter(item => item.trim() !== '') : ['el-note-action'];
      let index = -1;
      switch (type) {
        case 0: // 清除
          index = classList.indexOf('el-note-action__idea-line');
          if (index !== -1) {
            let newClassList = [];
            classList.forEach((item) => {
              if (item === 'el-note-action__idea-line' || !item.startsWith('el-note-action')) {
                newClassList.push(item);
              }
            });
            classList = newClassList;
          } else {
            classList = [];
          }
          return classList.join(' ');
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
          if (ideaIds && ideaIds.length > 0) {
            index = classList.indexOf('el-note-action__idea-line');
            if (index === -1) {
              classList.push('el-note-action__idea-line');
            }
            ideaIds.forEach((ideaId) => {
              if (!classList.includes(`idea-id-${ideaId}`)) {
                classList.push(`idea-id-${ideaId}`);
              }
            });
          }
          return classList.join(' ');
        default:
          return className;
      }
    },
    getStyle(type, color, style) {
      const styleArr = style ? style.split(';').filter(item => item.trim() !== '') : [];
      let newStyle = '';
      switch (type) {
        case 0: // 清除
          if (style && style.includes('--idea-line-color')) {
            newStyle += `--idea-line-color: ${this.ideaLineColor};`;
          }
          return newStyle;
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
          if (style && style.includes('--idea-line-color')) {
            newStyle = style;
          } else {
            for (const item of styleArr) {
              newStyle += item.trim() + ';';
            }
            newStyle += `--idea-line-color: ${this.ideaLineColor};`;
          }
          return newStyle;
        default:
          return style;
      }
    },
    closeIdeas(updateNotes) {
      this.deselectText();
      this.ideaListVisible = false;
      this.currentIdeas = [];
    },
    editIdea(id, content) {
      for (let i = 0; i < this.ideas.length; i++) {
        if (this.ideas[i].id === id) {
          this.ideas[i].content = content;
          // this.ideas[i].updateTime = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
          break;
        }
      }
    },
    deleteIdea(params) {
      const {ideaId, isClose} = params;
      if (isClose) {
        this.closeIdeas();
      }
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
      this.signs = newSigns;
      // 3. 遍历文本节点，删除该笔记id
      signIds.forEach(index => {
        const signedNode = document.getElementById(`note_adder_${index}`);
        this.walk(signedNode, (node) => {
          if (node.className) {
            let className = node.className;
            if (className.includes('idea-id-' + ideaId)) {
              const count = className.split('idea-id-').length - 1;
              if (count === 1) {
                className = className.replace('idea-id-' + ideaId, '').trim();
                className = className.replace('el-note-action__idea-line', '').trim();
                if (className.includes('el-note-action__')) {
                  let newNode = node.cloneNode(true);
                  newNode.className = className;
                  node.parentNode.replaceChild(newNode, node);
                } else {
                  let textNode = document.createTextNode(node.textContent);
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
    },
    checkIfIdeaExist(noteId) {
      const id = /^\d+$/.test(noteId) ? `note_adder_${noteId}` : noteId;
      let result = false;
      this.walk(document.getElementById(id), (node) => {
        if (node.className) {
          let className = node.className;
          if (className.includes('idea-id-')) {
            result = true;
          }
        }
      });
      return result;
    },
    directShowIdeaList(noteId) {
      const id = /^\d+$/.test(noteId) ? `note_adder_${noteId}` : noteId;
      this.walk(document.getElementById(id), (node) => {
        if (node.className) {
          let className = node.className;
          if (className.includes('idea-id-')) {
            let classList = className.split(' ');
            let ideaIds = [];
            classList.forEach((className) => {
              if (className.startsWith('idea-id-')) {
                const ideaId = className.replace('idea-id-', '');
                let signIds = [];
                let matchMarks = [];
                for (let i = 0; i < this.signs.length; i++) {
                  for (let j = 0; j < this.signs[i].marks.length; j++) {
                    const mark = this.signs[i].marks[j];
                    if (mark.ideaIds && mark.ideaIds.includes(ideaId)) {
                      if (!signIds.includes(this.signs[i].id)) {
                        signIds.push(this.signs[i].id);
                      }
                      matchMarks.push(mark);
                    }
                  }
                }
                for (let i = 0; i < this.signs.length; i++) {
                  const sign = this.signs[i];
                  for (let j = 0; j < sign.marks.length; j++) {
                    const mark = sign.marks[j];
                    if (mark.ideaIds && (mark.ideaIds.includes(ideaId) ||
                        (signIds.length && matchMarks.length &&
                            ((signIds[0] === sign.id && matchMarks[0].start === mark.end) ||
                                (signIds[signIds.length - 1] === sign.id && matchMarks[matchMarks.length - 1].end === mark.start))))) {
                      mark.ideaIds.forEach((id) => {
                        if (!ideaIds.includes(id)) {
                          ideaIds.push(id);
                        }
                      });
                    }
                  }
                }
              }
            });
            ideaIds = this.recursionCollectIdeaIds(ideaIds);
            let ideas = [];
            ideaIds.forEach((ideaId) => {
              const findIdea = this.ideas.find((idea) => idea.id === ideaId);
              if (findIdea) {
                ideas.push(findIdea);
              }
            });
            if (ideas.length > 0) {
              ideas.sort((a, b) => a.updateTime > b.updateTime ? 1 : -1);
              this.currentIdeas = ideas;
              this.visible = false;
              this.ideaWriteVisible = false;
              this.ideaListVisible = true;
            } else {
              this.$message({
                message: '该处文本没有笔记',
                type: 'info'
              });
            }
          }
        }
      });
    }
  }
};
</script>
