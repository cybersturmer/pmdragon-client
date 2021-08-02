import { Platform, openURL } from 'quasar'

export function openInAppBrowser (url) {
	return cordova.InAppBrowser.open(url, '_system', 'location=yes')
}

export function platformOpenURL (url) {
	switch (true) {
	case Platform.is.android || Platform.is.ios:
		openInAppBrowser(url)
		break
	default:
		openURL(url)
	}
}
