const communitiesBlogAppSettings = require( './communities-blog-app' );
const siteMetaSettings = require( './site-meta-app' );
const easyBlogSettings = require( './easy-blog-app' );
const mediaManagerSettings = require( './media-manager' );

/**
 * An array of the defined extractors.
 */
module.exports = [
	siteMetaSettings,
	communitiesBlogAppSettings,
	mediaManagerSettings,
	easyBlogSettings,
];
