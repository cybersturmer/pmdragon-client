<template>
	<div>
		<q-menu
			square
			auto-close
			no-focus
			:target="this.editor"
			:value="true">
			<!-- List for persons -->
			<q-list bordered
							separator>
				<!-- Item with username, we create mentioning chip on clicking it-->
				<q-item
					v-for="person in persons"
					:key="person.id"
					v-ripple
					clickable
					@click="select(person)">
					<q-item-section>
						@{{ person.username }}
					</q-item-section>
				</q-item>
			</q-list>
		</q-menu>
		<q-editor
			dense
			paragraph-tag="p"
			ref="editor"
			toolbar-toggle-color="secondary"
			class="q-ma-none"
			:placeholder="placeholder"
			:height="height"
			:min-height="minHeight"
			:toolbar="editorToolbar"
			:value="value"
			@input="handleInput"
			@keydown.tab.prevent="handleTab"
			@keyup.enter="handleEnter"/>
	</div>
</template>

<script>
import { isEmptyString } from 'src/services/util'

export default {
	name: 'Editor',
	emits: [
		'input',
		'enter',
		'show_popup',
		'mentioning',
		'stop_mentioning'
	],
	props: {
		editorToolbar: {
			type: Array,
			required: false,
			default: () => [ 		// Type of the default value for 'editorToolbar' prop must be a function
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
	data () {
		return {
			isMentionSuggestionVisible: false,
			anchorNode: undefined,
			html: this.value
		}
	},
	mounted () {
		this.anchorNode = this.$refs.editor.getContentEl()
	},
	computed: {
		mentioningPatternObjects () {
			/** Mentioning regex's based on usernames so
			 * could be convenient generated from vuex store and yeas, i think
			 * that is good approach to use it from all components **/
			return this.$store.getters['auth/MENTIONING_REGEX']
		},
		editor () {
			/** Just return editor instance from $refs variable
			 * I use it to make code easier to understand **/
			return this.$refs.editor
		},
		htmlLength () {
			return this.anchorNode.innerHTML.length
		},
		persons () {
			return this.$store.getters['auth/PERSONS']
				.filter(this.filterByAnyMeta)
				.slice(0, this.maxResults)
		}
	},
	methods: {
		/** Popup related methods */
		select (person) {
			this.$emit('select', person)
		},
		selectFirst () {
			this.$emit('select', this.persons[0])
		},
		filterByAnyMeta (value) {
			/** Let's return true if there is no filter **/
			if (isEmptyString(this.filter)) return false

			try {
				return this.filterByUsername(value) ||
					this.filterByFirstName(value) ||
					this.filterByLastName(value)
			} catch (e) {
				return false
			}
		},
		filterByUsername (value) {
			return value.username.toLowerCase().includes(this.filter)
		},
		filterByFirstName (value) {
			return value.first_name.toLowerCase().includes(this.filter)
		},
		filterByLastName (value) {
			return value.last_name.toLowerCase().includes(this.filter)
		},
		showMentioningPopup (value) {
			this.isMentioningPopupVisible = true
			this.popupParticipantsFilter = value[1].toLowerCase()
			this.focus()
		},
		hideMentioningPopup () {
			this.isMentioningPopupVisible = false
			this.focus()
		},
		/** Editor related methods **/
		__setSelectionRange ($node, from, to) {
			/** We drop all previous selections and set another selection **/
			const range = document.createRange()
			const sel = window.getSelection()

			// $node = range.selectNodeContents(this.editor.)

			// The Range.setStart() method sets the start position of a Range.
			// https://developer.mozilla.org/en-US/docs/Web/API/Range/setStart
			range.setStart($node, from)

			// The Range.setEnd() method sets the end position of a Range to be
			// located at the given offset into the specified node x.Setting
			// the end point above (higher in the document) than the start point
			// will result in a collapsed range with the start and end points
			// both set to the specified end position.
			// https://developer.mozilla.org/en-US/docs/Web/API/Range/setEnd
			range.setEnd($node, to)

			// Experimental!  The Selection.removeAllRanges() method removes all ranges from the selection,
			// leaving the anchorNode and focusNode properties equal to null and leaving nothing selected.
			// https://developer.mozilla.org/en-US/docs/Web/API/Selection/removeAllRanges
			sel.removeAllRanges()

			// The Selection.addRange() method adds a Range to a Selection.
			// https://developer.mozilla.org/en-US/docs/Web/API/Selection/addRange
			sel.addRange(range) // And set a new one selection
		},
		__setCaret ($node, offset = undefined) {
			this.focus()

			const range = document.createRange()
			const sel = window.getSelection()

			console.dir($node)

			const innerTextLength = $node.length

			console.log(
				`offset: ${offset} >= innerTextLength: ${innerTextLength} ---- `,
				offset >= innerTextLength
			)

			if (offset >= innerTextLength) return false

			// The Range.setStart() method sets the start position of a Range.
			// https://developer.mozilla.org/en-US/docs/Web/API/Range/setStart
			range.setStart($node, innerTextLength)

			// The Range.collapse() method collapses the Range to one of its boundary points.
			// Look here https://developer.mozilla.org/en-US/docs/Web/API/Range/collapse
			range.collapse(true)

			// Experimental!  The Selection.removeAllRanges() method removes all ranges from the selection,
			// leaving the anchorNode and focusNode properties equal to null and leaving nothing selected.
			// https://developer.mozilla.org/en-US/docs/Web/API/Selection/removeAllRanges
			sel.removeAllRanges()

			// The Selection.addRange() method adds a Range to a Selection.
			// https://developer.mozilla.org/en-US/docs/Web/API/Selection/addRange
			sel.addRange(range)

			range.detach() // Optimization
		},
		__insertMentionedChip (person) {
			/** We generate chip and insert it into text area **/
			const placeholder = this.generateMentionedChip(person)
			this.editor.runCmd('insertHTML', placeholder, true)
		},
		emitInput (data) {
			this.$emit('input', data)
		},
		focus () {
			/** Let's focus editor by this method **/
			this.$nextTick(this.editor.focus)
		},
		handleInput (value) {
			/** Just usual @input emit handler
			 * We use this wrapper to render mentioning before passing emit
			 * signal on higher level **/
			this.parseMentioning(value)
			this.$nextTick(this.editor.focus)

			this.emitInput(this.replaceMentionedByChip(value))
		},
		handleEnter (e) {
			/** Handle Ctrl + Enter command in editor **/
			if (e.ctrlKey) {
				this.$emit('enter')
			}
		},
		handleTab (e) {
			this.$emit('choose_first_person_in_popup')
		},
		parseMentioned (value) {
			/** Check Mentioning by checking all RegExp, pre-built
			 * Example: Hello @cybersturmer
			 * It also update participant object by defining index **/

			for (const participant of this.mentioningPatternObjects) {
				const mentioned = value.match(participant.regex)
				if (mentioned) {
					participant.index = mentioned.index
					return participant
				}
			}

			return false
		},
		parseMentioning (value) {
			/** Show popup if user start typing something like this:
			 *  Example: @c or Hello @c (2 chars enough to emit "mentioning" to show popup menu)
			 *  (emit "stop_mentioning to hide popup menu") **/

			if (isEmptyString(value)) return false

			const isStringStartedFromMentioning = new RegExp('^@(\\w{1,20})', 'mi')
			const isStringContinuedWithMentioning = new RegExp('^\\s@(\\w{1,20})', 'mi')

			const isMentioning = value.match(isStringStartedFromMentioning) ||
													 value.match(isStringContinuedWithMentioning)

			isMentioning
				? this.$emit('mentioning', isMentioning)
				: this.$emit('stop_mentioning')

			return isMentioning
		},
		generateMentionedChip (person) {
			/** generate username snippet for mentioned username **/
			const spanClass = 'class="editor_token"'
			const titleOption = `title="${person.first_name} ${person.last_name}"`
			const userId = `data-mentioned-user-id="${person.id}"`
			const username = person.username
			const contentNotEditable = 'contenteditable="false"'
			const space = '&nbsp;'

			return `${space}<span ${spanClass} ${titleOption} ${userId} ${contentNotEditable}>${username}</span>${space}`
		},
		__deleteSelectionAndReturnCaret (length) {
			const currentPos = this.editor.caret.selection.focusOffset
			const currentNode = this.editor.caret.selection.focusNode

			/** Set selection for typed username and delete it from the document **/
			this.__setSelectionRange(currentNode, currentPos - (length + 1), currentPos)
			this.editor.caret.selection.deleteFromDocument()

			/** Set caret to initial position that was before username deletion **/
			this.__setCaret(currentNode, currentPos)
		},
		replaceMentioningByChosenChip (person) {
			const mentioning = this.parseMentioning(this.value)
			if (!mentioning) return this.value

			const html = this.value.replace(mentioning[0], this.generateMentionedChip(person))
			this.$nextTick(() => {
				this.emitInput(html)
			})

			setTimeout(() => {
				this.focus()
				this.__setCaret(this.$refs.editor.caret.selection.focusNode)
			}, 5)
		},
		replaceMentionedByChip (value) {
			/** Replace @username to snippet with firstName-lastName non-editable block **/
			/** Firstly we have to check - do we have mentioning somewhere in the text **/
			const person = this.parseMentioned(value)
			if (!person) return value

			this.__deleteSelectionAndReturnCaret(person.textLength)

			/** We generate placeholder and insert it in editor **/
			this.$nextTick(() => {
				this.__insertMentionedChip(person)
			})

			this.$nextTick(() => {
				this.editor.focus()
			})

			return this.editor.getContentEl().innerHTML
		}
	}
}
</script>
