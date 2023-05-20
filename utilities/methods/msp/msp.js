const networkManager = new NetworkManager();
// define a variable to store the first clicked node
var firstNodeId = null;
var isAddingNode = false;
var draggingNode = false; // Flag to track if a node is currently being dragged

function addNewEdge(from, to, label) {
    // Check if the edge already exists in the dataset
    var edges = network.body.data.edges._data;
    var edgeExists = false;
    for (var edgeId in edges) {
        var edge = edges[edgeId];
        if ((edge.from == from && edge.to == to) || (edge.from == to && edge.to == from)) {
            edgeExists = true;
            break;
        }
    }
    if (!edgeExists) {
        // Add the new edge to the dataset
        var newEdge = { from: from, to: to, label: label };
        edgesDataSet.add(newEdge);
        network.setData({ nodes: nodesDataSet, edges: edgesDataSet });
    }
}
// function to check if two nodes are already connected
function isConnected(nodeA, nodeB, mstEdges) {
    // iterate through the MST edges to find if there is a connection between the given nodes
    var mstEdgesArray = mstEdges.get();
    for (var i = 0; i < mstEdgesArray.length; i++) {
        var edge = mstEdgesArray[i];
        var edgeFrom = edge.parent.from;
        var edgeTo = edge.parent.to;
        if ((edgeFrom === nodeA && edgeTo === nodeB) || (edgeFrom === nodeB && edgeTo === nodeA)) {
            return true; // the nodes are already connected
        }
    }
    return false; // the nodes are not connected
}
// main kruskal algorithm
function kruskalAlgorithm(network){
        // Get the connected edges and nodes from the Network object
        var edges = network.body.data.edges.get();
        var nodes = network.body.data.nodes.get();
        console.log(edges);
        var mstEdges = new vis.DataSet();
        // create a new array with edge objects
        var edgesArray = edges;
        // sort the array by label value in ascending order
        edgesArray.sort((a, b) => a.label - b.label);

        // create an array to keep track of the parent of each node
        var parent = [];

        // initialize the parent array with each node being its own parent
        for (var i = 1; i <= nodes.length; i++) {
            parent[i] = i;
        }

        // define a function to find the parent of a node in the tree
        function find(node) {
            if (parent[node] === node) {
                return node;
            }
            return find(parent[node]);
        }

        // loop through each edge in the sorted array
        for (var i = 0; i < edgesArray.length; i++) {
            // get the nodes connected by the edge
            var from = edgesArray[i].from;
            var to = edgesArray[i].to;

            // find the parents of the connected nodes
            var parentFrom = find(from);
            var parentTo = find(to);

            // if the nodes have different parents, add the edge to the minimum spanning tree
            if (parentFrom !== parentTo && !isConnected(parentFrom, parentTo, mstEdges)) {
                var mstEdge = Object.assign({}, edgesArray[i], { parent: { from: parentFrom, to: parentTo } });
                mstEdges.add(mstEdge);
                // update the parent of the smaller tree to the parent of the larger tree
                if (parentFrom < parentTo) {
                    parent[parentTo] = parentFrom;
                } else {
                    parent[parentFrom] = parentTo;
                }
            }
        }
        return mstEdges;
}
// create a new dataset for the minimum spanning tree edges
var mstEdges = new vis.DataSet();
var network = null;
var networkNodes = null;
var networkEdges = null;
// Create new network
async function node() {
    networkManager.createNetwork("mynetwork");
  
    const nodes = [];
    const edges = [];
  
    nodes.forEach(node => networkManager.addNode(node));
    edges.forEach(edge => networkManager.addEdge(edge));

    network = networkManager.network;
    networkNodes = networkManager.nodes;
    networkEdges = networkManager.edges;

    networkManager.printData();
}
node();

//function that triggers the highlighting of the edges and nodes based on Kruskal's
async function highlightEdges() {
    networkManager.printData();
    mstEdges = kruskalAlgorithm(network);
    console.log(mstEdges.get());
    networkNodes.update(networkNodes.get().map(function (node) {
        node.color = {
            background: '#97C2FC',
            border: '#2B7CE9',
        };
        node.font = {
            color: 'black'
        };
        return node;
    }));
    
    networkEdges.update(networkEdges.get().map(function (edge) {
        edge.color = 'lightblue';
        edge.highlight = 'lightblue';
        return edge;
        }));

    // highlight the edges in red that are part of the minimum spanning tree
    var mstEdgesArray = mstEdges.get();
    for (var i = 0; i < mstEdgesArray.length; i++) {
        await new Promise(resolve => {
            setTimeout(() => {
                var edgeId = mstEdgesArray[i].id;
                var edge = network.body.edges[edgeId];
                edge.setOptions({
                    color: 'red',
                    highlight: 'red'
                });

                // get the parent of the edge and highlight it
                var parentFrom = mstEdgesArray[i].parent.from;
                var parentTo = mstEdgesArray[i].parent.to;
                var parentNodeFrom = network.body.nodes[parentFrom];
                var parentNodeTo = network.body.nodes[parentTo];
                if (parentNodeFrom && parentNodeTo) {
                    parentNodeFrom.setOptions({
                        color: 'red',
                        highlight: 'red',
                        font:{color:'white'}
                    });
                    parentNodeTo.setOptions({
                        color: 'red',
                        highlight: 'red',
                        font:{color:'white'}
                    });
                }
                network.redraw(); // add this line to refresh the graph
                resolve();
            }, 2000);
        });
    }
}
// Call the function when the button is clicked
document.getElementById('highlightBtn').addEventListener('click', highlightEdges);