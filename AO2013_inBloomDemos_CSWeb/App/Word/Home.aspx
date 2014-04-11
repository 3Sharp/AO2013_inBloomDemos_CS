<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Home.aspx.cs" Inherits="InBloomWebSite.App.Word.Home" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
    <title>inBloom Word Demo App</title>

    <!-- Add your CSS styles to the following file -->
    <link rel="stylesheet" type="text/css" href="../App.css" />

    <script src="https://ajax.aspnetcdn.com/ajax/jquery/jquery-2.0.0.js"></script>
    <script>
        // Fallback to loading jQuery from a local path if the CDN is unavailable
        (window.jQuery || document.write('<script src="../../Scripts/jquery-2.0.0.js"><\/script>'));
    </script>  

    <!-- Use the CDN reference to Office.js when deploying your app -->
    <!--<script src="https://appsforoffice.microsoft.com/lib/1.0/hosted/office.js"></script>-->

    <!-- Use the local script references for Office.js to enable offline debugging -->
    <script src="../../Scripts/Office/1.0/MicrosoftAjax.js"></script>
    <script src="../../Scripts/Office/1.0/office.js"></script>

    <!-- Add your JavaScript to the following file -->
    <script src="../App.js"></script>
    <script src="WordInteraction.js"></script>
    <script src="../ServiceApi.js"></script>
    <!-- For optimization the various entities can be put into a single file -->
    <script src="../inBloomScripts/InBloomContext.js"></script>
    <script src="../inBloomScripts/Address.js"></script>
    <script src="../inBloomScripts/StudentParentAssociation.js"></script>
    <script src="../inBloomScripts/Parent.js"></script>
    <script src="../inBloomScripts/Section.js"></script>
    <script src="../inBloomScripts/Student.js"></script>
    <script src="../inBloomScripts/BulkEntityConverter.js"></script>
    <script src="WordSearchUI.js"></script>
    <script src="WordSearchDataManager.js"></script>
    <script src="WordBrowseUI.js"></script>
    <script src="WordBrowseDataManager.js"></script>

    

    <!-- TODO: Modify this to remove all rotten tomatoes stuff and make sure data matches -->
    <!--<script src="ExcelInteraction.debug.js"></script>-->
    <!-- TODO: Modify this so it will work with both word and app -->
    <script src="AcceleratorWordDemo2013.js"></script>

</head>
<body>
    <div id="loadingDiv">
        <img src="../../Images/ajax-loader.gif" />
    </div>
    <form id="form1" runat="server">
        <header id="userLogin">
            <span class="loginMessage">Welcome</span>
            <!-- TODO: Add logic to grab this... -->
            <span class="loginName" id="usersName"></span>
        </header>

        <section id="tabSection">
            <nav id="tabNav">
                <ul>
                    <li id="searchTab" class="selected">Search</li>
                    <li id="detailsTab">Details</li>
                </ul>
            </nav>
        </section>

        <section id="mainContent">
            <article id="search">
                <!-- Search Bar -->
                <div id="searchBox">
                    <input type="text" id="searchInput" />
                    <button type="button" id="searchButton">
                        <img src="../../Images/search.png" alt="Search" height="24" width="24" />
                    </button>
                </div>
                <!-- Search Results -->
                <div class="accordion">
                    <header>Search Results</header>
                    <div class="content" id="searchResults"></div>
                </div>
                <!-- Browse -->
                <div class="accordion">
                    <header>Browse Sections</header>
                    <div id="browseSectionsContent" class="content">
                    </div>
                </div>
            </article>
            <article id="details">
                <div id="className">&nbsp</div>
                <div id="classDetail">
                    <div id="classInfo">
                    </div>
                </div>
                <div class="accordion">
                    <header>Students</header>
                    <div class="content" id="studentList"></div>
                </div>
            </article>
        </section>

        <footer>
            <img src="../../Images/inBloom_Logo_gray_RGB.png" alt="inBloom" width="200" height="64" />
            <div>
                Powered by <a href="http://www.3sharp.com">3Sharp</a>
            </div>
        </footer>
        
    </form>


</body>
</html>
