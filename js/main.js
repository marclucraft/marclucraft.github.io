/* =====================================================================
 * Shared UI behavior: rendering product grids, simple category filters,
 * and the mobile nav toggle.
 *
 * This file also has a few OneSignal hook points for tracking browsing
 * behavior (good for segmentation and journeys).
 * ===================================================================== */

function productCard(p) {
  return (
    "<article class=\"product-card\" data-id=\"" + p.id + "\" data-category=\"" + p.category + "\">" +
      (p.tag ? "<span class=\"product-tag\">" + p.tag + "</span>" : "") +
      "<a href=\"#\" class=\"product-image\" onclick=\"return viewProduct('" + p.id + "')\">" +
        "<img src=\"" + p.image + "\" alt=\"" + p.name + "\" loading=\"lazy\">" +
      "</a>" +
      "<div class=\"product-body\">" +
        "<h3>" + p.name + "</h3>" +
        "<p class=\"muted\">" + p.description + "</p>" +
        "<div class=\"product-footer\">" +
          "<span class=\"price\">£" + p.price.toFixed(2) + "</span>" +
          "<button class=\"btn btn-primary\" onclick=\"addToCart('" + p.id + "')\">Add to cart</button>" +
        "</div>" +
      "</div>" +
    "</article>"
  );
}

window.viewProduct = function (productId) {
  const product = window.findProduct(productId);
  if (!product) return false;

  // -----------------------------------------------------------------
  // OneSignal hook: Custom Event for product views.
  //
  // withOneSignal(function (OneSignal) {
  //   OneSignal.User.trackEvent("view_product", {
  //     product_id: product.id,
  //     product_name: product.name,
  //     category: product.category,
  //     price: product.price,
  //   });
  //   OneSignal.User.addTag("last_viewed_category", product.category);
  // });
  // -----------------------------------------------------------------

  // No product detail page in this demo: just add to cart from main grid.
  return false;
};

function renderGrid(targetId, items) {
  const el = document.getElementById(targetId);
  if (!el) return;
  el.innerHTML = items.map(productCard).join("");
}

function renderHome() {
  if (!document.getElementById("featured-grid")) return;
  // Show a handful of items as the homepage hero grid.
  const featured = window.PRODUCTS.slice(0, 4);
  renderGrid("featured-grid", featured);

  const newIn = window.PRODUCTS.filter(function (p) { return p.tag === "New"; });
  renderGrid("new-grid", newIn.length ? newIn : window.PRODUCTS.slice(4, 8));
}

function renderShop() {
  const grid = document.getElementById("shop-grid");
  if (!grid) return;

  function applyFilter(category) {
    const items = category === "all"
      ? window.PRODUCTS
      : window.PRODUCTS.filter(function (p) { return p.category === category; });
    renderGrid("shop-grid", items);

    // -------------------------------------------------------------
    // OneSignal hook: tag the user with the category they're browsing
    // so we can segment them later.
    //
    // withOneSignal(function (OneSignal) {
    //   OneSignal.User.addTag("browsing_category", category);
    // });
    // -------------------------------------------------------------
  }

  applyFilter("all");

  document.querySelectorAll("[data-filter]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll("[data-filter]").forEach(function (b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");
      applyFilter(btn.getAttribute("data-filter"));
    });
  });
}

function setupMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", function () {
    nav.classList.toggle("open");
  });
}

function setupNewsletter() {
  const form = document.getElementById("newsletter-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = form.querySelector("input[type=email]").value.trim();
    if (!email) return;

    // -------------------------------------------------------------
    // OneSignal hook: subscribe the visitor's email without
    // necessarily logging them in. Useful for newsletter signups.
    //
    // withOneSignal(function (OneSignal) {
    //   OneSignal.User.addEmail(email);
    //   OneSignal.User.addTags({
    //     signup_source: "footer_newsletter",
    //     newsletter_subscriber: "true",
    //   });
    //   OneSignal.User.trackEvent("newsletter_signup", { email: email });
    // });
    // -------------------------------------------------------------

    form.innerHTML = "<p class=\"muted\">Thanks! You're on the list.</p>";
  });
}

document.addEventListener("DOMContentLoaded", function () {
  setupMobileNav();
  renderHome();
  renderShop();
  setupNewsletter();
});
