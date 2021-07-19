import { Platform } from 'quasar'

const ANDROID_DOWNLOAD_LOCATION = 'file:///storage/emulated/0/'
const IOS_DOWNLOAD_LOCATION = cordova.file.documentsDirectory

function downloadFileOnCordova (uri, filename) {
	let storageLocation = ''

	switch (true) {
	case Platform.is.android:
		storageLocation = ANDROID_DOWNLOAD_LOCATION
		break
	case Platform.is.ios:
		storageLocation = IOS_DOWNLOAD_LOCATION
	}

	window.resolveLocalFileSystemURL(storageLocation,
		function (fileSystem) {
			fileSystem.getDirectory('Download', {
				create: true,
				exclusive: false
			},
			function (directory) {
				directory.getFile(filename, {
					create: true,
					exclusive: false
				},
				function (fileEntry) {
					fileEntry.createWriter(function (writer) {
						writer.onwriteend = function () {
							console.log('File written to downloads')
						}

						writer.seek(0)
						writer.write(filename)
					}, errorCallback)
				}, errorCallback)
			}, errorCallback)
		}, errorCallback)
}

function errorCallback (e) {
	console.log('Error: ' + e)
}
