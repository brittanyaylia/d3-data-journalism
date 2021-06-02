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

    // updating circles with Tooltip
    function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup) {
  
      if (chosenXAxis === "poverty") {
        var xLabel = "Poverty (%)";
      }
      else if (chosenXAxis === "age") {
        var xLabel = "Age (Median)";
      }
      else {
        var xLabel = "Household Income (Median)";
      }
      if (chosenYAxis === "healthcare") {
        var yLabel = "Lacks Healthcare (%)";
      }
      else if (chosenYAxis === "obesity") {
        var yLabel = "Obese (%)";
      }
      else {
        var yLabel = "Smokes (%)";
    }

    // initialize 
    var toolTip = d3.tip()
      .attr("class", "tooltip d3-tip")
      .offset([90, 90])
      .html(function(d) {
        return (`<strong>${d.abbr}</strong><br>${xLabel} ${d[chosenXAxis]}<br>${yLabel} ${d[chosenYAxis]}`);
      });
    // create circles in the chart
    circlesGroup.call(toolTip);
    // display and hide circles 
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data) {
        toolTip.hide(data);
      });
    // create text in the chart
    textGroup.call(toolTip);
    // display and hide the text 
    textGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data) {
        toolTip.hide(data);
      });
    return circlesGroup;
}

// import data from csv
d3.csv("assets/data/data.csv")
  .then(function(acsData) {

  // parse data
  acsData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;
    data.healthcare = +data.healthcare;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
});

// xLinearScale & yLinearScale functions 
var xLinearScale = xScale(acsData, chosenXAxis);
var yLinearScale = yScale(acsData, chosenYAxis);

// axis functions for charts
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

// append xaxis
var xAxis = chartGroup.append("g")
  .classed("x-axis", true)
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

// append yaxis 
var yAxis = chartGroup.append("g")
  .classed("y-axis", true)
  .call(leftAxis);

// append circles
var circlesGroup = chartGroup.selectAll(".stateCircle")
  .data(acsData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d[chosenXAxis]))
  .attr("cy", d => yLinearScale(d[chosenYAxis]))
  .attr("class", "stateCircle")
  .attr("r", 15)
  .attr("opacity", ".75");

// append text 
var textGroup = chartGroup.selectAll(".stateText")
  .data(acsData)
  .enter()
  .append("text")
  .attr("x", d => xLinearScale(d[chosenXAxis]))
  .attr("y", d => yLinearScale(d[chosenYAxis]*.98))
  .text(d => (d.abbr))
  .attr("class", "stateText")
  .attr("font-size", "12px")
  .attr("text-anchor", "middle")
  .attr("fill", "white");

// group for all xaxis Labels
  var xLabelsGroup = chartGroup.append("g")
  .attr("transform", `translate(${width / 2}, ${height + 20})`);
// append xaxis
var povertyLabel = xLabelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 20)
  .attr("value", "poverty") 
  .classed("active", true)
  .text("Poverty (%)");

var ageLabel = xLabelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 40)
  .attr("value", "age") 
  .classed("inactive", true)
  .text("Age (Median)");

var incomeLabel = xLabelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 60)
  .attr("value", "income") 
  .classed("inactive", true)
  .text("Household Income (Median)");

  // group for all yaxis labels
  var yLabelsGroup = chartGroup.append("g")
  .attr("transform", `translate(-25, ${height / 2})`);
// append yaxis
var healthcareLabel = yLabelsGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", -30)
  .attr("x", 0)
  .attr("value", "healthcare")
  .attr("dy", "1em")
  .classed("axis-text", true)
  .classed("active", true)
  .text("Lacks Healthcare (%)");

var smokesLabel = yLabelsGroup.append("text") 
  .attr("transform", "rotate(-90)")
  .attr("y", -50)
  .attr("x", 0)
  .attr("value", "smokes")
  .attr("dy", "1em")
  .classed("axis-text", true)
  .classed("inactive", true)
  .text("Smokes (%)");

var obesityLabel = yLabelsGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", -70)
  .attr("x", 0)
  .attr("value", "obesity")
  .attr("dy", "1em")
  .classed("axis-text", true)
  .classed("inactive", true)
  .text("Obese (%)");
    
