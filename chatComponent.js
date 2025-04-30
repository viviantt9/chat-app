export async function ChatComponent() {
  return {
    data() {
      return {
        myMessage: '',
        editGroupName: '',
        messages: [],
        showNameModal: false,
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
    async created() {
      await this.loadMessages();
    },
    methods: {
      async loadMessages() {
        const results = this.$graffiti.discover({
          channels: [this.selectedChannel],
          schema: this.messageSchema
        });
        
        this.messages = [];
        for await (const result of results) {
          this.messages.push({
            content: result.value.content,
            published: result.value.published,
            actor: result.actor
          });
        }
        this.messages.sort((a, b) => b.published - a.published);
      },

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
        await this.loadMessages();
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

    },
    template: await fetch("./chatComponent.html").then((r) => r.text())
  };
}