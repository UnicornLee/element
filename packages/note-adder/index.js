import NoteAdder from './src/note-adder';

/* istanbul ignore next */
NoteAdder.install = function(Vue) {
  Vue.component(NoteAdder.name, NoteAdder);
};

export default NoteAdder;
