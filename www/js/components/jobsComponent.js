mapApp.component('jobs', {
  bindings: {jobs: '<'},
  templateUrl: 'templates/jobs.html',
  
  controller : function($timeout, $q, $log, $state, BreadcrumbService) {
    var self = this;
    var data =  self.jobs;  
    $log.info(data);
    
    // Function placed on scope to set the selected node using the BreadcrumbService
    self.updateSelected = function(selected) {
      BreadcrumbService.setSelected(selected);
    }
    
    // Function placed on scope to get the selected node using the BreadcrumbService
    self.getSelected = function() {
      return BreadcrumbService.getSelected();
    }
    
  //-----------------------------
  // BEGIN HELP TOOLTIP
  //-----------------------------
    
    // Set the chart tooltip to not be seen and open direction to nothing
    self.tooltip = {
      showTooltip : false,
      tipDirection : ''
    };
    
  //-----------------------------
  // END HELP TOOLTIP
  //-----------------------------
  
  //-----------------------------
  // BEGIN SEARCH BOX
  //-----------------------------
  
    self.simulateQuery = false; // 
    self.isDisabled = false;
    self.items = loadAll();
    self.querySearch = querySearch;
    self.selectedItemChange = selectedItemChange;

    // Function that queries the data with what the user types in the input
    function querySearch (query) {
      var results = query ? data.nodes.filter(createFilterFor(query)) : data,
         deferred;
      if (self.simulateQuery) {
       deferred = $q.defer();
       $timeout(function () { 
         deferred.resolve(results); 
       }, Math.random() * 1000, false);
       return deferred.promise;
      } else {
        return results;
      }
    } // End querySearch()

    // Function that updates the node's id so position's controller can get it 
    // and updates the chart to reflect the node selected from autocomplete.
    function selectedItemChange(item) {
      if(item) {
        self.updateSelected(item.id);
        self.myChart.updateSearch(item);
      }
    } // End selectedItemChange()

    // Function that maps a value for each node in the data for the autocomplete
    // input. 
    function loadAll() {
      return data.nodes.map(function (node) {
          node.value = node.name.toLowerCase();
          return node;
      });
    }// End loadAll()

    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(item) {
        return (item.value.indexOf(lowercaseQuery) === 0);
      };
    }// End createFilterFor()
    
  //-----------------------------
  // END SEARCH BOX
  //-----------------------------
  
  //-----------------------------
  // BEGIN CHART
  //-----------------------------
    
    self.makeChart; // Variable for encapsulating chart function
    self.radialPlacement; // Variable for node placement function
    self.activate; // Variable for function that shows the nodes that are active
    self.root; // Variable for the data
    self.myChart;

    // Get the root from the data [NEEDS TO BE DYNAMIC]
    for (var i = 0; i < data.nodes.length; i++) {
      if(data.nodes[i].id == 'innovation-lab-director') {
        self.root = data.nodes[i];
      }
    }

    // Function for the placement of the nodes and links
    self.radialPlacement = function() {
      // Initialize variables for the nodes
      var center, current, increment, place, placement, radialLocation, radius, setKeys, start, values;
      
      values = d3.map(); // Map the key -> location values
      increment = 20; // Distance between each node
      radius = 200; // How large the layout of the chart is
      center = { // Where the drawing begins
        "x": 0,
        "y": 0
      };
      start = -120; // What angle to start drawing nodes
      current = start;
      
      // Function to place the nodes around the root in a circular fashion that
      // returns the x,y coordinates based on angle and radius
      radialLocation = function(center, angle, radius) {
        var x, y;
        x = center.x + radius * Math.cos(angle * Math.PI / 180);
        y = center.y + radius * Math.sin(angle * Math.PI / 180);
        return {
          "x": x,
          "y": y
        };
      }; // End radialLocation()
      
      // Function to get the value of a certain node
      placement = function(key) {
        var value;
        value = values.get(key);
        if (!values.has(key)) {
          value = place(key);
        }
        return value;
      }; // End placement()
      
      // Function to get the location of a node
      place = function(key) {
        var value;
        value = radialLocation(center, current, radius);
        values.set(key, value);
        current += increment;
        
        return value;
      }; // End place()
      
      // Create a ringed layout based on radius, center, increment and a set of nodes
      setKeys = function(keys) {
        var firstCircleCount, firstCircleKeys, secondCircleKeys;
        
        values = d3.map();
        firstCircleCount = 360 / increment;
        
        if (keys.length < firstCircleCount) { // If there are not enough nodes to fill out an entire circle
          increment = 360 / keys.length; // make them fit in one circle
        }
        
        // Get the nodes for the first ring
        firstCircleKeys = keys.slice(0, firstCircleCount);
        // and set them in the ring
        firstCircleKeys.forEach(function(k) {
          return place(k);
        });
        
        // Get the ndoes for the second ring
        secondCircleKeys = keys.slice(firstCircleCount);
        radius = radius + radius / 1.8;
        increment = 360 / secondCircleKeys.length;
        // and set them in the second ring
        return secondCircleKeys.forEach(function(k) {
          return place(k);
        });
      }; // End setKeys()
      
      // --------------------------
      // The following section is a series of functions that serve as combined getters
      // and setters for individual properties of the placement object
      // -------------------------
      
      // Add a keys property that returns the values of the keys passed
      // to the function if there are no arguments and returns 
      // key placements if there are arguments
      placement.keys = function(_) {
        if (!arguments.length) {
          return d3.keys(values);
        }
        setKeys(_);
        
        return placement;
      }; // End placement.keys()
      
      // Add a center property that returns the center of the chart
      // if there are no arguments and sets the center value to 
      // the argument if there is an argument passed
      placement.center = function(_) {
        if (!arguments.length) {
          return center;
        }
        center = _;
        
        return placement;
      }; // End placement.center()
      
      // Add a radius property that returns the radius of the rings if there are
      // no arguments and sets the radius to the argument if there is
      placement.radius = function(_) {
        if (!arguments.length) {
          return radius;
        }
        radius = _;
        
        return placement;
      }; // End placement.radius()
      
      // Add a start property that returns the start location if there are no
      // arguments and sets the start to the argument and current to start.
      placement.start = function(_) {
        if (!arguments.length) {
          return start;
        }
        start = _;
        current = start;
        
        return placement;
      }; // End placement.start()
      
      // Add an increment property that returns the value of increment if
      // there are no arguments and sets the increment to the arguments if there is
      placement.increment = function(_) {
        if (!arguments.length) {
          return increment;
        }
        increment = _;
        return placement;
      }; // End placement.increment()
      
      return placement;
    }; // End radialPlacement()

    // Function that encapsulates the entire chart for reuse, returns a d3 chart object
    self.makeChart = function() {
      var allData, charge, curLinksData, curNodesData, filter, filterLinks, filterNodes, force, forceTick, groupCenters, height, hideDetails, layout, link, linkedByIndex, linksG, mapNodes, moveToRadialLayout, neighboring, network, node, nodeColors, nodeCounts, nodesG, setFilter, setLayout, setupData, showDetails, sort, sortedPositions, strokeFor, tooltip, update, updateCenters, updateLinks, updateNodes, width;
      var div;
      var zoom;
      var drag;
      
      // Set dimensions of chart
      width = 700;
      height = 400;
      
      // Initialize the arrays for the nodes
      allData = [];
      curLinksData = [];
      curNodesData = [];
      linkedByIndex = {};
      // Initialize svg group variables
      nodesG = null;
      linksG = null;
      
      // Initialize node and link pointers
      node = null;
      link = null;
      
      layout = "force"; // Sets layout to force diagram
      filter = "all"; // Sets the initial value of filter to all to show all nodes
      sort = "name"; // Sorts by name at first
      groupCenters = null;
      force = d3.layout.force(); // Set layout to a force diagram
      nodeColors = d3.scale.category20(); // Set the colors of the nodes to a built in d3 color scheme
      
      // Function that sets the force between the nodes
      charge = function(node) {
        return -Math.pow(node.radius, 3.0) / 2;
      }; // End charge()
      
      // Function to initialize chart and its layout
      network = function(selection, data) {
        var chart;
        allData = setupData(data); // Format data with setupData function
        
        zoom = d3.behavior.zoom()
                 .scaleExtent([0.5, 4])
                 .on("zoom", zoomed);
                 
        drag = d3.behavior.drag()
                 .origin(function(d) { return d; })
                 .on("dragstart", dragstarted)
                 .on("drag", dragged)
                 .on("dragend", dragended);
                 
        // Create the svg where the chart will be drawn and the groups for the
        // nodes and links
        chart = d3.select(selection)
                  .append("svg")
                  .attr("width", width)
                  .attr("height", height)
                  .call(zoom);
                  
        linksG = chart.append("g")
                      .attr("id", "links")
                      .call(drag);
                      
        nodesG = chart.append("g")
                      .attr("id", "nodes")
                      .call(drag);
        
        // Define the div for the tooltip.
        div = d3.select("body").append("div")	
                .attr("class", "tooltip")				
                .style("opacity", 0);
        
        // Setup the size where the forces will act inside
        force.size([width, height]);
        
        // Set default settings for layout and filter
        setLayout("force");
        //setFilter("all");
        
        return update();
      }; // End network()
      
      // Function that is called everytime the chart needs updated.
      // Basically redraws based on user input
      update = function() {
        //var positions;
        
        // Filter nodes and links based on the current filter settings
        // curNodesData = filterNodes(allData.nodes);
        // curLinksData = filterLinks(allData.links, curNodesData);
        
        curNodesData = allData.nodes;
        curLinksData = allData.links;
        
        // If the chart is in a radial layout, the nodes need to be rearranged
        if (layout === "tree") {
          //positions = sortedPositions(curNodesData, curLinksData);
          updateCenters(curNodesData);
        }
        
        force.nodes(curNodesData);
        updateNodes();
        
        // If the chart is in a force layout, then always show the links
        if (layout === "force") {
          force.links(curLinksData);
          updateLinks();
        } else { // Otherwise, don't draw the links until the whole chart has drawn
          force.links([]);
          if (link) {
            link.data([]).exit().remove();
            link = null;
          }
        }
        
        return force.start();
      }; // End update()
      
      // Function to toggle between radial and force layouts
      network.toggleLayout = function(newLayout) {
        force.stop();
        setLayout(newLayout);
        
        return update();
      }; // end network.toggleLayout()
      
      
      // network.toggleFilter = function(newFilter) {
      //   force.stop();
      //   setFilter(newFilter);
      //   return update();
      // };
      
      // network.toggleSort = function(newSort) {
      //   force.stop();
      //   setSort(newSort);
      //   return update();
      // };
      
      // Function to update the chart and highlight the node
      // based on the search term
      network.updateSearch = function(searchTerm) {
        var searchRegEx = new RegExp(searchTerm);
        
        return node.each(function(d) {
          var element = d3.select(this);
          
          if (searchTerm.id.length > 0 && (d.id == searchTerm.id)) {
            $(this).d3Click();
            return d.searched = true;
          } else {
            d.searched = false;
            return element.style("fill", function(d) {
              return nodeColors(d.name);
            }).style("stroke-width", 1.0);
          }
        });
      }; // End network.updateSearch()
      
      // Function that resets the searched value to false for all nodes when a
      // user navigates away from the previously searched name
      resetSearch = function() {
        return node.each(function(d) {
          var element = d3.select(this);
          d.searched = false;
          return element.style("fill", function(d) {
            return nodeColors(d.name);
          }).style("stroke-width", 1.0);
        });
      } // End of network.resetSearch()
      
      // Function to remove nodes from chart if data has changed
      network.updateData = function(newData) {
        allData = setupData(newData);
        link.remove();
        node.remove();
        
        return update();
      }; // End network.updateData()
      
      // Function to format data
      setupData = function(data) {
        var circleRadius = 7;
        var nodesMap;
                
        // Set initial x,y values for each node based on the chart's dimensions
        data.nodes.forEach(function(n) {
          var rand;
          
          n.x = rand = Math.floor(Math.random() * width);
          n.y = rand = Math.floor(Math.random() * height);
          
          // Add radius to the node
          return n.radius = circleRadius;
        });
        
        // Map the id's of each node to the node objects
        nodesMap = mapNodes(data.nodes);
        
        // Links are currently mapped between the nodes in JSON so they need to
        // reworked to point at the node objects instead
        data.links.forEach(function(l) {
          l.source = nodesMap.get(l.source);
          l.target = nodesMap.get(l.target);
          
          return linkedByIndex[l.source.id + "," + l.target.id] = 1;
        });
        
        return data;
      }; // end setupData()
      
      // Function to map the id's of each node to the actual node objects 
      mapNodes = function(nodes) {
        var nodesMap;
        nodesMap = d3.map();
        nodes.forEach(function(n) {
          return nodesMap.set(n.id, n);
        });
        
        return nodesMap;
      }; // end mapNodes()
      
      // Function that returns the number of unique attributes in the nodes
      nodeCounts = function(nodes, attr) {
        var counts = {};
        
        nodes.forEach(function(d) {
          var name;
          if (counts[name = d[attr]] == null) {
            counts[name] = 0;
          }
          return counts[d[attr]] += 1;
        });
        
        return counts;
      };
      
      // Function that returns true if there is a link between two nodes
      neighboring = function(a, b) {
        return linkedByIndex[a.id + "," + b.id] || linkedByIndex[b.id + "," + a.id];
      }; // end neighboring()
      
      // Function to filter the nodes that are visible based off the filter
      // filter the user selects
      // filterNodes = function(allNodes) {
      //   var cutoff; // 
      //   var filteredNodes;
      //   var positioncounts;
      //   
      //   filteredNodes = allNodes;
      //   if (filter === "popular" || filter === "obscure") {
      //     positioncounts = allNodes.map(function(d) {
      //       return d.positioncount;
      //     }).sort(d3.ascending);
      //     cutoff = d3.quantile(positioncounts, 0.5);
      //     filteredNodes = allNodes.filter(function(n) {
      //       if (filter === "popular") {
      //         return n.positioncount > cutoff;
      //       } else if (filter === "obscure") {
      //         return n.positioncount <= cutoff;
      //       }
      //     });
      //   }
      //   
      //   // Return the filtered array of nodes.
      //   return filteredNodes;
      // };
      
      // Function to rescale the chart if a user zooms
      zoomed = function() {
        linksG.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        nodesG.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
      }
      
      // Following three functions are used to update chart if a user pans
      dragstarted = function(d) {
        d3.event.sourceEvent.stopPropagation();
        d3.select(this).classed("dragging", true);
      }

      dragged = function(d) {
        d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
      }

      dragended = function(d) {
        d3.select(this).classed("dragging", false);
      }
      
      // Update the node location into rings if the layout is radial
      updateCenters = function(positions) {
        if (layout === "tree") {
          return groupCenters = RadialPlacement().center({
            "x": width / 2,
            "y": height / 2 - 100
          }).radius(300).increment(18).keys(positions);
        }
      }; // End updateCenters()
      
      // Function that removes links based on the filter setting
      // filterLinks = function(allLinks, curNodes) {
      //   curNodes = mapNodes(curNodes);
      //   return allLinks.filter(function(l) {
      //     return curNodes.get(l.source.id) && curNodes.get(l.target.id);
      //   });
      // }; // End filterLinks()
      
      // Function that draws the nodes to the chart and updates what is show
      // if the data has changed
      updateNodes = function() {
        node = nodesG.selectAll("circle.node")
                     .data(curNodesData, function(d) {
                        return d.id;
                     });
        
        node.enter()
            .append("circle")
            .attr("class", "node")
            .attr("id", function(d) {
              return d.id;
            })
            .attr("cx", function(d) {
              return d.x;
            })
            .attr("cy", function(d) {
              return d.y;
            })
            .attr("r", function(d) {
              return d.radius;
            })
            .style("fill", function(d) {
              return nodeColors(d.name);
            })
            .style("stroke", function(d) {
              return strokeFor(d);
            })
            .style("stroke-width", 1.0)
            .on("click", showDetails)
            .on("mouseover", function(d) {		
               div.transition()		
                  .duration(200)		
                  .style("opacity", .9);		
               div.html(d.name)	
                  .style("left", (d3.event.pageX) + "px")		
                  .style("top", (d3.event.pageY - 28) + "px");	
               })					
            .on("mouseout", function(d) {		
               div.transition()		
                  .duration(500)		
                  .style("opacity", 0);	
            });
                
        return node.exit().remove();
      }; // End updateNodes()
      
      // Function that draws the links to the chart and updates what is shown
      // if the data changes
      updateLinks = function() {
        link = linksG.selectAll("line.link")
                     .data(curLinksData, function(d) {
                       return d.source.id + "_" + d.target.id;
                     });
        link.enter()
            .append("line")
            .attr("class", "link")
            .attr("stroke", "#ddd")
            .attr("stroke-opacity", 0.8)
            .attr("x1", function(d) {
              return d.source.x;
            }).attr("y1", function(d) {
              return d.source.y;
            }).attr("x2", function(d) {
              return d.target.x;
            }).attr("y2", function(d) {
              return d.target.y;
            });
            
        return link.exit().remove();
      }; // End updateLinks()
      
      // Function that switches between radial and force layouts
      setLayout = function(newLayout) {
        layout = newLayout;
        if (layout === "force") {
          return force.on("tick", forceTick).charge(-200).linkDistance(50);
        } 
      }; // End setLayout()
      
      // // Function that sets the filter
      // setFilter = function(newFilter) {
      //   return filter = newFilter;
      // };
      // setSort = function(newSort) {
      //   return sort = newSort;
      // };
      
      // Function that sets amount of movement that the nodes make when
      // the chart is updated in the force layout
      forceTick = function(e) {
        node.attr("cx", function(d) {
              return d.x;
            })
            .attr("cy", function(d) {
              return d.y;
            });
            
        return link.attr("x1", function(d) {
                     return d.source.x;
                   })
                   .attr("y1", function(d) {
                     return d.source.y;
                   })
                   .attr("x2", function(d) {
                     return d.target.x;
                   })
                   .attr("y2", function(d) {
                    return d.target.y;
                   });
      }; // End forceTick()
      
      // Function that returns the stroke color for a node
      strokeFor = function(d) {
        return d3.rgb(nodeColors(d.name)).darker().toString();
      }; // End strokeFor()
      
      // Function that runs when a node is clicked. It changes the state based 
      // the nodes id, displays the information of that particular node, and 
      // darkens the links and nodes that neighbor the node clicked
      showDetails = function(d, i) {
        resetSearch();
        self.updateSelected(d.id);
        $state.go('jobs.position', { positionId: d.id });
        
        d3.selectAll(".node").attr("r", 7);
        
        if (link) {
          link.attr("stroke", function(l) {
            if (l.source === d || l.target === d) {
              return "#000";
            } else {
              return "#ddd";
            }
          }).attr("stroke-opacity", function(l) {
            if (l.source === d || l.target === d) {
              return 1.0;
            } else {
              return 0.4;
            }
          });
        }
        
        node.style("stroke", function(n) {
              if (n.searched || neighboring(d, n)) {
                return "#555";
              } else {
                return strokeFor(n);
              }
            })
            .style("stroke-width", function(n) {
              if (n.searched || neighboring(d, n)) {
                return 2.0;
              } else {
                return 1.0;
              }
            })
            .style("fill-opacity", function(n) {
              if (n.searched || neighboring(d, n)) {
                return 1.0;
              } else {
                return 0.4;
              }
            });
        
        return d3.select(this).style("stroke", "black").style("stroke-width", 2.0).style("fill-opacity", 1.0).attr("r", 10);
      }; // End showDetails()
      
      return network;
    }; // End makeChart()

    // Functions that toggles the active class on the buttons
    self.activate = function(group, link) {
      d3.selectAll("#" + group + " a").classed("active", false);
      
      return d3.select("#" + group + " #" + link).classed("active", true);
    };

    $(function() {
      self.myChart = self.makeChart();

      // d3.selectAll("#layouts a").on("click", function(d) {
      //   var newLayout;
      //   newLayout = d3.select(this).attr("id");
      //   self.activate("layouts", newLayout);
      //   
      //   return myChart.toggleLayout(newLayout);
      // });
      
      // d3.selectAll("#filters a").on("click", function(d) {
      //   var newFilter;
      //   newFilter = d3.select(this).attr("id");
      //   activate("filters", newFilter);
      //   
      //   return myChart.toggleFilter(newFilter);
      // });

      self.myChart("#chart", data);
      $("#global-solutions-engineering-vp").d3Click();
    });
    
  //-----------------------------
  // END CHART
  //-----------------------------
  
  //-----------------------------
  // START REFORMAT DATA
  //-----------------------------
    var nodes = data.nodes; 
    
    // Convert flat data into hierarchical data.
    var dataMap = nodes.reduce(function(map,node){
      map[node.name] = node;
      
      return map;
    }, {});

    var treeData = [];
    nodes.forEach(function(node) {
      // Add to parent.
      var parent = dataMap[node.parent];
      if(parent) {
        // Create the child array if it doesn't exist.
        (parent.children || (parent.children = [])).push(node);
      } else {
        // Parent is null or missing.
        treeData.push(node);
      }
    });
    
    BreadcrumbService.setData(treeData);
    
  //-----------------------------
  // END REFORMAT DATA
  //-----------------------------
  
    $.fn.d3Click = function () {
      this.each(function (i, e) {
        var evt = new MouseEvent("click");
        e.dispatchEvent(evt);
      });
    };
  }
})  