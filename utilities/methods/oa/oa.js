$(document).ready(function() {
    var tableData = []; // Array to store table data
    var totalPriceArray = []; // Array to store total price
    var remainingWeight = 0;
    var textarea = $("#textarea");

    // ...
    
    // Highlight button click event
    $(document).on("click", "#highlightBtn", function() {
        tableData = []; // Clear table data
        totalPriceArray = []; // Clear total price array

        $("#dataTable tbody tr").each(function() {
            var row = $(this);
            var objectCode = row.find(".object-code").val();
            var profit = row.find(".profit").val();
            var weight = row.find(".weight").val();

            if (objectCode !== '') {
                var rowData = {
                    code: objectCode,
                    profit: profit,
                    weight: weight,
                    selection: 0, // Initialize selection with 0
                    profitPerWeight: (parseFloat(profit) / parseFloat(weight)).toFixed(2) // Calculate profit per weight ratio
                };

                tableData.push(rowData);
            }
        });

        textarea.val("Table Data:\n");
        tableData.forEach(function(row) {
            textarea.val(textarea.val() + "Code: " + row.code + " -> Profit: " + row.profit + ", Weight: " + row.weight + ", Profit Per Weight: " + row.profitPerWeight + "\n");
        });

        var weightRestriction = parseFloat(prompt("Please enter the weight restriction:"));
        remainingWeight = weightRestriction;
        if (remainingWeight !== null && !isNaN(remainingWeight)) {
            tableData.sort(function(a, b) {
                return b.profitPerWeight - a.profitPerWeight; // Sort in descending order of profit per weight ratio
            });

            for (var i = 0; i < tableData.length; i++) {
                var currentWeight = parseFloat(tableData[i].weight);
                if (currentWeight <= remainingWeight) {
                    tableData[i].selection = 1;
                    totalPriceArray.push({
                        code: tableData[i].code,
                        totalPrice: (parseFloat(tableData[i].profit) * tableData[i].selection).toFixed(2)
                    });
                    remainingWeight -= currentWeight;
                } 
//                 else {
//                     var fractionWeight = remainingWeight / currentWeight;
//                     tableData[i].selection = fractionWeight;
//                     totalPriceArray.push({
//                         code: tableData[i].code,
//                         totalPrice: (parseFloat(tableData[i].profit) * tableData[i].selection).toFixed(2)
//                     });
//                     remainingWeight = 0;
//                     break;
//                 }
            }

            var totalPriceTotal = totalPriceArray.reduce(function(total, item) {
                return total + parseFloat(item.totalPrice);
            }, 0);

            // Update the textarea with the results
            textarea.val(textarea.val() + "\n");
            textarea.val(textarea.val() + "Weight Restriction: " + weightRestriction.toFixed(2) + "\n\n");
            textarea.val(textarea.val() + "Selection Profits:\n");
            totalPriceArray.forEach(function(row) {
                var code = row.code;
                var selectedRow = tableData.find(function(data) {
                    return data.code === code;
                });
                textarea.val(textarea.val() + "Code: " + code + " -> Portion: " + (selectedRow ? selectedRow.selection: '') + ", Profit Per Weight: " + (selectedRow ? selectedRow.profitPerWeight : '')  + ", Total Cost: " + row.totalPrice + "\n");
            });
            textarea.val(textarea.val() + "\n");
            textarea.val(textarea.val() + "Overall Profit: " + totalPriceTotal.toFixed(2));
        }
    });
});
