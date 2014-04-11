using System.ServiceModel;
using System.IO;

namespace InBloomWebSite.Service
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IInBloomApiWrapper" in both code and config file together.
    [ServiceContract]
    public interface IInBloomApiWrapper
    {
        [OperationContract]
        Stream SearchStudents(string studentName);

        [OperationContract]
        Stream GetSections();

        [OperationContract]
        Stream GetStudentSections(string studentId);

        [OperationContract]
        Stream GetStudentGradebookEntriesByStudentAndSection(string studentId, string sectionId);

        [OperationContract]
        Stream GetSectionStudents(string sectionId);

        [OperationContract]
        Stream GetStudentParents(string studentId);

        [OperationContract]
        Stream GetGradebookEntry(string gradebookEntryId);

        [OperationContract]
        Stream GetStudentParentAssociation(string studentId);

        [OperationContract]
        Stream GetParent(string parentId);
    }
}
