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
            type: "line"
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
            // Drag points(circle) only
            if(e.originalEvent.target[0].tagName === 'circle'){
                movePathWithPoint(e.originalEvent.target[0], e.originalEvent.event.offsetY);
            }
        },

        dragStart: function(e) {
            // Calculate the dimensions only if the target is “circle”
            if(e.originalEvent.target[0].tagName !== 'circle'){
                return;
            }         
   
            var me = this,
            circle = $('.kendo-chart').find('svg g g circle'), // Get all the line intersecting points
            path = $('.kendo-chart').find('svg g g path'), // Get all the line paths
            pathLength = path.length, // Get the total paths length
            circleLength = circle.length;  // Get the total circles length
            
            me.index = 0;
      	
            // Calculate the chart boundaries
            if(!self.chartLimits){
                self.chartLimits = getChartLimits();
            }

            // Set attribute to the line path for retrieving the individual path
            path.each(function() {
                if (!$(this).attr('data-index')) {
                    $(this).attr('data-index', ++me.index);
                }
            });

            // Set attribute to the circles(points) for retrieving the individual circle
            for (var k = 0; k < circleLength; k++) {
                $(circle[k]).attr({
                    'data-index': (k % pathLength) + 1,
                    'data-bar': Math.ceil((k + 1) / pathLength)
                });
            }

        }
       
    });
    
    // Get the chart area (plot area) limits
    var getChartLimits = function(){
        var plotArea = $($('svg path')[2]).attr('d').substr(1),
        plotAreaDim = plotArea.split(" "),
        
        chartLimits = {
            upperHeightLimit: plotAreaDim[5], // For line/column graphs
            lowerHeightLimit: plotAreaDim[1], // For line/column graphs
            upperWidthLimit: plotAreaDim[2], // For bar graphs
            lowerWidthLimit: plotAreaDim[0] // For bar graphs
        };
        
        return chartLimits;
    };
    
    // Draggable functionality     
    var movePathWithPoint = function (element, pos) {
        var pointIndex, path, p_array, pathElement ,circle, pathIndex,
        chartLimits = self.chartLimits;
	
        // Get the target circle element
        circle=  $('circle[data-model-id=' + $(element).attr('data-model-id') + ']');                
        pointIndex = circle.attr('data-bar') - 1;                
        pathIndex = circle.attr('data-index');  

        // Get the line path in which the circle lies              
        pathElement = $('svg g g path[data-index=' + pathIndex + ']');
        
        // Restrict dragging outside the chart limits 
        if (pos > chartLimits.lowerHeightLimit && pos < chartLimits.upperHeightLimit) {

            // In the pathElement the “d” attribute contains all the coordinates of the points and lines
            path = pathElement.attr('d').substr(1);         
  
            // Set the line path along with the dragging circle
            p_array = path.split(" ");
            p_array[(pointIndex * 2) + 1] = pos; // Change the path coordinate with the new position of the dragged circle

            path = "M" + p_array.join(" "); 

            pathElement.attr('d', path); // Reset the “d” attribute with the changed coordinates
            circle.attr('cy', pos); // Reset the circles y-coordinate 
        }
    }
});