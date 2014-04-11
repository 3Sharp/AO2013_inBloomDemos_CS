using System.Linq;
using System.Web;
using System.Net;
using System.Runtime.Serialization.Json;
using System.IO;

namespace inBloomCode
{
    /// <summary>
    /// Contains utility classes common to multiple pages.
    /// </summary>
    public static class Utilities
    {

        /// <summary>
        /// Builds an inBloom api http web request
        /// </summary>
        /// <param name="url">The inBloom api url to call</param>
        /// <param name="accessToken">The access token</param>
        /// <returns>an HttpWebRequest ready to use.</returns>
        public static HttpWebRequest BuildInBloomRequest(string url, string accessToken)
        {
            var webRequest = (HttpWebRequest)HttpWebRequest.Create(url);
            webRequest.Headers.Add("Authorization", "bearer " + accessToken);
            webRequest.Accept = "application/vnd.slc+json";

            //Next add the X-Forwarded-For header so the API we're calling knows
            //we are not the party initiating the requests.
            string xForwards = "";
            if (HttpContext.Current.Request.Headers.AllKeys.Contains("X-Forwarded-For"))
            {
                string currentXfor = HttpContext.Current.Request.Headers["X-Forwarded-For"];
                if (currentXfor.Length > 0)
                {
                    xForwards = currentXfor;
                }
            }

            if (xForwards.Length > 0)
            {
                xForwards += ",";
            }

            xForwards += HttpContext.Current.Request.UserHostAddress.ToString();
            webRequest.Headers.Add("X-Forwarded-For", xForwards);

            return webRequest;
        }

        /// <summary>
        /// Serializes an object to JSON as long as the object is a data contract type.
        /// </summary>
        /// <typeparam name="T">The data contract type to serialize.</typeparam>
        /// <param name="obj">The object to serialize to JSON</param>
        /// <returns>The json string of the object</returns>
        public static string JsonSerializeHelper<T> (T obj) where T : JSONObject
        {
            var jsonSerializer = new DataContractJsonSerializer(typeof(T));
            var memoryStream = new MemoryStream(); jsonSerializer.WriteObject(memoryStream, obj);
            memoryStream.Position = 0;
            var streamReader = new StreamReader(memoryStream);
            string jsonError = streamReader.ReadToEnd();
            return jsonError;
        }

        /// <summary>
        /// Trims the leading and trailing quotes from JSON strings that interfere
        /// with JavaScript parsing them correctly
        /// </summary>
        /// <param name="trimThis">String to trim</param>
        /// <returns>The string without leading or trailing quotes</returns>
        public static string TrimWrapingQuotes(string trimThis)
        {

            if (trimThis.StartsWith("\"") && trimThis.EndsWith("\""))
            {
                string trimmedString = trimThis.Substring(1, trimThis.Length - 2);
                return trimmedString;
            }
            else
            {
                return trimThis;
            }
        }
    }
}