
namespace inBloomCode
{

    /// <summary>
    /// Holds the client id and secret. Replace these
    /// with your own id and secret.
    /// </summary>
    public static class ClientInfo
    {
        //Set the client key and secret to match your registered app client
        //key and secret
        //TODO: Insert your client ID and client secret here
        private const string clientId = "";
        private const string clientSecret = "";
        private const string baseUrl = "https://api.sandbox.inbloom.org/api/rest/v1.2/";

        public static string ClientId
        {get { return clientId; }}

        public static string ClientSecret
        { get { return clientSecret; } }

        public static string BaseUrl
        { get { return baseUrl; } }
    }
}