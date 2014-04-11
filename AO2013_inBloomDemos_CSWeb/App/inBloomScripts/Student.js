//For the pattern on interacting with inBloom we define an actual "class" to set
//defaults for properties that come back undefined. The class also contains methods
//for getting related entities. This can be extended and modified to suit the needs
//of each app.
//To use this ServiceApi.js MUST be loaded.
function Student(rawStudent) {
    
    //Declare Public Properties
    this.id;
    this.firstName;
    this.lastName;
    this.addresses;
    this.entityType;
    this.owner = null;

    //inBloom requires an additional call to
    //get this information
    this.parentAssociations = [];
    this.sections = [];
    this.studentGradebookEntries = [];

    //Private Properties
    //Workaround to get at this object from within "private" functions
    var that = this;

    //Set Properties ***************************************************************
    //id
    if (rawStudent.id === undefined) {
        this.id = "";
    }
    else {
        this.id = rawStudent.id;
    }

    //firstName
    if (rawStudent.name.firstName === undefined) {
        this.firstName = "";
    }
    else {
        this.firstName = rawStudent.name.firstName;
    }

    //lastName
    if (rawStudent.name.lastSurname === undefined) {
        this.lastName = "";
    }
    else {
        this.lastName = rawStudent.name.lastSurname;
    }

    //addresses
    if (rawStudent.address === undefined) {
        this.addresses = [];
    }
    else {
        this.addresses = BulkEntityConverter.convertRawAddresses(rawStudent.address);
    }

    //entityType
    if (rawStudent.entityType === undefined) {
        this.entityType = "student";
    }
    else {
        this.entityType = rawStudent.entityType;
    }

    //Public Functions *************************************************************
    this.loadParentsAssociationsAsync = function (successCallback, failCallback, doneCallback,context) {
        //Form our standard context object if it doesn't already exist.
        if (context === undefined || context === null) {
            context = new InbloomContext();
        }

        context.callbackStack.push(successCallback);
        ServiceApi.beginGetStudentParentAssociations(this.id, loadParentAssociationsCallback, failCallback, doneCallback, context);
    };

    this.loadSectionsAsync = function (successCallback, failCallback, doneCallback,context) {
        if (context === undefined || context === null) {
            context = new InbloomContext();
        }

        context.callbackStack.push(successCallback);

        ServiceApi.beginGetStudentSections(this.id, loadSectionsCallback,
            failCallback, doneCallback, context);
    };

    this.loadStudentGradebookEntriesBySectionAsync = function (sectionId, successCallback, failCallback, doneCallback, context) {
        if (context === undefined || context === null) {
            context = new InbloomContext();
        }

        context.callbackStack.push(successCallback);

        ServiceApi.beginGetStudentGradebookEntries(this.id, sectionId,
            loadStudentGradebookEntriesBySectionCallback, failCallback, doneCallback, context);
    };

    //Private Functions ************************************************************
    var loadParentAssociationsCallback = function (studentParentAssociations) {
        //Convert the parents from the raw JSON to an array of our Parent objects,
        //then assign that.parents to the array.
        var convertedParentsArray = BulkEntityConverter.convertRawStudentParentAssociations(studentParentAssociations);
        that.parentAssociations = convertedParentsArray;
        setChildrensOwner(that.parentAssociations);

        var poppedCallback = this.callbackStack.pop();

        if (poppedCallback !== null) {
            poppedCallback(context);
        }
    };

    var loadSectionsCallback = function (sections) {
        var convertedSectionsArray = BulkEntityConverter.convertRawSections(sections);
        that.sections = convertedSectionsArray;
        setChildrensOwner(that.sections);
        var poppedCallback = this.callbackStack.pop();

        if (poppedCallback !== null) {
            poppedCallback(context);
        }
    };

    var loadStudentGradebookEntriesBySectionCallback = function (studentGradebookEntries) {
        var convertedStudentGradebookEntriesArray =
            BulkEntityConverter.convertRawStudentGradebookEntries(studentGradebookEntries);
        that.studentGradebookEntries = convertedStudentGradebookEntriesArray;

        setChildrensOwner(that.studentGradebookEntries);
        var poppedCallback = this.callbackStack.pop();

        if (poppedCallback !== null) {
            poppedCallback(context);
        }
    };

    var setStudentParentAssociationsStudent = function (studentParentAssociations) {
        for (var i = 0; i < studentParentAssociations.length; i++) {
            studentParentAssociations[i].student = that;
        }
    };

    var setChildrensOwner = function (childArray) {
        for (var i = 0; i < childArray.length; i++) {
            childArray[i].owner = that;
        }
    };
}