angular
  .module('bluetooth_wortex.directives', [])
  .directive('bleGraph', function($timeout, d3) {
    return {
      restrict: 'E',
      scope: { currentRssi: "@" },
      template: "<div class='graph'></div>",
      link: function(scope, element, attrs) {
        var deviceDB = [];
        var timeRange = 10 * 1000;
        var timeshift = 500;
        var margin = {top: 0, right: 20, bottom: 8, left: 30};
        var width = 200, height = 75;
        var graphWidth = width - margin.right - margin.left;
        var graphHeight = height - margin.top - margin.bottom;

        var x = d3.time.scale()
          .domain([Date.now() - timeRange, Date.now() - timeshift * 5])
          .range([0, graphWidth]);
        var xAxis = d3.svg.axis().scale(x).orient('bottom');
        var y = d3.scale.linear()
          .domain([-110, -30])
          .range([graphHeight, 0]);
        var yAxis = d3.svg.axis().scale(y).orient("left").ticks(3);

        attrs.$observe('currentRssi', function (value) {
          var currentRssi = Number(value);
          var rssiData = {timeMark: Date.now(), currentRssi: currentRssi};
          deviceDB.push(rssiData);
          var minY = d3.min(deviceDB, function (d) {
            return d.currentRssi;
          });
          var maxY = d3.max(deviceDB, function (d) {
            return d.currentRssi;
          });
          var differ = maxY - minY;
          var minDeffer = 20;

          if ((maxY - minY) < minDeffer) {
            minY -= differ / 2;
            maxY += differ / 2;
            if (minY < -110) {
              minY = -110;
              maxY = -110 + minDeffer;
            } else if (maxY > -30) {
              minY = -30;
              maxY = -30 + minDeffer;
            }
          }

          y = d3.scale.linear()
            .domain([minY, maxY])
            .range([graphHeight, 0]);

          yAxis = d3.svg.axis().scale(y).orient("left").ticks(3);
        });

          var area = d3.svg.area()
            .x(function (d) {
              return x(d.timeMark);
            })
            .y0(graphHeight)
            .y1(function (d) {
              return y(d.currentRssi);
            });

          var svg = d3.select(element[0]).select('.graph')
            .append('svg')
            .attr('class', 'chart')
            .attr('width', width)
            .attr('height', height);

          svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", graphWidth)
            .attr("height", graphHeight)
            .attr('x', margin.left)
            .attr('y', margin.top);

          svg.append("linearGradient")
            .attr("id", "blue-gradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0).attr("y1", -50)
            .attr("x2", 0).attr("y2", 77)
            .selectAll("stop")
            .data([
              {offset: "0%", color: 'blue'},  //  52, 32, 232
              {offset: "50%", color: 'steelblue'},
              {offset: "100%", color: 'white'}
            ])
            .enter().append("stop")
            .attr("offset", function (d) {
              return d.offset;
            })
            .attr("stop-color", function (d) {
              return d.color;
            });

          var renderXAxis = svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(' + margin.left + ',' + graphHeight + ')')
            .call(xAxis);

          var renderYAxis = svg.append("g")
            .attr("class", "y axis")
            .attr('transform', 'translate(' + margin.left + ')')
            .call(yAxis);

          var path = svg.append("g")
            .attr("clip-path", "url(#clip)")
            .append("path")
            .datum(deviceDB)
            .attr("class", "area")
            .attr("d", area);

          tick();

          function tick() {
            x.domain([Date.now() - timeRange, Date.now() - timeshift * 5]);

            path
              .attr("d", area)
              .attr("transform", null)
              .transition()
              .duration(timeshift)
              .ease("linear")
              .attr("transform", "translate(" + x(Date.now() - timeRange - timeshift) + ",0)")
              .each("end", tick);

            renderXAxis
              .transition()
              .duration(timeshift)
              .ease('linear')
              .call(xAxis);

            renderYAxis
              .transition()
              .duration(timeshift)
              .ease('linear')
              .call(yAxis);


            // pop the old data point off the front
            if (deviceDB.length > 500) {
              deviceDB.shift();
            }
          }

      }
    }
  });


