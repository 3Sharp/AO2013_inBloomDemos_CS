//For the pattern on interacting with inBloom we define an actual "class" to set
//defaults for properties that come back undefined. The class also contains methods
//for getting related entities. This can be extended and modified to suit the needs
//of each app.
//To use this ServiceApi.js MUST be loaded.
function Section(rawSection) {

    //Declare Public Properties
    this.id;
    this.uniqueSectionCode;
    this.entityType;
    this.students = [];
    this.studentGradebookEntries = [];
    this.owner = null;

    var that = this;


    //Set Properties ***************************************************************
    //id
    if (rawSection.id === undefined) {
        this.id = "";
    }
    else {
        this.id = rawSection.id;
    }

    //entityType
    if (rawSection.entityType === undefined) {
        this.entityType = "section";
    }
    else {
        this.entityType = rawSection.entityType;
    }

    //uniqueSectionCode
    if (rawSection.uniqueSectionCode === undefined) {
        this.uniqueSectionCode = "";
    }
    else {
        this.uniqueSectionCode = rawSection.uniqueSectionCode;
    }

    //Public Functions *************************************************************
    this.loadStudentGradebookEntriesByStudentAsync = function (studentId, successCallback, failCallback, doneCallback, context) {
        if (context === undefined || context === null) {
            context = new InbloomContext();
        }
        
        context.callbackStack.push(successCallback);
        ServiceApi.beginGetStudentGradebookEntries(studentId, this.id,
            loadStudentGradebookEntriesCallback, failCallback, doneCallback, context);
    };

    this.loadStudentsAsync = function (successCallback, failCallback, doneCallback, context) {
        if (context === undefined || context === null) {
            context = new InbloomContext();
        }

        context.callbackStack.push(successCallback);
        ServiceApi.beginGetSectionStudents(this.id, loadStudentsCallback,
            failCallback, doneCallback, context);
    };


    //Private Functions ************************************************************
    var loadStudentGradebookEntriesCallback = function (studentGradebookEntries, context) {
        var convertedStudentGradebookEntriesArray =
            BulkEntityConverter.convertRawStudentGradebookEntries(studentGradebookEntries);
        that.studentGradebookEntries = convertedStudentGradebookEntriesArray;
        setChildrensOwner(that.studentGradebookEntries);

        var poppedCallback = this.callbackStack.pop();

        if (poppedCallback !== null) {
            poppedCallback(context);
        }
    };

    var loadStudentsCallback = function (students, context) {
        var convertedStudentsArray = BulkEntityConverter.convertRawStudents(students);
        that.students = convertedStudentsArray;
        setChildrensOwner(that.students);
        var poppedCallback = this.callbackStack.pop();

        if (poppedCallback !== null) {
            poppedCallback(context);
        }
    };
    
    var setChildrensOwner = function (childArray) {
        for (var i = 0; i < childArray.length; i++) {
            childArray[i].owner = that;
        }
    };
}