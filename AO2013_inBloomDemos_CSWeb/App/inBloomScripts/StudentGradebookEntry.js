//For the pattern on interacting with inBloom we define an actual "class" to set
//defaults for properties that come back undefined. The class also contains methods
//for getting related entities. This can be extended and modified to suit the needs
//of each app.
//To use this ServiceApi.js MUST be loaded.
function StudentGradebookEntry(rawStudentGradebookEntry) {
    //Declare Public Properties
    this.id;
    this.letterGradeEarned;
    this.numericGradeEarned;
    this.sectionId;
    this.studentId;
    this.gradebookEntryId;
    this.entityType;
    this.owner = null;
    this.gradeBookEntry = null;

    //Private Properties
    var that = this;

    //Set Properties ****************************************************************
    //id
    if (rawStudentGradebookEntry.id === undefined) {
        this.id = "";
    }
    else {
        this.id = rawStudentGradebookEntry.id;
    }

    //letterGradeEarned
    if (rawStudentGradebookEntry.letterGradeEarned === undefined) {
        this.letterGradeEarned = "";
    }
    else {
        this.letterGradeEarned = rawStudentGradebookEntry.letterGradeEarned;
    }

    //numericGradeEarned
    if (rawStudentGradebookEntry.numericGradeEarned === undefined) {
        this.numericGradeEarned = "";
    }
    else {
        this.numericGradeEarned = rawStudentGradebookEntry.numericGradeEarned;
    }

    //sectionId
    if (rawStudentGradebookEntry.sectionId === undefined) {
        this.sectionId = "";
    }
    else {
        this.sectionId = rawStudentGradebookEntry.sectionId;
    }

    //studentId
    if (rawStudentGradebookEntry.studentId === undefined) {
        this.studentId = "";
    }
    else {
        this.studentId = rawStudentGradebookEntry.studentId;
    }

    //gradebookEntryId
    if (rawStudentGradebookEntry.gradebookEntryId === undefined) {
        this.gradebookEntryId = "";
    }
    else {
        this.gradebookEntryId = rawStudentGradebookEntry.gradebookEntryId;
    }

    //entityType
    if (rawStudentGradebookEntry.entityType === undefined) {
        this.entityType = "studentGradebookEntry";
    }
    else {
        this.entityType = rawStudentGradebookEntry.entityType;
    }

    //Public Functions *************************************************************
    this.loadGradebookEntryAsync = function (successCallback, failCallback, doneCallback, context) {
        if (context === undefined || context === null) {
            context = new InbloomContext();
        }
        context.callbackStack.push(successCallback);
        ServiceApi.beginGetGradebookEntry(this.gradebookEntryId,
            loadGradebookEntryCallback, failCallback, doneCallback, context);
    };

    //Private Functions ************************************************************
    var loadGradebookEntryCallback = function (gradebookEntry, context) {
        var convertedGradebookEntry = new GradebookEntry(gradebookEntry);
        that.gradeBookEntry = convertedGradebookEntry;
        that.gradeBookEntry.owner = that;
        //This works because jqueries ajax will set this to be the context object
        var poppedCallback = this.callbackStack.pop();

        if (poppedCallback !== null) {
            poppedCallback(context);
        }
    };
}