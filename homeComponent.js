export async function HomeComponent() {
  return {
    data() {
      return {
        groupNames: {},
        showNameModal: false,
        editGroupName: ''
      };
    },
    methods: {
      async createGroupChat() {
        const newChannel = crypto.randomUUID();
        await this.$graffiti.put({
          value: {
            activity: 'Create',
            object: {
              type: 'Group Chat',
              name: this.editGroupName || 'Unnamed Chat',
              channel: newChannel,
            }
          },
          channels: ['designftw']
        }, this.$graffitiSession.value);
        this.$router.push(`/chat/${newChannel}`);
      }
    },
    template: await fetch("./homeComponent.html").then((r) => r.text())
  };
}