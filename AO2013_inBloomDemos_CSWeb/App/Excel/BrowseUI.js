// This "class" handles drawing the dynamic UI for the browse portion of the page.
function BrowseUI() {

    //Public Functions
    this.DrawUI = function (sections) {
        var content = $("#browseSectionsContent");
        var ul = $("<ul>").addClass("classList");
        content.append(ul);

        for (var i = 0; i < sections.length; i++) {
            var section = sections[i];
            var li = $("<li>");
            li.text(section.uniqueSectionCode);
            ul.append(li);
            setupLIClick(li, section);
        }

        $("#loadingDiv").hide();
    };

    this.minorBrowseError = function (result, a, b) {
        var errorText = "Not all data may have been retrieved successfully";
        app.showNotification("Minor Error Loading Browse", errorText);
    };

    this.majorBrowseError = function (result, a, b) {
        var errorText = "Please reload the app and try again";
        app.showNotification("Major Browse Error", errorText);
    };

    //Private Functions
    var setupLIClick = function (li, section) {
        li.click(function () {
            fillInClassDetails(section);
        });
    };

    var fillInClassDetails = function (section) {
        clearClassDetails();
        $("#className").text(section.uniqueSectionCode);
        $("#analyzeButton")[0].onclick = function () {
            ExcelInteraction.createTableAsync(section, insertAllStudents);
        };

        var list = $("<ul>");
        $("#studentList").append(list);
        var students = section.students;
        
        for (var i = 0; i < students.length; i++) {
            var student = students[i];
            var fullName = student.firstName + " " + student.lastName;
            var li = $("<li>").text(fullName);
            if (i % 2 === 0) {
                li.addClass('oddRow');
            }
            list.append(li);

            if (student.studentGradebookEntries.length > 0) {
                var button = $("<button>").text("+");
                button.attr("type", "button");
                li.append(button);
                setStudentAddButton(button, student);
            }
        }
        showDetailsTab();
    };

    var setStudentAddButton = function (button, student) {
        button.click(function(){
            ExcelInteraction.createTableAsync(student, insertSingleStudent);
        });
    };

    var insertSingleStudent = function (context) {
        var studentRowData = createSingleStudentRowData(context.asyncContext);
        ExcelInteraction.addRowAsync(studentRowData);
    };

    var insertAllStudents = function (context) {
        var section = context.asyncContext;
        var students = section.students;

        var studentRowDataArray = [];
        for (var i = 0; i < students.length; i++) {
            var studentRowData = createSingleStudentRowData(students[i]);
            studentRowDataArray.push(studentRowData);
        }

        ExcelInteraction.addRowArrayAsync(studentRowDataArray);
    };

    var createSingleStudentRowData = function (student) {
        var studentGradebookEntries = student.studentGradebookEntries;
        var rowData = new excelInteractionRowData();
        rowData.firstName = student.firstName;
        rowData.lastName = student.lastName;
        //In this path the owner of the student is the section
        rowData.sectionName = student.owner.uniqueSectionCode;

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

        return rowData;
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

    var clearClassDetails = function () {
        $("#className").text(' ');
        $("#teacherName").text(' ');
        $("#grade").text(' ');
        $("#avgScore").text(' ');
        $("#studentList").children().remove();
    };
}