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

  function getContentImageConfig() {
    var defaults = {
      autoGallery: false,
      minImages: 2,
      lightbox: false
    };
    var config = window.AsheContentImages || {};
    var minImages = parseInt(config.minImages, 10);

    return {
      autoGallery: config.autoGallery === true,
      minImages: Number.isFinite(minImages) && minImages > 1 ? minImages : defaults.minImages,
      lightbox: config.lightbox === true
    };
  }

  function isImageOnlyElement(element) {
    var $element = $(element);

    if ($element.closest(".content-gallery-container, .album-gallery-container").length) {
      return false;
    }

    if ($element.is(".no-auto-gallery, [data-no-gallery], .wp-block-gallery, .gallery")) {
      return false;
    }

    if ($element.find("img").length === 0) {
      return false;
    }

    if (!$element.is("p, figure, div")) {
      return false;
    }

    if ($element.is("figure")) {
      return true;
    }

    var valid = true;

    $element.contents().each(function () {
      if (this.nodeType === 3) {
        if ($.trim(this.nodeValue) !== "") {
          valid = false;
        }
        return;
      }

      if (this.nodeType !== 1) {
        return;
      }

      var tagName = this.tagName.toLowerCase();
      var $child = $(this);

      if (tagName === "br" || tagName === "img" || tagName === "picture") {
        return;
      }

      if (tagName === "a" && $child.find("img").length > 0 && $.trim($child.clone().find("img, picture, br").remove().end().text()) === "") {
        return;
      }

      valid = false;
    });

    return valid;
  }

  function getImageItem(image) {
    var $image = $(image);
    var $link = $image.closest("a");
    var $figure = $image.closest("figure");
    var href = $link.attr("href") || $image.attr("src") || "";
    var src = $image.attr("src") || href;
    var title = $link.attr("data-title") || $image.attr("title") || $.trim($figure.find("figcaption").first().text()) || $image.attr("alt") || "";
    var alt = $image.attr("alt") || title || "";

    return {
      href: href,
      src: src,
      title: title,
      alt: alt
    };
  }

  function buildContentGallery(items, groupName, lightboxEnabled) {
    var $gallery = $('<div class="gallery-container content-gallery-container"></div>');

    items.forEach(function (item) {
      if (!item.href || !item.src) {
        return;
      }

      var $pictureContainer = $('<div class="picture-container"></div>');
      var $link = $('<a target="_blank" rel="noopener"></a>').attr("href", item.href);
      var $picture = $("<picture></picture>");
      var $image = $("<img>", {
        src: item.src,
        alt: item.alt,
        "class": "img-thumbnail",
        loading: "lazy"
      });

      if (lightboxEnabled) {
        $link.attr({
          "data-lightbox": groupName,
          "data-title": item.title
        });
      }

      $picture.append($image);
      $link.append($picture);
      $pictureContainer.append($link);
      $gallery.append($pictureContainer);
    });

    return $gallery;
  }

  function convertImageGroup(blocks, config, groupIndex) {
    var items = [];

    blocks.forEach(function (block) {
      $(block).find("img").each(function () {
        items.push(getImageItem(this));
      });
    });

    if (items.length < config.minImages) {
      return;
    }

    var groupName = "content-gallery-" + groupIndex;
    var $gallery = buildContentGallery(items, groupName, config.lightbox);

    if (!$gallery.children().length) {
      return;
    }

    $(blocks[0]).before($gallery);
    blocks.forEach(function (block) {
      $(block).remove();
    });
  }

  function autoGroupContentImages() {
    var config = getContentImageConfig();

    if (!config.autoGallery || $("body").hasClass("album-detail")) {
      return;
    }

    var groupIndex = 0;

    $(".single .post-content, .page article.page > .post-content").each(function () {
      var blocks = [];

      $(this).children().each(function () {
        if (isImageOnlyElement(this)) {
          blocks.push(this);
          return;
        }

        if (blocks.length > 0) {
          groupIndex += 1;
          convertImageGroup(blocks, config, groupIndex);
          blocks = [];
        }
      });

      if (blocks.length > 0) {
        groupIndex += 1;
        convertImageGroup(blocks, config, groupIndex);
      }
    });
  }

  $(document).ready(function () {
    redirectSearchForms();
    filterArchivePosts();
    autoGroupContentImages();
  });
})(jQuery);
