const twitterPlugin = require('@weknow/gatsby-remark-twitter');

module.exports = (options) => {
  return async (tree, file) => {
    try {
      console.log(`[TWITTER DEBUG] Processing file: ${file.path || file.filename || 'unknown'}`);
      
      // Check if the file contains Twitter links before processing
      const hasTwitterLink = file.contents && (
        file.contents.includes('twitter.com/') || 
        file.contents.includes('x.com/')
      );
      
      if (hasTwitterLink) {
        console.log(`[TWITTER DEBUG] Found Twitter link in: ${file.path || file.filename || 'unknown'}`);
      }
      
      const result = await twitterPlugin(options)(tree, file);
      
      if (hasTwitterLink) {
        console.log(`[TWITTER DEBUG] Successfully processed Twitter links in: ${file.path || file.filename || 'unknown'}`);
      }
      
      return result;
    } catch (error) {
      console.error(`[TWITTER DEBUG] Error in file: ${file.path || file.filename || 'unknown'}`);
      console.error(`[TWITTER DEBUG] Error details:`, error);
      throw error; // Re-throw to maintain original behavior
    }
  };
};