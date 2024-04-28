<template>
  <div>
    <el-popover
        ref="noteIdeaListPopover"
        placement="bottom"
        trigger="manual"
        width="600"
        :value="computedVisible"
    >
      <div v-for="(note, index) in notes" :key="note.id">
        <div class="note-item">
          <div class="note-header">
            <div class="note-title">{{ note.title }}</div>
            <el-button type="text" icon="el-icon-edit"></el-button>
            <el-button type="text" icon="el-icon-delete" class="note-delete-btn" @click="deleteIdea(note.id)"></el-button>
          </div>
          <div>
            <div class="note-content">{{ note.content }}</div>
          </div>
        </div>
        <el-divider v-if="index < notes.length - 1"></el-divider>
      </div>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'idea-list',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    notes: {
      type: Array,
      items: {
        type: Object,
        properties: {
          id: {
            type: String,
            default: ''
          },
          title: {
            type: String,
            default: ''
          },
          content: {
            type: String,
            default: ''
          }
        }
      }
    }
  },
  data() {
    return {
      updateNotes: []
    };
  },
  computed: {
    computedVisible() {
      return this.visible;
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
        event.preventDefault();
        event.stopPropagation();
        // 判断点击事件是否发生在Popover外部
        const popoverEl = this.$refs.noteIdeaListPopover.$el;
        if (!popoverEl.contains(event.target)) {
          // 点击的是Popover外部，关闭Popover
          this.$emit('ideas-show-close', this.updateNotes);
        }
      }
    },
    deleteIdea(id) {
      this.$confirm('确定要删除该想法吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.notes.findIndex(note => note.id === id);
        this.notes.splice(index, 1);
        this.$emit('idea-delete', id);
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // });
        console.log('已取消删除');
      });
    }
  }
};
</script>

<style scoped>
.note-header {
  display: flex;
}
.note-title {
  color: #82848a;
  width: 500px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 10px;
}
.note-delete-btn {
  color: #ff5722;
}
</style>
