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

export function downloadURL (url, filename) {
	/** Right now that can work only for Android, just POC **/
	// eslint-disable-next-line no-undef
	const fileTransfer = new FileTransfer()
	const encodedURI = encodeURI(url)

	const fileURL = `///storage/emulated/0/Download/${filename}`

	fileTransfer.download(
		encodedURI,
		fileURL,
		function (entry) {
			console.log('Download complete')
		},
		function (e) {
			console.log('download error source ' + e.source)
			console.log('download error target ' + e.target)
			console.log('download error code' + e.code)
		},
		false,
		{}
	)
}
