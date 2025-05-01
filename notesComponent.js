export async function NotesComponent() {
    return {
        data() {
            return {
            notes: '',
            showNotes: false,
            saveTimeout: null
            };
        },
        computed: {
            notesSchema() {
                return {
                    properties: {
                        value: {
                            required: ['content', 'describes'],
                            properties: {
                            content: { type: 'string' },
                            describes: { type: 'string' }
                            }
                        }
                    }
                };
            }
        },

        methods: {
            selectedChannel() {
                return this.$route.params.channel;
            },

            async updateNotes(notesObjects) {
                for (const obj of notesObjects) {
                    this.notes = obj.value.content
                }
                return true;
            },

            async submitEdit() {
                await this.$graffiti.patch({
                    value: [
                    {
                        op: 'replace',
                        path: '/content',
                        value: this.notes
                    }
                    ]
                }, notes, this.$graffitiSession.value);
            },
        },
        template: await fetch("./notesComponent.html").then((r) => r.text())
    };
}