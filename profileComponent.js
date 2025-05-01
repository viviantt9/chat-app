export async function ProfileComponent() {
    return {
      data() {
        return {
          profile: {
            name: '',
            pronouns: '',
            bio: '',
            icon: ''
          },
          isEditing: false,
          selectedFile: null
        };
      },

      computed: {
        profileSchema() {
          return {
            properties: {
                value: {
                required: ['content', 'describes'],
                    properties: {
                        content: {
                            name: { type: 'string' },
                            describes: { type: 'string' },
                            pronouns: { type: 'string' },
                            bio: { type: 'string' },
                            icon: { type: 'string' }
                        },
                    describes: { type: 'string' },
                }
                }
            }
          };
        }
      },

      methods: {
        async saveProfile() {
            const contentObject = {
                name: this.name,
                pronouns: this.pronouns,
                bio: this.bio,
                icon: this.icon,
            }
            await this.$graffiti.patch({
                value: [
                    {
                        op: 'replace',
                        path: '/content',
                        value: contentObject
                    }
                ],
                channels: [this.$graffitiSession.value.actor]
            }, contentObject, this.$graffitiSession.value);
            this.isEditing = false;
        },

        async fileUpload(event) {
          this.selectedFile = event.target.files[0];
          if (this.selectedFile) {
            const graffitiObject = await this.$graffiti.fileToGraffitiObject(this.selectedFile);
            const uploadedFile = await this.$graffiti.put({
                value: graffitiObject.value,
                channels: [this.$graffitiSession.value.actor],
                allowed: []
              }, this.$graffitiSession.value);
            this.profile.icon = uploadedFile.url;
          }
        },

        async getIcon(graffitiUrl) {
            const graffitiObject = await this.$graffiti.get(graffitiUrl);         
            this.iconFile = await this.$graffiti.graffitiObjectToFile(graffitiObject);
            this.profile.icon = graffitiUrl;
        }
      },
      template: await fetch("./profileComponent.html").then((r) => r.text())
    };
 }