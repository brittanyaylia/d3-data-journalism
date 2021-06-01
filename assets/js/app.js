// D3 

// chart code - resize the chart automatically
function makeResponsive() {

    // if SVG area is not empty - replace with resized chart 
    var svgArea = d3.select("body").select("svg");
  
    // clear SVG
    if (!svgArea.empty()) {
      svgArea.remove();
    }
    
    // chart setup 
    var svgWidth = 980;
    var svgHeight = 600;
  
    // SVG margins
    var margin = {
      top: 20,
      right: 40,
      bottom: 90,
      left: 100
    };
