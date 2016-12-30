#Relationship Map App
This is a web app meant to lay out and describe the various relationships in an
organization. This project is built with the MEAN stack.

AngularJS is used to modularize the features into states, which are configured in states.js.

Each state in states.js has a template and a component that act as the view and 
controller for that state. 

User input, or the URL, determines which state is loaded in index.html. There are
three views: jobs, position, and add. 

The jobs view is comprised of the search box and autocomplete, the force map coded
in D3.js, and the map help tooltip. The map elements (the nodes and links) are 
bound to the data from the database, so when a change is made to the data the map 
reflects that change.

The position view is comprised of the information about a specific node (after a 
user click or search) and the edit mode that allows the user to modify field data that pushes directly to the database.

The add view is comprised of a form that user can fill out to add a new position into the database. The changes will reflect on the map. 

This project is not complete.

##Future Todos
>Highlight nodes that have links to the role but not necessarily the ones linked directly to it using primary and secondary relationships

>Add tooltips for each form input

>Add form validation

>Add DELETE functionality