let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
let req = new XMLHttpRequest(); // This is the method we'll use to import our data as js object.

let values = []; // We'll fill with the data that we importet with req. 

let xScale;
let yScale;

let width = 800;
let height = 600;
let padding = 40;

let svg = d3.select("svg"); // Returns to the svg element in our HTML file.
let tooltip = d3.select("#tooltip")

let drawCanvas = () => {
    svg.attr("width", width);
    svg.attr("height", height);
}

// Generate x and y scales.
let generateScales = () => {
    // Using the domain so that we can align each item with their corresponding point/value on the x-axis.
    // I can see that the range of the x-axis labels are within the range of the actual x-axis data.
    xScale = d3.scaleLinear()
                .domain([d3.min(values, (item) => {
                    return item["Year"];
                }), d3.max(values, (item) => {
                    return item["Year"];
                })])
	            .range([padding, width-padding]);

    // I can see that the range of the y-axis labels are within the range of the actual y-axis data.
    yScale = d3.scaleTime()
                .domain([d3.min(values, (item) => {
                    return new Date(item["Seconds"] * 1000);     // We are multiplying with 1000 because fate objects require milliseconds.
                }), d3.max(values, (item) => {
                    return new Date(item["Seconds"] * 1000);
                })])
                .range([padding, height - padding]);
}

// Plot the circles for the dot points into the graph.
 let drawPoints = () => {
    // I can see dots, that each have a class of dot, which represent the data being plotted.
    // Each dot should have the properties data-xvalue and data-yvalue containing their corresponding x and y values.
    // The data-xvalue and data-yvalue of each dot should be within the range of the actual data and in the correct data format.
    // For data-xvalue, integers (full years) or Date objects are acceptable for test evaluation. For data-yvalue (minutes), use Date objects.
    svg.selectAll("circle")
        .data(values)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("r", "5")
        .attr("data-xvalue", (item) => {
            return item["Year"];
        })
        .attr("data-yvalue", (item) => {
            return new Date(item["Seconds"] * 1000);
        })
        .attr("cx", (item) => {
            return xScale(item["Year"]);    // The data-xvalue and its corresponding dot should align with the corresponding point/value on the x-axis.
        })
        .attr("cy", (item) => {
            return yScale(new Date(item["Seconds"] * 1000));    // The data-yvalue and its corresponding dot should align with the corresponding point/value on the y-axis.
        })
        .attr("fill", (item) => {
            if(item["Doping"] != ""){
                return "blue";
            } else {
                return "green";  // Change color if there was a doping.
            }
        })
        // I can mouse over an area and see a tooltip with a corresponding id="tooltip" which displays more information about the area.
        .on("mouseover", (item) => {
            tooltip.transition()
                    .style("visibility", "visible");
            
            if(item["Doping"] != "") {
                tooltip.text(item["Year"] + " - " + item["Name"] + " - " + item["Time"] + " - " + item["Doping"]);
            }else {
                tooltip.text(item["Year"] + " - " + item["Name"] + " - " + item["Time"] + " - " + "No Allegations");
            }

            // My tooltip should have a data-year property that corresponds to the data-xvalue of the active area.
            tooltip.attr("data-year", item["Year"]);
        })
        .on("mouseout", (item) => {
            tooltip.transition()
                    .style("visibility", "hidden");
        })
 }

// Draw x and y axis into our graph.
let generateAxis = () => {
    let xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format("d"));    // I can see multiple tick labels on the x-axis that show the year. Formating the year values in every tick for example from 1,994 to 1994.

    let yAxis = d3.axisLeft(yScale)
                    .tickFormat(d3.timeFormat("%M:%S"));    // I can see multiple tick labels on the y-axis with %M:%S time format.

    // I can see an x-axis that has a corresponding id="x-axis".
    svg.append("g")
        .call(xAxis)
        .attr("id", "x-axis")
        .attr("transform", "translate(0, " + (height - padding) + ")");

    // I can see a y-axis that has a corresponding id="y-axis".
    svg.append("g")
        .call(yAxis)
        .attr("id", "y-axis")
        .attr("transform","translate(" + padding + ", 0)");
}

req.open("GET", url, true);
req.onload = () => {
    values = JSON.parse(req.responseText);
    console.log(values);
    drawCanvas();
    generateScales();
    drawPoints();
    generateAxis();
}
req.send();