/* Vercel Web Analytics initialization
 * This script initializes Vercel Web Analytics for tracking page views.
 * It uses the vanilla queue-based approach for compatibility with non-module scripts.
 */
(function() {
  'use strict';
  
  // Initialize the analytics queue
  window.va = window.va || function() { 
    (window.vaq = window.vaq || []).push(arguments); 
  };
  
  // Create and load the analytics script
  var script = document.createElement('script');
  script.defer = true;
  script.src = '/_vercel/insights/script.js';
  
  // Insert the script into the document
  var firstScript = document.getElementsByTagName('script')[0];
  if (firstScript && firstScript.parentNode) {
    firstScript.parentNode.insertBefore(script, firstScript);
  } else {
    document.head.appendChild(script);
  }
})();
