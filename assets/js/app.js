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
  
    // updating xScale when xaxis options are selected 
    function xScale(acsData, chosenXAxis) {
      // scale functions
      var xLinearScale = d3.scaleLinear()
        .domain([d3.min(acsData, d => d[chosenXAxis]) * 0.8,
          d3.max(acsData, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);
      return xLinearScale;
    }

    //  updating yScale wjen yaxis options are selected
    function yScale(acsData, chosenYAxis) {
      // scale functions 
      var yLinearScale = d3.scaleLinear()
        .domain([d3.min(acsData, d => d[chosenYAxis]) * 0.8,
          d3.max(acsData, d => d[chosenYAxis]) * 1.2
        ])
        .range([height, 0]);
      return yLinearScale;
    }
  
    // updating xAxis when axis label is selected 
    function renderXAxes(newXScale, xAxis) {
      var bottomAxis = d3.axisBottom(newXScale);
      xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
      return xAxis;
    }

    // updating yAxis when axis label is selected
    function renderYAxes(newYScale, yAxis) {
      var leftAxis = d3.axisLeft(newYScale);
      yAxis.transition()
        .duration(1000)
        .call(leftAxis);
      return yAxis;
    }
  
    // updating circles with transition  
    function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
  
      circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));
      return circlesGroup;
    }
  
    // updating text transition 
    function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
  
      textGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]))
        .attr("text-anchor", "middle");
  
      return textGroup;
    }

    