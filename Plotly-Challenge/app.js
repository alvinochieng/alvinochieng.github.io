function createchart(id) {

    d3.json("data/samples.json").then((data) => {
        console.log(data);
        
        var wfreq = data.metadata.map(row => row.wfreq);
        console.log(`Washing Frequency: ${wfreq}`)
        
        var samples = data.samples.filter(row => row.id.toString() === id)[0];
        console.log(samples);
        
        // getting only the top 10 values and reversing them.
        var samplevalues = samples.sample_values.slice(0, 10).reverse();
        
        var otuid = (samples.otu_ids.slice(0, 10)).reverse();
        console.log(otuid);

        var otus = otuid.map(row => "OTU" + row)

        var labels = samples.otu_labels.slice(0, 10);

        // horizontal bar chart

        var trace1 = {
            x:samplevalues,
            y: otus,
            text: labels,
            marker: {
                color: "purple"
            },
            type: "bar",
            orientation: "h",
        };

        var plotdata = [trace1];

        var layout = {
            title: "Top 10 OTU Found",
            yaxis:{
                tickmode: "linear",
            },

            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 100
              }
        }

        Plotly.newPlot("bar", plotdata, layout);

        // bubble chart

        var trace2 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },

            text: samples.otu_labels
        };

        var layout2 = {
            xaxis: {
                title: "OTU ID"
            },
            height: 600,
            width: 800
        };
        var plotdata1 = [trace2];

        Plotly.newPlot("bubble", plotdata1, layout2);

        // Gauge Chart
        var trace3 = {
              domain: { x: [0, 1], y: [0, 1] },
              value: parseFloat(wfreq),
              title: { text: "Scrubs Per Week" },
              type: "indicator",
              mode: "gauge+number",
              gauge: {
                axis: { range: [null, 9] },
                steps: [
                  { range: [0, 1], color: "red" },
                  { range: [1, 2], color: "orange" },
                  { range: [2, 3], color: "yellow" },
                  { range: [3, 4], color: "green" },
                  { range: [4, 5], color: "blue" },
                  { range: [5, 6], color: "indigo" },
                  { range: [6, 7], color: "violet" },
                  { range: [7, 8], color: "gray" },
                  { range: [8, 9], color: "lightblue" }
                  
                ],
              }
            };
            
            var plotdata2 = [trace3];
            
            var layout3= { 
              width: 600, height: 450, margin: { t: 0, b: 0 },
              paper_bgcolor: "lavender",
              font: { color: "darkblue", family: "Algerian" }
         };

        Plotly.newPlot("gauge", plotdata2, layout3);

    });
}

function selectinfo(id) {

    d3.json("data/samples.json").then((newdata) => {

        var metadata = newdata.metadata;

        console.log(metadata);

        var filtered = metadata.filter(row => row.id.toString() === id)[0];

        // selecting the panel to input the demographic info
        var demo = d3.select("#sample-metadata");

        // refresh the panel when new id is selected
        demo.html("");

        // select the data from the ID and append the information
        Object.entries(filtered).forEach((key) => {
            demo.append("h5").text(key[0] + ": " + key[1] + "\n");
        });
    });
}

// creating the function for the new data selected
function optionChanged(id) {
    createchart(id);
    selectinfo(id);
}

// creating the default function
function init() {

    var selected = d3.select("#selDataset");

    d3.json("data/samples.json").then((importeddata) => {

        importeddata.names.forEach(function(info) {
            selected.append("option").text(info).property("value");

        });

        // call the functions so the data can be displayed on the page
        createchart(importeddata.names[0]);
        selectinfo(importeddata.names[0]);
    });
}

init();