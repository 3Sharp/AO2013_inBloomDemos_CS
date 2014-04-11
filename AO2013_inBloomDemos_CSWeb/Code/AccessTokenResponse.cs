using System.Runtime.Serialization;

namespace inBloomCode
{
    /// <summary>
    /// The strong type of the json object containing the access token
    /// returned by inBloom
    /// </summary>
    [DataContract]
    public class AccessTokenResponse : JSONObject
    {
        [DataMember(Name = "access_token")]
        public string AccessToken;
    }
}