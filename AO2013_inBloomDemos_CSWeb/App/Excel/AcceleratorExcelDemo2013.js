//This is the main javascript file created by the app for office template.
//It's the starting point for apps for office and binds everything together.

// This function is run when the app is ready to start interacting with the host application
// It ensures the DOM is ready before adding click handlers to buttons
Office.initialize = function (reason) {
    $(document).ready(function () {
        pageInitialize();
    });
};

function pageInitialize() {
    app.initialize();
    setupNavigationTabs();
    setupAccordions();
    setupBrowsing();
    setupSearch();
}

// UI SETUP
function setupNavigationTabs() {
    $('#tabNav ul li').click(function (e) {
        switch (e.target.id) {
            case "searchTab":
                showSearchTab();
                break;
            case "detailsTab":
                showDetailsTab();
                break;
        }
    });
}

function setupAccordions() {
    var accordions = $('.accordion');
    for (var i = 0; i < accordions.length; i++) {
        var accordion = $(accordions[i]);
        createAccordion(accordion);
    }
}

// Browsing
function setupBrowsing() {
    $("#loadingDiv").show();
    var browseManager = new BrowseDataManager();
    browseManager.beginBrowseConstruction();
}

function setupSearch() {
    var input = $("#searchInput");
    var button = $("#searchButton");
    //TODO: Move this to global?
    var searchManager = new SearchDataManager();

    input.keypress(function (e) {
        if (e.keyCode === 13) {
            $("#loadingDiv").show();
            searchManager.beginSearch(input.val());
            e.preventDefault();
        }
    });
    button.click(function () {
        $("#loadingDiv").show();
        searchManager.beginSearch(input.val());
    });
}

// TABS
function showSearchTab() {
    var details = $("#details");
    var search = $("#search");

    $("#detailsTab").removeClass('selected');
    $("#searchTab").addClass('selected');
    
    if (details.css('display') !== "none") {
        search.hide();
        details.stop().fadeOut(100, function () {
            search.fadeIn();
        });
    }
}

function showDetailsTab() {
    var details = $("#details");
    var search = $("#search");

    $("#detailsTab").addClass('selected');
    $("#searchTab").removeClass('selected'); 

    if (search.css('display') !== "none") {
        details.hide();
        search.stop().fadeOut(100, function () {
            details.fadeIn();
        });
    }
}

// CREATE ELEMENTS
function createAccordion(div) {
    var header = div.children('header');
    header.addClass("open");
    header.click(function (e) {
        var content = header.siblings(".content");
        content.toggle(200);
        if (header.hasClass("open")) {
            header.removeClass("open");
            header.addClass("close");
        }
        else {
            header.removeClass("close");
            header.addClass("open");
        }
    });
}
