# ISD Scotland D3.js draft line chart template
This is the first draft of a template to create line chart with option to select NHS Boards and locations within NHS Boards. The template consist out of 3 script files and a dummy data file:
* index.html
* js/isdcharts.js
* css/isdcharts.css

The template is written in [HTML](https://developer.mozilla.org/en-US/docs/Learn/HTML), [CSS](https://developer.mozilla.org/en-US/docs/Learn/CSS) and [JavaScript](https://developer.mozilla.org/en-US/docs/Learn/JavaScript) and uses the JavaScript libraries [D3.js](https://d3js.org/) and [jQuery](https://jquery.com/). To start working with the template download the zipfile or clone the repository. To preview the page open the index.html file in [Firefox](https://www.mozilla.org/en-GB/firefox/) or preview  using an editor like [visual studio code](https://code.visualstudio.com/) or [atom](https://atom.io/).
To use the template the following columns need to be included in the data file a date variable with the last date of a time period, NHS Board name variable and location name variable with up to 6 data variables. The rows need to be sorted on date and contain information on location level, NHS Board level with the NHS Board name also as location name and (NHS)Scotland level with location name (NHS)Scotland.  

| date_variable |	nhs_board_name |	location_name |	variable_1 |	variable_2 |	
| ----- | ----- | ----- | ----- | ----- |
| 2016-03-06	| NHS Ayrshire & Arran |	Location1 |	122.4 |	240 |	
| 2016-03-06 |	NHS Ayrshire & Arran |	Location2 |	92.7 |	183.6	|
| 2016-03-06 |	NHS Ayrshire & Arran |	NHS Ayrshire & Arran |	122.4 |	244.8	|
| 2016-03-06 |	NHSScotland |	NHSScotland |	122.4	| 264 |

The use the template with a new data file the code in the top part of the JavaScript file (isdcharts.js) will need to be updated, see code below for instructions. 

```javascript
  var filename = "ExampleDummyData.csv"; // update filename
  var dateFormatInput = "%Y-%m-%d"; // update date format to what's used in the data file 
  // Please not that for csv files excel sometimes shows a different date format that the actual date format 
  var variableNamesBase = ["date_variable", "nhs_board_name", "location_name", "variable_1", "variable_2"] 
  // Change variable names up to 6 variables can be included
  // Please make sure these are ordered in date, nhs board name and location name, variable1, variable2 etc.
  var variableLabelBase = ["Year ending", "NHS Board", "Location", "variable 1", "variable 2"]
  // Change variable labels for the legend
  // Please make sure these are in the same order as the variable names
  
  d3.csv("data/" + filename, function (error, basedata) {

    var parseDateInput = d3.timeParse(dateFormatInput);
    basedata.forEach(function (d, i) {
      d["date"] = parseDateInput(d[variableNamesBase[0]]);
      d[variableNamesBase[1]] = d[variableNamesBase[1]];
      d[variableNamesBase[2]] = d[variableNamesBase[2]];
      for (var i = 3; i < variableNamesBase.length; i++) {
        d[variableNamesBase[i]] = +d[variableNamesBase[i]];
      };
    });

///// Copy this line chart function to create another chart using the same data
    LineChart( // to add another 
      startdata = basedata,
      classname = "chart-1", // update this if creating multiple charts on the same page
      htmlFigureId = "#figure-chart-1", // update this if creating multiple charts on the same page
      xlabel =  "Week ending", // update 
      ylabel = "y label", // update
      dateFormatOutput =  "%b%y",// format for date on the x axis
      circlesize = 3, // set circle size of circles that appear when hovering over the chart
      variableNamesFunc = variableNamesBase,// update if creating new chart with same data for example:
      // variableNamesFunc = ["date_variable", "nhs_board_name", "location_name", "variable_3"]
      variableLabelsFunc = variableLabelBase, //update if creating another chart from same data
      colourNumbers = ["I", "II", "III", "IV", "V", "VI"], 
      // The numbers correspond to the following colours: 
      //I - #004785, II - #00a2e5, III - #4c7ea9, IV - #99daf5, V - #4cbeed, VI - #99b5ce
      // Change the order of the numbers below to change the colour order of the lines 
      // The colours can be changed in the top part of the css file isdcharts.css
      
      margin = {
        top: 5, right: 20, bottom: 40, left: 50 
        // margin of the chart, increase left margin if y-axis numbers are cut off 
      }
      );
 /////
      
      
      
  });
```

Besides the javascript code the html code might need to be updated

```html
<!-- Copy the code below to add another chart to the page -->
<!-- When using multpile charts update "chart-1" to "chart-2","chart-3" etc when using multiple charts -->
   <div>
      <form>
        <label>Select NHS Board:</label>
        <select class="dropdown chart-1 I form-control" id="hb-chart-1"> 
        <!-- Update chart-1 to chart-2 etc when using multiple charts -->
        <option value="NHSScotland">NHSScotland</option> 
        <!-- Change into <option value="Scotland">Scotland</option> if using Scotland instead of NHSScotland-->
        </select>

        <label>Select Location:</label>
        <select class="dropdown chart-1 II form-control" id="location-chart-1">
        <!-- Update chart-1 to chart-2 etc when using multiple charts -->
        <option value="NHSScotland">All</option>
        <!-- Change into <option value="Scotland">All</option> if using Scotland instead of NHSScotland-->
        </select>
      </form>
    </div>
    <h3>
      <span id="chartLocation-chart-1"></span>
     
    </h3>
    
    <div class="chart-div" id="figure-chart-1"></div>
       <div class="figure-legend" id="figure-legend-chart-1"></div>
```
Please let us know if you have any feedback or questions.

 
