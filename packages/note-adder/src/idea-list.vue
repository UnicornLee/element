<template>
  <el-popover
      ref="noteIdeaListPopover"
      placement="bottom"
      trigger="manual"
      width="600"
      :value="computedVisible"
      class="note-idea-list-popover"
  >
    <div v-for="(note, index) in allNotes" :key="note.id">
      <div class="note-item">
        <div class="note-header">
          <div class="note-title">{{ note.title }}</div>
          <div v-if="note.isEditable !== true">
            <el-button type="text" icon="el-icon-edit" @click="editIdea(note.id)"></el-button>
            <el-button type="text" icon="el-icon-delete" class="note-delete-btn" @click="deleteIdea(note.id)"></el-button>
          </div>
        </div>
        <div class="note-body">
          <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="note.content"
              :disabled="note.isEditable !== true"
          >
          </el-input>
          <div v-if="note.isEditable === true" class="note-edit-btns">
            <el-button class="note-edit-cancel-btn" type="text" icon="el-icon-error" @click="cancelEditIdea(note.id)"></el-button>
            <el-button :disabled="note.content === ''" class="note-edit-confirm-btn" type="text" icon="el-icon-success" @click="confirmEditIdea(note.id)"></el-button>
          </div>
        </div>
      </div>
      <el-divider v-if="index < notes.length - 1"></el-divider>
    </div>
  </el-popover>
</template>

<script>
import _ from 'lodash';

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
          },
          isEditable: {
            type: Boolean,
            default: false
          }
        }
      }
    }
  },
  data() {
    return {
      allNotes: [],
      updateNotes: []
    };
  },
  computed: {
    computedVisible() {
      console.log('idea-list computedVisible', this.visible);
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
    },
    notes: {
      handler(val) {
        this.allNotes = _.cloneDeep(val);
      },
      deep: true
    }
  },
  methods: {
    handleClick(event) {
      if (this.computedVisible) {
        event.preventDefault();
        event.stopPropagation();
        // 判断点击事件是否发生在Popover外部
        console.log('this.$refs.noteIdeaListPopover: ', this.$refs.noteIdeaListPopover);
        if (this.$refs.noteIdeaListPopover) {
          const popoverEl = this.$refs.noteIdeaListPopover.$el;
          if (!popoverEl.contains(event.target)) {
            // 点击的是Popover外部，关闭Popover
            this.$emit('ideas-show-close', this.updateNotes);
          }
        }
      }
    },
    editIdea(id) {
      console.log('editIdea', id);
      // document.removeEventListener('mousedown', this.handleClick);
      for (let i = 0; i < this.allNotes.length; i++) {
        if (this.allNotes[i].id === id) {
          this.$set(this.allNotes[i], 'isEditable', !this.allNotes[i].isEditable);
          break;
        }
      }
      console.log('allNotes: ', this.allNotes);
    },
    cancelEditIdea(id) {
      const note = this.notes.find(note => note.id === id);
      if (note) {
        for (let i = 0; i < this.allNotes.length; i++) {
          if (this.allNotes[i].id === id) {
            this.$set(this.allNotes[i], 'content', note.content);
            this.$set(this.allNotes[i], 'isEditable', false);
            break;
          }
        }
      }
      // document.addEventListener('mousedown', this.handleClick);
    },
    confirmEditIdea(id) {
      const note = this.allNotes.find(note => note.id === id);
      for (let i = 0; i < this.allNotes.length; i++) {
        if (this.allNotes[i].id === id) {
          this.$set(this.allNotes[i], 'isEditable', !this.allNotes[i].isEditable);
          break;
        }
      }
      if (note) {
        this.$emit('idea-edit', note.id, note.content);
      }
      // document.addEventListener('mousedown', this.handleClick);
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
.note-idea-list-popover {
  position: relative;
  user-select: none;
}
.note-header,.note-body {
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
.note-edit-btns {
  width: 100px;
}
.note-edit-cancel-btn {
  font-size: 30px;
}
.note-edit-cancel-btn.el-button--text {
  color: #606266;
}
.note-edit-cancel-btn.el-button--text:hover {
  color: rgb(154, 152, 152);
}
.note-edit-confirm-btn {
  font-size: 30px;
  color: rgb(35, 131, 226);
}
</style>
