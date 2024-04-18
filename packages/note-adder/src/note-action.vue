<template>
  <div class="root-container">
    <div class="note-action">
      <div class="note-action-icon-title">
        <div :class="['el-icon-' + iconName]"></div>
        <div>{{ title }}</div>
      </div>
      <div v-if="isDropdown" class="el-icon-arrow-down note-action-dropdown">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'note-action',
  props: {
    title: {
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
    }
  }
};
</script>

<style scoped>
.note-action {
  display: flex;
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
</style>
