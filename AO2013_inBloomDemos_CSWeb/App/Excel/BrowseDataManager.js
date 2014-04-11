//Because each use case for getting the necessary data is different (such as the chains
//to get everything) we followed a pattern where the actual steps for getting each data
//entity are handled at the specific app level.
//The pattern is one public call to begin the process, and various private functions to
//handle getting the entities. To keep track of the async calls we increment a counter
//for each call made and decrement it in the doneCallback (which boils down to Jquery's
//.always()).
//For code sample purposes this was broken into phases, such as get all students, then
//get the sections for every student, then get the student grade book entries, etc etc.
//This phasing can be left out in production to optimize.
//The results are kept in a private array that acts much like an array of doubly linked
//lists. This builds out the chain of data for each entity.
//There is currently no caching, which would greatly improve performance. This was left
//out so as to keep the code as simple as possible.

//This "class" handles retrieving the sections and students for the browse use case.
//This gets called once when the application starts.
function BrowseDataManager() {
    //Private properties
    var browseResults = [];
    var browseUIManager = new BrowseUI();
    var sectionStudentsOutstanding = 0;
    var studentStudentGradebookEntriesOutstanding = 0;
    var studentGradebookEntryGradebookEntriesOutstanding = 0;
    var that = this;

    //Public functions
    this.beginBrowseConstruction = function () {
        browseResults = [];
        ServiceApi.beginGetSections(sectionsReturned, browseUIManager.majorBrowseError, null, null);
        
    };

    //Private functions
    var sectionsReturned = function (sections) {
        var convertedResults = BulkEntityConverter.convertRawSections(sections);
        browseResults = convertedResults;
        callGetSectionStudents(browseResults);
    };

    var callGetSectionStudents = function (sections) {
        for (var i = 0; i < sections.length; i++) {
            var currentSection = sections[i];
            sectionStudentsOutstanding++;
            currentSection.loadStudentsAsync(null, browseUIManager.minorBrowseError, sectionGetStudentsDone, null);
        }
    };

    var sectionGetStudentsDone = function (result) {
        sectionStudentsOutstanding--;

        if (sectionStudentsOutstanding === 0) {
            callGetStudentsStudentGradebookEntries(browseResults);
        }
    };

    var callGetStudentsStudentGradebookEntries = function (sections) {
        for (var i = 0; i < sections.length; i++) {
            var currentSection = sections[i];
            var sectionsStudents = currentSection.students;

            for (var j = 0; j < sectionsStudents.length; j++) {
                var currentStudent = sectionsStudents[j];
                studentStudentGradebookEntriesOutstanding++;
                currentStudent.loadStudentGradebookEntriesBySectionAsync(currentSection.id,null, browseUIManager.minorBrowseError, studentStudentGradebookEntriesDone, null);
            }
        }
    };

    var studentStudentGradebookEntriesDone = function(result) {
        studentStudentGradebookEntriesOutstanding--;

        if (studentStudentGradebookEntriesOutstanding === 0) {
            callGetStudentGradebookEntriesGradebookEntry(browseResults);
        }
    };

    var callGetStudentGradebookEntriesGradebookEntry = function (sections) {
        for (var i = 0; i < sections.length; i++) {
            var currentSection = sections[i];
            var sectionsStudents = currentSection.students;

            for (var j = 0; j < sectionsStudents.length; j++) {
                var currentStudent = sectionsStudents[j];
                var currentStudentGradebookEntries = currentStudent.studentGradebookEntries;

                for (var k = 0; k < currentStudentGradebookEntries.length; k++) {
                    var currentStudentGradebookEntry = currentStudentGradebookEntries[k];
                    studentGradebookEntryGradebookEntriesOutstanding++;
                    currentStudentGradebookEntry.loadGradebookEntryAsync(null, browseUIManager.minorBrowseError, gradebookEntryDone, null);
                }
            }
        }
    };

    var gradebookEntryDone = function (result) {
        studentGradebookEntryGradebookEntriesOutstanding--;

        //For each section, if it has students, order the students studentGradebookEntries
        if (studentGradebookEntryGradebookEntriesOutstanding === 0) {
            for (var i = 0; i < browseResults.length; i++) {
                if (browseResults[i].students.length > 0) {
                    orderStudentGradebookEntries(browseResults[i]);
                }
            }
            browseUIManager.DrawUI(browseResults);
        }
    };

    //This function orders student gradebook entries by their gradebook entry date.
    //This helps keep the entries aligned in the proper columns in excel.
    var orderStudentGradebookEntries = function (section) {
        var students = section.students;
        for (i = 0; i < students.length; i++) {
            var student = students[i];
            var studentGradebookEntries = student.studentGradebookEntries;

            if (studentGradebookEntries.length > 1) {
                //simple insertion sort based on gradebookEntry date
                for (var j = 0; j < studentGradebookEntries.length; j++) {
                    var toInsert = studentGradebookEntries[j];
                    var position = j;

                    //Doesn't handle missing dateAssigned or missing gradebook entry
                    while (position > 0 && toInsert.gradeBookEntry.dateAssigned < studentGradebookEntries[position - 1].gradeBookEntry.dateAssigned) {
                        studentGradebookEntries[position] = studentGradebookEntries[position - 1];
                        position--;
                    }
                    studentGradebookEntries[position] = toInsert;
                }
            }
        }
    };
}