//For the pattern on interacting with inBloom we define an actual "class" to set
//defaults for properties that come back undefined. The class also contains methods
//for getting related entities. This can be extended and modified to suit the needs
//of each app.
//To use this ServiceApi.js MUST be loaded.
function GradebookEntry(rawGradebookEntry) {
    //Declare public variables
    this.id;
    this.description;
    this.entityType;
    this.gradebookEntryType;
    this.dateAssigned;
    this.owner = null;

    //Set Properties ****************************************************************
    //id
    if (rawGradebookEntry.id === undefined) {
        this.id = "";
    }
    else {
        this.id = rawGradebookEntry.id;
    }

    //description
    if (rawGradebookEntry.description === undefined) {
        //In case we want to put this in excel, it needs to be not null or undefined
        this.description = "";
    }
    else {
        this.description = rawGradebookEntry.description;
    }

    //entityType
    if (rawGradebookEntry.entityType === undefined) {
        this.entityType = "gradebookEntry";
    }
    else {
        this.entityType = rawGradebookEntry.entityType;
    }

    //gradebookEntryType
    if (rawGradebookEntry.gradebookEntryType === undefined) {
        this.gradebookEntryType = "";
    }
    else {
        this.gradebookEntryType = rawGradebookEntry.gradebookEntryType;
    }

    //dateAssigned
    if (rawGradebookEntry.dateAssigned === undefined) {
        this.dateAssigned = "";
    }
    else {
        this.dateAssigned = rawGradebookEntry.dateAssigned;
    }
    
}