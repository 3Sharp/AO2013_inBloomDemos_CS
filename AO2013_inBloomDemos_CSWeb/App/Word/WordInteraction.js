//This "class" handles the actual interaction with word. For this app this means
//inserting data into the templates custom xml parts.

function WordInteraction() {

    //Public Functions
    this.beginInsertStudent = function (student) {
        //If a new template is made this guid will need to be updated by adding .zip 
        //to the end of the .docx file, extracting, navigating to the customxmlparts
        //subfolder, and getting it from the correct itemProps.xml
        Office.context.document.customXmlParts.getByIdAsync("{3B0BEB97-A000-4CD2-B208-1B891E83C6F4}",
            { asyncContext: student }, GotCustomXmlPart);
    };

    //Private Functions
    var GotCustomXmlPart = function(asyncResult) {
        var asyncContext = asyncResult.asyncContext;
        asyncResult.value.getNodesAsync("*/*", { asyncContext: asyncContext }, SetStudentInfo);
    };

    var SetStudentInfo = function (asyncResult) {
        if (asyncResult.status === "succeeded") {
            if (asyncResult.asyncContext !== undefined) {
                var student = asyncResult.asyncContext;
                var nodes = asyncResult.value;
                var parent = setParent(student.parentAssociations);
                var studentName = student.firstName + " " + student.lastName;

                //If we leave this as an empty string when not found, word will automatically
                //put in the phrase "Click here to insert text". For code sample purposes I've
                //made this a dash, but if used in production you may want to make it a space
                //so it's not visible.
                var parentPrefix = "-";
                var parentName = "Parent/Guardian of " + studentName;

                if (parent !== null) {
                    if (parent.sex === "male") {
                        parentPrefix = "Mr.";
                    }
                    else if (parent.sex === "female") {
                        parentPrefix = "Ms.";
                    }

                    parentName = parent.firstName + " " + parent.lastName;
                }

                var address = "No Address on Record";
                var city = "No City on File";
                var state = "No State on File";
                var zip = "No Zip Code on File";
                var fullAddress = null;

                //Since only a parent with at least one valid address is considered good,
                //and we've already checked for that a parent is guaranteed to have an address
                //if it's not null.
                if (parent !== null) {
                    //For code sample purposes we're only using the first address found
                    //in production it would likely use the address with type "Mailing"
                    //or "Home"
                    fullAddress = parent.addresses[0];
                }
                else if (student.addresses.length > 0) {
                    fullAddress = student.addresses[0];
                }

                if (fullAddress !== null) {
                    address = fullAddress.street;
                    if (fullAddress.unitNumber !== "") {
                        address += " #" + fullAddress.unitNumber;
                    }

                    city = fullAddress.city;
                    state = fullAddress.city;
                    zip = fullAddress.zip;
                }
              
                //Any change to the structure of the custom xml part will require possible changes to keep the array synced.
                nodes[0].setXmlAsync("<ParentPrefix xmlns=\"StudentInfo\">" + parentPrefix + "</ParentPrefix>");
                nodes[1].setXmlAsync("<ParentName xmlns=\"StudentInfo\">" + parentName + "</ParentName>");
                nodes[2].setXmlAsync("<AddressLine1 xmlns=\"StudentInfo\">" + address + "</AddressLine1>");
                nodes[4].setXmlAsync("<City xmlns=\"StudentInfo\">" + city + "</City>");
                nodes[5].setXmlAsync("<State xmlns=\"StudentInfo\">" + state + "</State>");
                nodes[6].setXmlAsync("<Zip xmlns=\"StudentInfo\">" + zip + "</Zip>");
                nodes[7].setXmlAsync("<StudentName xmlns=\"StudentInfo\">" + studentName + "</StudentName>");
            }
        }
    };


    //Checks through the parents to find which one should be used.
    var setParent = function (parentAssociations) {
        var parent = null;
        if (parentAssociations.length > 0) {
            var lastUsedContactPriority = -1;
            for (var i = 0; i < parentAssociations.length; i++) {
                var currentAssociation = parentAssociations[i];
                //If we hit the primary contact, and it has an address, we're done.
                if (currentAssociation.primaryContactStatus && currentAssociation.parent.addresses.length > 0) {
                    parent = currentAssociation.parent;
                    break;
                }
                //We only care about parents that have an address
                else if (currentAssociation.parent.addresses.length > 0) {
                    //No parent yet, if this one is good, set it.
                    if (parent === null) {
                        //Treat contacts with a priority -1 as if they don't exist.
                        if (currentAssociation.contactPriority > -1) {
                            parent = currentAssociation.parent;
                            lastUsedContactPriority = currentAssociation.contactPriority;
                        }
                    }
                    //The closer to 1 the higher the priority.
                    else if (currentAssociation.contactPriority < parent.contactPriority) {
                        parent = currentAssociation.parent;
                    }
                }
            }
        }

        return parent;
    };
}