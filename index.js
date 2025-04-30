import { createApp } from "vue";
import { GraffitiRemote } from "@graffiti-garden/implementation-remote";
import { GraffitiLocal } from "@graffiti-garden/implementation-local";
import { GraffitiPlugin } from "@graffiti-garden/wrapper-vue";

createApp({
    data() {
        return {
            currentView: 'home',
            myMessage: "",
            sending: false,
            selectedChannel: null,
            editGroupName: "",
            editMessage: "",
            editingMessage: null,
            groupNames: {},
            showNameModal: false,
        };
    },

    computed: {
        messageSchema() {
            return {
                properties: {
                value: {
                    required: ['content', 'published'],
                    properties: {
                        content: { type: 'string' },
                        published: { type: 'number' }
                    }
                }}
            };
        },
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
                                channel: { type: 'string' },
                            }
                        }
                    }
                }}
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

        activeGroupName() {
            return this.groupNames[this.selectedChannel] || 'Unnamed Chat';
        }
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

        selectChat(channel) {
            this.currentView = 'groupChat';
            this.selectedChannel = channel;
            this.loadGroupName(channel);
        },

        backToHome() {
            this.currentView = 'home';
        },

        sortedMessages(messages) {
            return messages.slice().sort((a, b) => b.value.published - a.value.published);
        },

        async sendMessage(session) {
            if (!this.myMessage) return;
            this.sending = true;
            await this.$graffiti.put({
                value: {
                content: this.myMessage,
                published: Date.now()
                },
                channels: [this.selectedChannel]
            }, session);
            this.sending = false;
            this.myMessage = '';
            await this.$nextTick();
            this.$refs.messageInput.focus();
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

        async renameGroupChat() {
            if (!this.editGroupName) return;
            await this.$graffiti.put({
                value: {
                    name: this.editGroupName,
                    describes: this.selectedChannel
                },
                channels: ['designftw']
            }, this.$graffitiSession.value);
            this.groupNames[this.selectedChannel] = this.editGroupName;
            this.editGroupName = '';
            this.showNameModal = false;
        },

        getGroupName(channel, fallback) {
            return this.groupNames[channel] || fallback;
        },

        loadGroupName(channel) {
            this.$graffiti.discover({
                channels: ['designftw'],
                schema: {
                properties: {
                    value: {
                    properties: {
                        describes: { const: channel },
                        name: { type: 'string' }
                    }
                    }
                }
                }
            }).then(async (results) => {
                for await (const result of results) {
                this.groupNames[channel] = result.value.name;
                }
            });
        },

        updateRenames(objects) {
            for (const obj of objects) {
              this.groupNames[obj.value.describes] = obj.value.name;
            }
            return true;
        },

    }
})
.use(GraffitiPlugin, {
graffiti: new GraffitiLocal()
})
.mount('#app');
