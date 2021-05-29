import gallery from "./gallery-items.js";

const refs = {
  gallery: document.querySelector(".js-gallery"),
  lightbox: document.querySelector(".js-lightbox"),
  modalImage: document.querySelector(".lightbox__image"),
  closeBtn: document.querySelector(".lightbox__button"),
};
const arrayImages = gallery.map((item) => item.original);

// Разметка галлереи
const galleryMarkup = createGalleryMarkup(gallery);
refs.gallery.insertAdjacentHTML("beforeend", galleryMarkup);

function createGalleryMarkup(gallery) {
  return gallery
    .map(({ preview, original, description }) => {
      return `
    <li class="gallery__item">
  <a
    class="gallery__link"
    href="${original}"
  >
    <img
      class="gallery__image"
      src="${preview}"
      data-source="${original}"
      alt="${description}"
    />
  </a>
</li>
`;
    })
    .join("");
}

// Слушатели
refs.gallery.addEventListener("click", onGalleryItemClick);
refs.closeBtn.addEventListener("click", onModalClose);
refs.lightbox.addEventListener("click", onBackdropClickClose);

// колбэки
function onGalleryItemClick(e) {
  e.preventDefault();
  if (e.target.nodeName !== "IMG") return;

  onModalOpen();
  setModalImage(e);
  // Слушатели на события клавиатуры
  window.addEventListener("keydown", onEscPress);
  window.addEventListener("keydown", onArrowPress);
}

function setModalImage(e) {
  refs.modalImage.src = e.target.dataset.source;
  refs.modalImage.alt = e.target.alt;
}

function onModalOpen() {
  refs.lightbox.classList.add("is-open");
}

function onModalClose(e) {
  refs.lightbox.classList.remove("is-open");
  refs.modalImage.src = "";
  refs.modalImage.alt = "";
  // Удаляем слушатели
  window.removeEventListener("keydown", onEscPress);
  window.removeEventListener("keydown", onArrowPress);
}

function onBackdropClickClose(e) {
  if (e.target.nodeName !== "IMG") {
    onModalClose(e);
  }
}

function onEscPress(e) {
  if (e.key === "Escape") {
    onModalClose(e);
  }
}

function onArrowPress(e) {
  let newIndex;
  const currentId = arrayImages.indexOf(refs.modalImage.src);
  if (e.key === "ArrowLeft") {
    newIndex = currentId - 1;
    if (newIndex == -1) {
      newIndex = arrayImages.length - 1;
    }
  } else if (e.key === "ArrowRight") {
    newIndex = currentId + 1;
    if (newIndex === arrayImages.length) {
      newIndex = 0;
    }
  } else {
    return;
  }
  refs.modalImage.src = arrayImages[newIndex];
}
