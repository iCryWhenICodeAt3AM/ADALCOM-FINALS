//variables
const networkManager = new NetworkManager();
var startNodeId = 1; // ID of the start node
var network = null;
var networkNodes = null;
var networkEdges = null;

//Dijkstra Algorithm
function dijkstraAlgorithm(network, startNodeId) {
    const nodes = network.body.data.nodes;
    const edges = network.body.data.edges;
    const distances = {};
    const visited = {};
    const previous = {};
    
    // Initialize distances with Infinity and previous with null for all nodes
    for (const node of nodes.getIds()) {
      distances[node] = Infinity;
      previous[node] = null;
    }
    
    distances[startNodeId] = 0; // Set the distance of the start node to 0
    
    while (true) {
      let closestNode = null;
      let closestDistance = Infinity;
      
      // Find the closest unvisited node
      for (const node of nodes.getIds()) {
        if (!visited[node] && distances[node] < closestDistance) {
          closestNode = node;
          closestDistance = distances[node];
        }
      }
      
      if (closestNode === null) {
        // No more unvisited nodes
        break;
      }
      
      visited[closestNode] = true; // Mark the node as visited
      
      // Update distances to neighbors
      const neighbors = network.getConnectedNodes(closestNode);
      for (const neighbor of neighbors) {
        const edgeId = network.getConnectedEdges(closestNode, neighbor)[0];
        const edgeLabel = edges.get(edgeId).label;
        const distance = closestDistance + parseInt(edgeLabel);
        
        if (distance < distances[neighbor]) {
          distances[neighbor] = distance;
          previous[neighbor] = closestNode;
        }
      }
    }
    
    // Construct the shortest path from start to each node
    const shortestPaths = {};
    for (const node of nodes.getIds()) {
      if (distances[node] === Infinity) {
        // Node is unreachable
        shortestPaths[node] = null;
      } else {
        shortestPaths[node] = constructPath(previous, node);
      }
    }
    
    return shortestPaths;
  }
  
  // Helper function to construct the shortest path from start to a given node
  function constructPath(previous, node) {
    const path = [];
    let current = node;
    
    while (current !== null) {
      path.unshift(current);
      current = previous[current];
    }
    
    return path;
}

// Create new network
async function node() {
    networkManager.createNetwork("mynetwork");
  
    const nodes = [
      { id: 1, label: "A" },
      { id: 2, label: "B" },
      { id: 3, label: "C" },
      { id: 4, label: "D" },
      { id: 5, label: "E" }
    ];
    const edges = [
      { from: 1, to: 2, label: "20" },
      { from: 2, to: 3, label: "30" },
      { from: 3, to: 4, label: "10" },
      { from: 4, to: 2, label: "50" },
      { from: 4, to: 5, label: "10" },
      { from: 5, to: 1, label: "25" }
    ];
  
    nodes.forEach(node => networkManager.addNode(node));
    edges.forEach(edge => networkManager.addEdge(edge));

    network = networkManager.network;
    networkNodes = networkManager.nodes;
    networkEdges = networkManager.edges;
    
    document.getElementById("highlightBtn").addEventListener("click", highlightEdges);
}
node();
async function highlightEdges() {
  // Ask the user where to start using a prompt based on node value
  const startNodeLabel = prompt("Enter the label of the starting node:");

  // Find the node ID based on the entered label
  let startNode = null;
  networkNodes.forEach(function(node) {
    if (node.label === startNodeLabel) {
      startNode = node;
    }
  });

  if (!startNode) {
    alert("Invalid starting node label!");
    return;
  }

  // Set the starting node ID
  startNodeId = startNode.id;

  const shortestPaths = dijkstraAlgorithm(network, startNodeId);
  var buildString = ``;
  // Print shortest paths
  // Get all edge IDs
  var edgeIds = networkEdges.getIds();
  for (const node in shortestPaths) {
    //print the result of dijkstra algorithm
    buildString += `Shortest path to node ${networkNodes.get(parseInt(node)).label}: ${shortestPaths[node].map(nodeId => networkNodes.get(parseInt(nodeId)).label).join(" -> ")}\n`;        
    document.getElementById("textarea").value = buildString;
    document.getElementById("indicator").value = `Tracker: ${startNode.label} to ${networkNodes.get(parseInt(node)).label}`;
    //
    // Find the edge ID with matching parentFrom and parentTo
    var edgeIdsToHighlight = [];

    for (var i = 0; i < edgeIds.length; i++) {
      var foundEdges = [];
      var path = shortestPaths[node];

      for (var j = 0; j < path.length - 1; j++) {
        var edge = networkManager.edges.get(edgeIds[i]);
        if (edge.from == path[j] && edge.to == path[j + 1] || edge.to == path[j] && edge.from == path[j + 1] ) {
          foundEdges.push(edgeIds[i]);
          console.log(edgeIds[i]);
          break;
        }
      }

      if (foundEdges.length == 1) {
        edgeIdsToHighlight.push(foundEdges[0]);
      }
    }
    console.log("Highlight", edgeIdsToHighlight);
    // Highlight the collected edges to red
    for (var i = 0; i < edgeIdsToHighlight.length; i++) {
      var edge = networkManager.edges.get(edgeIdsToHighlight[i]);
      edge.color = 'red';
      edge.highlight = 'red';
      networkManager.edges.update(edge);
    }

    // Delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Reset the color of all edges
    const allEdges = networkManager.edges.get();
    for (var i = 0; i < allEdges.length; i++) {
      allEdges[i].color = { color: 'lightblue', highlight: 'lightblue' };
    }

    // Update all edges at once
    networkManager.edges.update(allEdges);

  }
  networkManager.printData();
}
