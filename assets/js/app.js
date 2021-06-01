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

    // chart dimensions
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;
  
    // SVG element wrapper 
    var svg = d3
      .select("#scatter")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);
  
    // append group element & set margins 
    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
    // parameters
    var chosenXAxis = "poverty";
    var chosenYAxis = "healthcare";
  
    // updating chart when xaxis is pressed
    function xScale(acsData, chosenXAxis) {
      // scale functions
      var xLinearScale = d3.scaleLinear()
        .domain([d3.min(acsData, d => d[chosenXAxis]) * 0.8,
          d3.max(acsData, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);
      return xLinearScale;
    }

    