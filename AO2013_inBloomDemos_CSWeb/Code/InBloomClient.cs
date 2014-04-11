using System;
using System.Collections.Generic;
using System.Web;
using System.Net;
using System.Runtime.Serialization.Json;
using DotNetOpenAuth.AspNet.Clients;
using DotNetOpenAuth.Messaging;

namespace inBloomCode
{

    /// <summary>
    /// The specialized oAuth 2 client for connecting to inBloom 
    /// </summary>
    public class InBloomClient : OAuth2Client
    {
        #region fields

        //These three end points domains will be different in a production environment instead 
        //of the sandbox environment.
        //TODO: Change these if moving from the sandbox environment
        private const string AuthorizationEndpoint = 
            "https://api.sandbox.inbloom.org/api/oauth/authorize";
        private const string TokenEndpoint = 
            "https://api.sandbox.inbloom.org/api/oauth/token";
        private const string SessionCheckEndpoint = 
            "https://api.sandbox.inbloom.org/api/rest/v1.2/system/session/check";

        private readonly string clientId;
        private readonly string clientSecret;

        #endregion

        #region Constructors
        public InBloomClient(string clientId, string clientSecret)
            : base("inBloom")
        {
            if (string.IsNullOrWhiteSpace(clientId) || string.IsNullOrWhiteSpace(clientSecret))
            { throw new ArgumentNullException("Client ID and secret cannot be null"); }

            this.clientId = clientId;
            this.clientSecret = clientSecret;
        }

        #endregion

        #region Methods

        /// <summary>
        /// Builds the full authorization endpoint URI.
        /// </summary>
        /// <param name="returnUrl">The callback URI to return to. Must be the same
        /// as the redirect uri provided when registering the app on inBlooms
        /// site.</param>
        /// <returns>The service login url including query string.</returns>
        protected override Uri GetServiceLoginUrl(Uri returnUrl)
        {
            var inBloomAuthorizationUriBuilder = new UriBuilder(AuthorizationEndpoint);
            inBloomAuthorizationUriBuilder.AppendQueryArgument("response_type","code");
            inBloomAuthorizationUriBuilder.AppendQueryArgument("client_id", this.clientId);
            inBloomAuthorizationUriBuilder.AppendQueryArgument("redirect_uri",returnUrl.AbsoluteUri);
            return inBloomAuthorizationUriBuilder.Uri;
        }

        /// <summary>
        /// Gets the users data from inBloom after connecting. This verifies the token
        /// works. The data from the dictionary will be available inside the ExtraData
        /// dictionary in an AuthenticationResult returned by 
        /// OpenAuth.VerifyAuthentication.
        /// </summary>
        /// <param name="accessToken">The access token.</param>
        /// <returns>A dictionary with the users information.</returns>
        protected override IDictionary<string, string> GetUserData(string accessToken)
        {
            var sessionCheckWebRequest = 
                (HttpWebRequest)Utilities.BuildInBloomRequest(SessionCheckEndpoint, accessToken);

            using (var sessionCheckWebResponse = 
                (HttpWebResponse)sessionCheckWebRequest.GetResponse())
            {
                if (sessionCheckWebResponse.StatusCode == HttpStatusCode.OK)
                {
                    //Use the JsonSerializer to parse the result
                    var jsonSerializer = 
                        new DataContractJsonSerializer(typeof(SessionCheck));

                    var sessionCheckResponse = 
                        jsonSerializer.ReadObject(sessionCheckWebResponse.GetResponseStream())
                        as SessionCheck;

                    //These 3 named parameters MUST be included as DotNetOpenAuth is
                    //expecting to find them (name, username, id) and will throw an
                    //exception if it can't find them.
                    var sessionCheckDictionary = new Dictionary<string, string>();
                    sessionCheckDictionary.Add("name", sessionCheckResponse.FullName);
                    sessionCheckDictionary.Add("username", sessionCheckResponse.UserId);
                    sessionCheckDictionary.Add("id",sessionCheckResponse.TenantId);

                    return sessionCheckDictionary;
                }
                else
                {
                    throw new HttpException((Int32)sessionCheckWebResponse.StatusCode,
                        "Something went wrong");
                }
            }
        }

        /// <summary>
        /// Takes the authorization code given from inBloom and makes a (synchronous)
        /// call back to inBloom to trade the code for the access token.
        /// </summary>
        /// <param name="returnUrl">The url to return to from inBloom.</param>
        /// <param name="authorizationCode">The authorization code previously granted
        /// by the user, from inBloom.</param>
        /// <returns>The access token string.</returns>
        protected override string QueryAccessToken(Uri returnUrl, string authorizationCode)
        {
            var inBloomTokenUriBuilder = new UriBuilder(TokenEndpoint);
            inBloomTokenUriBuilder.AppendQueryArgument("grant_type", "authorization_code");
            inBloomTokenUriBuilder.AppendQueryArgument("client_id",this.clientId);
            inBloomTokenUriBuilder.AppendQueryArgument("client_secret",this.clientSecret);
            inBloomTokenUriBuilder.AppendQueryArgument("code", authorizationCode);
            inBloomTokenUriBuilder.AppendQueryArgument("redirect_uri", returnUrl.AbsoluteUri);

            //Create the web request, get the response, and try to get the access
            //token.
            var tokenWebRequest = 
                (HttpWebRequest)HttpWebRequest.Create(inBloomTokenUriBuilder.Uri);

            using (var tokenWebResponse = 
                (HttpWebResponse)tokenWebRequest.GetResponse())
            {
                if (tokenWebResponse.StatusCode == HttpStatusCode.OK)
                {

                    //Use json serializer to drill down and get the access token.
                    var jsonSerializer =
                        new DataContractJsonSerializer(typeof(AccessTokenResponse));
                    var tokenResponse =
                        jsonSerializer.ReadObject(tokenWebResponse.GetResponseStream())
                        as AccessTokenResponse;
                    return tokenResponse.AccessToken;
                }
                else
                {
                    throw new HttpException((Int32)tokenWebResponse.StatusCode,
                        "Something went wrong");
                }
            }
        }

        #endregion
    }
}