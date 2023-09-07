export const defaultEditorContent = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: {level: 2},
      content: [
        {type: 'text', marks: [{type: 'bold'}], text: 'Here is'},
        {type: 'text', text: ' Monote...'},
      ],
    },
    {
      type: 'paragraph',
      content: [
        {type: 'text', marks: [{type: 'bold'}], text: 'Notion'},
        {
          type: 'text',
          text: "-style simple note taking app for your daily thoughts and activities. It's ",
        },
        {
          type: 'text',
          marks: [{type: 'bold'}, {type: 'italic'}],
          text: 'private',
        },
        {type: 'text', text: ' 🕶 and '},
        {
          type: 'text',
          marks: [{type: 'bold'}, {type: 'italic'}],
          text: 'secure',
        },
        {
          type: 'text',
          text: ' 🔐, all your notes are stored on your device...',
        },
      ],
    },
  ],
};
