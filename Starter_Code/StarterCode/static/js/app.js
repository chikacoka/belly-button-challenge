// Use the D3 library to read in sample.json/ get the endpoint
const samples = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Fetch the JSON data and console log it
// d3.json(samples).then(function (data) {
//     console.log(data);
// });

function metaData(sample) {



// Fetch the JSON data and console log it
d3.json(samples).then(function (data) {
    console.log(data);
    let metaData = data.metadata;
    let sampleId = metaData.filter(sampleOtu =>sampleOtu.id ==sample);
    let result = sampleId[0];
    let button = d3.select("#sample-metadata");
    button.html("");

    for (key in result){
        button.append("h6").text(`${key.toUpperCase()}:${result[key]}`);
    };
});
}

function otuPlot(sample) {
    d3.json(samples).then(function (data) {
        let sampleData = data.samples;
        let sampleId = sampleData.filter(sampleOtu => sampleOtu.id == sample);
        let result = sampleId[0];   
        let sampleValues = result.sample_values;
        let otuIds = result.otu_ids;
        let otuLabels = result.otu_labels;
        let topTenSample = sampleValues.slice(0,10).reverse();
        let topOtuId = otuIds.slice(0,10).map(otuTen=> `OTU ${otuTen}`).reverse();
        let topTenLabels = otuLabels.slice(0,10).reverse();

        let barData = [{
            y: topOtuId, 
            x: topTenSample,
            text: topTenLabels,
            type: "bar",
            orientation: 'h'

        }];
        let layout = {title: "Top 10 OTUs"

        };
        Plotly.newPlot("bar", barData, layout);

     
       

        

    });
}
    
   //Create a bubble chart that displays each sample.
function plotBubbleChart(sample) {
    d3.json(samples).then(function (data) {
        let sampleData = data.samples;
        let sampleId = sampleData.filter(sampleOtu => sampleOtu.id == sample);
        let result = sampleId[0];
        let sampleValues = result.sample_values;
        let otuIds = result.otu_ids;
        let otuLabels = result.otu_labels;
        let bubbleChart = [{
            y: sampleValues,
            x: otuIds,
            text: otuLabels,
            mode: "markers",
            marker: {
                size: sampleValues,
                color: otuIds,
                colorscale: "Earth"
            }
        }];

        let layout = {
            title: "Bacteria Culture Per Sample", hovermode: "closest", xaxis: { title: "OTU ID" }
        };

        Plotly.newPlot("bubble", bubbleChart, layout);


        
    });

}



function dropDown(){
    let objectDropDown = d3.select("#selDataset");
    d3.json(samples).then(function (data) {
        console.log(data);
        let sampleNames = data.names;

        sampleNames.forEach((sample) => {
            objectDropDown
                .append("option")
                .text(sample)
                .property("value", sample);
        });
        let firstName = sampleNames[0];
        metaData(firstName);
        otuPlot(firstName);
        plotBubbleChart(firstName);
    });

}
dropDown();
function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    metaData(newSample);
    otuPlot(newSample);
    plotBubbleChart(newSample);
}
