function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);

        var result = resultArray[0];

        var PANEL = d3.select("#sample-metadata");

        PANEL.html("");

        Object.entries(result).forEach(([key, value]) => {
            PANEL.append("h6").text(key + ': ' + value);
        });
    });
}

function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
        var samplesData = data.samples;
        var resultArray2 = samplesData.filter(sampleObj => sampleObj.id == sample);
        var result2 = resultArray2[0]

        var sampleVals = result2.sample_values;
        var iDs = result2.otu_ids;
        var labels = result2.otu_labels;
        
        var topTenValues = sampleVals.slice(0,10).reverse();
        var topTenLabels = labels.slice(0,10);

        var OTUlabel = iDs.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();

        // barChart for the data
        var bar = {
            x: topTenValues,
            y: OTUlabel,
            text: topTenLabels, 
            type: "bar",
            orientation: "h"
        };

        // Data
        var barChart = [bar];

        // Apply the group bar mode to the layout
        var barChartLayout = {
            title: "Top 10 Bacterial Species",
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 100
            }
        };

        // Render the plot to the div tag with id "bar"
        Plotly.newPlot("bar", barChart, barChartLayout);

        // Building the bubble chart
        var bubbleChart = {
            x: iDs,
            y: sampleVals,
            text: labels,
            mode: "markers",
            marker: {
                size: sampleVals,
                color: iDs,
                colorscale: "Jet"
            }
        };

        var bubbleChartData =[bubbleChart];

        // Bubble Chart Layout
        var bubbleChartLayout = {
            title: "Bacteria Species per Sample",
            showlegend: false,
            xaxis: {
                title: {
                    text: "UTO IDs" }
            }
        };

        // Render the plot to the div tag with id "bubble"
        Plotly.plot("bubble", bubbleChartData, bubbleChartLayout);
    });
}

function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
            selector
            .append("option")
            .text(sample)
            .property("value", sample);
        });

    // Use first sample id to build the plots when page is opened
    var firstID = sampleNames[0];
    buildMetadata(firstID);
    buildCharts(firstID);
})}

function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
}

init();
