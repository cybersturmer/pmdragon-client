import { Platform } from 'quasar'

function generalErrorCallback (e) {
	console.log(e)
}

export function downloadFile (blobFile, filename) {
	const ANDROID_DOWNLOAD_LOCATION = 'file:///storage/emulated/0'
	const IOS_DOWNLOAD_LOCATION = cordova.file.documentsDirectory

	if (!(Platform.is.android || Platform.is.ios)) {
		throw new Error('Only Android and IOS applications are supported.')
	}

	const storageLocation = Platform.is.android ? ANDROID_DOWNLOAD_LOCATION : IOS_DOWNLOAD_LOCATION

	window.resolveLocalFileSystemURL(storageLocation, (fileSystem) => {
		fileSystem.getDirectory('Download', {
			create: true,
			exclusive: false
		}, (directory) => {
			directory.getFile(filename, {
				create: true,
				exclusive: false
			}, (fileEntry) => {
				fileEntry.createWriter((writer) => {
					writer.onwriteend = () => { console.log('File written to downloads') }
					writer.seek(0)
					writer.write(blobFile)
				}, generalErrorCallback)
			}, generalErrorCallback)
		}, generalErrorCallback)
	}, generalErrorCallback)
}
