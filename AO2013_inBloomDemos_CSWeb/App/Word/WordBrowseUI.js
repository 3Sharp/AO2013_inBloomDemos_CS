// This "class" handles drawing the dynamic UI for the browse portion of the page.
function BrowseUI() {

    //Private Properties
    var wordManager = new WordInteraction();

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
        searchError = true;
        var errorText = "Not all data may have been retrieved successfully";
        app.showNotification("Minor Error Loading Browse", errorText);
    };

    this.majorBrowseError = function (result, a, b) {
        searchError = true;
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

            var button = $("<button>").text("+");
            button.attr("type", "button");
            li.append(button);
            setStudentAddButton(button, student);
        }
        showDetailsTab();
    };

    var setStudentAddButton = function (button, student) {
        button.click(function () {
            wordManager.beginInsertStudent(student);
        });
    };

    var clearClassDetails = function () {
        $("#className").text(' ');
        $("#teacherName").text(' ');
        $("#grade").text(' ');
        $("#avgScore").text(' ');
        $("#studentList").children().remove();
    };
}