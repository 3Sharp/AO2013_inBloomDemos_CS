//This "class" handles drawing the dynamic UI for the search portion of the page.
function SearchUI() {

    //Public Functions
    this.drawSearchUi = function (searchResults) {
        //Uncomment the following to filter out sections the student does not have
        //any student gradebook entries for.
        //var searchResults = filterSearchResults(searchResults);
        //Cleanup the old content
        var content = $("#searchResults");
        content.children().remove();
        content.text('');

        if (searchResults.length === 0) {
            content.text("No Results");
            slideSearchOpen();
            $("#loadingDiv").hide();
            return;
        }

        for (var i = 0; i < searchResults.length; i++) {
            var div = $("<div>").addClass("studentResult");

            if (i % 2 === 0) {
                div.addClass("oddRow");
            }

            var student = searchResults[i];
            var fullName = student.lastName + ", " + student.firstName;
            var sections = student.sections;
            var ul = $("<ul>");
            div.append($("<span>").addClass("fullName").text(fullName));
            div.append(ul);

            for (var j = 0; j < sections.length; j++) {
                var section = sections[j];
                var li = $("<li>").text(section.uniqueSectionCode);
                ul.append(li);

                if (section.studentGradebookEntries.length > 0) {
                    var button = $("<button>").text("+");
                    button.attr("type","button");
                    li.append(button);
                    setupAddStudentButton(button, student, section);
                }
            }
            content.append(div);
            $("#loadingDiv").hide();
        }

        slideSearchOpen();
    };

    this.minorSearchError = function (result, a, b) {
        var errorText = "Not all data may have been retrieved successfully";
        app.showNotification("Minor Error During Search", errorText);
    };

    this.majorSearchError = function (result, a, b) {
        var errorText = "Please reload the app and try again";
        app.showNotification("Major Search Error", errorText);
    };

    //Private Functions
    var setupAddStudentButton = function (button, student, section) {
        button.click(function () {
            var contextObject = {};
            contextObject.student = student;
            contextObject.section = section;
            ExcelInteraction.createTableAsync(contextObject, insertStudent);
        });
    };

    var insertStudent = function (context) {
        var student = context.asyncContext.student;
        var section = context.asyncContext.section;
        var studentGradebookEntries = section.studentGradebookEntries;
        var rowData = new excelInteractionRowData();
        rowData.firstName = student.firstName;
        rowData.lastName = student.lastName;
        rowData.sectionName = section.uniqueSectionCode;
        
        //Assignments
        if (studentGradebookEntries[0] !== undefined) {
            var gradeBookDescription1 = formGradebookDescription(studentGradebookEntries[0].gradeBookEntry);
            var gradeBookScore1 = formGradebookEntryScore(studentGradebookEntries[0]);
            rowData.assignmentDescrip1 = gradeBookDescription1;
            rowData.assignmentScore1 = gradeBookScore1;
        }
        else {
            rowData.assignmentDescrip1 = "";
            rowData.assignmentScore1 = "";
        }

        if (studentGradebookEntries[1] !== undefined) {
            var gradeBookDescription2 = formGradebookDescription(studentGradebookEntries[1].gradeBookEntry);
            var gradeBookScore2 = formGradebookEntryScore(studentGradebookEntries[1]);
            rowData.assignmentDescrip2 = gradeBookDescription2;
            rowData.assignmentScore2 = gradeBookScore2;
        }
        else {
            rowData.assignmentDescrip2 = "";
            rowData.assignmentScore2 = "";
        }

        if (studentGradebookEntries[2] !== undefined) {
            var gradeBookDescription3 = formGradebookDescription(studentGradebookEntries[2].gradeBookEntry);
            var gradeBookScore3 = formGradebookEntryScore(studentGradebookEntries[2]);
            rowData.assignmentDescrip3 = gradeBookDescription3;
            rowData.assignmentScore3 = gradeBookScore3;
        }
        else {
            rowData.assignmentDescrip3 = "";
            rowData.assignmentScore3 = "";
        }

        if (studentGradebookEntries[3] !== undefined) {
            var gradeBookDescription4 = formGradebookDescription(studentGradebookEntries[3].gradeBookEntry);
            var gradeBookScore4 = formGradebookEntryScore(studentGradebookEntries[3]);
            rowData.assignmentDescrip4 = gradeBookDescription4;
            rowData.assignmentScore4 = gradeBookScore4;
        }
        else {
            rowData.assignmentDescrip4 = "";
            rowData.assignmentScore4 = "";
        }

        if (studentGradebookEntries[4] !== undefined) {
            var gradeBookDescription5 = formGradebookDescription(studentGradebookEntries[4].gradeBookEntry);
            var gradeBookScore5 = formGradebookEntryScore(studentGradebookEntries[4]);
            rowData.assignmentDescrip5 = gradeBookDescription5;
            rowData.assignmentScore5 = gradeBookScore5;
        }
        else {
            rowData.assignmentDescrip5 = "";
            rowData.assignmentScore5 = "";
        }

        ExcelInteraction.addRowAsync(rowData);
    };

    var formGradebookEntryScore = function (studentGradebookEntry) {
        if (studentGradebookEntry === undefined || studentGradebookEntry === null) {
            return "";
        }

        if (studentGradebookEntry.numericGradeEarned !== "") {
            return studentGradebookEntry.numericGradeEarned;
        }
        else if (studentGradebookEntry.letterGradeEarned !== "") {
            return studentGradebookEntry.letterGradeEarned;
        }
        else {
            return "";
        }
    };

    var formGradebookDescription = function (gradebookEntry) {
        if (gradebookEntry === undefined || gradebookEntry === null) {
            return "";
        }
        var gradebookDescription = "Unknown";
        if (gradebookEntry.description !== "") {
            gradebookDescription = gradebookEntry.description;
        }
        else if (gradebookEntry.dateAssigned !== "" && gradebookEntry.gradebookEntryType !== "") {
            gradebookDescription = gradebookEntry.gradebookEntryType + " " + gradebookEntry.dateAssigned;
        }
        else if (gradebookEntry.gradebookEntryType !== "") {
            gradebookDescription = gradebookEntry.gradebookEntryType;
        }
        else if (gradebookEntry.dateAssigned !== "") {
            gradebookDescription = gradebookEntry.dateAssigned;
        }

        return gradebookDescription;
    };

    //If you want to filter the results to only sections that have student gradebook
    //entries, call this method.
    var filterSearchResults = function (searchResults) {
        var filteredResults = [];
        for (var i = 0; i < searchResults.length; i++) {
            var student = searchResults[i];
            var studentSections = student.sections;
            var filteredStudentSections = [];
            for (var j = 0; j < studentSections.length; j++) {
                var section = studentSections[j];
                if (section.studentGradebookEntries.length > 0) {
                    filteredStudentSections.push(section);
                }
                student.sections = filteredStudentSections;
            }
            filteredResults.push(student);
        }
        return filteredResults;
    };

    var slideSearchOpen = function () {
        $("#searchResults").slideDown(200);
        var header = $("#searchResults").siblings("header");
        header.removeClass("open");
        header.addClass("close");
    };
}