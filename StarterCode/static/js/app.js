function init() {

    // Grabbing the dropdown element
    var selector = d3.select('#selDataset');
    
    d3.json("/StarterCode/samples.json").then(function(data){
        var names = data.names;

        selector.selectAll('option')
            .data(names)
            .enter()
            .append('option')
            .attr('value', n => n)
            .text(n => n);

        var starter = names[0];

        charts(starter);
        demographics(starter);

    }).catch(error => console.log(error));
};

function optionChanged(newID){
    charts(newID);
    demographics(newID);
};


function demographics(id){
    d3.json("/StarterCode/samples.json").then(function(sample){
        const userInfoPanel = d3.select(".panel-body");
        var filtered = sample.metadata.filter(sample => sample.id == id)[0];
        console.log(filtered);

        userInfoPanel.html("")
        userInfoPanel.append("h6").text(`ID: ${filtered.id}`)
        userInfoPanel.append("h6").text(`Ethnicity: ${filtered.ethnicity}`)
        userInfoPanel.append("h6").text(`Gender: ${filtered.gender}`)
        userInfoPanel.append("h6").text(`Age: ${filtered.age}`)
        userInfoPanel.append("h6").text(`Location: ${filtered.location}`)
        userInfoPanel.append("h6").text(`BBtype: ${filtered.bbtype}`)
        userInfoPanel.append("h6").text(`Wfreq: ${filtered.wfreq}`)
    });
}

function charts(id){
    d3.json("/StarterCode/samples.json").then(function(sample){
        var filtered = sample.samples.filter(sample => sample.id == id)[0];
        var top10otu = filtered.otu_ids.slice(0, 10).reverse();
        var top10sv = filtered.sample_values.slice(0, 10).reverse();
        console.log(top10otu);

        var barchart = [
        {
            y: top10otu.map(label => `OTU${label}`),
            x: top10sv,
            type: 'bar',
            orientation: 'h'
        }
        ];
        Plotly.newPlot('bar', barchart);

        
        var trace1 = {
            x: filtered.otu_ids,
            y: filtered.sample_values,
            text: [`${filtered.sample_values}`],
            mode: 'markers',
            marker: {
            size: filtered.sample_values
            }
        };
        
        var data = [trace1];
        
        var layout = {
            title: 'Sample Data',
            showlegend: false,
            height: 600,
            width: 600,
            title: 'OTU values',
            text: filtered.otu_ids,
            color: filtered.sample_values}
        
        Plotly.newPlot('bubble', data, layout);

});
}

init();