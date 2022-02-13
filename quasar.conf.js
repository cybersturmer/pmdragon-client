/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js
/* eslint-env node */

const fs = require('fs')

// Custom process based constants
const DEBUG = process.env.NODE_ENV === 'development'
const HEROKU = process.env.HEROKU
const IS_ANDROID = process.argv[3] === 'android'

// Custom calculated constants
const IS_HTTPS = !HEROKU && !IS_ANDROID
const IS_SELF_SIGNED_HTTPS = DEBUG && !IS_ANDROID

const ESLintPlugin = require('eslint-webpack-plugin')
const { configure } = require('quasar/wrappers')

module.exports = configure(function (ctx) {
	return {
		https: IS_HTTPS,
		supportTS: true,
		bin: {
			linuxAndroidStudio: '/home/cs/programs/android-studio/bin/studio.sh'
		},
		// https://quasar.dev/quasar-cli/cli-documentation/boot-files
		boot: [
			'i18n',
			'theme',
			'router',
			'meta',
			'moment',
			'server',
			'sockets',
			ctx.mode.capacitor ? 'capacitor' : ''
		],

		// https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-css
		css: [
			'app.scss'
		],

		// https://github.com/quasarframework/quasar/tree/dev/extras
		extras: [
			'mdi-v5',
			'roboto-font'
		],

		// Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-build
		build: {
			vueRouterMode: 'history', // available values: 'hash', 'history'

			// Add dependencies for transpiling with Babel (Array of regexes)
			// (from node_modules, which are by default not transpiled).
			// Does not applies to modern builds.
			// transpileDependencies: [],
			// rtl: false, // https://quasar.dev/options/rtl-support
			// preloadChunks: true,
			// showProgress: false,
			// gzip: true,
			// analyze: true,

			// Options below are automatically set depending on the env, set them if you want to override
			// extractCSS: false,
			chainWebpack (chain) {
				chain.plugin('eslint-webpack-plugin')
					.use(ESLintPlugin, [{ extensions: ['js', 'vue'] }])
			}
		},

		// Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-devServer
		// I created folder ssl with 2 certificates by this tool https://github.com/FiloSottile/mkcert
		// Of course i didn't commit that :) So create it by yourself or set https: false
		devServer: {
			https: IS_SELF_SIGNED_HTTPS
				? {
					key: fs.readFileSync('ssl/localhost+2-key.pem'),
					cert: fs.readFileSync('ssl/localhost+2.pem')
				}
				: false,
			port: 8080,
			open: false
		},

		// https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-framework
		framework: {
			dark: true,
			iconSet: 'mdi-v5', // Quasar icon set
			lang: 'en-US', // Quasar language pack

			// Possible values for "all":
			// * 'auto' - Auto-import needed Quasar components & directives
			//            (slightly higher compile time; next to minimum bundle size; most convenient)
			// * false  - Manually specify what to import
			//            (fastest compile time; minimum bundle size; most tedious)
			// * true   - Import everything from Quasar
			//            (not treeshaking Quasar; biggest bundle size; convenient)
			importStrategy: 'auto',

			components: [],
			directives: [],

			// Quasar plugins
			plugins: [
				'LocalStorage',
				'Dialog',
				'Notify',
				'Loading',
				'AppVisibility'
			]
		},

		// animations: 'all', // --- includes all animations
		// https://quasar.dev/options/animations
		animations: [],

		// https://quasar.dev/quasar-cli/developing-ssr/configuring-ssr
		ssr: {
			pwa: false,

			// manualStoreHydration: true,
			// manualPostHydrationTrigger: true,

			prodPort: 3000, // The default port that the production server should use
			// (gets superseded if process.env.PORT is specified at runtime)

			maxAge: 1000 * 60 * 60 * 24 * 30,
			// Tell browser when a file from the server should expire from cache (in ms)
			chainWebpackWebserver (chain) {
				chain.plugin('eslint-webpack-plugin')
					.use(ESLintPlugin, [{ extensions: ['js'] }])
			},

			middlewares: [
				ctx.prod ? 'compression' : '',
				'render' // keep this as last one
			]
		},

		// https://quasar.dev/quasar-cli/developing-pwa/configuring-pwa
		pwa: {
			workboxPluginMode: 'GenerateSW', // 'GenerateSW' or 'InjectManifest'
			workboxOptions: {}, // only for GenerateSW
			manifest: {
				name: 'PmDragon',
				short_name: 'PmDragon',
				description: 'PmDragon Community Edition',
				display: 'standalone',
				orientation: 'portrait',
				background_color: '#ffffff',
				theme_color: '#027be3',
				icons: [
					{
						src: 'icons/icon-128x128.png',
						sizes: '128x128',
						type: 'image/png'
					},
					{
						src: 'icons/icon-192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: 'icons/icon-256x256.png',
						sizes: '256x256',
						type: 'image/png'
					},
					{
						src: 'icons/icon-384x384.png',
						sizes: '384x384',
						type: 'image/png'
					},
					{
						src: 'icons/icon-512x512.png',
						sizes: '512x512',
						type: 'image/png'
					}
				]
			}
		},

		// Full list of options: https://quasar.dev/quasar-cli/developing-capacitor-apps/configuring-capacitor
		capacitor: {
			id: 'com.cybersturmer.pmdragon.pmdragonce',
			appName: 'PmDragon',
			hideSplashscreen: true
		},

		// Full list of options: https://quasar.dev/quasar-cli/developing-electron-apps/configuring-electron
		electron: {
			bundler: 'packager', // 'packager' or 'builder'
			packager: {
				appVersion: '1.0.0',
				buildVersion: '1',
				appCopyright: 'Vladimir Shturmer',
				// https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

				// OS X / Mac App Store
				// appBundleId: '',
				// appCategoryType: '',
				// osxSign: '',
				// protocol: 'myapp://path',

				// Windows only
				win32metadata: {
					companyName: 'Vladimir Shturmer',
					productName: 'PmDragon',
					appCopyright: 'Vladimir Shturmer',
					appVersion: '1.0.0',
					buildVersion: '1',
					icon: 'src/src-electron/icons/linux-512x512.png'
				}
			},

			builder: {
				// https://www.electron.build/configuration/configuration
				appId: 'com.cybersturmer.pmdragon.pmdragonce'
			},

			// "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain
			chainWebpackMain (chain) {
				chain.plugin('eslint-webpack-plugin')
					.use(ESLintPlugin, [{ extensions: ['js'] }])
			},

			// "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain
			chainWebpackPreload (chain) {
				chain.plugin('eslint-webpack-plugin')
					.use(ESLintPlugin, [{ extensions: ['js'] }])
			}
		}
	}
})
