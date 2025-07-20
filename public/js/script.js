<script>
  // Carousel
  let index = 0;
  const slides = document.querySelector('.carousel-slides');
  const total = slides.children.length;

  setInterval(() => {
    index = (index + 1) % total;
    slides.style.transform = `translateX(-${index * 100}%)`;
  }, 3000);

  // Toggle actualité
  function toggleContent(index) {
    const div = document.getElementById(`contenu-${index}`);
    div.style.display = (div.style.display === "none" || div.style.display === "") ? "block" : "none";
  }

  // 🔔 Toggle Notifications avec animation
  function toggleNotifications() {
    const box = document.getElementById('notificationBox');

    if (box.classList.contains('show')) {
      box.classList.remove('show');
      box.classList.add('hide');
      setTimeout(() => {
        box.style.display = 'none';
      }, 200); // Match duration of slideFadeOut
    } else {
      box.style.display = 'block';
      box.classList.remove('hide');
      box.classList.add('show');
    }
  }

  // Fermer la boîte si clic en dehors
  document.addEventListener('click', function(event) {
    const box = document.getElementById('notificationBox');
    const button = document.querySelector('.btn-auth[onclick="toggleNotifications()"]');

    if (!box || !button) return;

    if (!box.contains(event.target) && !button.contains(event.target)) {
      if (box.classList.contains('show')) {
        box.classList.remove('show');
        box.classList.add('hide');
        setTimeout(() => {
          box.style.display = 'none';
        }, 200);
      }
    }
  });
</script>