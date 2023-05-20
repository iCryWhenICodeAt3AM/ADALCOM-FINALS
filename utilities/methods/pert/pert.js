$(document).ready(function() {

  const networkManager = new NetworkManager();
  // Create new network
  async function createNetwork() {
      networkManager.createNetwork("pertChart");
      
      const nodes = [];
      const edges = [];
      
      nodes.forEach(node => networkManager.addNode(node));
      edges.forEach(edge => networkManager.addEdge(edge));
      
      network = networkManager.network;
      networkNodes = networkManager.nodes;
      networkEdges = networkManager.edges;

      // Auto-adjust node positions 
      layoutNetwork();

  }
  // create netwrok
  createNetwork();


  // Button click event
  $('#highlightBtn').on('click', function() {
    var dataObject = {};
    // var dataObject = {
    //   a:{pred: 'none', et: 1},
    //   b:{pred: 'none', et: 11},
    //   c:{pred: 'none', et: 3},
    //   d:{pred: 'a', et: 7},
    //   e:{pred: 'a', et: 4},
    //   f:{pred: 'e', et: 6},
    //   g:{pred: 'b', et: 10},
    //   h:{pred: 'b', et: 6},
    //   i:{pred: 'd, f', et: 18},
    //   j:{pred: 'c', et: 13},
    //   k:{pred: 'h, j', et: 4}
    // };

    // var dataObject = {
    //   a:{pred: 'none', et: 2},
    //   b:{pred: 'a', et: 3},
    //   c:{pred: 'a', et: 1},
    //   d:{pred: 'b, c', et: 2},
    //   e:{pred: 'b', et: 1},
    //   f:{pred: 'e', et: 2},
    //   g:{pred: 'd, f', et: 4},
    // };

    // Retrieve data from the dataTable and store it in the object
    $('#dataTable tbody tr').each(function() {
      var code = $(this).find('.code').val().trim();
      var pred = $(this).find('.pred').val().trim();
      var et = parseFloat($(this).find('.et').val().trim());

      // Store the data in the object
      if (code !== "" && pred !== "" && !isNaN(et)) {
        dataObject[code] = { pred: pred, et: et };
      }
    });

    // Calculate ES and EF
    Object.keys(dataObject).forEach(function(code) {
      var pred = dataObject[code].pred;
      var et = dataObject[code].et;

      if (pred.toLowerCase() === "none") {
        dataObject[code].es = 0;
      } else {
        var predArray = pred.split(",").map(function(item) {
          return item.trim();
        });
        
        var maxEF = 0;
        predArray.forEach(function(predCode) {
          if (dataObject.hasOwnProperty(predCode) && dataObject[predCode].ef > maxEF) {
            maxEF = dataObject[predCode].ef;
          }
        });

        dataObject[code].es = maxEF;
      }

      dataObject[code].ef = dataObject[code].es + et;
    });


    // Perform the backward pass
    var taskCodes = Object.keys(dataObject);
    var lastTask = taskCodes[taskCodes.length - 1];

    for (var i = taskCodes.length - 1; i >= 0; i--) {
      var code = taskCodes[i];

      if (code === lastTask) {
        // Last row
        var maxEF = 0;
        taskCodes.forEach(function(taskCode) {
          maxEF = Math.max(maxEF, dataObject[taskCode].ef);
        });

        dataObject[code].lf = maxEF;
        dataObject[code].ls = dataObject[code].lf - dataObject[code].et;
      } else {
        // Not the last row
        var lf = dataObject[lastTask].lf;

        for (var j = i + 1; j < taskCodes.length; j++) {
          var rowCode = taskCodes[j];

          if (dataObject[rowCode].pred.includes(code)) {
            if (lf > dataObject[rowCode].ls) {
              lf = dataObject[rowCode].ls;
            }
          }

          if (rowCode === code) {
            break;
          }
        }

        dataObject[code].lf = lf;
        dataObject[code].ls = dataObject[code].lf - dataObject[code].et;
      }
    }

  // Calculate EF and Slack Time (S)
  taskCodes.forEach(function(code) {
    dataObject[code].ef = dataObject[code].es + dataObject[code].et;
    dataObject[code].s = dataObject[code].ls - dataObject[code].es;
  });

    // Clear existing table data
    $('#pertTable tbody').empty();

    // Append dataObject to pertTable
    taskCodes.forEach(function(code) {
      var pred = dataObject[code].pred;
      var et = dataObject[code].et;
      var es = dataObject[code].es;
      var ef = dataObject[code].ef;
      var ls = dataObject[code].ls;
      var lf = dataObject[code].lf;
      var s = dataObject[code].s;
  
      // Append the row to the pertTable
      $('#pertTable tbody').append('<tr class="text-white text-center"><td>' + code + '</td><td>' + pred + '</td><td>' + et + '</td><td>' + es + '</td><td>' + ef + '</td><td>' + ls + '</td><td>' + lf + '</td><td>' + s + '</td></tr>');
    });
  
    // Display the dataObject in the console
    console.log(dataObject);

    // Create nodes and edges arrays for vis.js
    var nodes = [];
    var edges = [];

    // Iterate over the dataObject
    Object.keys(dataObject).forEach(function(code) {
      var et = dataObject[code].et;
      var es = dataObject[code].es;
      var ls = dataObject[code].ls;
      var s = lf - (es + et);
      // Create a node for the code with et, es, and lf as the label
      var nodeLabel = code + '\nET: ' + et + ' | ES: ' + es + ' | LS: ' + ls;
      nodes.push({ id: code, label: nodeLabel });

       // Keep track of connected codes
      var connectedCodes = [];
      console.log("task codes: ",taskCodes)
        // Find mentions of the current code in predecessors' pred values
        for (var i = taskCodes.indexOf(code) + 1; i < taskCodes.length; i++) {
          var rowCode = taskCodes[i];
          var rowPred = dataObject[rowCode].pred;

          if (rowPred.includes(code)) {
            connectedCodes.push(rowCode);

            if (rowCode === lastTask) {
              break;
            }
          }
        }

        // Create edges for each connected code
        console.log("conneted: ", connectedCodes);
        console.log("row code: ", code);
        connectedCodes.forEach(function(connectedCode) {
          console.log("conneted "+connectedCode+ " es and ef:", dataObject[connectedCode].ef + " " + dataObject[connectedCode].lf);
          var slack = dataObject[connectedCode].lf - dataObject[connectedCode].ef;
          var parentSlack = dataObject[code].lf - dataObject[code].ef;
          var edgeColor = slack === 0 && parentSlack === 0? 'red' : 'lightblue';
          edges.push({ from: connectedCode, to: code, label: 'Slack: ' + slack, color: edgeColor });
        });
    });

    // Set the nodes and edges of the network manager
    networkManager.nodes = new vis.DataSet(nodes);
    networkManager.edges = new vis.DataSet(edges);
    // Re-update network
    createNetwork();
  });
  
  // Custom layout algorithm
  function layoutNetwork() {
    // Additional Settings
    const options = {
      layout: {
        hierarchical: {
          enabled: true,
          direction: "LR", // Left to right layout
          sortMethod: "directed",
          levelSeparation: 240, // Adjust the distance between nodes
        },
      },
      physics: false,
    };

    network.setOptions(options);
    network.fit();
  }
});
  