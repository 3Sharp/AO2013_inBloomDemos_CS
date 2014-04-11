//For the pattern on interacting with inBloom we define an actual "class" to set
//defaults for properties that come back undefined. The class also contains methods
//for getting related entities. This can be extended and modified to suit the needs
//of each app.
//To use this ServiceApi.js MUST be loaded.

function Address(rawAddress) {

    //Declare Public Properties
    this.addressType;
    this.buildingNumber;
    this.city;
    this.stateAbbreviation;
    this.street;
    this.unitNumber;
    this.zip;

    //Set Properties
    //addressType
    if (rawAddress.addressType === undefined) {
        this.addressType = "";
    }
    else {
        this.addressType = rawAddress.addressType;
    }

    //buildingNumber
    if (rawAddress.buildingSiteNumber === undefined) {
        this.buildingNumber = "";
    }
    else {
        this.buildingNumber = rawAddress.buildingSiteNumber;
    }

    //city
    if (rawAddress.city === undefined) {
        this.city = "";
    }
    else {
        this.city = rawAddress.city;
    }

    //stateAbbreviation
    if (rawAddress.stateAbbreviation === undefined) {
        this.stateAbbreviation = "";
    }
    else {
        this.stateAbbreviation = rawAddress.stateAbbreviation;
    }

    //street
    if (rawAddress.streetNumberName === undefined) {
        this.street = "";
    }
    else {
        this.street = rawAddress.streetNumberName;
    }

    //unitNumber
    if (rawAddress.apartmentRoomSuiteNumber === undefined) {
        this.unitNumber = "";
    }
    else {
        this.unitNumber = rawAddress.apartmentRoomSuiteNumber;
    }

    //zip
    if (rawAddress.postalCode === undefined) {
        this.zip = "";
    }
    else {
        this.zip = rawAddress.postalCode;
    }

}