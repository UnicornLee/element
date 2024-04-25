<template>
  <el-popover
      ref="noteIdeaWritePopover"
      placement="top"
      trigger="manual"
      :value="computedVisible"
  >
    <el-input
        type="textarea"
        :rows="2"
        placeholder="请输入内容"
        v-model="content">
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
  mounted() {
    document.addEventListener('mousedown', this.handleClick);
  },
  beforeDestroy() {
    document.removeEventListener('mousedown', this.handleClick);
  },
  methods: {
    handleClick(event) {
      if (this.computedVisible) {
        // event.preventDefault();
        // 判断点击事件是否发生在Popover外部
        const popoverEl = this.$refs.noteIdeaWritePopover.$el;
        if (!popoverEl.contains(event.target)) {
          // 点击的是Popover外部，关闭Popover
          this.$emit('idea-written', null);
          document.removeEventListener('mousedown', this.handleClick);
        }
      }
    },
    handleCancel() {
      this.$emit('idea-written', null);
      document.removeEventListener('mousedown', this.handleClick);
    },
    handleConfirm() {
      this.$emit('idea-written', this.content);
      this.content = '';
      document.removeEventListener('mousedown', this.handleClick);
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
