// Belly Button Biodiversity

// An interactive dashboard to explore the Belly Button Biodiversity DataSet from
// http://robdunnlab.com/projects/belly-button-biodiversity/

function buildMetadata(sample) {
  // * Display the sample metadata from the route `/metadata/<sample>`
  var metadata = `/metadata/${sample}`;

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(metadata).then(response => {

    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select('#sample-metadata');

    // Use `.html('') to clear any existing metadata
    panel.html('');

    //   * Display each key/value pair from the metadata JSON object somewhere on the page
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(response).forEach(([key, value]) => {
      panel.append('div').text(`${key}: ${value}`);
    });
  })
}

// ## Step 1 - Use Plotly.js to build interactive charts for your dashboard.
function buildCharts(sample) {
  // * Create a PIE chart that uses data from your samples route (`/samples/<sample>`) to display the top 10 samples.
  var samples = `/samples/${sample}`;

  d3.json(samples).then(response => {
    //   * Use `sample_values` as the values for the PIE chart
    var values = response.sample_values.slice(0, 10);

    //   * Use `otu_ids` as the labels for the pie chart
    var ids = response.otu_ids.slice(0, 10);

    //   * Use `otu_labels` as the hovertext for the chart
    var labels = response.otu_labels.slice(0, 10);

    var data = [{
      type: 'pie',
      values: values,
      hovertext: labels,
      labels: ids
    }];

    var layout = {
      width: 500,
      height: 500
    };
    Plotly.newPlot('pie', data, layout);

    // * Create a Bubble Chart that uses data from your samples route (`/samples/<sample>`) to display each sample.
    //   * Use `otu_ids` for the x values
    var x = response.otu_ids;

    //   * Use `sample_values` for the y values
    //   * Use `sample_values` for the marker size
    var y = response.sample_values;

    //   * Use `otu_ids` for the marker colors
    var color = response.otu_ids;

    //   * Use `otu_labels` for the text values
    var text = response.otu_labels;

    var data = [{
      x: x,
      y: y,
      text: text,
      mode: 'markers',
      marker: {
        color: color,
        colorscale: 'Bluered',
        size: y
      }
    }];

    var layout = {
      width: 500,
      height: 500
    };
    Plotly.newPlot('bubble', data, layout);

    // BONUS: Build the Gauge Chart
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select('#selDataset');

  // Use the list of sample names to populate the select options
  d3.json('/names').then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append('option')
        .text(sample)
        .property('value', sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];

    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// * Update all of the plots any time that a new sample is selected.
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();