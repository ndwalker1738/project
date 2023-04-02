const url = "api/brewery_untappd_export_MD.json";

// read data from html.

d3.json(url).then(function(x) {
    console.log(x);

    for ( let i=0; i<x.length; i++){
        let b_location = x[i].brewery_location;
        console.log(b_location);
    }
    const distinctTypes = [...new Set(x.map((d) => d.brewery_type))]
    const distinctCities = [...new Set(x.map((d) => d.brewery_location))]

    //fill the dropdown
    for ( let i=0; i<x.length; i++){
        d3.select("#selectpicker").append("option").text(distinctCities[i]).property("value",distinctCities[i] )
        d3.select("#selDataset").append("option").text(distinctTypes[i]).property("value",distinctTypes[i])
   }
})
function init() {

    let Menu = d3.select("#selDataset");

    d3.json(url).then((data) => {

        let brewery_name = data.brewery_name;

        brewery_name.forEach((_id)) => {

            console.log(brewery_name);

            Menu.append("option")
                .text(brewery_name)
                .property("value", brewery_name);


        });


    let first_brewery = brewery_name[0];

    console.log(first_brewery);

    buildMetadata(first_brewery);
    buildBarchart(first_brewery);
    buildBubblechart(first_brewery);

});

};
function optionChanged(brew) {
    buildMetadata(brew);
    buildBarchart(brew);
    buildBubblechart(brew);
};

function buildMetadata(brew) {

    d3.json(url).then((data) => {

        let metadata = data.metadata;

        let value = metadata.filter(result => result.id == brew);

        console.log(value)

        let valuedata = value[0];

        d3.select("#sample-metadata").html("");

        Object.entries(valuedata).forEach(([key, value]) => {

            console.log(key, value);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });
};

function buildBarchart(brew) {

    d3.json(url).then((data) => {

        let brew_info = data.brewery_name;

        let value = brew_info.filter(result => result.id == brew);

        let valuedata = value[0];

        let brewery_name = valuedata.brewery_name;
        let brewery_type = valuedata.brewery_type;
        let brewery_ratings = valuedata.brewery_ratings;

        console.log(brewery_name, brewery_type, brewery_ratings);

        let yticks = brewery_name.slice(0, 10).map(id => `brewery_name`).reverse();
        let xticks = brewery_ratings.slice(0, 10).reverse();
        let labels = brewery_type.slice(0, 10).reverse();

        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        let layout = {
            title: "Top 10 Breweries"
        };

        Plotly.newPlot("bar", [trace], layout)
    });
};

function buildBubblechart(brew) {

    d3.json(url).then((data) => {

        let brew_info = data.brewery_name;

        let value = brew_info.filter(result => result.id == brew);

        let valuedata = value[0];

        let brewery_name = valuedata.brewery_name;
        let brewery_type = valuedata.brewery_type;
        let brewery_ratings = valuedata.brewery_ratings;

        console.log(brewery_name, brewery_type, brewery_ratings);

        let yticks = brewery_name.slice(0, 10).map(id => `brewery_name`).reverse();
        let xticks = brewery_ratings.slice(0, 10).reverse();
        let labels = brewery_type.slice(0, 10).reverse();

        let trace1 = {
            x: brewery_name,
            y: brewery_ratings,
            text: brewery_type,
            mode: "markers",
            marker: {
                size: brewery_ratings,
                color: brewery_name,
                colorscale: "Earth"
            }
        };

        let layout = {
            title: "Top 10 Breweries"
            hovermode: "closest",
        };

        Plotly.newPlot("bubble", [trace1], layout)
    });
};

init();


function Type(selectedType){
    d3.json(url).then(function(x) {
        //bar chart
        let breweryType=x.filter(f=>f.brewery_type==selectedType)
            console.log(breweryType)

d3.select("table").remove();
// copyrigh to : https://gist.github.com/jfreels/6733593 and to https://www.htmlgoodies.com/javascript/bring-your-data-to-life-with-d3-js/
    function tabulate(data, columns) {
        var table = d3.select('.col-md-6').append('table')
        //give the table an id
        .attr("id", "BrewType")
        .style("border-collapse", "collapse")
        .style("border", "2px black solid")
        .style("background-color","white");
        var thead = table.append('thead')
        var	tbody = table.append('tbody');
    
        // append the header row
        thead.append('tr')
        .selectAll('th')
        .data(columns).enter()
        .append('th')
        .text(function (column) { return column; })
        .style("border", "1px black solid")
        .style("padding", "5px")
        .style("background-color", "orange")
        .style("font-weight", "bold")
        .style("text-transform", "uppercase")

            

        //    .on('mouseout', function (d, i) {
        //         d3.select(this).transition()
        //              .duration('50')
        //              .attr('opacity', '1');
    
        // create a row for each object in the data
        var rows = tbody.selectAll('tr')
        .data(data)
        .enter()
        .append('tr');
    
        // create a cell in each row for each column
        var cells = rows.selectAll('td')
        .data(function (row) {
            return columns.map(function (column) {
            return {column: column, value: row[column]};
            });
        })
        .enter()
        .append('td')
            .text(function (d) { return d.value; })
            .style("border", "1px black solid")
            .style("padding", "5px")
            .style("font-size", "12px")
            .on("mouseover", function(d,i) {
                // make the row red
                d3.select(this)
                    .style("background-color","red");
            })
            .on("mouseout",function(d,i){
                d3.select(this)
                   .style("background-color","transparent");
            })
    
    return table;
    }
    var brewTableType=tabulate(breweryType, ['brewery_location', 'brewery_name', 'brewery_ratings', 'brewery_type','number_beers']);

    brewTableType.selectAll("tbody tr") 
        .sort(function(a, b) {
                return d3.ascending(a.brewery_location, b.brewery_location);
        });



        // let samplesValue= samples[0].sample_values.slice(0,10).reverse()
        //     console.log(samplesValue)
        // let samplesLabels= samples[0].otu_labels.slice(0,10).reverse()
        //     console.log(samplesLabels)
        //     //map functin is valid on array, therefore we have to pick the otu_id array
        // let samplesOtu_ids= samples[0].otu_ids.map(x=> `OTU_${x}`).slice(0,10).reverse()
        //     console.log(samplesOtu_ids)

        
        // let trace1={
        //     x:samplesValue,
        //     y:samplesOtu_ids,
        //     type:"bar",
        //     orientation: 'h'
        // }
        // let data=[trace1];

        // Plotly.newPlot('bar',data)


        // //Bubble plot
        // let samples2=x.samples.filter(function(f){return f.id==selectedid})
        //     console.log(samples2)
        // let samplesValue2= samples2[0].sample_values
        //     console.log(samplesValue2)
        // let samplesLabels2= samples2[0].otu_labels
        //     console.log(samplesLabels2)
        //     //map functin is valid on array, therefore we have to pick the otu_id array
        // let samplesOtu_ids2= samples2[0].otu_ids
        //     console.log(samplesOtu_ids2)

        // //Bubble plot
        // let trace2= {
        //     x: samplesOtu_ids2,
        //     y: samplesValue2,
        //     text: samplesLabels2,
        //     mode: 'markers',
        //     marker: {
        //       color: samplesOtu_ids2,
        //       size: samplesValue2,
        //     }
        //   };
          
        //   let data2 = [trace2];
          
        //   let layout = {
        //     title: 'Bubble Chart',
        //     showlegend: false,
        //     height: 600,
        //     width: 1200
        //   };
          
        //   Plotly.newPlot('bubble', data2, layout);

        //   //adding the panel info

        // let panelInfo=x.metadata.filter(f=> f.id==selectedid)
        //     console.log(panelInfo);
            
        //     //clearing the demographic panel
        //     d3.select(".marginclass").remove();
        //     //Adding the demographic infop to the panel
        //     d3.select(".panel-primary").append("p").html(`id: ${panelInfo[0].id} <br> ethnicity:  ${panelInfo[0].ethnicity} <br>
        //     gender:  ${panelInfo[0].gender} <br> age:  ${panelInfo[0].age} <br>
        //      location:  ${panelInfo[0].location} bbtype:  ${panelInfo[0].bbtype} <br> wfreq:  ${panelInfo[0].wfreq}`).attr("class", "marginclass");
             
        });
    }      

function Citi(selectedCiti){
    d3.json(url).then(function(x) {
            //bar chart
        let breweryCiti=x.filter(f=>f.brewery_location==selectedCiti)
            console.log(breweryCiti)


            d3.select("table").remove();
            // copyrigh to : https://gist.github.com/jfreels/6733593 and to https://www.htmlgoodies.com/javascript/bring-your-data-to-life-with-d3-js/
                function tabulate(data, columns) {
                    var table = d3.select('.col-md-6').append('table')
                    //give the table an id
                    .attr("id", "BrewType")
                    .style("border-collapse", "collapse")
                    .style("border", "2px black solid")
                    .style("background-color","white");
                    var thead = table.append('thead')
                    var	tbody = table.append('tbody');
                
                    // append the header row
                    thead.append('tr')
                    .selectAll('th')
                    .data(columns).enter()
                    .append('th')
                    .text(function (column) { return column; })
                    .style("border", "1px black solid")
                    .style("padding", "5px")
                    .style("background-color", "orange")
                    .style("font-weight", "bold")
                    .style("text-transform", "uppercase");
            
                        
            
                    //    .on('mouseout', function (d, i) {
                    //         d3.select(this).transition()
                    //              .duration('50')
                    //              .attr('opacity', '1');
                
                    // create a row for each object in the data
                    var rows = tbody.selectAll('tr')
                    .data(data)
                    .enter()
                    .append('tr');
                
                    // create a cell in each row for each column
                    var cells = rows.selectAll('td')
                    .data(function (row) {
                        return columns.map(function (column) {
                        return {column: column, value: row[column]};
                        });
                    })
                    .enter()
                    .append('td')
                        .text(function (d) { return d.value; })
                        .style("border", "1px black solid")
                        .style("padding", "5px")
                        .style("font-size", "12px")
                        .on("mouseover", function(d,i) {
                            // make the row red
                            d3.select(this)
                                .style("background-color","red");
                        })
                        .on("mouseout",function(d,i){
                            d3.select(this)
                               .style("background-color","transparent");
                        })
                
                return table;
                }
                var brewTableCiti=tabulate(breweryCiti, ['brewery_location', 'brewery_name', 'brewery_ratings', 'brewery_type','number_beers']);
            
                brewTableCiti.selectAll("tbody tr") 
                    .sort(function(a, b) {
                            return d3.ascending(a.brewery_location, b.brewery_location);
                    });
    })
}

//Defining the function in the html which executes once the drop downn is clicked
function optionChangedC(selectedCiti){
        console.log(`city ${selectedCiti} selected by the user`)
        Citi(selectedCiti)
        
       }

function optionChangedT(selectedType){
        console.log(`city ${selectedType} selected by the user`)
        Type(selectedType)
        
       }


// function optionChanged(y){
//         console.log(y)
        
            
//         }