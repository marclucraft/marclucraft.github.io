document.querySelector('#down').addEventListener('click', (e) => {
    document.querySelector('#about').scrollIntoView({ 
        behavior: 'smooth' 
      });
})

const lightbox = GLightbox({
    touchNavigation: true,
    loop: true,
    autoplayVideos: true,
});
