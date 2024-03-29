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
					:modelValue="modelValue"
					@update:modelValue="handleInput"
					@keyup.enter="handleEnter"
					@keydown.tab.prevent="handleTab"
				/>
			</form>
		<div class="fit">
			<EditorMentionPopupMenu :visible="isMentioningPopupVisible"
															:persons="persons"
															@selected="select($event)"
			/>
		</div>
	</div>
</template>

<script>
import { defineComponent } from 'vue'
import { setCaret } from 'src/services/content/content'
import { isEmptyString } from 'src/services/util'
import EditorMentionPopupMenu from 'components/elements/team/EditorMentionPopupMenu'
import { htmlSnippets } from 'src/pages/mixins/htmlSnippets'

export default defineComponent({
	name: 'EditorExtended',
	components: {
		EditorMentionPopupMenu
	},
	mixins: [
		htmlSnippets
	],
	props: {
		modelValue: {
			type: String,
			required: false,
			default: ''
		},
		options: {
			type: Object,
			required: false
		}
	},
	emits: [
		'update:modelValue',
		'enter'
	],
	data () {
		return {
			isMentioningPopupVisible: false,
			mentionMaxResults: 1,
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
		setCaretHandler ($node, offset = undefined) {
			setCaret($node)
		},

		/** Emitting methods **/
		emitUpdateModel (value) {
			this.$emit('update:modelValue', value)
		},

		/** Handling user activity **/
		handleInput (value) {
			this.isMentioningPopupVisible = !!this.isMentioning(value)
			this.editor.focus()

			const mentionedReplacedByChip = this.replaceMentionedByChip(value)
			this.emitUpdateModel(mentionedReplacedByChip)
		},
		handleEnter (key) {
			if (!key.ctrlKey) return false
			this.$emit('enter')
		},
		handleTab (key) {
			const mentioning = this.isMentioning(this.modelValue)
			if (!mentioning || this.persons.length <= 0) return false
			this.replaceMentioningByChosenChip(mentioning, this.persons[0])
		},

		/** Select mentioning person **/
		select (person) {
			const mentioning = this.isMentioning(this.modelValue)
			this.replaceMentioningByChosenChip(mentioning, person)
		},

		/** Analyzing content and make conclusions **/
		isMentioning (value) {
			/** Show popup if user start typing something like this:
			 *  Example: @c or Hello @c (2 chars enough to emit "mentioning" to show popup menu)
			 *  (emit "stop_mentioning to hide popup menu") **/

			if (isEmptyString(value)) return false

			const isMentioningPattern = /@(?<meta>\S+)/
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
			const html = this.modelValue.replace(replaceable, chip)

			this.$nextTick(() => {
				this.emitUpdateModel(html)
				this.editor.focus()
			})

			setTimeout(() => {
				this.editor.focus()
				const focusNode = this.editor.caret.selection.focusNode.parentNode.nextSibling
				this.setCaretHandler(focusNode)
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
				this.emitUpdateModel(html)
				this.editor.focus()
			})

			setTimeout(() => {
				this.editor.focus()
				const $contentEl = this.editor.getContentEl()

				this.setCaretHandler($contentEl)
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
})
</script>
