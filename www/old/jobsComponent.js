


mapApp.component('jobs', {
  bindings: { jobs: '<' },
  templateUrl: 'templates/jobs.html',
  
  controller : function($timeout, $q, $log, $state) {
    var self = this;
    var data = self.jobs;
    
    // BEGIN tooltip
    self.demo = {
      showTooltip : false,
      tipDirection : ''
    };
    // END tooltip
    
    // BEGIN search box
    self.simulateQuery = false;
    self.isDisabled = false;
    self.items = loadAll();
    self.querySearch = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.selectedId;

    function querySearch (query) {
      var results = query ? data.filter(createFilterFor(query)) : data,
         deferred;
      if (self.simulateQuery) {
       deferred = $q.defer();
       $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
       return deferred.promise;
      } else {
        return results;
      }
    }

    function selectedItemChange(item) {
      self.selectedId = item.id;
      if(self.selectedId != undefined) {
        var paths = searchTree(root, []);
        if(typeof(paths) !== 'undefined') {
          for(var i = 1;i < paths.length - 1;i++) {
            toggle(paths[i]);
            update(paths[i]);
          }
          d3.select('#' + selected).classed('active', true);
        }
      }
      $state.go('jobs.position', { positionId: self.selectedId });
    }

    function loadAll() {
      return data.positions.map( function (position) {
          position.value = position.name.toLowerCase();
          return position;
      });
    }

    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(item) {
        return (item.value.indexOf(lowercaseQuery) === 0);
      };
    }
    // END search box
    
    // BEGIN tree
    // Convert flat data into hierarchical data.
    var dataMap = data.reduce(function(map,node){
      map[node.name] = node;
      
      return map;
    }, {});
    
    var treeData = [];
    data.forEach(function(node) {
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
    
    // Set up dimensions of tree
    var margin = {
      top: 150, 
      right: 120, 
      bottom: 20, 
      left: 250
    };
    var width = 1100 - margin.right - margin.left;
    var height = 400 - margin.top - margin.bottom;
    
    var i = 0;
    var duration = 50;
        
    // Create the tree and assign size and a separation function for the nodes so they don't overlap
    var tree = d3.layout.tree()
                 .separation(function(a, b) { 
                   return ((a.parent == root) && (b.parent == root)) ? 3 : 3; 
                 })
                 .size(height, width);
    
    // Set up the link function to later draw the Bezier curves.
    var diagonal = d3.svg.diagonal()
                         .projection(function(d) { return [d.y, d.x]; });
    
    // Make the svg inside the #tree div and assign dimensions.
    var svg = d3.select('#tree')
                .append('svg')
                .attr('width', width + margin.right + margin.left)
                .attr('height', height + margin.top + margin.bottom)
                .attr('background-color', '#F6F6F6')
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                .call(d3.behavior.zoom()
                  .scaleExtent([0.5, 5])
                  .on('zoom', zoom)
                );
                    
    // Assign the root of the tree which is the top most parent.
    root = treeData[0];
    
    // Assign the root's position
    root.x0 = height / 2;
    root.y0 = 0;
    
    // A function that toggles all the nodes in the tree with children.
    function toggleAll(d) {
      if(d.children) { // If the node has children,
        d.children.forEach(toggleAll); // toggle all of its child nodes.
        toggle(d);
      }
    }
    
    // Apply the toggle all function to the tree.
    root.children.forEach(toggleAll);
    
    update(root);
    
    // Function to update the dimensions of the tree when nodes are toggled based on
    // how many nodes are visible
    function update(source) {
      // Compute the new height of the tree.
      var levelWidth = [1]; // Starts with 1 node at level one because it is the top.
      
      // Function to count how many children there are in each level.
      var childCount = function(level, n) {
        if(n.children && n.children.length > 0) { // If n has children and there is at least 1 child,
          if(levelWidth.length <= level + 1) { // add 0 to levelWidth if there are no children in that node,
            levelWidth.push(0);
          }
        
          levelWidth[level + 1] += n.children.length; // add the number of children in the node at the right level,
          n.children.forEach(function(d) { // and apply childCount() to each child continue counting down the levels
            childCount(level + 1, d);
          });
        }
      };
      
      // Call childCount() and start at the top with the root node 
      childCount(0, root);
      
      // Get the highest number from levelWidth to change the height of the tree    
      var newHeight = d3.max(levelWidth) * 20;
      tree = tree.size([newHeight, width]);
      
      // Compute the new tree layout.
      var nodes = tree.nodes(root).reverse();
      
      // Assign the length of the nodes (separation between levels).
      nodes.forEach(function(d) { d.y = d.depth * 180; });
      
      // Update the nodes
      var node = svg.selectAll('g.node')
                    .data(nodes, function(d) { 
                      return d.id || (d.id = ++i); 
                    });
      
      // Enter any new nodes at the parent's previous position.
      var nodeEnter = node.enter()
                          .append('g')
                          .attr('class', 'node')
                          .attr('id', function(d) {
                            return d.id;
                          })
                          .attr('transform', function(d) { 
                            return 'translate(' + source.y0 + ',' + source.x0 + ')'; 
                          })
                          .on('click', function(d) {   
                            if (d3.event.shiftKey) {
                              d3.selectAll('.node').classed('active', false);
                              d3.select(this).classed('active', true);
                              $state.go('jobs.position', { positionId: d.id});
                            } else {
                              toggle(d); 
                              update(d); 
                            }
                          });
      
      // Add the circles, they will be blue if that node has children and white otherwise
      // During transition styles (circles are small during transition)
      nodeEnter.append('circle')
               .attr('r', 1e-6)
               .style('fill', function(d) { 
                 return d._children ? '#00A1DF' : '#fff'; 
               });
      
      // Add the text next to the nodes
      // During transition styles (text is transparent during transition)
      nodeEnter.append('text')
               .attr('x', function(d) { 
                 return d.children || d._children ? -10 : 10; 
               })
               .attr('dy', '.35em')
               .attr('text-anchor', function(d) { 
                 return d.children || d._children ? 'end' : 'start'; 
               })
               .text(function(d) { return d.name; })
               .style('fill-opacity', 1e-6);
      
      // Transition nodes to their new position.
      var nodeUpdate = node.transition()
                           .duration(duration)
                           .attr('transform', function(d) { 
                             return 'translate(' + d.y + ',' + d.x + ')'; 
                           });
      
      // After transition styles of circles
      nodeUpdate.select('circle')
                .attr('r', 4.5)
                .style('fill', function(d) { 
                  return d._children ? '#00A1DF' : '#fff'; 
                });
      
      // After transition styles of text
      nodeUpdate.select('text')
                .style('fill-opacity', 1);
      
      // Transition exiting nodes to the parent's new position.
      var nodeExit = node.exit()
                         .transition()
                         .duration(duration)
                         .attr('transform', function(d) { 
                           return 'translate(' + source.y + ',' + source.x + ')'; 
                         })
                         .remove();
      
      // During transition styles of circles
      nodeExit.select('circle')
              .attr('r', 1e-6);
      
      // During transition styles of text
      nodeExit.select('text')
              .style('fill-opacity', 1e-6);
      
      // In addition to the nodes, the links need to be drawn to the page and connect
      // the nodes with each other
      var link = svg.selectAll('path.link')
                    .data(tree.links(nodes), function(d) { return d.target.id; });
      
      // Enter any new links at the parent's previous position.
      link.enter()
          .insert('svg:path', 'g')
          .attr('class', 'link')
          .attr('d', function(d) {
            var o = {x: source.x0, y: source.y0};
            return diagonal({source: o, target: o});
          })
          .transition()
          .duration(duration)
          .attr('d', diagonal);
      
      // Transition links to their new position.
      link.transition()
          .duration(duration)
          .attr('d', diagonal);
      
      // Transition exiting nodes to the parent's new position.
      link.exit()
          .transition()
          .duration(duration)
          .attr('d', function(d) {
            var o = {x: source.x, y: source.y};
            return diagonal({source: o, target: o});
          })
          .remove();
      
      // Stash the old positions for transition.
      nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });
        
    }
     
    // Toggle children.
    function toggle(d) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
    }

    // Zoom function to scale and translate the tree
    var zoom = function() {
      svg.attr("transform",
      "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
  }
  
  // Function to search tree for selected object based on what job the user searched for on
  // the previous page
  function searchTree(node, path) {
    if(node.id === self.selected){ // If search is found return, add the object to the path and return it
      path.push(node);
      return path;
    } else if(node.children || node._children) { // If node has open or collapsed children,
      var children = (node.children) ? node.children : node._children; // assign the children as either open or collapsed,
      for(var i = 0;i < children.length;i++) { // cycle through the children of this node,
        path.push(node);// assume this path is the right one
        var found = searchTree(children[i], path); // and recursively call this function to find the searched node
        if(found) { // If found this should return the bubbled-up path from the first if statement
          return found;
        }
        else { // Otherwise, remove this parent from the path and continue iterating
          path.pop();
        }
      }
    } else { // Not the right object, return false so it will continue to iterate in the loop
      return false;
    }
  }
  
  if(self.selectedId != undefined) {
    var paths = searchTree(root, []);
    if(typeof(paths) !== 'undefined') {
      for(var i = 1;i < paths.length - 1;i++) {
        toggle(paths[i]);
        update(paths[i]);
      }
      d3.select('#' + selected).classed('active', true);
    }
  }
}
})  