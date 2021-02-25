/**
 * WordPress dependencies
 */
const WXR = require( '@wordpress/wxr' );

/**
 * Internal dependencies
 */
const extractors = require( './extractors' );

/**
 * Loop through all of the defined extractors, and run them over the content.
 *
 * @param {Object} config The Wix config data.
 */
const startExport = async ( config ) => {
	const wxr = new WXR();

	await Promise.all(
		extractors.map( async ( extractor ) => {
			// Grab the config data for this extractor.
			let extractorConfig;

			if ( extractor.appDefinitionId === 'media-manager' ) {
				extractorConfig = config.mediaToken;
			} else {
				extractorConfig = Object.values(
					( config.initialState &&
						config.initialState.embeddedServices ) ||
						{}
				).reduce( ( found, appConfig ) => {
					if ( found ) {
						return found;
					}

					if (
						appConfig.appDefinitionId === extractor.appDefinitionId
					) {
						return appConfig;
					}

					return false;
				}, false );
			}

			// If we couldn't find any app config for this extractor, the app isn't enabled.
			if ( ! extractorConfig ) {
				if ( config.extractAll ) {
					extractorConfig = {};
				} else {
					return;
				}
			}

			// Run the extractor.
			const extractedData = await extractor.extract( extractorConfig );

			// Convert the extracted data to WXR.
			await extractor.save( extractedData, wxr );
		} )
	);

	return wxr.export();
};

module.exports = startExport;
