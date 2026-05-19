(function ($) {
  "use strict";

  function getQueryParam(name) {
    var params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  function normalizeText(value) {
    return (value || "").toString().toLowerCase();
  }

  function filterArchivePosts() {
    var archivePosts = $("#archive-posts");
    var category = normalizeText(getQueryParam("category"));
    var tag = normalizeText(getQueryParam("tag"));
    var q = normalizeText(getQueryParam("q"));
    $('input[name="q"]').val(getQueryParam("q") || "");

    if (!archivePosts.length) {
      return;
    }

    var noResults = $("#archive-no-results");
    var visibleCount = 0;

    archivePosts.children("li").each(function () {
      var article = $(this).find("article").first();
      var categories = normalizeText(article.attr("data-categories"));
      var tags = normalizeText(article.attr("data-tags"));
      var author = normalizeText(article.attr("data-author"));
      var search = normalizeText(article.attr("data-search"));
      var show = true;

      if (category && categories.indexOf(category) === -1) {
        show = false;
      }

      if (tag && tags.indexOf(tag) === -1) {
        show = false;
      }

      if (q && search.indexOf(q) === -1 && author.indexOf(q) === -1) {
        show = false;
      }

      $(this).toggle(show);
      if (show) {
        visibleCount += 1;
      }
    });

    if ($("#archive-description-text").length) {
      if (category) {
        $("#archive-description-text").text("当前分类：" + category);
      } else if (tag) {
        $("#archive-description-text").text("当前标签：" + tag);
      } else if (q) {
        $("#archive-description-text").text('搜索结果："' + q + '"');
      }
    }

    noResults.toggle(visibleCount === 0);
  }

  function redirectSearchForms() {
    $(document).on("submit", "#searchform", function (event) {
      event.preventDefault();
      var query = $(this).find('input[name="q"]').val() || "";
      var target = new URL($("body").hasClass("page") && window.location.pathname.indexOf("/search/") !== -1 ? window.location.href : (window.location.origin + $(this).attr("action")));
      if (query) {
        target.searchParams.set("q", query);
      } else {
        target.searchParams.delete("q");
      }
      if (target.pathname === "/" || target.pathname === "") {
        target.pathname = "/search/";
      }
      window.location.href = target.toString();
    });
  }

  $(document).ready(function () {
    redirectSearchForms();
    filterArchivePosts();
  });
})(jQuery);
