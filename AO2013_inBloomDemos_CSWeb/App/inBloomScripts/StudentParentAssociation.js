//For the pattern on interacting with inBloom we define an actual "class" to set
//defaults for properties that come back undefined. The class also contains methods
//for getting related entities. This can be extended and modified to suit the needs
//of each app.
//To use this ServiceApi.js MUST be loaded.
function StudentParentAssociation(rawStudentParentAssociation) {

    //Declare Public Properties
    this.id;
    this.contactPriority;
    this.primaryContactStatus;
    this.parentId;
    this.studentId;
    this.parent = null;
    this.student = null;
    this.owner = null;

    //Private Properties
    var that = this;

    //Set Properties ***************************************************************
    //id
    if (rawStudentParentAssociation.id === undefined) {
        this.id = "";
    }
    else {
        this.id = rawStudentParentAssociation.id;
    }

    //contactPriority
    if (rawStudentParentAssociation.contactPriority === undefined) {
        this.contactPriority = -1;
    }
    else {
        this.contactPriority = rawStudentParentAssociation.contactPriority;
    }

    //primaryContactStatus
    if (rawStudentParentAssociation.primaryContactStatus === undefined) {
        this.primaryContactStatus = false;
    }
    else {
        this.primaryContactStatus = rawStudentParentAssociation.primaryContactStatus;
    }

    //studentId
    if (rawStudentParentAssociation.studentId === undefined) {
        this.studentId = "";
    }
    else {
        this.studentId = rawStudentParentAssociation.studentId;
    }

    //parentId
    if (rawStudentParentAssociation.parentId === undefined) {
        this.parentId = "";
    }
    else {
        this.parentId = rawStudentParentAssociation.parentId;
    }

    //Public Functions *************************************************************
    this.loadParent = function (successCallback, failCallback, doneCallback, context) {
        if (context === undefined || context === null) {
            context = new InbloomContext();
        }

        context.callbackStack.push(successCallback);
        ServiceApi.beginGetParent(this.parentId, loadParentCallback, failCallback, doneCallback, context);
    };

    //Private Functions ************************************************************
    var loadParentCallback = function (rawParent) {
        var convertedParent = new Parent(rawParent);
        that.parent = convertedParent;
        that.parent.owner = this;

        var poppedCallback = this.callbackStack.pop();

        if (poppedCallback !== null) {
            poppedCallback(context);
        }
    };
}