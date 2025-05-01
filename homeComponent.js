export async function HomeComponent() {
  return {
    data() {
      return {
        groupChats: [],
        showNameModal: false,
        editGroupName: ''
      };
    },
    computed: {
      groupChatSchema() {
        return {
          properties: {
            value: {
              required: ['activity', 'object'],
              properties: {
                activity: { const: 'Create' },
                object: {
                  required: ['type', 'name', 'channel'],
                  properties: {
                    type: { const: 'Group Chat' },
                    name: { type: 'string' },
                    channel: { type: 'string' }
                  }
                }
              }
            }
          }
        };
      }, 
      
      renameSchema() {
        return {
          properties: {
            value: {
              required: ['name', 'describes'],
              properties: {
                name: { type: 'string' },
                describes: { type: 'string' }
              }
            }
          }
        };
    },
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
        this.editGroupName = '';
        this.showNameModal = false;
      },

      updateRenames(objects) {
        for (const obj of objects) {
          this.groupChats[obj.value.describes] = obj.value.name;
        }
        return true;
    },
    },
    template: await fetch("./homeComponent.html").then((r) => r.text())
  };
}