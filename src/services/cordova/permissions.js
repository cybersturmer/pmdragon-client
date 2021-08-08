export const permissions = cordova.plugins.permissions

const errorCallback = (permission) => {
	console.warn(`Permission ${permission} is not turned on`)
}

const definePermission = (permission) => {
	switch (permission) {
	case 'storage':
		return permissions.READ_EXTERNAL_STORAGE
	default:
		throw new Error('Undefined permission')
	}
}

export function grantPermission (
	permissionChoice,
	positiveCallback,
	positiveCallbackOptions
) {
	console.dir(positiveCallbackOptions)

	const permission = definePermission(permissionChoice)

	permissions.checkPermission(
		permission,
		(status) => {
			if (!status.hasPermission) {
				permissions.requestPermission(
					permission,
					(status) => {
						if (!status.hasPermission) {
							errorCallback(permission)
						} else {
							positiveCallback(...positiveCallbackOptions)
						}
					},
					errorCallback
				)
			} else {
				positiveCallback(...positiveCallbackOptions)
			}
		},
		null
	)
}
