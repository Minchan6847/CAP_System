/* 
 This internationalization code uses JQuery, Promises, and i18next.
 For the complete stack, load all necessary libaries like this:
  <script src="lib/jquery-3.1.1.min.js"></script>
  <script src="lib/es6-promise.js"></script>
  <script src="lib/es6-promise.auto.js"></script> 
  <script src="lib/i18next.js"></script>
  <script src="lib/i18nextXHRBackend.js"></script>
  <script src="lib/translate.js"></script>
*/
var lang = "";
function setTranslation(sourceId) {
  // Parse the URL queryString for language code, found in the final
  // characters of the sourceId, which is passed as an HTTP parameter.
  // For example, if sourceId is set to 'zw-dms-sn' then the
  // language code is 'sn'.
  var sourceIdArray = sourceId.split("-");
  lang = sourceIdArray[sourceIdArray.length - 1];
  var fileName = "locales/" + lang + "/translation.json";
  var fallbackLang = "en"; // 'en' (English) is the fallback language code
  var set_lang = function () {
    // accept the appName lang only if the locales/ file exists for it
    return new Promise(function (resolve, reject) {
      $.ajax({
        type: "GET",
        url: fileName,
        dataType: "json",
        success: function () {
          lang = lang;
          $("html").attr("lang", lang); // set HTML lang attribute to new lang code
          dir = i18next.dir(lang); // direction should be 'rtl' for Arabic, Hebrew, etc
          //$('html').attr('dir',dir);
          // Eliot Christian changed this. Instead of setting document level text
          // direction, dir is checked in translate function to add a span attribute
          // in the case of rtl direction, i.e., <span dir='rtl' id=...>
          resolve("success");
        },
        error: function (xhr, status, error) {
          alert(
            "Translation file '" +
              fileName +
              "' not found. " +
              "Using fallback language code: '" +
              fallbackLang +
              "'."
          );
          lang = fallbackLang;
          $("html").attr("lang", lang); // set HTML lang attribute to new lang code
          dir = i18next.dir(lang);
          $("html").attr("dir", dir); // direction should be 'rtl' for Arabic, Hebrew, etc
          resolve("success");
        },
      }); // end of ajax function GET xml
    }); // end of Promise function
  }; // end of set_lang definition
  var set_fileName = function () {
    return new Promise(function (resolve, reject) {
      fileName = "locales/" + lang + "/translation.json";
      resolve("success");
    }); // end of Promise function
  }; // end of set_fileName definition

  var run_i18next = function () {
    return new Promise(function (resolve, reject) {
      i18next.use(i18nextXHRBackend).init(
        {
          lng: lang,
          debug: true,
          load: "unspecific",
          fallbackLng: fallbackLang,
          backend: {
            loadPath: fileName,
            crossDomain: true,
          },
        },
        function (err, t) {
          // init set content
          translateContent();
        }
      );
      resolve("success");
    }); // end of Promise function
  }; // end of run_i18next definition
  //$(document).ready(function() {
  set_lang().then(set_fileName).then(run_i18next);
  //});
} // end of setTranslation function

function translateContent() {
  // Select all HTML elements in the page that have an id containing "inner-" or "attr".
  // Step through the elements and attempt to translate the content of each "innerHTML" or "value" attribute.
  var ceTranslationId = "";
  $("[id^='inner-']").each(function (index, element) {
    if (dir == "rtl") {
      this.setAttribute("dir", "rtl");
    }
    document.getElementById(this.id).innerHTML = i18next.t(this.id);
  });
  $("[id^='@value-']").each(function (index, element) {
    if (dir == "rtl") {
      this.setAttribute("dir", "rtl");
    }
    this.setAttribute("value", i18next.t(this.id));
  });
  $("[id^='@title-']").each(function (index, element) {
    if (dir == "rtl") {
      this.setAttribute("dir", "rtl");
    }
    this.setAttribute("title", i18next.t(this.id));
  });
}

function parseLangFromSourceId() {
  // Parse the URL queryString for language code, found in the final
  // characters of the sourceId, which is passed as a parameter from
  // index.php. For example, if sourceId is set to 'zw-dms-sn'
  // then the langauge code is 'sn'.
  var url = location.href;
  var queryString = url.substring(url.indexOf("?") + 1).split("&");
  var sourceId = "";
  for (var i = 0, result = {}; i < queryString.length; i++) {
    queryString[i] = queryString[i].split("=");
    if (queryString[i][0] == "sourceId") {
      sourceId = queryString[i][1];
    }
  }
  // SourceId may have more than two dashes, e.g. 'us-noaa-nws-en'.
  var sourceIdArray = sourceId.split("-");
  return sourceIdArray[sourceIdArray.length - 1];
}

function parseLangFromAppName() {
  // Parse the path to isolate the language code, found in the final
  // characters of the application name, which is that part of the
  // path just before the page name. For example, if the path contains
  // 'org.cap.editor.es/login.php' then the langauge code is 'es'.
  var pathArray = window.location.pathname.split("/");
  var appNameIndex = pathArray.length - 2;
  var appName = pathArray[appNameIndex];
  var appNameArray = [];
  if (appName.search("-") > 0) {
    appNameArray = appName.split("-");
  } else {
    appNameArray = appName.split(".");
  }
  return appNameArray[pathArray.length - 1];
}
