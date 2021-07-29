<template>
	<q-menu
		square
		auto-close
		no-focus
		:value="visible"
		:target="target">
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
</template>

<script>
import { isEmptyString } from 'src/services/util'

export default {
	name: 'EditorParticipantsPopup',
	emits: [
		'select'
	],
	props: {
		visible: {
			type: Boolean,
			required: false,
			default: false
		},
		target: {
			required: false
		},
		filter: {
			type: String,
			required: false,
			default: ''
		},
		maxResults: {
			type: Number,
			required: false,
			default: 5
		}
	},
	computed: {
		persons () {
			return this.$store.getters['auth/PERSONS']
				.filter(this.filterByAnyMeta)
				.slice(0, this.maxResults)
		}
	},
	methods: {
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
		}
	}
}
</script>
