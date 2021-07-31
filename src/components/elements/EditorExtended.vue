<template>
	<div>
		<!-- I think these modern features are terrible -->
		<form
			autocomplete="off"
			autocorrect="off">
			<q-editor
				dense
				paragraph-tag="p"
				ref="editor"
				toolbar-toggle-color="secondary"
				class="q-ma-none"
				v-bind="options"
				:value="value"
				@input="handleInput"
				@keyup.enter="handleEnter"
				@keydown.tab.prevent="handleTab"
			/>
		</form>
		<EditorMentionPopupMenu :visible.sync="isMentioningPopupVisible"
														:persons="persons"
														@selected="select($event)"
		/>
	</div>
</template>

<script>
import { isEmptyString } from 'src/services/util'
import EditorMentionPopupMenu from 'src/components/elements/EditorMentionPopupMenu'
import { htmlSnippets } from 'src/pages/mixins/htmlSnippets'

export default {
	name: 'EditorExtended',
	components: {
		EditorMentionPopupMenu
	},
	mixins: [
		htmlSnippets
	],
	props: {
		value: {
			type: String,
			required: false,
			default: ''
		},
		options: {
			type: Object,
			required: false
		}
	},
	data () {
		return {
			isMentioningPopupVisible: true,
			mentionMaxResults: 2,
			mentionFilter: ''
		}
	},
	computed: {
		editor () {
			return this.$refs.editor
		},
		persons () {
			return this.$store.getters['auth/PERSONS']
				.filter(this.filterByMetaData)
				.slice(0, this.mentionMaxResults)
		},
		mentionedPatterns () {
			/** Mentioning regex's based on usernames so
			 * could be convenient generated from vuex store and yeah... i think
			 * that is good approach to use it from all components **/
			return this.$store.getters['auth/MENTIONING_REGEX']
		}
	},
	methods: {
		/** Technical methods **/
		runCmd (command, data) {
			this.editor.runCmd(command, data, true)
		},
		setCaret ($node, offset = undefined) {
			/** Set caret to offset position or **/

			this.editor.focus()

			const range = document.createRange()
			const selection = window.getSelection()
			const length = $node.length

			if (offset >= length) return false

			// The Range.setStart() method sets the start position of a Range.
			// https://developer.mozilla.org/en-US/docs/Web/API/Range/setStart
			range.setStart($node, offset)

			// The Range.collapse() method collapses the Range to one of its boundary points.
			// Look here https://developer.mozilla.org/en-US/docs/Web/API/Range/collapse
			range.collapse(true)

			// Experimental!  The Selection.removeAllRanges() method removes all ranges from the selection,
			// leaving the anchorNode and focusNode properties equal to null and leaving nothing selected.
			// https://developer.mozilla.org/en-US/docs/Web/API/Selection/removeAllRanges
			selection.removeAllRanges()

			// The Selection.addRange() method adds a Range to a Selection.
			// https://developer.mozilla.org/en-US/docs/Web/API/Selection/addRange
			selection.addRange(range)

			range.detach() // Optimization
		},

		/** Emitting methods **/
		emitInput (value) {
			this.$emit('input', value)
		},

		/** Handling user activity **/
		handleInput (value) {
			this.isMentioningPopupVisible = !!this.isMentioning(value)
			this.editor.focus()

			const mentionedReplacedByChip = this.replaceMentionedByChip(value)
			this.emitInput(mentionedReplacedByChip)
		},
		handleEnter (key) {
			if (!key.ctrlKey) return false
			this.$emit('enter')
		},
		handleTab (key) {
			const mentioning = this.isMentioning(this.value)
			if (!mentioning || this.persons.length <= 0) return false
			this.replaceMentioningByChosenChip(mentioning, this.persons[0])
		},

		/** Select mentioning person **/
		select (person) {
			const mentioning = this.isMentioning(this.value)
			this.replaceMentioningByChosenChip(mentioning, person)
		},

		/** Analyzing content and make conclusions **/
		isMentioning (value) {
			/** Show popup if user start typing something like this:
			 *  Example: @c or Hello @c (2 chars enough to emit "mentioning" to show popup menu)
			 *  (emit "stop_mentioning to hide popup menu") **/

			if (isEmptyString(value)) return false

			const isMentioningPattern = new RegExp('@(?<meta>\\S+)')
			const isMentioningResult = value.match(isMentioningPattern)

			if (!isMentioningResult) {
				this.mentionFilter = ''
				return false
			}

			this.mentionFilter = isMentioningResult.groups.meta

			return isMentioningResult[0]
		},
		parseMentioned (value) {
			/** Check Mentioning by checking all RegExp, pre-built
			 * Example: Hello @cybersturmer
			 * It also update participant object by defining index **/

			for (const participant of this.mentionedPatterns) {
				const mentioned = value.match(participant.regex)
				if (mentioned) {
					participant.index = mentioned.index
					return participant
				}
			}

			return false
		},

		/** Replacing content with snippets **/
		replaceMentioningByChosenChip (replaceable, person) {
			const chip = this.generatePersonSnippet(person)
			const html = this.value.replace(replaceable, chip)

			this.$nextTick(() => {
				this.emitInput(html)
				this.editor.focus()
			})

			setTimeout(() => {
				this.editor.focus()
				const focusNode = this.editor.caret.selection.focusNode.parentNode.nextSibling
				this.setCaret(focusNode)
			}, 5)

			this.isMentioningPopupVisible = false
		},
		replaceMentionedByChip (value) {
			const person = this.parseMentioned(value)
			if (!person) return value

			this.mentionFilter = ''

			const chip = this.generatePersonSnippet(person)
			const html = value.replace(`@${person.username}`, chip)

			this.$nextTick(() => {
				this.emitInput(html)
				this.editor.focus()
			})

			setTimeout(() => {
				this.editor.focus()
				const focusNode = this.editor.caret.selection.focusNode.lastChild
				this.setCaret(focusNode)
			}, 10)
		},

		/** Filtering persons by given text filter **/
		filterByMetaData (value) {
			if (isEmptyString(this.mentionFilter)) return false

			return this.filterByUsername(value) ||
						 this.filterByFirstName(value) ||
						 this.filterByLastName(value)
		},
		filterByUsername (value) { return value.username.toLowerCase().includes(this.mentionFilter) },
		filterByFirstName (value) { return value.first_name.toLowerCase().includes(this.mentionFilter) },
		filterByLastName (value) { return value.last_name.toLowerCase().includes(this.mentionFilter) }
	}
}
</script>
