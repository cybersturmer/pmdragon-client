function _getStatusMessage (status) {
	let message = ''
	switch (status) {
	case 200:
		message = 'Was executed successfully'
		break
	case 201:
		message = 'Was created successfully'
		break
	case 400:
		message = 'Bad request'
		break
	case 401:
		message = 'Authorization was not correct'
		break
	case 404:
		message = 'Requested resource not found'
		break
	case 503:
		message = 'Server unavailable. Please try again later'
		break
	default:
		message = 'Oops...'
	}

	return message
}

function _getResponseErrorMessage (error) {
	if (error.response?.data) {
		if (error.response.data?.detail) {
			return error.response?.data?.detail
		} else if (error.response?.data?.non_field_errors) {
			return error.response?.data?.non_field_errors.join(' ')
		} else {
			return _getStatusMessage(error.response?.status)
		}
	}

	const baseURL = new URL(error?.config?.baseURL)

	if (error?.response?.statusText) return error.response.statusText
	return error.message === 'Network Error'
		? `Network error. Check that ${baseURL.protocol}//${baseURL.host} is available.`
		: error.message
}

export class ErrorHandler extends Error {
	constructor (error, message) {
		super()
		this.request = error.isAxiosError
		this.data = error.response?.data
		this.data = error.response?.data
		this.success = error.response?.data?.success
		this.meta = error.response?.data?.meta
		this.code = error.response?.data?.code
		this.status = error.response?.status
		this.statusMessage = _getStatusMessage(this.status)
		this.message = message || _getResponseErrorMessage(error)
		this.messageUseful = !!this.data || message
	}

	setErrors (errors) {
		if (!this.request) return false
		for (const [key, value] of Object.entries(this.data)) {
			if (key in errors) {
				errors[key] = Array.isArray(value) ? value.join('\r\n') : value
			}
		}
	}

	dropErrors (errors) {
		/** Just set any key in object to empty string */
		if (!this.request) return false
		for (const key of Object.keys(errors)) {
			errors[key] = ''
		}
	}
}

export function unWatch (value) {
	return JSON.parse(JSON.stringify(value))
}

export function isEmptyString (value) {
	return value === ''
}

export function syncPair (copyFrom, copyTo) {
	const attrs = Object.keys(copyFrom)
	for (const attr of attrs) {
		if (attr in copyTo && copyFrom[attr] !== copyTo[attr]) {
			copyTo[attr] = copyFrom[attr]
		}
	}
}

export function removeElement (array, element) {
	const index = array.indexOf(element)
	if (index <= -1) throw new Error('Requested array do not contain given element')

	array.splice(index, 1)
	return array
}

export function removeElementById (array, element) {
	const arrayElement = array.find(_element => element.id === _element.id)
	const index = array.indexOf(arrayElement)
	if (index <= -1) throw new Error('Requested array do not contain given element')

	array.splice(index, 1)
	return array
}

export function updateElement (array, oldElement, newElement) {
	const oldIndex = array.indexOf(oldElement)
	if (oldIndex <= -1) throw new Error('Requested array do not contain given element')

	array.splice(oldIndex, 1, newElement)
}

export function updateElementById (array, newElement) {
	const oldElement = array.find(element => element.id === newElement.id)
	updateElement(array, oldElement, newElement)
}
