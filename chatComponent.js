export async function ChatComponent() {
  return {
    data() {
      return {
        myMessage: '',
        editGroupName: '',
        messages: [],
        showNameModal: false,
        editMessage: "",
        editingMessage: null,
      };
    },
    computed: {
      selectedChannel() {
        return this.$route.params.channel;
      },
      messageSchema() {
        return {
          properties: {
            value: {
              required: ['content', 'published'],
              properties: {
                content: { type: 'string' },
                published: { type: 'number' }
              }
            }
          }
        };
      }, 
    },

    methods: {
      async sendMessage() {
        if (!this.myMessage.trim()) return;
        await this.$graffiti.put({
          value: {
            content: this.myMessage,
            published: Date.now()
          },
          channels: [this.selectedChannel]
        }, this.$graffitiSession.value);
        this.myMessage = '';
      },
      sortedMessages(messages) {
        return messages.slice().sort((a, b) => b.value.published - a.value.published);
      },

      async renameGroupChat() {
        if (!this.editGroupName) return;
        await this.$graffiti.put({
            value: {
                name: this.editGroupName,
                describes: this.$route.params.channel
            },
            channels: ['designftw']
        }, this.$graffitiSession.value);
        this.editGroupName = '';
        this.showNameModal = false;
      },

      async deleteMessage(message) {
        await this.$graffiti.delete(message, this.$graffitiSession.value);
      },

      startEdit(message) {
        this.editingMessage = message.url;
        this.editMessage = message.value.content;
      },

      async submitEdit(message) {
        await this.$graffiti.patch({
            value: [
            {
                op: 'replace',
                path: '/content',
                value: this.editMessage
            }
            ]
        }, message, this.$graffitiSession.value);
        this.editingMessage = null;
        this.editMessage = '';
      },

    },
    template: await fetch("./chatComponent.html").then((r) => r.text())
  };
}