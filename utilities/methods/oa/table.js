$(document).ready(function() {
  var isEditing = false; // Flag to track if a row is being edited

  // Check button click event
  $(document).on("click", ".check-btn", function() {

    var row = $(this).closest("tr");
    var objectCode = row.find(".object-code").val();
    var profit = row.find(".profit").val();
    var weight = row.find(".weight").val();
    var isValid = true;

    // Validate Object Code
    if (!isValidObjectCode(objectCode)) {
      row.find(".object-code").addClass("error");
      isValid = false;
    } else {
      row.find(".object-code").removeClass("error");
    }

    // Validate Profit
    if (!isValidNumber(profit)) {
      row.find(".profit").addClass("error");
      isValid = false;
    } else {
      row.find(".profit").removeClass("error");
    }

    // Validate Weight
    if (!isValidNumber(weight)) {
      row.find(".weight").addClass("error");
      isValid = false;
    } else {
      row.find(".weight").removeClass("error");
    }

    if (isValid || isValid && isEditing) {
      // Lock the row
      row.find("input").prop("readonly", true);
      $(this).prop("disabled", true);
      $(".edit-row").not(this).prop("disabled", false);
      $(".remove-row").not(this).prop("disabled", false);
      if (!isEditing) {
          // Add a new row
          var newRow = '<tr>' +
            '<td><input type="text" class="form-control object-code" required></td>' +
            '<td><input type="number" class="form-control profit" required></td>' +
            '<td><input type="number" class="form-control weight" required></td>' +
            '<td>' +
            '<button class="btn btn-primary btn-sm check-btn">Check</button>' +
            '<button class="btn btn-danger btn-sm remove-row">Remove</button>' +
            '<button class="btn btn-warning btn-sm edit-row">Edit</button>' +
            '</td>' +
            '</tr>';
    
          $("#dataTable tbody").append(newRow);
      }
      $(".check-btn").last().prop("disabled", false);
      // Disable the "Edit" and "Remove" buttons for the new row
      $("#dataTable tbody tr:last-child .edit-row, #dataTable tbody tr:last-child .remove-row").prop("disabled", true);
      isEditing = false
      }
  });

  // Remove button click event
  $(document).on("click", ".remove-row", function() {
    var row = $(this).closest("tr");
    if (row.find("input").prop("readonly")) {
      // Remove the row if it's a locked row
      row.remove();
    }
  });

  // Edit button click event
  $(document).on("click", ".edit-row", function() {
      if (isEditing) {
      var row = $(this).closest("tr");
      row.find("input").prop("readonly", true);
      row.find(".check-btn").prop("disabled", false);
      row.find(".edit-row").prop("disabled", false);
      row.find(".remove-row").prop("disabled", false);
      row.find(".edit-row").prop("disabled", false);
      isEditing = false;
      return;
      }
  
      var row = $(this).closest("tr");
      if (!row.is(":last-child")) { // Check if it's not the last row
      row.find("input").prop("readonly", false);
      row.find(".check-btn").prop("disabled", false);
      row.find(".edit-row, .remove-row").prop("disabled", true);
      isEditing = true;
      }
  
      // Disable other edit buttons
      $(".edit-row").not(this).prop("disabled", true);
  
      // Disable the "Edit" button of the last row
      $(".edit-row").last().prop("disabled", true);
      
      // Disable the "Check" button of the last row
      $(".check-btn").last().prop("disabled", true);

  });


  

  function isValidObjectCode(objectCode) {
    // Check if the object code is empty
    if (objectCode.trim() === '') {
      return false;
    }

    // Validate Object Code (letters only)
    var letters = /^[A-Za-z]+$/;
    if (!objectCode.match(letters)) {
      return false;
    }

    // Check for duplicates
    var existingCodes = [];
    $('.object-code').each(function() {
      existingCodes.push($(this).val());
    });
    var count = 0;
    for (var i = 0; i < existingCodes.length; i++) {
      if (existingCodes[i] === objectCode) {
        count++;
      }
    }
    if (count > 1) {
      return false;
    }

    return true;
  }

  function isValidNumber(value) {
    // Validate number (integers only)
    return !isNaN(value) && parseInt(value) == value;
  }
});
