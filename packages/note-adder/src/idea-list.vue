<template>
  <el-dialog
      id="noteIdeaListDialog"
      ref="noteIdeaListPopover"
      :visible="computedVisible"
      class="note-idea-list-popover"
      :class="{'width-setting': ideaListWidth > 0, 'position-setting': ideaListTop > 0 || ideaListLeft > 0}"
      :style="{'--idea-list-width': ideaListWidth + 'px',
              '--idea-list-top': ideaListTop + 'px',
              '--idea-list-left': ideaListLeft + 'px',
              '--idea-list-body-max-height': ideaListBodyMaxHeight + 'px'}"
      :modal="false"
      draggable
      @opened="handleOpened"
      @closed="handleClosed"
  >
    <div slot="title" class="note-idea-title">
      <div class="note-idea-close" @click="closeIdeaList">
        <svg width="26" height="22" viewBox="0 0 26 22" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0H24C25.1046 0 26 0.895431 26 2V22H16C7.16344 22 0 14.8366 0 6V0Z" fill="#EEEEEE"/>
          <path d="M15.6125 10L19.4625 6.15C19.6375 5.975 19.6375 5.7125 19.4625 5.5375C19.2875 5.3625 19.025 5.3625 18.85 5.5375L15 9.3875L11.15 5.5375C10.975 5.3625 10.7125 5.3625 10.5375 5.5375C10.3625 5.7125 10.3625 5.975 10.5375 6.15L14.3875 10L10.5375 13.85C10.3625 14.025 10.3625 14.2875 10.5375 14.4625C10.625 14.55 10.7344 14.5938 10.8437 14.5938C10.9531 14.5938 11.0625 14.55 11.15 14.4625L15 10.6125L18.85 14.4625C18.9375 14.55 19.0469 14.5938 19.1562 14.5938C19.2656 14.5938 19.375 14.55 19.4625 14.4625C19.6375 14.2875 19.6375 14.025 19.4625 13.85L15.6125 10Z" />
        </svg>
      </div>
    </div>
    <div v-for="(note, index) in allNotes" :key="note.id">
      <div class="note-idea-content">
        <div :ref="`note-item-${note.id}`" class="note-item">
          <div class="note-header">
            <div style="margin-top: 5px;">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect y="0.5" width="20" height="20" rx="4" fill="#ECF1F6"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.10931 3.375C6.39681 3.375 4.18744 5.58438 4.18744 8.29688C4.18744 10.0906 5.14994 11.7094 6.70306 12.5844V13C6.70306 13.4812 7.09681 13.875 7.57806 13.875H10.4218C10.9031 13.875 11.2968 13.4812 11.2968 13V12.7156C12.9593 11.8844 14.0312 10.1781 14.0312 8.29688C14.0312 5.58438 11.8218 3.375 9.10931 3.375ZM10.6843 12.0156L10.4218 12.125V13H7.57806V12.0594L7.33744 11.95C5.93744 11.25 5.06244 9.85 5.06244 8.29688C5.06244 6.06562 6.87806 4.25 9.10931 4.25C11.3406 4.25 13.1562 6.06562 13.1562 8.29688C13.1562 9.91563 12.1937 11.3813 10.6843 12.0156ZM10.8593 14.75H7.14056V15.625H10.8593V14.75ZM9.68861 7.12284C9.8255 6.92374 9.77506 6.65136 9.57595 6.51447C9.37684 6.37758 9.10446 6.42802 8.96757 6.62713L8.00004 8.03445C7.70068 8.46988 8.01242 9.06249 8.54082 9.06249H9.17454L8.33229 10.0991C8.17992 10.2866 8.20843 10.5622 8.39596 10.7145C8.58348 10.8669 8.85902 10.8384 9.01139 10.6509L10.1435 9.25756C10.4919 8.82869 10.1867 8.18749 9.63413 8.18749H8.95667L9.68861 7.12284Z" fill="#666666"/>
              </svg>
            </div>
            <div class="note-title" :title="note.title">{{ note.title }}</div>
            <div class="note-operation" v-if="note.isEditable !== true">
              <div @click="editIdea(note.id)">
                <svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.88125 8.05L1.77188 8.15937L1.75 8.3125L1.575 10.3469C1.55312 10.4781 1.61875 10.6094 1.70625 10.6969C1.79375 10.7844 1.925 10.8281 2.05625 10.8281L4.09063 10.6531L4.24375 10.6312L11.2438 3.63125C11.5938 3.28125 11.5938 2.73438 11.2438 2.38437L9.99687 1.1375C9.64688 0.7875 9.1 0.7875 8.75 1.1375L1.88125 8.05ZM3.85 9.8L2.49375 9.90938L2.60312 8.55312L8.11562 3.0625L9.34063 4.2875L3.85 9.8ZM9.975 3.675L9.93125 3.63125L8.75 2.42813L9.40625 1.77188L10.6531 3.01875L9.975 3.675Z" />
                  <path d="M12.0312 13.125H1.96875C1.72812 13.125 1.53125 12.9281 1.53125 12.6875C1.53125 12.4469 1.72812 12.25 1.96875 12.25H12.0312C12.2719 12.25 12.4688 12.4469 12.4688 12.6875C12.4688 12.9281 12.2719 13.125 12.0312 13.125Z" />
                </svg>
              </div>
              <el-popconfirm :ref="`popconfirm-${note.id}`" @onShow="handlePopconfirmShow(note.id)" subTitle="删除当前想法？" placement="top" @onConfirm="deleteIdea(note.id)">
                <div slot="reference">
                  <svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.7023 2.90117C10.4658 2.90117 10.273 3.09258 10.273 3.33047V11.9492C10.2771 12.116 10.1459 12.2541 9.97908 12.2596H4.03728C3.87048 12.2637 3.7324 12.1324 3.72693 11.9656V3.32227C3.72693 3.08301 3.53279 2.88887 3.29353 2.88887C3.05427 2.88887 2.86013 3.08301 2.86013 3.32227V11.9492C2.86013 12.5986 3.3865 13.125 4.03591 13.125H9.96267C10.6121 13.125 11.1385 12.5986 11.1385 11.9492V3.3291C11.1385 3.09258 10.947 2.8998 10.7092 2.8998C10.7078 2.90117 10.7051 2.90117 10.7023 2.90117Z" />
                    <path d="M12.3074 2.48008V2.47187H9.43904V2.05078C9.43904 1.40137 8.91267 0.875 8.26326 0.875H5.73669C5.09412 0.883203 4.57732 1.4082 4.57732 2.05078V2.48008H1.69255C1.4533 2.48008 1.25916 2.67422 1.25916 2.91348C1.25916 3.15273 1.4533 3.34687 1.69255 3.34687H12.306C12.5453 3.34687 12.7394 3.15273 12.7394 2.91348C12.7394 2.67422 12.5453 2.48008 12.3074 2.48008ZM8.57361 2.48008H5.3949L5.42634 2.05078C5.42224 1.88398 5.55349 1.7459 5.72029 1.74043H8.26326C8.43005 1.73633 8.56814 1.86758 8.57361 2.03437V2.48008ZM8.7199 10.6559V5.09551C8.7199 4.85625 8.52576 4.66211 8.2865 4.66211C8.04724 4.66211 7.8531 4.85625 7.8531 5.09551V10.6559C7.8531 10.8951 8.04724 11.0893 8.2865 11.0893C8.52576 11.0893 8.7199 10.8951 8.7199 10.6559ZM6.10173 10.6559V5.09551C6.10173 4.85625 5.90759 4.66211 5.66833 4.66211C5.42908 4.66211 5.23494 4.85625 5.23494 5.09551V10.6559C5.23494 10.8951 5.42908 11.0893 5.66833 11.0893C5.90759 11.0893 6.10173 10.8951 6.10173 10.6559Z" />
                  </svg>
                </div>
              </el-popconfirm>
            </div>
            <div class="note-time" v-if="note.isEditable !== true">{{ note.updateTime ? note.updateTime.substring(0, 10) : '' }}</div>
          </div>
          <div class="note-body">
            <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                placeholder="请输入"
                v-model="note.content"
                v-if="note.isEditable"
                maxlength="5000"
            />
            <div v-else>
              <el-input
                  type="textarea"
                  v-model="note.content"
                  class="textarea-readonly"
                  autosize
                  readonly
              />
            </div>
          </div>
          <div v-if="note.isEditable === true" class="note-edit-btns">
            <div>
              <el-button class="note-edit-cancel-btn"
                         @click="cancelEditIdea(note.id)">取消</el-button>
              <el-button :disabled="note.content === ''" class="note-edit-confirm-btn" type="primary"
                         @click="confirmEditIdea(note.id)">确定</el-button>
            </div>
          </div>
        </div>
      </div>
      <el-divider v-if="index < notes.length - 1"></el-divider>
    </div>
  </el-dialog>
</template>

<script>
import _ from 'lodash';
import { on, off } from '/src/utils/dom';

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
      allNotes: [],
      updateNotes: [],
      popconfirmRef: ''
    };
  },
  computed: {
    computedVisible() {
      return this.visible;
    }
  },
  watch: {
    notes: {
      handler(val) {
        this.allNotes = _.cloneDeep(val);
      },
      deep: true
    }
  },
  methods: {
    handleOpened() {
      const dialog = document.getElementById('noteIdeaListDialog');
      if (dialog && dialog.children && dialog.children.length && dialog.children[0].children &&
          dialog.children[0].children.length > 1 && dialog.children[0].children[1]) {
        on(dialog.children[0].children[1], 'scroll', this.handleWheelPopoverClose);
      }
    },
    handleClosed() {
      const dialog = document.getElementById('noteIdeaListDialog');
      if (dialog && dialog.children && dialog.children.length && dialog.children[0].children &&
          dialog.children[0].children.length > 1 && dialog.children[0].children[1]) {
        off(dialog.children[0].children[1], 'scroll', this.handleWheelPopoverClose);
      }
    },
    handleWheelPopoverClose() {
      if (this.popconfirmRef) {
        const popoverEl = this.$refs[this.popconfirmRef][0];
        if (popoverEl) {
          popoverEl.cancel();
          this.popconfirmRef = '';
        } else {
          this.popconfirmRef = '';
        }
      }
    },
    handlePopconfirmShow(id) {
      this.popconfirmRef = `popconfirm-${id}`;
    },
    closeIdeaList() {
      this.$emit('ideas-show-close', this.updateNotes);
    },
    editIdea(id) {
      for (let i = 0; i < this.allNotes.length; i++) {
        if (this.allNotes[i].id === id) {
          this.$set(this.allNotes[i], 'isEditable', !this.allNotes[i].isEditable);
          break;
        }
      }
    },
    cancelEditIdea(id) {
      this.$refs[`note-item-${id}`][0].style.height = 'unset';
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
    },
    confirmEditIdea(id) {
      this.$refs[`note-item-${id}`][0].style.height = 'unset';
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
    },
    deleteIdea(id) {
      const index = this.notes.findIndex(note => note.id === id);
      const isClose = this.notes.length === 1 && index === 0;
      this.$emit('idea-delete', {ideaId: id, isClose});
      if (!isClose) {
        this.notes.splice(index, 1);
      }
    }
  }
};
</script>
