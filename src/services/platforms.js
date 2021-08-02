import { Platform } from 'quasar'

export function openInAppBrowser (url) {
	return cordova.InAppBrowser.open(url, '_system', 'location=yes')
}

let FileTransfer

export function downloadFileOnCordova (uri, filename) {
	const ANDROID_DOWNLOAD_LOCATION = 'file:///storage/emulated/0'
	const IOS_DOWNLOAD_LOCATION = cordova.file.documentsDirectory

	let storageLocation = ''
	const download = 'Download'

	switch (true) {
	case Platform.is.android:
		storageLocation = `${ANDROID_DOWNLOAD_LOCATION}/${download}`
		break
	case Platform.is.ios:
		storageLocation = IOS_DOWNLOAD_LOCATION
	}

	const fileTransfer = new FileTransfer()
	const encodedURI = encodeURI(uri)

	fileTransfer.download(
		encodedURI,
		`${storageLocation}/${filename}`,
		(entry) => {
			console.log('download complete')
		},
		(error) => {
			console.log('download error source ' + error.source)
			console.log('download error target ' + error.target)
			console.log('upload error code' + error.code)
		}
	)

	console.log(storageLocation)
}
