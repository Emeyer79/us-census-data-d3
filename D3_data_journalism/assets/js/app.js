// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 700;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//columns from data.csv:
//id,state,abbr,poverty,povertyMoe,age,ageMoe,income,incomeMoe,healthcare,healthcareLow,healthcareHigh,obesity,
//obesityLow,obesityHigh,smokes,smokesLow,smokesHigh,-0.385218228


// Import Data from csv
d3.csv("assets/data/data.csv").then( healthData => {
  // Parse Data & Cast as numbers
  healthData.forEach( data => {
      data.state = data.state
      data.poverty = +data.poverty
      data.healthcare= +data.healthcare
      data.abbr = data.abbr
      });

  //Create scale functions
  var xLinearScale = d3.scaleLinear()
    .domain([8, d3.max(healthData, d => d.poverty)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([3, d3.max(healthData, d => d.healthcare)])
    .range([height, 0]);
  
  //Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  //Append Axes to the chart
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

  //Create Circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "purple")
    .style("text-anchor", "middle")
    .attr("opacity", ".75");

  //append text to all circles
  var circlesGroup = chartGroup.selectAll()
    .data(healthData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .style("font-size", "13px")
    .style("text-anchor", "middle")
    .style('fill', 'white')
    .text(d => (d.abbr))

// ===============================
// ===============================

// Adding Tooltips  
// Initialize toolTip
  var toolTip = d3.tip()
    .attr("class", "toolTip")
    .offset([80, -60])
    .html( function (d) {
      return (`${d.state}<br>Poverty: ${d.poverty}%<br>HealthCare: ${d.healthcare}%`);
    });

//Create tooltip in the chart
  chartGroup.call(toolTip);

//Create event listeners to display and hide the tooltip
var toolTip = d3.select("body").append("div")
// .attr("class", "tooltip");

// circlesGroup.on("mouseover", function(data) {
//   toolTip.style("display", "block");
//   console.log(d);
//   console.log(i);
//   // toolTip.html(`Pizzas eaten: <strong>${pizzasEatenByMonth[i]}</strong>`)
//   toolTip.html(function (d) {
//           return (`${d.state}<br>Poverty: ${d.poverty}%<br>HealthCare
//           : ${d.healthcare}%`);
// })

// circlesGroup.on("click", data => {
//     toolTip.show(data, this);
//   });

  // .on mouseover event

  // .on mouseout event
  .on("mouseout", (data, index) => {
      toolTip.hide(data);
    });

    // .on('mouseover', toolTip.show(data));
  // .on("mouseover", (data, index) => {
  //   toolTip.show(data);
  // });
  //Create axes labels
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", -50 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .attr("font-family", "sans-serif")
    .attr("font-size", "20px")
    .style('stroke', 'Black')
    .text("Lacks Healthcare %");

    chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .attr("font-family", "sans-serif")
    .attr("font-size", "20px")
    .style('stroke', 'Black')
    .text("Poverty %");

  // When the browser loads, makeResponsive() is called.
makeResponsive();

}).catch(function(error) {
  console.log(error);
});
  