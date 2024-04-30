<template>
  <div>
    <div class="note-action" @click.prevent="actionClick">
      <div class="note-action-icon-title">
        <div v-if="type === 'background'">
          <span class="note-action-background" :style="{backgroundColor: lastUsed.val}">A</span>
        </div>
        <div v-else-if="type === 'wavy'">
          <span class="note-action-wavy" :style="{textDecorationColor: lastUsed.val}">A</span>
        </div>
        <div v-else-if="type === 'straight'">
          <span class="note-action-straight" :style="{textDecorationColor: lastUsed.val}">A</span>
        </div>
        <div v-else :class="['el-icon-' + iconName]" style="font-size: 18px;"></div>
        <div>{{ title }}</div>
      </div>
      <div v-if="isDropdown" class="el-icon-arrow-down note-action-dropdown">
      </div>
    </div>
    <note-color-select :visible="colorSelectVisible" :lastUsed="lastUsed" :shortcut-key="shortcutKey"
                       :colors="colors" @color-selected="selectColor" />
  </div>
</template>

<script>
import NoteColorSelect from './note-color-select';
import IdeaWrite from './idea-write';

export default {
  name: 'note-action',
  props: {
    title: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    iconName: {
      type: String,
      default: 'house'
    },
    isDropdown: {
      type: Boolean,
      default: false
    },
    colors: {
      type: Array,
      items: {
        type: Object,
        properties: {
          name: {
            type: String,
            default: ''
          },
          val: {
            type: String,
            default: ''
          }
        }
      }
    },
    shortcutKey: {
      type: String,
      default: ''
    },
    lastUsed: {
      type: Object,
      default: () => ({
        name: '红',
        val: 'red'
      })
    }
  },
  data() {
    return {
      colorSelectVisible: false
    };
  },
  components: {
    NoteColorSelect,
    IdeaWrite
  },
  methods: {
    actionClick() {
      if (this.isDropdown) {
        console.log('isDropdown');
        this.colorSelectVisible = true;
      } else {
        if (this.type === 'idea') {
          this.$emit('action-idea-written');
        } else if (this.type === 'clear') {
          this.$emit('action-clear');
        }
      }
    },
    selectColor(color) {
      console.log('note-action: selectColor', JSON.stringify(color));
      if (color) {
        const type = this.type;
        this.$emit('action-color-selected', {type, color});
      }
      this.colorSelectVisible = false;
    }
  }
};
</script>

<style scoped>
.note-action {
  display: flex;
  width: 70px;
  align-items: center;
  justify-content: center;
  height: 100%;
  cursor: pointer;
  user-select: none;
}

.note-action-icon-title {
  text-align: center;
}

.note-action-dropdown {
  margin-left: 5px;
}
.note-action-background {
  font-size: 18px;
}
.note-action-straight {
  font-size: 18px;
  text-decoration: underline;
}
.note-action-wavy {
  font-size: 18px;
  text-decoration: underline;
  text-decoration-style: wavy;
}
</style>
