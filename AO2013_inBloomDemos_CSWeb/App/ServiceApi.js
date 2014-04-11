//This class handles the actual calling of our web service from the app to retrieve
//data from inBloom. It is designed to be easily extended for any new rest api calls
//made in the service.
var ServiceApi = {};

ServiceApi.BaseUrl = "../../Service/InBloomApiWrapper.svc/";

//Simply places the ajax call to the web service with the given
//api url, success callback function, and fail callback function
ServiceApi.call = function (url, sucessCallback, failCallback,doneCallback ,context) {
    if (context === undefined) {
        context = null;
    }

    //Check the callbacks, if any are null make them empty functions.
    if (sucessCallback === null) {
        sucessCallback = function () { };
    }

    if (failCallback === null) {
        failCallback = function () { };
    }

    if (doneCallback === null) {
        doneCallback = function () { };
    }
    
    $.ajax({
        url: url,
        context: context
    })
    .done(sucessCallback)
    .fail(failCallback)
    .always(doneCallback);
};

ServiceApi.beginGetParent = function (parentId, successCallback, failCallback, doneCallback, context) {
    if (context === undefined) {
        context = null;
    }

    var apiUrl = this.BaseUrl + "GetParent?parentId=" + parentId;
    this.call(apiUrl, successCallback, failCallback, doneCallback, context);
};

ServiceApi.beginGetSectionStudents = function (sectionId, successCallback, failCallback, doneCallback, context) {
    if (context === undefined) {
        context = null;
    }
    var apiUrl = this.BaseUrl + "GetSectionStudents?sectionId=" + sectionId;
    this.call(apiUrl, successCallback, failCallback, doneCallback, context);
};

ServiceApi.beginGetGradebookEntry = function (gradebookEntryId, successCallback, failCallback, doneCallback, context) {
    if (context === undefined) {
        context = null;
    }
    var apiUrl = this.BaseUrl + "GetGradebookEntry?gradebookEntryId=" + gradebookEntryId;
    this.call(apiUrl, successCallback, failCallback, doneCallback, context);
};

ServiceApi.beginGetStudentParents = function (studentId, successCallback, failCallback, doneCallback, context) {
    if (context === undefined) {
        context = null;
    }
    var apiUrl = this.BaseUrl + "GetStudentParents?studentId=" + studentId;
    this.call(apiUrl, successCallback, failCallback, doneCallback, context);
};

ServiceApi.beginGetStudentGradebookEntries = function (studentId, sectionId, successCallback, failCallback, doneCallback, context) {
    if (context === undefined) {
        context = null;
    }
    var apiUrl = this.BaseUrl + "GetStudentGradebookEntriesByStudentAndSection?studentId=" +
        studentId + "&sectionId=" +sectionId;
    this.call(apiUrl, successCallback, failCallback, doneCallback, context);
};

ServiceApi.beginGetStudentSections = function (studentId, successCallback, failCallback, doneCallback, context) {
    if (context === undefined) {
        context = null;
    }
    var apiUrl = this.BaseUrl + "GetStudentSections?studentId=" + studentId;
    this.call(apiUrl, successCallback, failCallback, doneCallback, context);
};

ServiceApi.beginGetSections = function (successCallback, failCallback, doneCallback, context) {
    if (context === undefined) {
        context = null;
    }
    var apiUrl = this.BaseUrl + "GetSections";
    
    this.call(apiUrl, successCallback, failCallback, doneCallback, context);
};

ServiceApi.beginStudentSearch = function (studentName, successCallback, failCallback, doneCallback, context) {
    if (context === undefined) {
        context = null;
    }
    var apiUrl = this.BaseUrl + "SearchStudents?studentName=" + studentName;
    this.call(apiUrl, successCallback, failCallback, doneCallback, context);
};

ServiceApi.beginGetStudentParentAssociations = function (studentId, successCallback, failCallback, doneCallback, context) {
    if (context === undefined) {
        context = null;
    }

    var apiUrl = this.BaseUrl + "GetStudentParentAssociations?studentId=" + studentId;
    this.call(apiUrl, successCallback, failCallback, doneCallback, context);
};
