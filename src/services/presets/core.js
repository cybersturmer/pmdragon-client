export const issueOrdering = {
	auth: true,
	expect: 200,
	method: 'put',
	endpoint: '/core/issue/ordering/'
}

export const getSprintRemainingPreset = {
	auth: true,
	expect: 200,
	method: 'get',
	endpoint: '/core/sprint-efforts-history/?sprint=<placeholder:sprint.id>'
}

export const getSprintGuidelinePreset = {
	auth: true,
	expect: 200,
	method: 'get',
	endpoint: '/core/sprint-guideline/<placeholder:sprint.id>/'
}
