//Line Chart Template
chart();
function chart() {

  var filename = "ExampleDummyData.csv";
  var dateFormatInput = "%Y-%m-%d";
  var variableNamesBase = ["date_variable", "nhs_board_name", "location_name", "variable_1", "variable_2", "variable_3", "variable_4"]//, "variable_5", "variable_6"]
  var variableLabelBase = ["Year ending", "NHS Board", "Location", "variable 1", "variable 2", "variable 3", "variable 4"]//, "variable 5", "variable 6"];

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

    LineChart(
      startdata = basedata,
      classname = "chart-1",
      htmlFigureId = "#figure-chart-1",
      xlabel =  "Week ending",
      ylabel = "y label",
      dateFormatOutput =  "%b%y",
      circlesize = 3, 
      variableNames = variableNamesBase,
      variableLabels = variableLabelBase,
      colourNumbers = ["I", "II", "III", "IV", "V", "VI"],
      margin = {
        top: 5, right: 20, bottom: 40, left: 50
      }
      );
  });

  // Formatting
    var format1000 = d3.format(","); 

  ///////////////////////////////////////////////////////////////////////////
  // Templates and functions
  ///////////////////////////////////////////////////////////////////////////
    // Data processing
      function dataUpdate(data, locationVariable, locationId) {

        var locname = $(locationId).val();
        
        var dataset = [];
        dataset = data.filter(function (d) { return d[locationVariable] == locname });
        
        return dataset;

      };

      function chartLocationUpdate(locationId, chartLocationId) {
        var locname = document.getElementById(locationId).value;//$(locationId).val();
        document.getElementById(chartLocationId).textContent = locname;

      };

    //Scale
      function xScaleResize(chart, Scale) {
        chart.w = $(".figure--size").width() - chart.margin.left - chart.margin.right;
        Scale.x.range([0, chart.w], .1);
      };

      function yScaleUpdate(dataset, chart, Scale, variable, classname) {
        
        var YmaxValues = []
        for (var i = 3; i < variableNames.length; i++) {
          YmaxValues[i - 3] = Scale.max.left = d3.max(dataset, function (d) { return d[variableNamesFunc[i]]; });
        }
        Scale.max.left = d3.max(YmaxValues, function (d) { return d * 1.15; });
        
        Scale.y.left.domain([0, Scale.max.left]);

        chart.select(".y-axis.left." + classname)
          .transition("scale")
          .duration(1000)
          .call(d3.axisLeft(Scale.y.left));
        return Scale;

      };

      function chartWidthHeight(chart, figureid) {
        chart.w = $(".figure--size").width() - chart.margin.left - chart.margin.right,
        chart.h = $(".figure--size").height() - chart.margin.top - chart.margin.bottom;
      };

      function chartScale(data, chart, Scale) {
        Scale.x = d3.scaleBand().range([0, chart.w], .1).paddingInner(0)
          .domain(data.map(function (d) { return d.date; }));
        
        Scale.y.left = d3.scaleLinear()
          .range([chart.h, 0])
          .domain([0, Scale.max.left]);
        if (typeof Scale.max.right !== "undefined") {
          Scale.y.right = d3.scaleLinear()
            .range([chart.h, 0])
            .domain([0, Scale.max.right]);
        };
      };

    // Axis and labels
      function drawAxis(chart, Scale, classname) {

        var xAxis = d3.axisBottom()
          .scale(Scale.x)
          .tickFormat(Scale.xFormat)
          .tickValues(Scale.x.domain());

        chart.append("g")
          .attr("class", "x-axis " + classname)
          .attr("transform", "translate(0," + chart.h + ")")
          .call(xAxis);

        chart.append("g")
          .attr("class", "y-axis left " + classname)
          .call(d3.axisLeft(Scale.y["left"]));

        if (typeof Scale.y["right"] !== "undefined") {

          chart.append("g")
            .attr("class", "y-axis right " + classname)
            .attr("transform", "translate(" + chart.w + ",0)")
            .call(d3.axisRight(Scale.y["right"]));
        };
      };

      function resizeXaxis(chart, Scale, classname) {
        var xAxis = d3.axisBottom()
      .scale(Scale.x).tickFormat(Scale.xFormat)
        .tickValues(Scale.x.domain());

        chart.select(".x-axis." + classname)
                    .transition("resizeaxis")
                    .duration(0)
                    .call(xAxis);

        if (typeof Scale.y["right"] !== "undefined") {
        
          chart.selectAll(".y-axis.right." + classname)
                .transition("axisymove")
                .duration(0)
                .attr("transform", "translate(" + chart.w + ",0)")
                .call(d3.axisRight(Scale.y["right"]));
        };
      };

      function resizeLine(chart, Scale, side, variable, classline) {

        var dataline = d3.line()
                      .x(function (d) { return Scale.x(d.date) + Scale.x.bandwidth() / 2; })
                      .y(function (d) { return Scale.y[side](d[variable]); });

        chart.selectAll(".line." + classline)
          .transition("resizeline")
          .duration(0)
          .attr("d", dataline);
      };

      function drawLabels(svg, chart, xlabelclass, xlabel, ylabelleftclass, ylabelLeft, ylabelrightclass, ylabelRight) {
        chart.append("text")
          .attr("transform", "translate(" + (chart.w / 2) + " ," + (chart.h + 35) + ")")
          .style("text-anchor", "middle")
          .attr("class", xlabelclass + " labels")
          .text(xlabel);

        chart.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - (chart.margin.left * 0.7))
          .attr("x", 0 - (chart.h / 2))
          .attr("class", ylabelleftclass + " labels")
          .style("text-anchor", "middle")
          .text(ylabelLeft);

        if (typeof ylabelRight !== "undefined") {

          chart.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", chart.w + (chart.margin.right * 0.7))
            .attr("x", 0 - (chart.h / 2))
            .attr("class", ylabelrightclass + " labels")
            .style("text-anchor", "middle")
            .text(ylabelRight);
        }
      };


      function resizeLabels(chart, xlabelclass, yaxisrightclass) {
        chart.select("." + xlabelclass)
          .transition("resizelabels")
          .duration(0)
          .attr("transform", "translate(" + (chart.w / 2) + " ," + (chart.h + 35) + ")");

        if (typeof yaxisrightclass !== "undefined") {
          chart.select("." + yaxisrightclass)
            .transition("yaxisright")
            .duration(0)
            .attr("y", chart.w + (chart.margin.right * 0.7));
        };
      };

    // Legend
      function drawLegend(classname, variableNames, variableLabels, colourNumbers) {
        var divTool = d3.select("#figure-legend-" + classname);
        var toolTipText = [];
        var this_circle = [];
        
        for (var i = 3; i < variableNames.length; i++) {
          toolTipText.push("<span class='no-wrap'><span class='font-size--big colour__" + colourNumbers[i - 3] + "--color'> &#9644;</strong></span>" + variableLabels[i] + "</span>");
        }

        divTool.html(toolTipText.join(" &nbsp;"));

      }
    // Line
      function drawLine(data, chart, Scale, side, variable, classline) {
        var dataline = d3.line()
          .x(function (d) { return Scale.x(d.date) + Scale.x.bandwidth() / 2; })
          .y(function (d) { return Scale.y[side](d[variable]); });

        chart.append("path")
          .data([data])
          .attr("class", "line " + classline)
          .attr("d", dataline);
      };

      function redrawLineUpdate(dataset, chart, Scale, side, variable, classname, classline, colourNumber) {
        var dataline = d3.line()
                      .x(function (d) { return Scale.x(d.date) + Scale.x.bandwidth() / 2; })
                      .y(function (d) { return Scale.y[side](d[variable]); });
        var datalineZero = d3.line()
                            .x(chart.w)
                            .y(Scale.y[side](dataset[dataset.length - 1][variable]));

            chart.select(".line." + classname + "." + colourNumber)
                .remove();

            chart.append("path")
                .data([dataset])
                .attr("class", "line " + classline)
                .attr("d", datalineZero)
                .transition("redraw-line")
                .duration(1000)
                .attr("d", dataline);      
      };

      function lineUpdate(dataset, chart, Scale, side, variable, classname, classline, colourNumber) {
        var dataline = d3.line()
                        .x(function (d) { return Scale.x(d.date) + Scale.x.bandwidth() / 2; })
                        .y(function (d) { return Scale.y[side](d[variable]); });

        chart.selectAll(".line." + classname + "." + colourNumber)
          .data([dataset])
          .transition("updateline")
          .duration(1000)
          .attr("d", dataline);
      };

    // Circle
      function drawCircles(data, chart, Scale, side, variable, circlesize, circleclass) {
        chart.selectAll("circ")
          .data(data)
          .enter()
          .append("circle")
          .attr("class", "circle " + circleclass)
          .attr("r", circlesize)
          .attr("cx", function (d) { return Scale.x(d.date) + Scale.x.bandwidth() / 2; })
          .attr("cy", function (d) { return Scale.y[side](d[variable]); });
      };

      function circleUpdate(dataset, chart, Scale, side, circlesize, variable, classname, colourNumber) {
        
        var circle = chart.selectAll(".circle." + classname + "." + colourNumber)
          .data(dataset);

        circle.enter()
          .append("circle")
          .attr("class", "circle " + classname + " " + colourNumber +" circle--hide stroke--thin colour__" + colourNumber + "--fill colour__" + colourNumber +"--stroke")
          .attr("r", circlesize)
          .attr("cx", function (d) { return Scale.x(d.date) + Scale.x.bandwidth() / 2; })
          .attr("cy", function (d) { return Scale.y[side](d[variable]); });
        
        circle.transition("changecircle")
          .duration(1000)
          .attr("cx", function (d) { return Scale.x(d.date) + Scale.x.bandwidth() / 2; })
          .attr("cy", function (d) { return Scale.y[side](d[variable]); });

        circle.exit()
          .transition("exitCircle")
          .duration(0)
          .remove();
        circle.merge(circle);
      };

      function resizeCircle(dataset, chart, Scale, circleclass) {
        chart.selectAll(".circle." + circleclass)
          .data(dataset)
          .transition("resizecirc")
          .duration(0)
          .attr("cx", function (d) { return Scale.x(d.date) + Scale.x.bandwidth() / 2; });
      };

    // Hoverbar - for tooltip and highlighting
      function drawHoverBar(dataset, chart, Scale, barclass, classname, variableNames, variableLabels, colourNumbers) {
        chart.selectAll("bars")
          .data(dataset)
          .enter()
          .append("rect")
          .attr("class", " hoverbars--hide " + barclass + " hoverbars ")
          .attr("x", function (d) { return Scale.x(d.date); })
          .attr("y", 0)
          .attr("width", Scale.x.bandwidth())
          .attr("height", function (d) { return chart.h; })
          .on("mouseout", function (d) {
            var this_bar = d3.select(this);
            this_bar.classed("hoverbars--hide", true);
            this_bar.classed("hoverbars--highlight", false);
            mouseOutBar(d, Scale, classname);
            drawLegend(classname, variableNames, variableLabels, colourNumbers);
          })
          .on("mouseover", function (d) {

            var this_bar = d3.select(this);
            this_bar.classed("hoverbars--hide", false);
            this_bar.classed("hoverbars--highlight", true);

            mouseOverBar(d, Scale, classname, variableNames, variableLabels, colourNumbers);
          });     
      };

      function resizeHoverBars(dataset, chart, Scale, barclass) {
        chart.selectAll(".hoverbars." + barclass)
          .data(dataset)
          .transition("resizebars")
          .duration(0)
          .attr("x", function (d) { return Scale.x(d.date); })
          .attr("width", Scale.x.bandwidth());
      };

      function removeHoverBar(chart, barclass) {
        chart.selectAll(".hoverbars." + barclass).remove();
      }

      function updateHoverBar(dataset, chart, Scale, barclass, classname, variableNames, variableLabels, colourNumbers) {
        var bar = chart.selectAll(".hoverbars." + barclass)
          .data(dataset);

          bar.enter()
          .append("rect")
          .attr("class", "hoverbars--hide " + "hoverbars " + barclass)
          .attr("x", function (d) { return Scale.x(d.date); })
          .attr("y", 0)
          .attr("width", Scale.x.bandwidth())
          .attr("height", function (d) { return chart.h; });

        bar.transition("changebar")
          .duration(0)
          .attr("x", function (d) { return Scale.x(d.date); })
          .attr("y", 0)
          .attr("width", Scale.x.bandwidth())
          .attr("height", function (d) { return chart.h; });;

        bar.exit()
          .transition("exitBar")
          .duration(100)
          .remove();

        bar.merge(bar)
            .on("mouseout", function (d) {

            var this_bar = d3.select(this);
            this_bar.classed("hoverbars--hide", true);
            this_bar.classed("hoverbars--highlight", false);
            drawLegend(classname, variableNames, variableLabels, colourNumbers);
            mouseOutBar(d, Scale, classname);
          })
          .on("mouseover", function (d) {

            var this_bar = d3.select(this);
            this_bar.classed("hoverbars--hide", false);
            this_bar.classed("hoverbars--highlight", true);

            mouseOverBar(d, Scale, classname, variableNames, variableLabels, colourNumbers);
          });
      };

      function mouseOverBar(d, Scale, classname, variableNames, variableLabels, colourNumbers) {
        var x = Scale.x(d.date);
        var dateFormat = d3.timeFormat("%d %B %Y");
        var xCircle = x + (Scale.x.bandwidth() / 2);

        var this_bars = d3.select(".bars." + classname + "[x=\"" + x + "\"]");
        this_bars.classed("bars--highlight", true);
        var divTool = d3.select("#figure-legend-" + classname);
        var toolTipText = [];
        var this_circle = [];
        for (var i = 3; i < variableNames.length; i++) {

          this_circle[i] = d3.select(".circle." + classname + "."  + colourNumbers[i - 3] + "[cx=\"" + xCircle + "\"]");
          this_circle[i].classed("circle--hide", false);
          this_circle[i].classed("circle--highlight", true);
          toolTipText.push("<span class='no-wrap'><span class='font-size--big colour__" + colourNumbers[i - 3] + "--color'>  &#9644;</strong></span>" + variableLabels[i] + ":" + format1000(d[variableNamesFunc[i]].toFixed(1)) + "</span>");
        }
        divTool.html(toolTipText.join("&nbsp;") + "<br><span class='no-wrap'><strong>" + dateFormat(d.date) + "</strong></span>");
      };

      function mouseOutBar(d, Scale, classname) {
        var x = Scale.x(d.date);
        var xCircle = x + (Scale.x.bandwidth() / 2);

        var this_bars = d3.selectAll(".bars." + classname + "[x=\"" + x + "\"]");
        this_bars.classed("bars--highlight", false);

        var this_circle = d3.selectAll(".circle[cx=\"" + xCircle + "\"]");
        this_circle.classed("circle--hide", true);
        this_circle.classed("circle--highlight", false);

        var divTool = d3.select(" .tooltip." + classname);

        divTool.classed("tooltip--hide", true)
          .classed("tooltip--show", false);
      };

    // Dropdowns 
      function dropDownNHSBoard(data, classname, variableNames) {
        var dataname = data.filter(function (d) { return d[variableNamesFunc[1]].substr(d[variableNamesFunc[1]].length - 8) !== "Scotland"});
        var selectvalues = d3.nest()
          .key(function (d) { return d[variableNamesFunc[1]]; })
          .entries(dataname);

        for (var i = 0; i < selectvalues.length; i++) {
          $("#hb-" + classname).append('<option value="' + selectvalues[i].key + '">' + selectvalues[i].key + '</option>');
        };
      };

      function dropDownLocation(data, classname, variableNames) {
        $("#location-" + classname).children().remove();

        var hbname = $("#hb-" + classname).val();
        var LatestDate = data[data.length - 1][variableNamesFunc[0]];
      
        var dataname = data.filter(function (d) { return d[variableNamesFunc[1]] === hbname && d[variableNamesFunc[2]] !== hbname && d[variableNamesFunc[0]] === LatestDate});

        var selectvalues = d3.nest()
          .key(function (d) { return d[variableNamesFunc[2]]; })
          .entries(dataname);

        var boardname = "NHS Board";
        if (hbname === "Scotland" || hbname === "NHSScotland" || hbname ==="NHS Scotland") { boardname = "All" };
      
        $("#location-" + classname).append('<option value="' + hbname + '">' + boardname + '</option>');
        
        for (var i = 0; i < selectvalues.length; i++) {
          $("#location-" + classname).append('<option value="' + selectvalues[i].key + '">' + selectvalues[i].key + '</option>');
        };
      };

      /////////////////////Templates/////////////////////////////

      // Charts
      // Line chart
        function LineChart(startdata, classname, htmlFigureId, xLabel, ylabel, dateFormatOutput, circlesize, variableNames, variableLabels, colourNumbers, margin) {
          if (document.querySelector("#hb-" + classname).children.length < 2) {
            dropDownNHSBoard(startdata, classname, variableNames);
            dropDownLocation(startdata, classname, variableNames);
          };

          var dataset = [];

          d3.select("body").append("div")
            .attr("class", "tooltip " + classname + " tooltip--hide");

          var Scale = {
            y: {},
            max: {
              left: {},
            
            },
            xFormat: d3.timeFormat(dateFormatOutput)
          };

          drawLegend(classname, variableNames, variableLabels, colourNumbers); 

          var svg = d3.select(htmlFigureId)
            .append("svg")
            .attr("class", "figure--size"),
            chart = svg.append("g");

          chart.margin = margin;
        
          chart.attr("transform", "translate(" + chart.margin.left + "," + chart.margin.top + ")");

          chartWidthHeight(chart, htmlFigureId);

          dataset = dataUpdate(startdata, variableNames[2], "#location-" + classname);

          chartLocationUpdate("location-" + classname, "chartLocation-" + classname);

          var YmaxValues = []
          for (var i = 3; i < variableNames.length; i++) {
            YmaxValues[i-3] = Scale.max.left = d3.max(dataset, function (d) { return d[variableNamesFunc[i]]; });
          }
          Scale.max.left = d3.max(YmaxValues, function (d) { return d * 1.15; });
          
          chartScale(dataset, chart, Scale);

          for (var i = 3; i < variableNames.length; i++) {
            drawLine(dataset, chart, Scale, "left", variableNames[i], classname + " " + colourNumbers[i - 3] + " stroke--medium colour__" + colourNumbers[i-3] + "--stroke");

            drawCircles(dataset, chart, Scale, "left", variableNames[i], circlesize, classname + " " + colourNumbers[i - 3] +  " circle--hide colour__" + colourNumbers[i - 3] + "--fill " + "colour__" + colourNumbers[i - 3] + "--stroke");
          }
        
          drawAxis(chart, Scale, classname);

          drawLabels(svg, chart, "xlabel", xLabel, "ylabel-left", ylabel);

          drawHoverBar(dataset, chart, Scale, classname, classname, variableNames, variableLabels,colourNumbers);
        
          $(window).on('resize', function () {

            xScaleResize(chart, Scale);

            resizeXaxis(chart, Scale, classname);
            
            for (var i = 3; i < variableNames.length; i++) {
              resizeLine(chart, Scale, "left", variableNames[i], classname + "." + colourNumbers[i - 3]);

              resizeCircle(dataset, chart, Scale, classname + "." + colourNumbers[i - 3]);
            }
            resizeHoverBars(dataset, chart, Scale, classname);

            resizeLabels(chart, "xlabel", "ylabel-right");

            })

          $(".dropdown." + classname + ".I")
            .on("change", function () {

              dropDownLocation(startdata, classname, variableNames);

              var previousDataLength = dataset.length;

              dataset = dataUpdate(startdata, variableNames[2], "#location-" + classname);
              var newDataLength = dataset.length;

              chartLocationUpdate("location-" + classname, "chartLocation-" + classname);

              Scale = yScaleUpdate(dataset, chart, Scale, variableNames[3], classname);
          
              for (var i = 3; i < variableNames.length; i++) {
                if (previousDataLength < newDataLength) {
                  redrawLineUpdate(dataset, chart, Scale, "left", variableNames[i], classname, classname + " " + colourNumbers[i - 3] + " stroke--medium colour__" + colourNumbers[i - 3] + "--stroke", colourNumbers[i - 3]);
                }
                else {
                lineUpdate(dataset, chart, Scale, "left", variableNames[i], classname, classname + " " + colourNumbers[i - 3] + " stroke--medium colour__" + colourNumbers[i - 3] + "--stroke", colourNumbers[i - 3]);
              }
                circleUpdate(dataset, chart, Scale, "left", circlesize, variableNames[i], classname, colourNumbers[i - 3]);
                    }
              if (previousDataLength < newDataLength) {
                removeHoverBar(chart, classname);
                drawHoverBar(dataset, chart, Scale, classname, classname, variableNames, variableLabels, colourNumbers);
              }
              else {
                updateHoverBar(dataset, chart, Scale, classname, classname, variableNames, variableLabels, colourNumbers)
              }
            });

          $(".dropdown." + classname + ".II")
            .on("change", function () {
              var previousDataLength = dataset.length;
              
              dataset = dataUpdate(startdata, variableNames[2], "#location-" + classname);
              var newDataLength = dataset.length;
            
              chartLocationUpdate("location-" + classname, "chartLocation-" + classname);

              Scale = yScaleUpdate(dataset, chart, Scale, variableNames[3], classname);

              

              for (var i = 3; i < variableNames.length; i++) {
                if (previousDataLength < newDataLength) {
                  redrawLineUpdate(dataset, chart, Scale, "left", variableNames[i], classname, classname + " " + colourNumbers[i - 3] + " stroke--medium colour__" + colourNumbers[i - 3] + "--stroke", colourNumbers[i - 3]);
                }
                else {
                  lineUpdate(dataset, chart, Scale, "left", variableNames[i], classname, classname + " " + colourNumbers[i - 3] + " stroke--medium colour__" + colourNumbers[i - 3] + "--stroke", colourNumbers[i - 3]);
                }
                circleUpdate(dataset, chart, Scale, "left", circlesize, variableNames[i], classname, colourNumbers[i - 3]);
              }

              if (previousDataLength < newDataLength) {
                removeHoverBar(chart, classname);
                drawHoverBar(dataset, chart, Scale, classname, classname, variableNames, variableLabels, colourNumbers);
              }
              else {
                updateHoverBar(dataset, chart, Scale, classname, classname, variableNames, variableLabels, colourNumbers)
              }
            });
        };

}