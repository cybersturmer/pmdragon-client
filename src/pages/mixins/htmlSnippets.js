const wrap = 'span'
const space = '&nbsp;'
const readOnly = 'contenteditable="false"'

export const htmlSnippets = {
	methods: {
		generatePersonSnippet (person) {
			/** This method just generate snippet that can be viewed on frontend and parsed on backend **/
			const snippetClass = 'class="m_snp"'
			const userTitle = `title="${person.first_name} ${person.last_name}"`
			const dataField = `data-mentioned-user-id="${person.id}"`
			const wrapParams = `${snippetClass} ${userTitle} ${dataField} ${readOnly}`

			return `${space}<${wrap} ${wrapParams}>${person.username}</${wrap}>${space}${space}${space}${space}${space}${space}`
		}
	}
}
