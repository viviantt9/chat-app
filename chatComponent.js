export async function ChatComponent() {
    return {
      data() {
        return {
          myMessage: '',
          sending: false,
          editMessage: '',
          editingMessage: null
        };
      },
      computed: {
        selectedChannel() {
          return this.$route.params.channel;
        }
      },
      methods: {
        async sendMessage() {
          if (!this.myMessage.trim()) return;
          this.sending = true;
          await this.$graffiti.put({
            value: {
              content: this.myMessage,
              published: Date.now()
            },
            channels: [this.selectedChannel]
          }, this.$graffitiSession.value);
          this.myMessage = '';
          this.sending = false;
        }
      },
      template: await fetch("./chatComponent.html").then((r) => r.text())
    };
  }