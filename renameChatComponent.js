export async function RenameChatComponent() {
    return {
      data() {
        return {
          newGroupName: '',
          isRenaming: false
        };
      },
      methods: {
        async submitRename() {
          if (!this.newGroupName.trim()) return;
          await this.$graffiti.put({
            value: {
              name: this.newGroupName,
              describes: this.$route.params.channel
            },
            channels: ['designftw']
          }, this.$graffitiSession.value);
          this.$router.go(-1); // Go back to chat
        }
      },
      template: await fetch("./renameChatComponent.html").then((r) => r.text())
    };
  }