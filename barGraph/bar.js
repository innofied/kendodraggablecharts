$(document).ready(function(){
    var self = this;
    $('.kendo-chart').kendoChart({
        title: {
            text: "Revenue By Country"
        },
        legend: {
            position: "bottom"
        },
        series: [{
            name: "United States",
            data: [15.7, 16.7, 20, 23.5, 26.6]
        }, {
            name: "India",
            data: [67.96, 68.93, 75, 74, 78]
        }],
        seriesDefaults: {
            type: "bar"
        },
        valueAxis: {
            labels: {
                format: "{0}"
            },
            line: {
                visible: true
            }
        },
        categoryAxis: {
            categories: ['2009', '2010', '2011', '2012'],
            majorGridLines: {
                visible: false
            }
        },
        drag: function(e){
            var el = e.originalEvent.target[0],
            barPath = $('svg g g path[data-model-id=' + $(el).attr('data-model-id') + ']'), //Get the target path
            path, p_array,
            pos = e.originalEvent.event.offsetX, // For dragging horizontally
            chartLimits = self.chartLimits;
        
            if (!barPath.length) {
                return;
            }
        
            // Get the path dimensions
            p_array = $(barPath[0]).attr('d').substr(1).split(" ");
            
            // Restrict the user to drag outside the chart boundaries
            if (pos > chartLimits.lowerWidthLimit && pos < chartLimits.upperWidthLimit) {
                p_array[2] = pos;
                p_array[4] = pos;
            }

            // Rejoin the path dimensions
            path = "M" + p_array.join(" ");
            
            // Set the bar path dimensions with changed values
            $(barPath[0]).attr('d', path);
            $(barPath[1]).attr('d', path);
        },

        dragStart: function(e) {
            if(!self.chartLimits){
                self.chartLimits = getChartLimits();
            }
        }
       
    });
    
    // Get the chart area (plot area) limits
    var getChartLimits = function(){
        var plotArea = $($('svg path')[2]).attr('d').substr(1),
        plotAreaDim = plotArea.split(" "),
        
        chartLimits = {
            upperWidthLimit: plotAreaDim[2], // For rigth side width limit
            lowerWidthLimit: plotAreaDim[0] // For left side width limit
        };
        
        return chartLimits;
    };
});