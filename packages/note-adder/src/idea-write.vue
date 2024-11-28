<template>
  <el-dialog
      ref="noteIdeaWritePopover"
      :visible="computedVisible"
      class="note-idea-write-popover"
      :modal="false"
      draggable
  >
    <div slot="title" class="note-idea-title">
      <div class="note-idea-close" @click="handleCancel">
        <svg width="26" height="22" viewBox="0 0 26 22" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0H24C25.1046 0 26 0.895431 26 2V22H16C7.16344 22 0 14.8366 0 6V0Z" fill="#EEEEEE"/>
          <path d="M15.6125 10L19.4625 6.15C19.6375 5.975 19.6375 5.7125 19.4625 5.5375C19.2875 5.3625 19.025 5.3625 18.85 5.5375L15 9.3875L11.15 5.5375C10.975 5.3625 10.7125 5.3625 10.5375 5.5375C10.3625 5.7125 10.3625 5.975 10.5375 6.15L14.3875 10L10.5375 13.85C10.3625 14.025 10.3625 14.2875 10.5375 14.4625C10.625 14.55 10.7344 14.5938 10.8437 14.5938C10.9531 14.5938 11.0625 14.55 11.15 14.4625L15 10.6125L18.85 14.4625C18.9375 14.55 19.0469 14.5938 19.1562 14.5938C19.2656 14.5938 19.375 14.55 19.4625 14.4625C19.6375 14.2875 19.6375 14.025 19.4625 13.85L15.6125 10Z" />
        </svg>
      </div>
    </div>
    <div class="note-idea-content">
      <div class="note-header">
        <div style="margin-top: 5px;">
          <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect y="0.5" width="18" height="18" rx="4" fill="#EEEEEE"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.10931 3.375C6.39681 3.375 4.18744 5.58438 4.18744 8.29688C4.18744 10.0906 5.14994 11.7094 6.70306 12.5844V13C6.70306 13.4812 7.09681 13.875 7.57806 13.875H10.4218C10.9031 13.875 11.2968 13.4812 11.2968 13V12.7156C12.9593 11.8844 14.0312 10.1781 14.0312 8.29688C14.0312 5.58438 11.8218 3.375 9.10931 3.375ZM10.6843 12.0156L10.4218 12.125V13H7.57806V12.0594L7.33744 11.95C5.93744 11.25 5.06244 9.85 5.06244 8.29688C5.06244 6.06562 6.87806 4.25 9.10931 4.25C11.3406 4.25 13.1562 6.06562 13.1562 8.29688C13.1562 9.91563 12.1937 11.3813 10.6843 12.0156ZM10.8593 14.75H7.14056V15.625H10.8593V14.75ZM9.68861 7.12284C9.8255 6.92374 9.77506 6.65136 9.57595 6.51447C9.37684 6.37758 9.10446 6.42802 8.96757 6.62713L8.00004 8.03445C7.70068 8.46988 8.01242 9.06249 8.54082 9.06249H9.17454L8.33229 10.0991C8.17992 10.2866 8.20843 10.5622 8.39596 10.7145C8.58348 10.8669 8.85902 10.8384 9.01139 10.6509L10.1435 9.25756C10.4919 8.82869 10.1867 8.18749 9.63413 8.18749H8.95667L9.68861 7.12284Z" fill="#666666"/>
          </svg>
        </div>
        <div class="note-title" :title="title">{{ title }}</div>
      </div>
      <div class="note-body">
        <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8 }"
            placeholder="请输入"
            v-model="content"
            maxlength="5000"
        >
        </el-input>
        <div class="idea-write-footer">
          <div>
            <el-button @click="handleCancel">取 消</el-button>
            <el-button type="primary" :disabled="confirmDisabled" @click="handleConfirm">确 定</el-button>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'idea-write',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
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
  // watch: {
  //   computedVisible(val) {
  //     if (val) {
  //       document.addEventListener('mousedown', this.handleClick);
  //     } else {
  //       document.removeEventListener('mousedown', this.handleClick);
  //     }
  //   }
  // },
  // mounted() {
  //   document.addEventListener('mousedown', this.handleClick);
  // },
  // beforeDestroy() {
  //   document.removeEventListener('mousedown', this.handleClick);
  // },
  methods: {
    // handleClick(event) {
    //   if (this.computedVisible) {
    //     // event.preventDefault();
    //     // 判断点击事件是否发生在Popover外部
    //     const popoverEl = this.$refs.noteIdeaWritePopover.$el;
    //     if (!popoverEl.contains(event.target)) {
    //       // 点击的是Popover外部，关闭Popover
    //       this.$emit('idea-written', null);
    //     }
    //   }
    // },
    handleCancel() {
      this.$emit('idea-written', null);
      this.content = '';
    },
    handleConfirm() {
      this.$emit('idea-written', this.content);
      this.content = '';
    }
  }
};
</script>
