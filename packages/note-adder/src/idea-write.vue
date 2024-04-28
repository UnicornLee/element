<template>
  <el-popover
      ref="noteIdeaWritePopover"
      placement="top"
      trigger="manual"
      width="600"
      :value="computedVisible"
  >
    <el-input
        type="textarea"
        :rows="2"
        placeholder="请输入内容"
        v-model="content"
    >
    </el-input>
    <div class="idea-write-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" :disabled="confirmDisabled" @click="handleConfirm">确 定</el-button>
    </div>
  </el-popover>
</template>

<script>
export default {
  name: 'idea-write',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      content: ''
    };
  },
  computed: {
    computedVisible() {
      return this.visible;
    },
    confirmDisabled() {
      return !this.content;
    }
  },
  watch: {
    computedVisible(val) {
      if (val) {
        document.addEventListener('mousedown', this.handleClick);
      } else {
        document.removeEventListener('mousedown', this.handleClick);
      }
    }
  },
  // mounted() {
  //   document.addEventListener('mousedown', this.handleClick);
  // },
  // beforeDestroy() {
  //   document.removeEventListener('mousedown', this.handleClick);
  // },
  methods: {
    handleClick(event) {
      if (this.computedVisible) {
        // event.preventDefault();
        // 判断点击事件是否发生在Popover外部
        const popoverEl = this.$refs.noteIdeaWritePopover.$el;
        if (!popoverEl.contains(event.target)) {
          // 点击的是Popover外部，关闭Popover
          this.$emit('idea-written', null);
        }
      }
    },
    handleCancel() {
      this.$emit('idea-written', null);
    },
    handleConfirm() {
      this.$emit('idea-written', this.content);
      this.content = '';
    }
  }
};
</script>

<style scoped>
.idea-write-footer {
  float: right;
  padding-top: 10px;
}
</style>
