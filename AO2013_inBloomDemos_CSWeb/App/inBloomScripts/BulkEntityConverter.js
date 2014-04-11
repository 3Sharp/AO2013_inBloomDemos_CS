//Singleton to handle converting arrays of inBloom JSON objects to our app version
//of the entities.
var BulkEntityConverter = {};

BulkEntityConverter.convertRawAddresses = function (rawAddresses) {
    var convertedAddresses = [];

    for (var i = 0; i < rawAddresses.length; i++) {
        convertedAddresses.push(new Address(rawAddresses[i]));
    }

    return convertedAddresses;
};

BulkEntityConverter.convertRawStudentParentAssociations = function (rawStudentParentAssociations) {
    var convertedAssociations = [];

    for (var i = 0; i < rawStudentParentAssociations.length; i++) {
        convertedAssociations.push(new StudentParentAssociation(rawStudentParentAssociations[i]));
    }

    return convertedAssociations;
};

BulkEntityConverter.convertRawParents = function (rawParents) {
    var convertedParents = [];

    for (var i = 0; i < rawParents.length; i++) {
        convertedParents.push(new Parent(rawParents[i]));
    }

    return convertedParents;
};

BulkEntityConverter.convertRawSections = function (rawSections) {
    var convertedSections = [];

    for (var i = 0; i < rawSections.length; i++) {
        convertedSections.push(new Section(rawSections[i]));
    }

    return convertedSections;
};

BulkEntityConverter.convertRawStudentGradebookEntries = function (rawStudentGradebookEntries) {
    var convertedStudentGradebookEntries = [];

    for (var i = 0; i < rawStudentGradebookEntries.length; i++) {
        convertedStudentGradebookEntries.push(
            new StudentGradebookEntry(rawStudentGradebookEntries[i]));
    }

    return convertedStudentGradebookEntries;
};

BulkEntityConverter.convertRawStudents = function (rawStudents) {
    var convertedStudents = [];

    for (var i = 0; i < rawStudents.length; i++) {
        convertedStudents.push(new Student(rawStudents[i]));
    }

    return convertedStudents;
};