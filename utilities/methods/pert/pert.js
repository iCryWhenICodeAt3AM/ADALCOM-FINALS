const networkManager = new NetworkManager();
// Create new network
async function createNetwork() {
    networkManager.createNetwork("pertChart");
    
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

  createNetwork();

$(document).ready(function() {
    // Button click event
    $('#highlightBtn').on('click', function() {
        // Clear existing table data
        $('#newTable tbody').empty();

        // Get data from existing table and populate new table
        $('#dataTable tbody tr').each(function() {
        var code = $(this).find('.code').text();
        var pred = $(this).find('.pred').text();
        var et = $(this).find('.et').text();

        // Append the row to the new table
        $('#newTable tbody').append('<tr><td>' + code + '</td><td>' + pred + '</td><td>' + et + '</td></tr>');
        });
    });
});
  