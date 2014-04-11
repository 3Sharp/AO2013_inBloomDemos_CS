//This "class" handles drawing the dynamic UI for the search portion of the page
function WordSearchUI() {

    //Private Properties
    var wordManager = new WordInteraction();

    //Public Functions
    this.DrawUI = function (searchResults) {
        var content = $("#searchResults");
        content.children().remove();
        content.text('');

        if (searchResults.length === 0) {
            content.text("No Results");
            slideSearchOpen();
            $("#loadingDiv").hide();
        }

        var ul = $("<ul>");
        content.append(ul);

        for (var i = 0; i < searchResults.length; i++) {
            var li = $("<li>");
            if (i % 2 === 0) {
                li.addClass("oddRow");
            }

            var student = searchResults[i];
            var fullName = student.lastName + ", " + student.firstName;
            li.append($("<span>").addClass("fullName").text(fullName));
            ul.append(li);

            var button = $("<button>").text("+");
            button.attr("type", "button");
            button.addClass("searchAddButton");
            li.append(button);

            setupAddStudentButton(button, student);
        }

        slideSearchOpen();
        $("#loadingDiv").hide();
    };

    this.minorSearchError = function (result, a, b) {
        searchError = true;
        var errorText = "Not all data may have been retrieved successfully";
        app.showNotification("Minor Error During Search", errorText);
    };

    this.majorSearchError = function (result, a, b) {
        searchError = true;
        var errorText = "Please reload the app and try again";
        app.showNotification("Major Search Error", errorText);
    };

    //Private Functions
    var setupAddStudentButton = function (button, student) {
        button.click(function () {
            wordManager.beginInsertStudent(student);
        });
    };

    var slideSearchOpen = function () {
        $("#searchResults").slideDown(200);
        var header = $("#searchResults").siblings("header");
        header.removeClass("open");
        header.addClass("close");
    };
}
