// Define a separate class for managing the network
class NetworkManager {
    constructor() {
      this.nodes = new vis.DataSet();
      this.edges = new vis.DataSet();
      this.network = null;
    }
  
    createNetwork(containerId) {
      const container = document.getElementById(containerId);
      const data = {
        nodes: this.nodes,
        edges: this.edges
      };
      const options = {
        height: "100%",
        width: "100%",
        edges: {
          smooth: false,
          color: {
            color: 'lightblue',
            highlight: 'lightblue'
          }
        },
        physics: {
          enabled: false
        }
      };
      this.network = new vis.Network(container, data, options);
      this.keystrokes = new Keystrokes(this.network, this.nodes, this.edges);

        // Register event listeners using the Keystrokes instance
        document.addEventListener('keydown', this.keystrokes.handleKeyDown);
        this.network.on(this.keystrokes.handleDragStart);
        this.network.on(this.keystrokes.handleDragEnd);
        this.network.on(this.keystrokes.draggingNode);
        this.network.on(this.keystrokes.handleClick);
        this.network.on(this.keystrokes.handleDoubleClick);
    }
  
    addNode(node) {
      this.nodes.add(node);
    }
  
    addEdge(edge) {
      this.edges.add(edge);
    }
  
    printData() {
      console.log('Nodes:', this.nodes.get());
      console.log('Edges:', this.edges.get());
    }
}
  
