/* =====================================================================
 * Cart logic for the UnoSignal Skate Store.
 *
 * The cart lives in localStorage under "unosignal_cart" so it persists
 * between page loads. This file also has the hook points where the
 * OneSignal Custom Event and Tag calls should live.
 *
 * Suggested OneSignal events to fire from here:
 *   add_to_cart, remove_from_cart, view_cart, checkout_started,
 *   purchase_completed
 *
 * Suggested Tags to set/update from here:
 *   cart_value, cart_item_count, last_category_added
 * ===================================================================== */

const CART_KEY = "unosignal_cart";

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function writeCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
  document.dispatchEvent(new CustomEvent("cart:updated", { detail: cart }));
}

function updateCartBadge() {
  const cart = readCart();
  const count = cart.reduce(function (n, item) { return n + item.qty; }, 0);
  document.querySelectorAll("[data-cart-count]").forEach(function (el) {
    el.textContent = count;
    el.style.display = count > 0 ? "inline-flex" : "none";
  });
}

function cartTotal(cart) {
  return cart.reduce(function (sum, item) {
    return sum + item.qty * item.price;
  }, 0);
}

window.addToCart = function (productId) {
  const product = window.findProduct(productId);
  if (!product) return;

  const cart = readCart();
  const existing = cart.find(function (i) { return i.id === productId; });
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      qty: 1,
    });
  }
  writeCart(cart);

  // -----------------------------------------------------------------
  // OneSignal hook: Custom Event for add_to_cart.
  // Fire when a user adds a product, so it can power journeys
  // (abandoned cart, cross-sell, etc.).
  //
  // withOneSignal(function (OneSignal) {
  //   OneSignal.User.trackEvent("add_to_cart", {
  //     product_id: product.id,
  //     product_name: product.name,
  //     category: product.category,
  //     price: product.price,
  //   });
  //
  //   // Update tags so the user can be put into segments based
  //   // on cart state.
  //   OneSignal.User.addTags({
  //     cart_item_count: String(cart.reduce(function (n, i) { return n + i.qty; }, 0)),
  //     cart_value: cartTotal(cart).toFixed(2),
  //     last_category_added: product.category,
  //   });
  // });
  // -----------------------------------------------------------------

  flashToast(product.name + " added to cart");
};

window.removeFromCart = function (productId) {
  const cart = readCart().filter(function (i) { return i.id !== productId; });
  writeCart(cart);

  // -----------------------------------------------------------------
  // OneSignal hook: Custom Event for remove_from_cart.
  //
  // withOneSignal(function (OneSignal) {
  //   OneSignal.User.trackEvent("remove_from_cart", { product_id: productId });
  //   OneSignal.User.addTags({
  //     cart_item_count: String(cart.reduce(function (n, i) { return n + i.qty; }, 0)),
  //     cart_value: cartTotal(cart).toFixed(2),
  //   });
  // });
  // -----------------------------------------------------------------
};

window.changeQty = function (productId, delta) {
  const cart = readCart();
  const item = cart.find(function (i) { return i.id === productId; });
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    return window.removeFromCart(productId);
  }
  writeCart(cart);
};

window.renderCartPage = function () {
  const cart = readCart();
  const container = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = "<p class=\"cart-empty\">Your cart is empty. <a href=\"shop.html\">Keep shopping</a>.</p>";
    if (totalEl) totalEl.textContent = "£0.00";
    return;
  }

  container.innerHTML = cart.map(function (item) {
    return (
      "<div class=\"cart-row\" data-id=\"" + item.id + "\">" +
        "<img src=\"" + item.image + "\" alt=\"" + item.name + "\">" +
        "<div class=\"cart-row-info\">" +
          "<h3>" + item.name + "</h3>" +
          "<p class=\"muted\">" + item.category + "</p>" +
          "<div class=\"qty-controls\">" +
            "<button onclick=\"changeQty('" + item.id + "', -1)\">−</button>" +
            "<span>" + item.qty + "</span>" +
            "<button onclick=\"changeQty('" + item.id + "', 1)\">+</button>" +
          "</div>" +
        "</div>" +
        "<div class=\"cart-row-price\">" +
          "<strong>£" + (item.qty * item.price).toFixed(2) + "</strong>" +
          "<button class=\"link-btn\" onclick=\"removeFromCart('" + item.id + "')\">Remove</button>" +
        "</div>" +
      "</div>"
    );
  }).join("");

  if (totalEl) totalEl.textContent = "£" + cartTotal(cart).toFixed(2);

  // -----------------------------------------------------------------
  // OneSignal hook: Custom Event for view_cart.
  // Useful for abandoned cart journeys.
  //
  // withOneSignal(function (OneSignal) {
  //   OneSignal.User.trackEvent("view_cart", {
  //     item_count: cart.reduce(function (n, i) { return n + i.qty; }, 0),
  //     cart_value: cartTotal(cart),
  //   });
  // });
  // -----------------------------------------------------------------
};

window.checkout = function () {
  const cart = readCart();
  if (cart.length === 0) {
    return flashToast("Your cart is empty");
  }

  // -----------------------------------------------------------------
  // OneSignal hook: Custom Event for checkout_started, then for the
  // simulated purchase_completed event. In a real store, fire
  // purchase_completed only after the payment processor confirms.
  //
  // withOneSignal(function (OneSignal) {
  //   OneSignal.User.trackEvent("checkout_started", {
  //     item_count: cart.reduce(function (n, i) { return n + i.qty; }, 0),
  //     cart_value: cartTotal(cart),
  //   });
  // });
  //
  // // ...after successful charge:
  // withOneSignal(function (OneSignal) {
  //   OneSignal.User.trackEvent("purchase_completed", {
  //     order_id: "demo-" + Date.now(),
  //     total: cartTotal(cart),
  //     item_count: cart.reduce(function (n, i) { return n + i.qty; }, 0),
  //   });
  //
  //   // Clear cart-state tags now the order is placed.
  //   OneSignal.User.addTags({
  //     cart_item_count: "0",
  //     cart_value: "0",
  //     last_purchase_value: cartTotal(cart).toFixed(2),
  //   });
  // });
  // -----------------------------------------------------------------

  flashToast("Order placed! Demo only, no payment was taken.");
  writeCart([]);
  setTimeout(function () { window.location.href = "index.html"; }, 1200);
};

function flashToast(msg) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add("visible");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(function () {
    toast.classList.remove("visible");
  }, 1800);
}

document.addEventListener("DOMContentLoaded", function () {
  updateCartBadge();
  if (document.getElementById("cart-items")) {
    window.renderCartPage();
    document.addEventListener("cart:updated", window.renderCartPage);
  }
});
