<template>
	<q-editor
		dense
		paragraph-tag="p"
		:placeholder="placeholder"
		toolbar-toggle-color="secondary"
		:height="height"
		:min-height="minHeight"
		:toolbar="editorToolbar"
		ref="editor"
		:value="value"
		@input="handleInput"
		@keyup.enter="handleEnter"
		class="q-ma-none"
	/>
</template>

<script>
export default {
	name: 'Editor',
	emits: [
		'input',
		'enter'
	],
	props: {
		// Type of the default value for 'editorToolbar' prop must be a function
		editorToolbar: {
			type: Array,
			required: false,
			default: () => [
				['bold', 'italic', 'underline'],
				['unordered', 'ordered'],
				['fullscreen'],
				['viewsource']
			]
		},
		height: {
			type: String,
			required: false
		},
		minHeight: {
			type: String,
			required: false,
			default: () => '5rem'
		},
		isMentionable: {
			type: Boolean,
			required: false,
			default: () => true
		},
		placeholder: {
			type: String,
			required: false
		},
		value: {
			type: String,
			required: false,
			default: () => ''
		}
	},
	computed: {
		mentioningRegex () {
			return this.$store.getters['auth/MENTIONING_REGEX']
		},
		editor () {
			return this.$refs.editor
		}
	},
	methods: {
		handleInput (value) {
			const html = this.renderEditorMentioning(value)
			this.$emit('input', html)
		},
		async handleEnter (e) {
			/** Handle Ctrl + Enter command in editor **/
			if (e.ctrlKey) {
				this.$emit('enter')
			}
		},
		focus () {
			/** Let's focus editor by this method **/
			this.$nextTick(this.editor.focus)
		},
		_setEditorSelectionRange ($node, from, to) {
			const range = document.createRange()
			const sel = window.getSelection()

			range.setStart($node, from)
			range.setEnd($node, to)

			sel.removeAllRanges()
			sel.addRange(range)
		},
		_setEditorCaret ($node, offset) {
			const range = document.createRange()
			const sel = window.getSelection()
			const innerTextLength = $node.length

			if (offset >= innerTextLength) return false

			range.setStart($node, innerTextLength)
			range.collapse(true)

			sel.removeAllRanges()
			sel.addRange(range)
		},
		getMentionedParticipant (value) {
			/** Check Mentioning by checking all RegExp, pre-built
			 * It also update participant object by defining index **/

			for (const participant of this.mentioningRegex) {
				const mentioned = value.match(participant.regex)
				if (mentioned) {
					participant.index = mentioned.index
					return participant
				}
			}

			return false
		},
		generateMentionedChip (participant) {
			/** generate username snippet for mentioned username **/
			const spanClass = 'class="editor_token"'
			const titleOption = `title="${participant.fullName}"`
			const userId = `data-mentioned-user-id="${participant.userId}"`
			const username = participant.username
			const contentNotEditable = 'contenteditable="false"'
			const space = '&nbsp;'

			return `${space}<span ${spanClass} ${titleOption} ${userId} ${contentNotEditable}>${username}</span>${space}`
		},
		renderEditorMentioning (value) {
			/** Replace @username to snippet with firstName-lastName non-editable block **/

			/** Firstly we have to check - do we have mentioning somewhere in the text **/
			const person = this.getMentionedParticipant(value)
			if (!person) return value

			const selection = this.editor.caret.selection

			/** Getting initial position of caret **/
			const currentPos = selection.focusOffset
			const currentNode = selection.focusNode

			/** Set selection for typed username and delete it from the document **/
			this._setEditorSelectionRange(currentNode, currentPos - (person.textLength + 1), currentPos)
			this.editor.caret.selection.deleteFromDocument()

			/** Set caret to initial position that was before username deletion **/
			this._setEditorCaret(currentNode, currentPos)

			/** We generate placeholder and insert it in editor **/
			const placeholder = this.generateMentionedChip(person)
			this.$nextTick(this.editor.runCmd('insertHTML', placeholder, true))
			this.$nextTick(this.editor.focus)

			return this.editor.getContentEl().innerHTML
		}
	}
}
</script>
