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

//This "class" handles the browse use case and runs at the start of the application.
//It gets all the sections of the logged in teacher and builds out the students under
//those sections, and the parent data for those students. It then calls to draw the
//UI.
function BrowseDataManager() {

    //Private Properties
    var browseResults = [];
    var sectionStudentsOutstanding = 0;
    var studentGetParentAssociationsOutstanding = 0;
    var parentAssociationsParentsOutstanding = 0;

    var browseUIManager = new BrowseUI();

    var that = this;

    //Public Functions
    this.beginBrowseConstruction = function () {
        browseResults = [];
        ServiceApi.beginGetSections(sectionsReturned, browseUIManager.majorBrowseError, null, null);
    };

    //Private Functions
    var sectionsReturned = function (sections) {
        var convertedSections = BulkEntityConverter.convertRawSections(sections);
        browseResults = convertedSections;
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
            callGetStudentParentAssociations(browseResults);
        }
    };

    var callGetStudentParentAssociations = function (browseResults) {
        for (var i = 0; i < browseResults.length; i++) {
            var section = browseResults[i];
            var students = section.students;

            for (var j = 0; j < students.length; j++) {
                var student = students[j];
                studentGetParentAssociationsOutstanding++;
                student.loadParentsAssociationsAsync(null, browseUIManager.minorSearchError, studentsParentAssociationsDone, null);
            }
        }
    };

    var studentsParentAssociationsDone = function (result) {
        studentGetParentAssociationsOutstanding--;

        if (studentGetParentAssociationsOutstanding === 0) {
            callStudentParentAssociationGetParents(browseResults);
        }
    };

    var callStudentParentAssociationGetParents = function (sectionsArray) {
        for (var i = 0; i < sectionsArray.length; i++) {
            var section = sectionsArray[i];
            var students = section.students;

            for (var j = 0; j < students.length; j++) {
                var student = students[j];
                var studentParentAssociations = student.parentAssociations;

                for (var k = 0; k < studentParentAssociations.length; k++) {
                    currentAssociation = studentParentAssociations[k];
                    parentAssociationsParentsOutstanding++;
                    currentAssociation.loadParent(null, browseUIManager.minorSearchError, parentDone, null);
                    currentAssociation.student = student;
                }
            }
        }   
    };

    var parentDone = function (result) {
        parentAssociationsParentsOutstanding--;

        if (parentAssociationsParentsOutstanding === 0) {
            browseUIManager.DrawUI(browseResults);
        }
    };
}