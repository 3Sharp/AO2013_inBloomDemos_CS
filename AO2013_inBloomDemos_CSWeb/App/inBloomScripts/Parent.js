//For the pattern on interacting with inBloom we define an actual "class" to set
//defaults for properties that come back undefined. The class also contains methods
//for getting related entities. This can be extended and modified to suit the needs
//of each app.
//To use this ServiceApi.js MUST be loaded.
function Parent(rawParent) {

    //Declare Public Properties
    this.addresses;
    this.entityType;
    this.id;
    this.firstName;
    this.lastName;
    this.sex;
    this.owner = null;

    //Set Properties
    //addresses
    if (rawParent.address === undefined) {
        this.addresses = [];
    }
    else {
        this.addresses = BulkEntityConverter.convertRawAddresses(rawParent.address);
    }

    //entityType
    if (rawParent.entityType === undefined) {
        this.entityType = "parent";
    }
    else {
        this.entityType = rawParent.entityType;
    }

    //id
    if (rawParent.id === undefined) {
        this.id = "";
    }
    else {
        this.id = rawParent.id;
    }

    //firstName
    if (rawParent.name.firstName === undefined) {
        this.firstName = "";
    }
    else {
        this.firstName = rawParent.name.firstName;
    }

    //lastName
    if (rawParent.name.lastSurname === undefined) {
        this.lastName = "";
    }
    else {
        this.lastName = rawParent.name.lastSurname;
    }

    if (rawParent.sex === undefined) {
        this.sex = "";
    }
    else {
        this.sex = rawParent.sex;
    }
}