// Variables
const networkManager = new NetworkManager();
const textarea = document.getElementById("textarea");
var network = null;
var networkNodes = null;
var networkEdges = null;

function getConnectedEdges(nodeId) {
  const connectedEdges = [];
  
  networkManager.edges.forEach(edge => {
    if (edge.from === nodeId || edge.to === nodeId) {
      connectedEdges.push(edge.id);
    }
  });
  
  return connectedEdges;
}

function getAdjacencyList() {
  // Create adjacency list (basically list of neighbors)
  const adjacencyList = new Map();
  
  // Iterate over the edges and construct the adjacency list
  networkEdges.forEach(edge => {
    const { from, to } = edge;
    if (adjacencyList.has(from)) {
      adjacencyList.get(from).push(to);
    } else {
      adjacencyList.set(from, [to]);
    }
    if (adjacencyList.has(to)) {
      adjacencyList.get(to).push(from);
    } else {
      adjacencyList.set(to, [from]);
    }
  });
  
  return adjacencyList;
}

// Print adjacency matrix to textarea log
function printMatrix(adjacencyList) {
  textarea.value += `Neighbors:\n`;
  for (const [node, neighbors] of adjacencyList) {
    textarea.value += `Node ${networkManager.nodes.get(parseInt(node)).label}: ${neighbors.map(neighbor => networkManager.nodes.get(parseInt(neighbor)).label)}\n`;
  }
}

// Create new network
async function createNetwork() {
  networkManager.createNetwork("mynetwork");
  
  const nodes = [];
  
  const edges = [];
  
  nodes.forEach(node => networkManager.addNode(node));
  edges.forEach(edge => networkManager.addEdge(edge));
  
  network = networkManager.network;
  networkNodes = networkManager.nodes;
  networkEdges = networkManager.edges;
  
  console.log("Adjacency List:", getAdjacencyList());
  // ...
}

// Highlight the current node and its connected edges and neighbors
// Highlight the current node and its connected edges and neighbors
async function highlightNode(nodeId) {
  const connectedEdges = getConnectedEdges(nodeId);

  // Highlight the current node
  var nodeData = networkManager.nodes.get(nodeId);
  nodeData.color = 'red';
  nodeData.highlight = 'red';
  networkManager.nodes.update(nodeData);

  // Highlight the connected edges
  for (const edgeId of connectedEdges) {
    const edgeData = networkManager.edges.get(edgeId);
    edgeData.color = 'red';
    edgeData.highlight = 'red';
    networkManager.edges.update(edgeData);
  }

  // Highlight the neighbor nodes
  const neighbors = getAdjacencyList().get(nodeId);
  for (const neighbor of neighbors) {
    var neighborData = networkManager.nodes.get(neighbor);
    neighborData.color = 'red';
    neighborData.highlight = 'red';
    networkManager.nodes.update(neighborData);
  }

  // Wait for 2 seconds
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Reset the colors back to lightblue
  nodeData.color = 'lightblue';
  nodeData.highlight = 'lightblue';
  networkManager.nodes.update(nodeData);

  for (const edgeId of connectedEdges) {
    const edgeData = networkManager.edges.get(edgeId);
    edgeData.color = 'lightblue';
    edgeData.highlight = 'lightblue';
    networkManager.edges.update(edgeData);
  }

  for (const neighbor of neighbors) {
    var neighborData = networkManager.nodes.get(neighbor);
    neighborData.color = 'lightblue';
    neighborData.highlight = 'lightblue';
    networkManager.nodes.update(neighborData);
  }
}


// Checker for Eulerian
async function isEulerian(graph) {
  const degrees = new Map();

  // Calculate the degree of each vertex
  for (const [node, edges] of graph.entries()) {
    degrees.set(node, edges.length);
  }
  console.log(parseInt(degrees.size));

  // Check if all vertices have an even degree
  for (const [node, degree] of degrees.entries()) {
    await highlightNode(node); // Highlight the current node and its connections

    if (degree % 2 !== 0) {

      return false;
    }
  }

  return true;
}

function isHamiltonian(graph) {
  // Get the vertices from the graph
  const vertices = Array.from(graph.keys());

  function isHamiltonianPathUtil(path, visited) {
    // If the path includes all vertices and forms a Hamiltonian circuit,
    // check if the last node has an edge to the start node
    if (path.length === vertices.length) {
      const lastNode = path[path.length - 1];
      const startNode = path[0];
      if (graph.get(lastNode).includes(startNode)) {
        return true;
      }
    }

    // Get the last node in the path
    const lastNode = path[path.length - 1];

    // Check all neighbors of the last node
    for (const neighbor of graph.get(lastNode)) {
      // If the neighbor is not visited
      if (!visited.has(neighbor)) {
        // Add the neighbor to the visited set
        visited.add(neighbor);
        // Recursively check the path with the neighbor included
        if (isHamiltonianPathUtil([...path, neighbor], visited)) {
          return true;
        }
        // Remove the neighbor from the visited set
        visited.delete(neighbor);
      }
    }

    return false;
  }

  // Try to find a Hamiltonian path starting from each vertex
  for (const startNode of vertices) {
    const visited = new Set();
    visited.add(startNode);
    // Start a new path with the current vertex
    if (isHamiltonianPathUtil([startNode], visited)) {
      return true;
    }
  }

  return false;
}

// Main function trigger
async function getResult() {
  const indicator = document.getElementById("indicator");
  const adjacencyList = getAdjacencyList();
  printMatrix(adjacencyList);
  const isEulerianResult = await isEulerian(adjacencyList);
  const isHamiltonianResult = isHamiltonian(adjacencyList);

  indicator.value = `Eulerian: ${isEulerianResult}\nHamiltonian: ${isHamiltonianResult}`;
  textarea.value += `\nEulerian: ${isEulerianResult}\nHamiltonian: ${isHamiltonianResult}\n\n`;
}

document.getElementById("highlightBtn").addEventListener('click', getResult);

// Call the createNetwork function to initialize the network
createNetwork();
