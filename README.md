# ggr472-project

<h1>GGR472: Developing Web Maps</h1>

Our final group project.

<h2>Context</h2>
An interactive web map displaying environmental risk across Ontario, Canada. 

Data included in this analysis are:
1. Average PM2.5 concentrations (fine particular matter)
2. Water quality at 21 processing facilities
3. Location of federal contaminated sites
4. Percentanges of minorites, immigrants, and low income earners against the general population

There are also two (2) sets of data of which are results of analysis on the above four (4).

<h2>Instructions</h2>

There are many ineractive parts of the webmap. The clickable elements are
1. The buttons in the navigation bar located the top of the site
2. The buttons in the submenus and sub-submenus
3. The quartile colorings of legends for their respective layers
4. The map itself can be moved around by dragging

There are many hoverable interavtive elements
1. Data visualizations in the map can be hovered over to show underlying data
2. Small information signs will display help messages and context for data

<h2>Loading Time</h2>

Mapbox seems to have a bug on slower computers wherer any form of accumulation using the `addSource` function will be fatal. To counteract this, long period of time given to each `addSource` call is lengthy. This creating a loading time or around twenty (20) seconds.

