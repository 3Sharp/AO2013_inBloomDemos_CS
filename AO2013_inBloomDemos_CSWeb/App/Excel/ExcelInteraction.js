//This singleton handles the actual interaction with excel. It contains methods to create
//the table and insert data into the table.

var ExcelInteraction = {};
// DATATYPES passed around - all are created by saying new xxxx();
// excelInteractionRowData  - this is a container with all data available for a row, it is used to both
//      pass row data in, and get row data out.
//
// excelInteractionAsyncResult - this is the data ALWAYS passed back from an async method, the 'value' field is used to return data
//
// ** METHODS AVAILABLE FOR GENERAL USE ***
// ExcelInteraction.excelInteractionInitialize(selectionChangedHandler) -
//      call this at document initialization time - the parameter is your selection changed event handler
//
// ExcelInteraction.getBindingAsync(asyncContext, callback)
//      This method will return the binding, or null in the callback's parameter 'value'
//      It sets successful to true if the binding is good, else false.
//      callback signature:  function myCallbackMethod( excelInteractionAsyncResult );
// 
// ExcelInteraction.createTableAsync(asyncContext, callback)
//      This method will create the spreadsheet table, if it does not exist, else it does nothing
//      callback signature:  function myCallbackMethod( excelInteractionAsyncResult );
// 
// ExcelInteraction.getTableDataAsync(asyncContext, callback)
//      This method returns all table data (including column names) table in the 'value' of the callback parameter
//      callback signature:  function myCallbackMethod( excelInteractionAsyncResult );
// 
// ExcelInteraction.setTableDataAsync(tableData, asyncContext, callback)
//      This method erases any table data and replaces it with the data provided
//      callback signature:  function myCallbackMethod( excelInteractionAsyncResult );
// 
// ExcelInteraction.addRowAsync(rowData, asyncContext, callback)
//      This method appends a row to the bottom of the table  
//      rowData is created by calling  new excelInteractionRowData() and setting its values as needed
//      callback signature:  function myCallbackMethod( excelInteractionAsyncResult );
//
// ExcelInteraction.convertTableRowToExcelInteractionRowData(tableData, rowNumber)
//      This method takes the tableData returned by a call to ExcelInteraction.getTableDataAsync() and returns a structure
//      you can use to easily navigate the ROW data by column.
//
//
//
//

// global variable for this module 
ExcelInteraction.excelInteractionRuntime = {
    bindingName: 'inBloomExcelTable',
    columnNames: [['First Name', 'Last Name', 'Section', 'Assign 1', 'Assign 1 Score', 'Assign 2', 'Assign 2 Score', 'Assign 3', 'Assign 3 Score', 'Assign 4', 'Assign 4 Score', 'Assign 5', 'Assign 5 Score']],
    variableNames: [['firstName', 'lastName', 'sectionName', 'assignmentDescrip1', 'assignmentScore1', 'assignmentDescrip2', 'assignmentScore2', 'assignmentDescrip3', 'assignmentScore3', 'assignmentDescrip4', 'assignmentScore4', 'assignmentDescrip5', 'assignmentScore5']],
    selectionChangedHandler: null,
};



ExcelInteraction.excelInteractionInitialize = function (selectionChangedHandler) {
    ///<summary> Creates the standard return parameter to any async call made to this module</summary>
    ///<param name="selectionChangedHandler" type="function" optional="false">required - method to call on selection change
    ///  the signature for the function is mySelectionChangedHandler(rowData) = where row data is excelInteractionRowData
    ///</param>
    ///

    if (selectionChangedHandler !== undefined && typeof (selectionChangedHandler) === 'function')
        ExcelInteraction.excelInteractionRuntime.selectionChangedHandler = selectionChangedHandler;
    else
        ExcelInteraction.excelInteractionRuntime.selectionChangedHandler = defaultSelectionChangedHandler;

    ExcelInteraction.getBindingAsync(function (asyncResult) {
        // add in the click event handler (if needed)
        if (asyncResult.successful === true)
            asyncResult.value.addHandlerAsync(Office.EventType.BindingSelectionChanged, ExcelInteraction.internalSelectionChangedHandler);
    });

    // TEST STUFF
    // END OF TEST STUFF


};

ExcelInteraction.getBindingAsync = function (asyncContext, callback) {
    ///<summary> Returns the Office BINDING object for the list if it exists, else null - this should be a TABLEBINDING object(type='table')'
    /// the binding object is returned in the callback parameter 'value' field if successful </summary>
    ///
    if (arguments.length === 1) {
        callback = asyncContext;
        asyncContext = null;
    }
    if (arguments.length === 0)
        callback = null;

    var result = new excelInteractionAsyncResult(false, asyncContext);

    Office.context.document.bindings.getByIdAsync(ExcelInteraction.excelInteractionRuntime.bindingName,
        function (asyncResult) {
            result.successful = Boolean(asyncResult.status === Office.AsyncResultStatus.Succeeded);
            if (result.successful) {
                if (asyncResult.value.hasHeaders === false) // if the table has been deleted, but the binding remains
                {
                    result.successful = false;
                    asyncResult.value.deleteAllDataValuesAsync(
                        function () {
                            Office.context.document.bindings.releaseByIdAsync(ExcelInteraction.excelInteractionRuntime.bindingName);
                            result.errorMessage = "empty binding found - binding deleted";
                            if (typeof (callback) === 'function')
                                callback(result);
                        });
                    return;
                }

                result.value = asyncResult.value;
            }
            if (typeof (callback) === 'function')
                callback(result);
        });
};

ExcelInteraction.createTableAsync = function (asyncContext, callback) {
    ///<summary> Async Method - Creates the Excel list if it does not exist, else it does nothing</summary>
    ///<param name="asyncContext" type="Object" optional="true">Object keeping state for the callback and is passed unaltered to the callback method</param>
    ///<param name="callback" type="function" optional="true">The optional callback method</param>
    ///
    if (arguments.length === 1) {
        callback = asyncContext;
        asyncContext = null;
    }
    if (arguments.length === 0)
        callback = null;

    var result = new excelInteractionAsyncResult(false, asyncContext);

    ExcelInteraction.getBindingAsync(
        function (asyncResult) {
            if (asyncResult.successful === true) {
                if (asyncResult.value.hasHeaders === false) // if the table has been deleted, but the binding remains
                {
                    asyncResult.value.deleteAllDataValuesAsync(
                        function () {
                            Office.context.document.bindings.releaseByIdAsync(ExcelInteraction.excelInteractionRuntime.bindingName);
                            result.errorMessage = "empty binding found - try again";
                            if (typeof (callback) === 'function')
                                callback(result);

                        });
                }
            }


            if (asyncResult.successful === false) {
                var myTable = new Office.TableData();
                myTable.headers = ExcelInteraction.excelInteractionRuntime.columnNames;
                myTable.rows = null;
                Office.context.document.setSelectedDataAsync(myTable, { coercionType: Office.CoercionType.Table },
                    function (asyncResult) {
                        var success = false;
                        if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
                            Office.context.document.bindings.addFromSelectionAsync(Office.CoercionType.Table, { id: ExcelInteraction.excelInteractionRuntime.bindingName },
                                function (asyncResult) {
                                    result.successful = Boolean(asyncResult.status === Office.AsyncResultStatus.Succeeded);
                                    // add in the click event handler (if needed)
                                    if (result.successful === true) {
                                        asyncResult.value.addHandlerAsync(Office.EventType.BindingSelectionChanged, ExcelInteraction.internalSelectionChangedHandler);
                                        if (typeof (callback) === 'function')
                                            callback(result);
                                    }

                                });
                        }
                        else {
                            if (typeof (callback) === 'function')
                                callback(result);
                        }
                    });
            }
            else  // the table already exists
            {
                result.successful = true;
                result.errorMessage = "table already exists";
                if (typeof (callback) === 'function')
                    callback(result);
            }
        });
};

ExcelInteraction.getTableDataAsync = function (asyncContext, callback) {
    ///<summary> Async Method - Returns the Excel list if exists(in the callback method parameter), else it does nothing</summary>
    ///<param name="asyncContext" type="Object" optional="true">Object keeping state for the callback and is passed unaltered to the callback method</param>
    ///<param name="callback" type="function" optional="true">The optional callback method</param>
    ///

    if (arguments.length === 1) {
        callback = asyncContext;
        asyncContext = null;
    }
    if (arguments.length === 0)
        callback = null;

    var result = new excelInteractionAsyncResult(false, asyncContext);

    Office.context.document.bindings.getByIdAsync(ExcelInteraction.excelInteractionRuntime.bindingName,
        function (asyncResult) {

            if (asyncResult.status === Office.AsyncResultStatus.Failed) {
                result.errorMessage = "The binding name {0} does not exist in the spreadsheet or has an incorrect type".f(ExcelInteraction.excelInteractionRuntime.bindingName);
                if (typeof (callback) === 'function')
                    callback(result);
            }
            else {
                var binding = asyncResult.value;

                binding.getDataAsync({ coercionType: 'table', valueType: 'unformatted' },
                    function (asyncResult2) {
                        if (asyncResult2.status === Office.AsyncResultStatus.Succeeded) {
                            result.value = asyncResult2.value;
                            result.successful = true;
                        }
                        else {
                            result.errorMessage = "could not get table data";
                        }

                        if (typeof (callback) === 'function')
                            callback(result);

                    });
            }
        });
};

ExcelInteraction.setTableDataAsync = function (tableData, asyncContext, callback) {
    ///<summary> Async Method - Replaces the Excel list if exists, else it does nothing</summary>
    ///<param name="tableData" type="object" optional="false">Object of type Office._TableData </param>
    ///<param name="asyncContext" type="Object" optional="true">Object keeping state for the callback and is passed unaltered to the callback method</param>
    ///<param name="callback" type="function" optional="true">The optional callback method</param>
    ///
    if (arguments.length === 2) {
        callback = asyncContext;
        asyncContext = null;
    }
    if (arguments.length === 1)
        callback = null;

    if (tableData.rows === undefined) {
        result.errorMessage = "Invalid parameter 'tabledata' is not a Office._TableData";
        if (typeof (callback) === 'function')
            callback(asyncContext);
        return;
    }
    var result = new excelInteractionAsyncResult(false, asyncContext);

    Office.context.document.bindings.getByIdAsync(ExcelInteraction.excelInteractionRuntime.bindingName,
        function (asyncResult) {
            if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
                var binding = asyncResult.value;
                binding.deleteAllDataValuesAsync(
                    function (asyncResult) {
                        if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
                            binding.addRowsAsync(tableData.rows,
                                function (asyncResult2) {
                                    result.successful = Boolean(asyncResult2.status === Office.AsyncResultStatus.Succeeded);
                                    if (!result.successful) {
                                        result.errorMessage = "could not addRowsAsync";
                                    }
                                    if (typeof (callback) === 'function')
                                        callback(result);
                                });
                        }
                        else {
                            result.errorMessage = "could not deleteAllDataValuesAsync";
                            if (typeof (callback) === 'function')
                                callback(result);
                        }
                    });
            }
            else {
                result.errorMessage = "could not get table data";
                if (typeof (callback) === 'function')
                    callback(result);
            }
        });
};

ExcelInteraction.addRowArrayAsync = function (rowData, asyncContext, callback) {
    ///<summary> Async Method - Adds rows to the Excel list if exists, else it does nothing</summary>
    ///<param name="rowData" type="object" optional="false">Object of type excelInteractionRowData </param>
    ///<param name="asyncContext" type="Object" optional="true">Object keeping state for the callback and is passed unaltered to the callback method</param>
    ///<param name="callback" type="function" optional="true">The optional callback method</param>
    ///
    if (arguments.length === 2) {
        callback = asyncContext;
        asyncContext = null;
    }
    if (arguments.length === 1)
        callback = null;

    var result = new excelInteractionAsyncResult(false, asyncContext);

    ExcelInteraction.getTableDataAsync(
        function (asyncResult) {
            if (asyncResult.successful === true) {
                var columns = asyncResult.value.headers;
                var rows = asyncResult.value.rows;
                var allNewRows = [];

                // move the data into the correct columns
                for (var jj = 0; jj < rowData.length; jj++) {
                    var newRowArray = new Array(columns[0].length);
                    for (i = 0; i < columns[0].length; i++) {
                        var columnName = convertColumnNameToVariableName(columns[0][i]);
                        newRowArray[i] = rowData[jj][columnName];

                    }
                    allNewRows.push(newRowArray);
                }


                var reuseLastRow = false;
                if (rows.length === 1)  // this may be an empty row - check it, if it is then we overwrite the row
                {
                    var foundData = false;
                    for (i = 0; i < rows[0].length; i++) {
                        if (rows[0][i] !== '') {
                            foundData = true;
                            break;
                        }
                    }
                    if (foundData === false)
                        reuseLastRow = true;
                }

                if (reuseLastRow === false) {
                    for (var ii = 0; ii < allNewRows.length; ii++) {
                        rows.push(allNewRows[ii]);
                    }

                }
                else {
                    rows[0] = allNewRows[0];
                    for (var ii = 1; ii < allNewRows.length; ii++) {
                        rows.push(allNewRows[ii]);
                    }
                }
                ExcelInteraction.setTableDataAsync(asyncResult.value,
                    function (asyncResult2) {
                        result.successful = asyncResult2.successful;
                        result.errorMessage = asyncResult2.successful;
                        if (typeof (callback) === 'function')
                            callback(asyncContext);
                    });
            }
            else {
                result.errorMessage = "could not get table from spreadsheet";
                if (typeof (callback) === 'function')
                    callback(asyncContext);
            }
        });
};

ExcelInteraction.addRowAsync = function (rowData, asyncContext, callback) {
    ///<summary> Async Method - Adds a row to the Excel list if exists, else it does nothing</summary>
    ///<param name="rowData" type="object" optional="false">Object of type excelInteractionRowData </param>
    ///<param name="asyncContext" type="Object" optional="true">Object keeping state for the callback and is passed unaltered to the callback method</param>
    ///<param name="callback" type="function" optional="true">The optional callback method</param>
    ///
    if (arguments.length === 2) {
        callback = asyncContext;
        asyncContext = null;
    }
    if (arguments.length === 1)
        callback = null;

    var result = new excelInteractionAsyncResult(false, asyncContext);

    if (rowData.addRowData_DontChangeMe === undefined) {
        result.errorMessage = "Invalid parameter 'rowdata' is not a excelInteractionRowData";
        if (typeof (callback) === 'function')
            callback(asyncContext);
        return;
    }

    ExcelInteraction.getTableDataAsync(
        function (asyncResult) {
            if (asyncResult.successful === true) {
                var columns = asyncResult.value.headers;
                var rows = asyncResult.value.rows;
                var newRowArray = new Array(columns[0].length);

                // move the data into the correct columns
                for (i = 0; i < columns[0].length; i++) {
                    var columnName = convertColumnNameToVariableName(columns[0][i]);
                    newRowArray[i] = rowData[columnName];
                }

                var reuseLastRow = false;
                if (rows.length === 1)  // this may be an empty row - check it, if it is then we overwrite the row
                {
                    var foundData = false;
                    for (i = 0; i < rows[0].length; i++) {
                        if (rows[0][i] !== '') {
                            foundData = true;
                            break;
                        }
                    }
                    if (foundData === false)
                        reuseLastRow = true;
                }

                if (reuseLastRow === false) {
                    rows.push(newRowArray);
                }
                else {
                    rows[0] = newRowArray;
                }
                ExcelInteraction.setTableDataAsync(asyncResult.value,
                    function (asyncResult2) {
                        result.successful = asyncResult2.successful;
                        result.errorMessage = asyncResult2.successful;
                        if (typeof (callback) === 'function')
                            callback(asyncContext);
                    });
            }
            else {
                result.errorMessage = "could not get table from spreadsheet";
                if (typeof (callback) === 'function')
                    callback(asyncContext);
            }
        });


};


ExcelInteraction.convertTableRowToExcelInteractionRowData = function (tableData, rowNumber) {
    ///<summary> this method takes a table row and converts it to an excelInteractionRowData variable
    ///<param name="tableData" type="object" optional="false">Object of type Office._TableData </param>
    ///<param name="rowNumber" type="integer" optional="false">the row to return from the table - ZERO BASED </param>
    ///
    var selectedRow = new excelInteractionRowData();

    for (var x = 0; x < tableData.headers[0].length; x++) {
        var columnName = convertColumnNameToVariableName(tableData.headers[0][x]);
        selectedRow[columnName] = tableData.rows[rowNumber][x];
    }
    return selectedRow;
};

//****************** DATATYPES USED BY THIS MODULE **********************
// they are instantiated by calling var x = new xxxx();

var excelInteractionRowData = function () {
    ///<summary> This function is used to instantiate a container that you can put table row data into 
    ///the field names in this container correspond to the column names in excelInteractionRuntime.columnNames</summary>
    ///
    for (i = 0; i < ExcelInteraction.excelInteractionRuntime.columnNames[0].length; i++) {
        var str = convertColumnNameToVariableName(ExcelInteraction.excelInteractionRuntime.columnNames[0][i]);
        this[str] = '';
    }

    this.addRowData_DontChangeMe = true;
};

var excelInteractionAsyncResult = function (successful, asyncContext) {
    ///<summary> Creates the standard return parameter to any async call made to this module</summary>
    ///<param name="successful" type="bool" optional="false">initialize the return value to this value</param>
    ///<param name="asyncContext" type="Object" optional="true">Object keeping state for the callback and is passed unaltered to the callback method</param>
    ///
    this.successful = Boolean(successful);
    this.errorMessage = 'success';
    this.asyncContext = asyncContext;
    this.value = {};
};

//**********************  PRIVATE METHODS ****************************************
//   You should not call these methods directly



// THIS METHOD is not for general use, it is the selection change front-end
ExcelInteraction.internalSelectionChangedHandler = function (eventArgs) {
    ///<summary>this method is called whenever the user clicks in the table</summary>
    // nothing to do here - move on
    if (eventArgs.columnCount !== 1 || eventArgs.rowCount !== 1 || eventArgs.binding.hasHeaders === false)
        return;
    if (ExcelInteraction.excelInteractionRuntime.selectionChangedHandler === null)
        return;  // nothing to do

    eventArgs.binding.getDataAsync({ coercionType: 'table', valueType: 'unformatted', startRow: eventArgs.startRow, rowCount: 1, startColumn: 0 },
        function (asyncResult) {
            var selectedRow = ExcelInteraction.convertTableRowToExcelInteractionRowData(asyncResult.value, 0);

            if (typeof (ExcelInteraction.excelInteractionRuntime.selectionChangedHandler) === 'function')
                ExcelInteraction.excelInteractionRuntime.selectionChangedHandler(selectedRow);

        });
};





// this is an equivalent to .net string.format() extension method
String.prototype.format = String.prototype.f = function () {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};


// this is used by default, so do not delete
function defaultSelectionChangedHandler(dataRow) {

}

function convertColumnNameToVariableName(columnName) {
    ///<summary>this routine takes a column name and creates a valid variable name - IT IS NOT VERY ROBUST, MODIFY AS NEEDED </summary>
    ///

    for( i=0; i< ExcelInteraction.excelInteractionRuntime.columnNames[0].length; i++)
    {
        if (ExcelInteraction.excelInteractionRuntime.columnNames[0][i] === columnName)
        {
            return ExcelInteraction.excelInteractionRuntime.variableNames[0][i];
        }
    }
    return null;
}
