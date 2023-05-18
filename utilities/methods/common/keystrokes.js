class Keystrokes {
    constructor(network, nodes, edges) {
      this.network = network;
      this.nodes = nodes;
      this.edges = edges;
      this.firstNodeId = null;
      this.draggingNode = false;
      this.isAddingNode = false;
      this.registerEventListeners();
    }
  
    registerEventListeners() {
      const self = this;
  
      // Register drag events
      this.network.on('dragStart', function (params) {
        const draggedNode = params.nodes[0];
        if (draggedNode) {
          self.draggingNode = true;
        }
      });
  
      this.network.on('dragEnd', function (params) {
        const draggedNode = params.nodes[0];
        if (draggedNode) {
          self.draggingNode = false;
          const newPosition = self.network.getPositions([draggedNode])[draggedNode];
          self.nodes.update({ id: draggedNode, x: newPosition.x, y: newPosition.y });
        }
      });
  
      this.network.on('dragging', function (params) {
        if (self.draggingNode) {
          const draggedNode = params.nodes[0];
          const newPosition = self.network.getPositions([draggedNode])[draggedNode];
          self.nodes.update({ id: draggedNode, x: newPosition.x, y: newPosition.y });
        }
      });
  
      // Register delete key event
      document.addEventListener('keydown', function (event) {
        if (event.key === 'Delete') {
          const selectedNodes = self.network.getSelectedNodes();
          const selectedEdges = self.network.getSelectedEdges();
  
          if (selectedNodes.length > 0) {
            document.body.style.cursor = 'default';
            self.firstNodeId=null;
            self.nodes.remove(selectedNodes);
          }
  
          if (selectedEdges.length > 0) {
            document.body.style.cursor = 'default';
            self.edges.remove(selectedEdges);
          }
        }
      });
  
      // Register space key event
      document.addEventListener('keydown', function (event) {
        if (event.key === ' ') {
          if (self.isAddingNode) {
            document.body.style.cursor = 'default';
            self.isAddingNode = false;
          } else {
            document.body.style.cursor = 'crosshair';
            self.isAddingNode = true;
          }
        }
      });
  
      // Register click event
      this.network.on('click', function (params) {
        if (params.nodes.length === 0 && self.isAddingNode) {
          const canvasPosition = params.pointer.canvas;
          const newNodeLabel = prompt('Enter a label for the new node:');
          const existingNode = self.nodes.get({
            filter: function (item) {
              return item.label === newNodeLabel;
            }
          });
  
          if (existingNode.length > 0) {
            alert('A node with this label already exists');
            return;
          } else {
            if (newNodeLabel) {
              const newNodeId = self.nodes.length + 1;
              const newNode = { id: newNodeId, label: newNodeLabel, x: canvasPosition.x, y: canvasPosition.y };
              self.nodes.add(newNode);
              document.body.style.cursor = 'default';
            }
          }
  
          self.isAddingNode = false;
        } else {
          if (params.nodes.length === 1) {
            if (self.firstNodeId === null) {
              document.body.style.cursor = 'crosshair';
              self.firstNodeId = params.nodes[0];
            } else {
              if (self.firstNodeId == params.nodes[0]) {
                document.body.style.cursor = 'default';
               
                self.firstNodeId = null;
            } else {
            const secondNodeId = params.nodes[0];
            const edgesArray = self.edges.get({
            filter: function (item) {
            return (
            (item.from === self.firstNodeId && item.to === secondNodeId) ||
            (item.from === secondNodeId && item.to === self.firstNodeId)
            );
            }
            });          if (edgesArray.length === 0 && self.firstNodeId !== secondNodeId) {
                const newLabel = prompt('Enter value:');
                if (newLabel != '' && !isNaN(newLabel) && Number.isInteger(parseFloat(newLabel))) {
                  self.edges.add({ from: self.firstNodeId, to: secondNodeId, label: newLabel });
                } else {
                  alert('Please enter a valid integer for the edge label.');
                }
              }
              document.body.style.cursor = 'default';
              self.firstNodeId = null;
            }
          }
        }
      }
    });
    
    // Register double click event
    this.network.on('doubleClick', function (params) {
      if (params.nodes.length === 1) {
        const nodeId = params.nodes[0];
        const currentNodeLabel = self.nodes.get(nodeId).label || '';
        const newNodeLabel = prompt('Enter new label:', currentNodeLabel);
        if (newNodeLabel !== null) {
          const existingNode = self.nodes.get({
            filter: function (item) {
              return item.label === newNodeLabel;
            }
          });
    
          if (existingNode.length === 0) {
            self.nodes.update({ id: nodeId, label: newNodeLabel });
          } else {
            alert('Node label already exists. Please enter a different label.');
          }
        }
      } else if (params.edges.length === 1) {
        const edgeId = params.edges[0];
        const currentEdgeLabel = self.edges.get(edgeId).label || '';
        const newEdgeLabel = prompt('Enter new label:', currentEdgeLabel);
        if (newEdgeLabel !== '' && !isNaN(newEdgeLabel) && Number.isInteger(parseFloat(newEdgeLabel))) {
          self.edges.update({ id: edgeId, label: newEdgeLabel });
        } else {
          alert('Please enter a valid integer for the edge label.');
        }
      }
    });
    }
}
