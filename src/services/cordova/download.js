import { Platform } from 'quasar'

function generalErrorCallback (e) {
	console.log(e)
}

export function downloadFile (blobFile, filename) {
	const ANDROID_DOWNLOAD_LOCATION = cordova.file.externalRootDirectory
	const IOS_DOWNLOAD_LOCATION = cordova.file.documentsDirectory

	if (!(Platform.is.android || Platform.is.ios)) {
		throw new Error('Only Android and IOS applications are supported.')
	}

	const storageLocation = Platform.is.android ? ANDROID_DOWNLOAD_LOCATION : IOS_DOWNLOAD_LOCATION

	window.resolveLocalFileSystemURL(storageLocation, (fileSystem) => {
		fileSystem.getDirectory('download', {
			create: true,
			exclusive: false
		}, (directory) => {
			directory.getFile(filename, {
				create: true,
				exclusive: false
			}, (fileEntry) => {
				fileEntry.createWriter((writer) => {
					writer.onwriteend = (data) => {
						console.log(`File ${filename} written to downloads.`)
					}
					writer.seek(0)
					writer.write(blobFile)
				}, generalErrorCallback)
			}, generalErrorCallback)
		}, generalErrorCallback)
	}, generalErrorCallback)
}
