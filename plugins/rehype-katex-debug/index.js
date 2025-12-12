const rehypeKatex = require('rehype-katex');

module.exports = (options) => {
  const originalTransformer = rehypeKatex(options);
  
  return (tree, file) => {
    try {
      console.log(`[KATEX DEBUG] Processing file: ${file.path || file.filename || 'unknown'}`);
      
      // Check if tree has any math elements before processing
      let hasMath = false;
      if (tree && tree.children) {
        const checkForMath = (node) => {
          if (node && node.tagName === 'span' && node.properties && 
              (node.properties.className?.includes('math') || 
               node.properties.className?.includes('katex'))) {
            hasMath = true;
            return;
          }
          if (node && node.children) {
            node.children.forEach(checkForMath);
          }
        };
        tree.children.forEach(checkForMath);
      }
      
      if (hasMath) {
        console.log(`[KATEX DEBUG] Found math content in: ${file.path || file.filename || 'unknown'}`);
      }
      
      const result = originalTransformer(tree, file);
      
      if (hasMath) {
        console.log(`[KATEX DEBUG] Successfully processed math in: ${file.path || file.filename || 'unknown'}`);
      }
      
      return result;
    } catch (error) {
      console.error(`[KATEX DEBUG] Error in file: ${file.path || file.filename || 'unknown'}`);
      console.error(`[KATEX DEBUG] Error details:`, error);
      console.error(`[KATEX DEBUG] Tree structure:`, JSON.stringify(tree, null, 2));
      throw error; // Re-throw to maintain original behavior
    }
  };
};