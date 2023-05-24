//variables
const networkManager = new NetworkManager();
var startNodeId = 1; // ID of the start node
var network = null;
var networkNodes = null;
var networkEdges = null;

//Dijkstra Algorithm
function dijkstraAlgorithm(network, startNodeId, targetNodeId) {
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
    const connectedEdges = network.getConnectedEdges(closestNode);
    for (const edgeId of connectedEdges) {
      const edge = edges.get(edgeId);
      const neighbor = edge.from === closestNode ? edge.to : edge.from;
      const distance = closestDistance + parseInt(edge.label);

      if (distance < distances[neighbor]) {
        distances[neighbor] = distance;
        previous[neighbor] = closestNode;
      }
    }
  }

  // Construct the shortest path from start to target node
  const shortestPath = constructPath(previous, targetNodeId);

  return shortestPath;
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
      {
          "id": 1,
          "label": "1",
          "x": -190.16161616161608,
          "y": 27.38241792929288
      },
      {
          "id": 2,
          "label": "2",
          "x": -95.21212121212113,
          "y": -58.47616792929297
      },
      {
          "id": 3,
          "label": "5",
          "x": 78,
          "y": -59
      },
      {
          "id": 4,
          "label": "9",
          "x": 183,
          "y": 30
      },
      {
          "id": 5,
          "label": "3",
          "x": -88,
          "y": 91
      },
      {
          "id": 6,
          "label": "4",
          "x": -192,
          "y": 176
      },
      {
          "id": 7,
          "label": "7",
          "x": -83.09090909090902,
          "y": 269.8066603535353
      },
      {
          "id": 8,
          "label": "6",
          "x": 38,
          "y": 178
      },
      {
          "id": 9,
          "label": "8",
          "x": 82.56565656565662,
          "y": 91.01878156565651
      }
  ];
    const edges = [
      {
          "from": 1,
          "to": 2,
          "label": "2",
          "id": "ca49f90e-a8f7-4741-bf39-6493d920a1a3",
          "color": {
              "color": "lightblue",
              "highlight": "lightblue"
          },
          "highlight": "red"
      },
      {
          "from": 1,
          "to": 5,
          "label": "5",
          "id": "6724a346-f7a7-41e4-b8cc-99c190e27723",
          "color": {
              "color": "lightblue",
              "highlight": "lightblue"
          },
          "highlight": "red"
      },
      {
          "from": 1,
          "to": 6,
          "label": "2",
          "id": "9b0ffd74-6d37-4d54-a0bc-884482438184",
          "color": {
              "color": "lightblue",
              "highlight": "lightblue"
          },
          "highlight": "red"
      },
      {
          "from": 6,
          "to": 5,
          "label": "3",
          "id": "c0cefd64-43d9-43ca-923c-db066b0e4a22",
          "color": {
              "color": "lightblue",
              "highlight": "lightblue"
          }
      },
      {
          "from": 6,
          "to": 7,
          "label": "2",
          "id": "328fd6f5-1c4e-46ab-ba7f-dfd6523aaa6a",
          "color": {
              "color": "lightblue",
              "highlight": "lightblue"
          },
          "highlight": "red"
      },
      {
          "from": 7,
          "to": 8,
          "label": "2",
          "id": "ef1524cf-9e59-46cf-b9ca-21a2dc6ee9e9",
          "color": {
              "color": "lightblue",
              "highlight": "lightblue"
          },
          "highlight": "red"
      },
      {
          "from": 8,
          "to": 5,
          "label": "1",
          "id": "bc3ec9f7-c83a-45d3-bb55-f1b2c944e555",
          "color": {
              "color": "lightblue",
              "highlight": "lightblue"
          }
      },
      {
          "from": 5,
          "to": 9,
          "label": "1",
          "id": "a027a551-a648-41a2-8669-8f77ccf2878d",
          "color": {
              "color": "lightblue",
              "highlight": "lightblue"
          },
          "highlight": "red"
      },
      {
          "from": 8,
          "to": 9,
          "label": "3",
          "id": "dcdb1ca3-d490-470f-9ed7-cbaaf055ee03",
          "color": {
              "color": "lightblue",
              "highlight": "lightblue"
          }
      },
      {
          "from": 9,
          "to": 4,
          "label": "1",
          "id": "44f78828-a509-464b-8ba1-d5b53413d87c",
          "color": {
              "color": "lightblue",
              "highlight": "lightblue"
          },
          "highlight": "red"
      },
      {
          "from": 4,
          "to": 3,
          "label": "7",
          "id": "a6de5f15-4e6d-4488-b4ce-13364072d6cf",
          "color": {
              "color": "lightblue",
              "highlight": "lightblue"
          }
      },
      {
          "from": 3,
          "to": 2,
          "label": "1",
          "id": "cff7cfbe-c33c-4e8c-a788-4b502c1354ff",
          "color": {
              "color": "lightblue",
              "highlight": "lightblue"
          },
          "highlight": "red"
      },
      {
          "from": 3,
          "to": 5,
          "label": "1",
          "id": "a6910c19-d1c4-41f5-8be5-7d83afc2cb04",
          "color": {
              "color": "lightblue",
              "highlight": "lightblue"
          }
      },
      {
          "from": 2,
          "to": 5,
          "label": "3",
          "id": "a95e2354-234d-4499-bb86-696514f884fa",
          "color": {
              "color": "lightblue",
              "highlight": "lightblue"
          }
      }
  ];
  
    nodes.forEach(node => networkManager.addNode(node));
    edges.forEach(edge => networkManager.addEdge(edge));

    network = networkManager.network;
    networkNodes = networkManager.nodes;
    networkEdges = networkManager.edges;
    
    document.getElementById("highlightBtn").addEventListener("click", highlightPath);
}
node();
async function highlightPath() {
  // Ask the user for the starting node label
  const startNodeLabel = prompt("Enter the label of the starting node:");

  // Find the node ID based on the entered label
  let startNodeId = null;
  networkNodes.forEach(function(node) {
    if (node.label === startNodeLabel) {
      startNodeId = node.id;
    }
  });

  if (!startNodeId) {
    alert("Invalid starting node label!");
    return;
  }

  // Ask the user for the target node label
  const targetNodeLabel = prompt("Enter the label of the target node:");

  // Find the node ID based on the entered label
  let targetNodeId = null;
  networkNodes.forEach(function(node) {
    if (node.label === targetNodeLabel) {
      targetNodeId = node.id;
    }
  });

  if (!targetNodeId) {
    alert("Invalid target node label!");
    return;
  }

  // Run Dijkstra's algorithm to find the shortest path
  const shortestPath = dijkstraAlgorithm(network, startNodeId, targetNodeId);

  if (shortestPath === null) {
    console.log("No path found from the starting node to the target node.");
    return;
  }

  const textarea = document.getElementById("textarea");

  textarea.value = `Node ${startNodeLabel} to Node ${targetNodeLabel}: ${shortestPath.map(nodeId => networkNodes.get(nodeId).label).join(" -> ")}`;

  // Highlight the nodes and edges along the shortest path
  const highlightedNodeIds = new Set();
  const highlightedEdgeIds = new Set();

  for (let i = 0; i < shortestPath.length - 1; i++) {
    const currentNodeId = shortestPath[i];
    const nextNodeId = shortestPath[i + 1];

    // Highlight the node
    const currentNode = networkNodes.get(currentNodeId);
    currentNode.color = "red";
    currentNode.highlight = "red";
    highlightedNodeIds.add(currentNodeId);
    networkNodes.update(currentNode);

    // Highlight the node
    const nextNode = networkNodes.get(nextNodeId);
    nextNode.color = "red";
    nextNode.highlight = "red";
    highlightedNodeIds.add(nextNode);
    networkNodes.update(nextNode);

    // Find the edges connected to the current node
    const edges = network.getConnectedEdges(currentNodeId);

    // Highlight the edge to the next node
    const edgeToNextNodeId = edges.find(edgeId => {
      const edge = networkEdges.get(edgeId);
      return edge.to === nextNodeId || edge.from === nextNodeId;
    });

    const edgeToNextNode = networkEdges.get(edgeToNextNodeId);
    edgeToNextNode.color = "red";
    edgeToNextNode.highlight = "red";
    highlightedEdgeIds.add(edgeToNextNodeId);
    networkEdges.update(edgeToNextNode);

    // Delay before next step
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Reset the color of nodes and edges
  highlightedNodeIds.forEach(nodeId => {
    const node = networkNodes.get(nodeId);
    node.color = "lightblue";
    node.highlight = "lightblue";
    networkNodes.update(node);
  });

  highlightedEdgeIds.forEach(edgeId => {
    const edge = networkEdges.get(edgeId);
    edge.color = "lightblue";
    edge.highlight = "lightblue";
    networkEdges.update(edge);
  });

  // Reset the color of the target node
  const targetNode = networkNodes.get(targetNodeId);
  targetNode.color = "lightblue";
  targetNode.highlight = "lightblue";
  networkNodes.update(targetNode);

}



