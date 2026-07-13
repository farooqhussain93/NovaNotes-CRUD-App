document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const searchInput = document.getElementById('searchNotes');
  const notesGrid = document.getElementById('notesGrid');
  const notesCountElement = document.getElementById('notesCount');
  
  // 1. Staggered Card Entrance Animation
  const noteCards = document.querySelectorAll('.note-card');
  noteCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.05}s`;
  });
  
  // 2. Count Notes initially
  updateNotesCount(noteCards.length);
  
  // 3. Client-side Real-time Search / Filter
  if (searchInput && notesGrid) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      let visibleCount = 0;
      
      noteCards.forEach(card => {
        const title = card.querySelector('.note-title')?.textContent.toLowerCase() || '';
        const description = card.querySelector('.note-description')?.textContent.toLowerCase() || '';
        
        if (title.includes(query) || description.includes(query)) {
          card.style.display = '';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });
      
      updateNotesCount(visibleCount, query !== '');
    });
  }
  
  // Update notes count label helper
  function updateNotesCount(count, isFiltered = false) {
    if (!notesCountElement) return;
    
    if (isFiltered) {
      notesCountElement.textContent = `${count} found`;
      notesCountElement.style.backgroundColor = 'var(--color-navy)';
      notesCountElement.style.color = 'var(--color-white)';
    } else {
      notesCountElement.textContent = `${count} note${count === 1 ? '' : 's'}`;
      notesCountElement.style.backgroundColor = '';
      notesCountElement.style.color = '';
    }
  }
  
  // 4. Input Focus Styling Enhancements
  const textInputs = document.querySelectorAll('.form-group input[type="text"]');
  textInputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    input.addEventListener('blur', () => {
      input.parentElement.classList.remove('focused');
    });
  });

// 5. Client-side Edit Note Handler
  const editButtons = document.querySelectorAll('.btn-edit');
  const noteIdInput = document.getElementById('note_id');
  const formTitle = document.getElementById('formTitle');
  const submitBtnText = document.getElementById('submitBtnText');
  const cancelEditBtn = document.getElementById('cancelEditBtn');

  editButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-id') || '';
      const title = btn.getAttribute('data-title') || '';
      const desc = btn.getAttribute('data-desc') || '';
      const important = btn.getAttribute('data-important') === 'True';
      
      const titleInput = document.getElementById('title');
      const descInput = document.getElementById('desc');
      const importantCheckbox = document.getElementById('important');
      
      if (noteIdInput) noteIdInput.value = id;
      if (titleInput) titleInput.value = title;
      if (descInput) descInput.value = desc;
      if (importantCheckbox) importantCheckbox.checked = important;

      if (formTitle) formTitle.textContent = 'Edit Note';
      if (submitBtnText) submitBtnText.textContent = 'Update Note';
      if (cancelEditBtn) cancelEditBtn.style.display = '';
      
      // Scroll to form card
      const formCard = document.querySelector('.form-card');
      if (formCard) {
        formCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          titleInput.focus();
        }, 300);
      }
    });
  });

  // 6. Cancel Edit Handler — resets form back to create mode
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener('click', () => {
      const titleInput = document.getElementById('title');
      const descInput = document.getElementById('desc');
      const importantCheckbox = document.getElementById('important');

      if (noteIdInput) noteIdInput.value = '';
      if (titleInput) titleInput.value = '';
      if (descInput) descInput.value = '';
      if (importantCheckbox) importantCheckbox.checked = false;
      if (formTitle) formTitle.textContent = 'Create a Note';
      if (submitBtnText) submitBtnText.textContent = 'Create Note';
      cancelEditBtn.style.display = 'none';
    });
  }

  // 7. Custom Delete Confirmation Modal
  const deleteButtons = document.querySelectorAll('.btn-delete');
  const deleteModal = document.getElementById('deleteModal');
  const modalCancelBtn = document.getElementById('modalCancelBtn');
  const modalConfirmBtn = document.getElementById('modalConfirmBtn');
  let pendingDeleteUrl = null;

  deleteButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      pendingDeleteUrl = btn.getAttribute('href');
      deleteModal.classList.add('active');
    });
  });

  if (modalCancelBtn) {
    modalCancelBtn.addEventListener('click', () => {
      pendingDeleteUrl = null;
      deleteModal.classList.remove('active');
    });
  }

  if (modalConfirmBtn) {
    modalConfirmBtn.addEventListener('click', () => {
      if (pendingDeleteUrl) {
        window.location.href = pendingDeleteUrl;
      }
    });
  }

  if (deleteModal) {
    deleteModal.addEventListener('click', (e) => {
      if (e.target === deleteModal) {
        deleteModal.classList.remove('active');
        pendingDeleteUrl = null;
      }
    });
  }

  // 8. Toast Notifications
  const toast = document.getElementById('toastNotification');
  const urlParams = new URLSearchParams(window.location.search);
  const msg = urlParams.get('msg');

  if (msg && toast) {
    let text = '';
    let variant = 'toast-success';

    if (msg === 'created') {
      text = 'Note created';
    } else if (msg === 'updated') {
      text = 'Note updated';
    } else if (msg === 'deleted') {
      text = 'Note deleted';
      variant = 'toast-danger';
    } else if (msg === 'error') {
      text = 'Title and description can\'t be empty';
      variant = 'toast-danger';
    }

    if (text) {
      toast.textContent = text;
      toast.classList.add('show', variant);
      setTimeout(() => {
        toast.classList.remove('show', variant);
      }, 2500);
    }

    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
  }

  // 9. Theme Toggle Handler
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
    });
  }
});