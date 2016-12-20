This project is built with the MEAN stack.

AngularJS is used to modularize the features, which is configured in states.js.

Each state in states.js has a template and a component that act as the view and 
controller for that state. 

User input, or the URL, determines which state is loaded in index.html. The views
are nested, with the position view determined by position id and then loaded into the 
jobs view. 

The jobs view is comprised of the search box and autocomplete, the force map coded
in D3.js, and the map help tooltip. The map elements (the nodes and links) are 
bound to the data from the database, so when a change is made to the data the map 
reflects that change.

The position view is comprised of the information about a specific node (after a 
user click) and the edit mode that allows the user to modify field data that pushes
directly to the database.