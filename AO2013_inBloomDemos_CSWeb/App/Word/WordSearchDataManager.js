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

//This "class" handles searching for a student by name. It goes through each student
//returned by the search API and attempts to get all of the parent data for the students.
function SearchDataManager() {

    //Private Properties
    var searchResults = [];
    var studentGetParentAssociationsOutstanding = 0;
    var parentAssociationsParentsOutstanding = 0;

    var searchUIManager = new WordSearchUI();
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
            callGetStudentsParentAssociations(searchResults);
        }
        else {
            searchUIManager.DrawUI(students);
        }
    };

    var callGetStudentsParentAssociations = function (studentsArray) {
        for (var i = 0; i < studentsArray.length; i++) {
            var currentStudent = studentsArray[i];
            studentGetParentAssociationsOutstanding++;
            currentStudent.loadParentsAssociationsAsync(null, searchUIManager.minorSearchError, studentsParentAssociationsDone, null);
        }
    };

    var studentsParentAssociationsDone = function (result) {
        studentGetParentAssociationsOutstanding--;

        if (studentGetParentAssociationsOutstanding === 0) {
            callStudentParentAssociationGetParents(searchResults);
        }
    };

    var callStudentParentAssociationGetParents = function (studentsArray) {
        var studentsWithNoParents = 0;
        for (var i = 0; i < studentsArray.length; i++) {
            var student = studentsArray[i];
            var studentParentAssociations = student.parentAssociations;

            if (studentParentAssociations.length === 0) {
                studentsWithNoParents++;
            }

            for (var j = 0; j < studentParentAssociations.length; j++) {
                currentAssociation = studentParentAssociations[j];
                parentAssociationsParentsOutstanding++;
                currentAssociation.loadParent(null, searchUIManager.minorSearchError, parentDone, null);
                currentAssociation.student = student;
            }

            //If No one had parents to get just call draw.
            if (studentsWithNoParents === studentsArray.length) {
                searchUIManager.DrawUI(searchResults);
            }
        }
    };

    var parentDone = function (result) {
        parentAssociationsParentsOutstanding--;

        if (parentAssociationsParentsOutstanding === 0) {
            searchUIManager.DrawUI(searchResults);
        }
    };
}