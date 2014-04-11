//Because each use case for getting the necessary data is different (such as the chains
//to get everything) we followed a pattern where the actual steps for getting each data
//entity are handled at the specific app level.
//The pattern is one public call to begin the process, and various private functions to
//handle getting the entities. To keep track of the async calls we increment a counter
//for each call made and decrement it in the doneCallback (which boils down to jqueries
//.always()).
//For code sample purposes this was broken into phases, such as get all students, then
//get the sections for every student, then get the student gradebook entries, etc etc.
//This phasing can be left out in production to optimize.
//The results are kept in a private array that acts much like an array of doubly linked
//lists. This builds out the chain of data for each entity.
//There is currently no caching, which would greatly improve performance. This was left
//out so as to keep the code as simple as possible.

//This "class" handles searching for a student by name. It moves through the hierarchy
//getting all the necessary data for each student in the search results and then calls
//to draw the UI.
function SearchDataManager() {

    //Private properties
    //searchResults will always be an array of students, which will hold their sections,
    //which will hold their studentGradebookEntries and works like a doubly linked list.
    var searchResults = [];
    var studentGetSectionsOutstanding = 0;
    var sectionGetStudentGradebooksOutstanding = 0;
    var studentGradebookGetGradebookOutstanding = 0;

    var searchUIManager = new SearchUI();

    var that = this;

    //Public Functions

    this.beginSearch = function (searchText) {
        searchResults = [];
        ServiceApi.beginStudentSearch(searchText, studentsReturned, searchUIManager.majorSearchError, null, null);
    };

    //Private Functions

    var studentsReturned = function (students) {
        if (students.length > 0) {
            var convertedStudentsArray = BulkEntityConverter.convertRawStudents(students);
            searchResults = convertedStudentsArray;
            callStudentGetSections(searchResults);
        }
        else {
            searchUIManager.drawSearchUi(students);
        }
    };

    var callStudentGetSections = function (studentsArray) {
        for (var i = 0; i < studentsArray.length; i++) {
            var currentStudent = studentsArray[i];
            studentGetSectionsOutstanding++;
            currentStudent.loadSectionsAsync(null, searchUIManager.minorSearchError, studentGetSectionDone, null);
        }
    };

    var studentGetSectionDone = function (result) {
        studentGetSectionsOutstanding--;

        if (studentGetSectionsOutstanding === 0) {
            callSectionStudentGradebookEntries(searchResults);
        }
    };

    var callSectionStudentGradebookEntries = function (studentsArray) {
        for (var i = 0; i < studentsArray.length; i++) {
            var currentStudent = studentsArray[i];
            var currentStudentSections = currentStudent.sections;

            for (var j = 0; j < currentStudentSections.length; j++) {
                var currentSection = currentStudentSections[j];
                sectionGetStudentGradebooksOutstanding++;
                currentSection.loadStudentGradebookEntriesByStudentAsync(currentStudent.id, null, searchUIManager.minorSearchError, sectionStudentGradebookEntryDone, null);
            }
        }
    };

    var sectionStudentGradebookEntryDone = function(result) {
        sectionGetStudentGradebooksOutstanding--;

        if (sectionGetStudentGradebooksOutstanding === 0) {
            callStudentGradebookEntryGetGradebookEntry(searchResults);
        }
    };

    var callStudentGradebookEntryGetGradebookEntry = function (studentsArray) {
        for (var i = 0; i < studentsArray.length; i++) {
            var currentStudent = studentsArray[i];
            var currentStudentSections = currentStudent.sections;

            for (var j = 0; j < currentStudentSections.length; j++) {
                var currentSection = currentStudentSections[j];
                var currentStudentGradebookEntries = currentSection.studentGradebookEntries;

                for (var k = 0; k < currentStudentGradebookEntries.length; k++) {
                    var currentStudentGradebookEntry = currentStudentGradebookEntries[k];
                    currentStudentGradebookEntry.loadGradebookEntryAsync(null, searchUIManager.minorSearchError, studentGradebookEntryGradebookEntryDone, null);
                    studentGradebookGetGradebookOutstanding++;
                }
            }
        }
    };

    var studentGradebookEntryGradebookEntryDone = function (results) {
        studentGradebookGetGradebookOutstanding--;

        if (studentGradebookGetGradebookOutstanding === 0) {
            searchUIManager.drawSearchUi(searchResults);
        }
    };
}