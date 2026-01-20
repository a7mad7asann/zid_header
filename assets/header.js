(function (window) {
  const Header = (window.Header = window.Header || {});
  if (Header._initialized) return;
  Header._initialized = true;

  Header.toggleSearchOverlay = function (force) {
    const overlay = document.getElementById("searchOverlay");
    if (!overlay) return;

    const active = force ?? !overlay.classList.contains("active");
    overlay.classList.toggle("active", active);

    if (active) overlay.querySelector("input")?.focus();
  };

  document.addEventListener("click", (e) => {
    const overlay = document.getElementById("searchOverlay");
    if (!overlay || !overlay.classList.contains("active")) return;

    if (
      !e.target.closest(".search-box") &&
      !e.target.closest(".search-toggle-btn")
    ) {
      Header.toggleSearchOverlay(false);
    }
  });

  const Wishlist = (window.Wishlist = window.Wishlist || {});

  Wishlist.open = function () {
    const modal = document.getElementById("wishlistModal");
    if (!modal) return;

    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => modal.classList.add("active"));
    Wishlist.loadItems();
  };

  Wishlist.close = function () {
    const modal = document.getElementById("wishlistModal");
    if (!modal) return;

    modal.classList.remove("active");
    setTimeout(() => {
      modal.style.display = "none";
      document.body.style.overflow = "";
    }, 300);
  };

  Wishlist.loadItems = function () {
    const container = document.getElementById("wishlistItems");
    const strings = window.WISHLIST_STRINGS || {};
    const loadingText = strings.loading || "loading...";
    const noProductsText = strings.noProducts || "No products in the wishlist";

    container.innerHTML = `
            <div class="empty">
                <i class="fa fa-heart"></i>
                <p class="empty-text text-danger">${loadingText}</p>
            </div>`;

    if (!window.zid?.account || !window.zid?.cart) {
      container.innerHTML = `
            <div class="empty">
                <i class="fa fa-heart"></i>
                <p class="empty-text text-danger">${loadingText}</p>
            </div>
        `;
      return;
    }

    zid.account
      .wishlists()
      .then((response) => {
        const products = response.results || [];
        container.innerHTML = "";

        if (products.length === 0) {
          container.innerHTML = `
            <div class="empty">
                <i class="fa fa-heart"></i>
                <p class="empty-text">  ${noProductsText}</p>
            </div>
            `;
          return;
        }

        const template = document.querySelector("#productCardTemplate");

          products.forEach(product => {
              const clone = template.content.cloneNode(true);

              // --------------------------
              // ملئ بيانات المنتج
              // --------------------------
              const imgEl = clone.querySelector('.wishlist-product-img');

              // 1️⃣ صورة المنتج الأساسية
              let imageUrl = product.main_image?.image?.full_size;

              // 2️⃣ thumbnail أول فيديو (YouTube)
              if (!imageUrl && Array.isArray(product.videos) && product.videos.length) {
                  imageUrl = product.videos[0]?.image?.full_size;
              }

              // 3️⃣ fallback أخير
              if (!imageUrl && Array.isArray(product.media)) {
                  const videoMedia = product.media.find(m => m.provider === 'youtube' && m.image);
                  imageUrl = videoMedia?.image?.full_size;
              }

              // 4️⃣ set image
              imgEl.src = imageUrl || '/assets/placeholder.png';
              imgEl.alt = product.name;


              clone.querySelector('.product-name').textContent = product.name;
              clone.querySelector('.product-discription').innerHTML = product.short_description || '';
              clone.querySelector('.product-price-value').textContent = product.formatted_price;
              clone.querySelectorAll('[data-wishlist-id]').forEach(el => el.dataset.wishlistId = product.id);

              clone.querySelectorAll('.add-to-cart-btn').forEach(btn => {
              btn.onclick = () => {
                  if (product.has_options || product.has_fields) {
                  window.location.href = `/products/${product.slug}`;
                  } else {
                  zid.cart.addProduct({ product_id: product.id, quantity: 1 });
                  }
              };
              });

              // --------------------------
              // زر الحذف من Wishlist
              // --------------------------
              const removeBtn = clone.querySelector('.remove-from-wishlist-btn');
              if (removeBtn) {
              removeBtn.onclick = () => {
                  removeBtn.disabled = true; // منع النقر المتكرر

                  zid.account.removeFromWishlist(product.id)
                  .then(() => {
                      syncWishlistUI(product.id, false);
              
                  removeBtn.closest('.product-item')?.remove();

                  
                      if (!container.querySelector('.product-item')) {
                      container.innerHTML = 
                      `
                          <div class="empty">
                          <i class="fa fa-heart"></i>
                          <p class="empty-text">  {{ _('No products in the wishlist') }}</p>
                          </div>
                      ;`;
                      }
                  })
                  .catch(() => {
                      removeBtn.disabled = false;
                      alert('{{ _("حدث خطأ أثناء الحذف") }}');
                  });
              };
              }

              container.appendChild(clone);
          });
        })
      .catch((err) => {
        container.innerHTML = `
            <div class="empty">
                <i class="fa fa-heart"></i>
                <p class="empty-text text-danger">${loadingText}</p>
            </div>
            `;
      });
  };

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".wishlist-btn")?.addEventListener("click", (e) => {
      e.preventDefault();
      Wishlist.open();
    });
  });
})(window);
