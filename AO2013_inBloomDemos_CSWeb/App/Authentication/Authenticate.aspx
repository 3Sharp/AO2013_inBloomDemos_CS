<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Authenticate.aspx.cs" Inherits="InBloomWebSite.App.Authentication.Authenticate" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div id="errorDiv" style="width:250px; color:darkred; word-break:break-all; padding-top:50px;">
        <asp:Literal ID="errorText" runat="server" />
    </div>
    </form>
</body>
</html>
