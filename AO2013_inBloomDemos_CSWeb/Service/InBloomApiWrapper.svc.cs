using System;
using System.Text;
using System.ServiceModel.Web;
using System.ServiceModel.Activation;
using System.Web;
using System.Net;
using System.IO;
using inBloomCode;

namespace InBloomWebSite.Service
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "InBloomApiWrapper" in code, svc and config file together.
    // NOTE: In order to launch WCF Test Client for testing this service, please select InBloomApiWrapper.svc or InBloomApiWrapper.svc.cs at the Solution Explorer and start debugging.
    //We have to use aspnet compatibility because it allows us to access Session variables and this is for OAuth authentication
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class InBloomApiWrapper : IInBloomApiWrapper
    {
        [WebGet(UriTemplate="/GetParent?parentId={parentId}",ResponseFormat=WebMessageFormat.Json)]
        public Stream GetParent(string parentId)
        {
            var apiUrl = ClientInfo.BaseUrl + "parents/" + parentId;
            return new MemoryStream(Encoding.UTF8.GetBytes(CallApi(apiUrl)));
        }

        [WebGet(UriTemplate="/GetStudentParentAssociations?studentId={studentId}",ResponseFormat=WebMessageFormat.Json)]
        public Stream GetStudentParentAssociation(string studentId)
        {
            var apiUrl = ClientInfo.BaseUrl + "students/" + studentId + "/studentParentAssociations";
            return new MemoryStream(Encoding.UTF8.GetBytes(CallApi(apiUrl)));
        }

        [WebGet(UriTemplate = "/GetSectionStudents?sectionId={sectionId}", ResponseFormat = WebMessageFormat.Json)]
        public Stream GetSectionStudents(string sectionId)
        {
            var apiUrl = ClientInfo.BaseUrl + "sections/" +
                HttpUtility.HtmlEncode(sectionId) +
                "/studentSectionAssociations/students";
            return new MemoryStream(Encoding.UTF8.GetBytes(CallApi(apiUrl)));
        }

        [WebGet(UriTemplate = "/GetGradebookEntry?gradebookEntryId={gradebookEntryId}", ResponseFormat = WebMessageFormat.Json)]
        public Stream GetGradebookEntry(string gradebookEntryId)
        {
            var apiUrl = ClientInfo.BaseUrl + "gradebookEntries/" +
                HttpUtility.HtmlEncode(gradebookEntryId);
            return new MemoryStream(Encoding.UTF8.GetBytes(CallApi(apiUrl)));
        }

        [WebGet(UriTemplate = "/GetStudentParents?studentId={studentId}", ResponseFormat = WebMessageFormat.Json)]
        public Stream GetStudentParents(string studentId)
        {
            var apiUrl = ClientInfo.BaseUrl + "students/" +
                HttpUtility.HtmlEncode(studentId) +
                "/studentParentAssociations/parents";
            return new MemoryStream(Encoding.UTF8.GetBytes(CallApi(apiUrl)));
        }

        [WebGet(UriTemplate = "/GetStudentGradebookEntriesByStudentAndSection?studentId={studentId}&sectionId={sectionId}",
            ResponseFormat = WebMessageFormat.Json)]
        public Stream GetStudentGradebookEntriesByStudentAndSection(string studentId, string sectionId)
        {
            var apiUrl = ClientInfo.BaseUrl + "studentGradebookEntries?studentId=" +
                HttpUtility.HtmlEncode(studentId) + "&sectionId=" +
                HttpUtility.HtmlEncode(sectionId);

            return new MemoryStream(Encoding.UTF8.GetBytes(CallApi(apiUrl)));
        }

        [WebGet(UriTemplate = "/GetStudentSections?studentId={studentId}", ResponseFormat = WebMessageFormat.Json)]
        public Stream GetStudentSections(string studentId)
        {
            var apiUrl = ClientInfo.BaseUrl + "students/" +
                HttpUtility.HtmlEncode(studentId) +
                "/studentSectionAssociations/sections";

            return new MemoryStream(Encoding.UTF8.GetBytes(CallApi(apiUrl)));
        }

        [WebGet(UriTemplate = "/GetSections", ResponseFormat = WebMessageFormat.Json)]
        public Stream GetSections()
        {
            var apiUrl = ClientInfo.BaseUrl + "sections";
            return new MemoryStream(Encoding.UTF8.GetBytes(CallApi(apiUrl)));
        }

        [WebGet(UriTemplate = "/SearchStudents?studentName={studentName}", ResponseFormat = WebMessageFormat.Json)]
        public Stream SearchStudents(string studentName)
        {
            var apiUrl = ClientInfo.BaseUrl + "search/students?q=" + HttpUtility.HtmlEncode(studentName);

            return new MemoryStream(Encoding.UTF8.GetBytes(CallApi(apiUrl)));
        }

        /// <summary>
        /// Places a call to the inBloom API given, and returns the response.
        /// </summary>
        /// <param name="url">The inBloom api url to call</param>
        /// <returns>The response from the API call</returns>
        private String CallApi(string url)
        {
            //Setting this ensures javascript will recognize the response as a JSON object
            WebOperationContext.Current.OutgoingResponse.ContentType = "application/json; charset=utf-8";
            HttpWebRequest request =
                Utilities.BuildInBloomRequest(url,
                HttpContext.Current.Session["accessToken"].ToString());

            using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
            {
                using (StreamReader reader = new StreamReader(response.GetResponseStream()))
                {
                    string completeResponse = reader.ReadToEnd();
                    completeResponse = Utilities.TrimWrapingQuotes(completeResponse);
                    return completeResponse;
                }
            }
        }
    }
}
