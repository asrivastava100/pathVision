# pathVision

Welcome to pathVision!

This is a simple tool that visualises path finding algorithms. The aim of such algorithms is to find the shortest path between two nodes on a graph. 

We explore three algorithms:

1. Breadth First Search.
2. Depth First Search.
3. Dijkstra's Algorithm.

The graph that we deal with consists of a grid of squares (nodes). Each node has four neighbours (or three for corner nodes). The graph is unweighted and undirected. 

Some key points to note:

- Breadth First Search does not take into account node weights (treats all nodes as equal) but does guarantee the shortest path.
- Dijkstra's Algorithm takes into account node weights and guarantees the shortest path.
- Depth First Search does not take into account node weights and does not guarantee the shortest path. 


It is interesting to see that in the case of an unweighted graph, both Dijkstra and Breadth First Search give the shortest path. In most cases, the nodes that they traverse on the way to finding the shortest path are also the same. 

In almost all cases, depth first search will traverse far more nodes than Breadth First Search and Dijkstra's Algorithm. However, there is one case where depth first search traverses fewer nodes than Breadth First Search. This is the case where the start node and end node are on the same branch in the graph. 


The tool offers four example graphs:

1. Spiral.
2. Random.
3. Pyramid.
4. Face.

To use these, the user needs to select an algorithm as well as selecting one of the examples above. Click the 'find path' and see the shortest path as well as nodes traversed.

The tool also allows the user to create their custom graph and find the shortest paths if they exist. 

For Dijkstra's algorithm, the tool allows the user to add weighted nodes. This can be done by double clicking on any node. All nodes in the graph (with the exception of wall nodes) have an initial weight set to 1. Creating a weighted node means that this particular node will have node weight 4. Wall nodes have a weight of infinity (they are unreachable). 

The user can compare the paths given by Breadth First Search and Dijkstra's Algorithm in this case. Since BFS ignores weights, it will most probably end up travelling one or more weighted nodes (since BFS is unweighted) on the way to finding the shortest path. This is where Dijkstra's Algorithm shows its true power. It will take into account the weights of these nodes and give the shortest path. 

I will try to add more algorithms in the future as well as try to further improve the code but I do hope that you find using this tool a lot of fun and try to further explore these and other path finding algorithms!

Please do not hesitate to contact me should you have any questions, suggestions to improve the code further, or to add any sort of functionality.

Thanks!
