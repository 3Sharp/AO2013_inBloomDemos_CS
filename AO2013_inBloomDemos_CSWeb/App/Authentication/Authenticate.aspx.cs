using System;
using System.Web.UI;
using inBloomCode;
using Microsoft.AspNet.Membership.OpenAuth;

namespace InBloomWebSite.App.Authentication
{
    public partial class Authenticate : System.Web.UI.Page
    {
        const string callBackUrl = "~/App/Authentication/Authenticate.aspx";

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!Page.IsPostBack)
            {
                Response.AppendHeader("Cache-Control", "no-cache, no-store, must-revalidate");

                if (Request.QueryString["demo"] != null)
                {
                    Session["demo"] = Request.QueryString["demo"];

                    //I've had exceptions before when not checking if the client is already
                    //in the AuthenticationClients collection. It seems short lived but
                    //if it is still there, it would be angry at trying to add two things
                    //with the same provider names.
                    if (OpenAuth.AuthenticationClients.GetByProviderName("inBloom") == null)
                    {
                        OpenAuth.AuthenticationClients.Add("inBloom", () =>
                                    new InBloomClient(ClientInfo.ClientId, ClientInfo.ClientSecret));
                    }
                    OpenAuth.RequestAuthentication("inBloom", callBackUrl);
                }
                else
                {
                    var authResult = OpenAuth.VerifyAuthentication(callBackUrl);

                    //Assign access token and user name and full name to session if
                    //successful
                    if (authResult.IsSuccessful)
                    {
                        Session["AccessToken"] = authResult.ExtraData["accesstoken"];
                        Session["FullName"] = authResult.ExtraData["name"];
                        Session["userId"] = authResult.ExtraData["username"];

                        if (Session["demo"] != null)
                        {
                            if (Session["demo"].ToString().Equals("excel", StringComparison.OrdinalIgnoreCase))
                            {
                                Session["demo"] = null;
                                Response.Redirect("~/App/Excel/Home.aspx");
                            }
                            else if (Session["demo"].ToString().Equals("word", StringComparison.OrdinalIgnoreCase))
                            {
                                Session["demo"] = null;
                                Response.Redirect("~/App/Word/Home.aspx");
                            }
                            else
                            {
                                Response.Redirect("~/App/UnrecoverableError.html");
                            }
                        }
                        else
                        {
                            Response.Redirect("~/App/UnrecoverableError.html");
                        }
                    }
                    else
                    {
                        string errorMessage = "Something went wrong, please reload the app";
                        errorMessage += "<br/><br/>" + authResult.Error.Message +
                            "<br/><br/>" + authResult.Error.ToString();

                        errorText.Text = errorMessage;
                    }
                }
            }
        }
    }
}