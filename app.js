class App {
  constructor() {
    //  state control
    this.noteArray = JSON.parse(localStorage.getItem("notes")) || [];
    this.title = "";
    this.text = "";
    this.id = "";
    // html elements
    this.form = document.querySelector("#form");
    this.noteTitle = document.querySelector("#note-title");
    this.noteText = document.querySelector("#note-text");
    this.notes = document.querySelector("#notes");
    this.placeholder = document.querySelector("#placeholder");
    this.formButtons = document.querySelector("#form-buttons");
    this.formCloseButton = document.querySelector("#form-close-button");
    this.modal = document.querySelector(".modal");
    this.modalTitle = document.querySelector(".modal-title");
    this.modalText = document.querySelector(".modal-text");
    this.modalCloseButton = document.querySelector(".modal-close-button");
    this.colorToolTip = document.querySelector("#color-tooltip");

    // METHOD
    this.render();
    this.addEventListeners();
  }
  addEventListeners() {
    document.body.addEventListener("click", (event) => {
      this.handleFormClick(event);
      this.selectNote(event);
      this.openModal(event);
      this.deleteNote(event);
    });

    document.body.addEventListener("mouseover", (event) => {
      this.openToolTip(event);
    });

    this.colorToolTip.addEventListener("click", (event) => {
      const color = event.target.dataset.color;
      if (color) {
        this.editNoteColor(color);
      }
      this.colorToolTip.style.display = "none";
      console.log(color);
    });

    this.colorToolTip.addEventListener("mouseover", function () {
      this.style.display = "flex";
    });

    this.colorToolTip.addEventListener("mouseout", function () {
      this.style.display = "none";
    });

    document.body.addEventListener("mouseout", (event) => {
      this.closeToolTip(event);
    });

    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
      const title = this.noteTitle.value;
      const text = this.noteText.value;
      const hasNote = title || text;
      if (hasNote) {
        this.addNote({ title, text });
      }
    });

    this.formCloseButton.addEventListener("click", (event) => {
      this.closeForm();
    });

    this.modalCloseButton.addEventListener("click", (event) => {
      this.closeModal();
    });
  }
  handleFormClick(event) {
    const isFormClicked = this.form.contains(event.target);
    if (isFormClicked) {
      this.openForm();
    } else {
      this.closeForm();
    }
  }

  openForm() {
    this.form.classList.add(".form-open");
    this.noteTitle.style.display = "block";
    this.formButtons.style.display = "block";
  }

  closeForm() {
    this.form.classList.remove(".form-open");
    this.noteTitle.style.display = "none";
    this.formButtons.style.display = "none";
    this.noteTitle.value = "";
    this.noteText.value = "";
  }

  openModal(event) {
    if (event.target.closest(".note")) {
      this.modal.classList.toggle("open-modal");
      this.modalTitle.value = this.title;
      this.modalText.value = this.text;
    }
  }

  closeModal(event) {
    this.editNote();
    this.modal.classList.toggle("open-modal");
  }

  openToolTip(event) {
    if (!event.target.matches(".toolbar-color")) return;
    this.id = event.target.dataset.id;
    const coOrdinate = event.target.getBoundingClientRect();
    const horizontal = coOrdinate.left + window.scrollX;
    const vertical = window.scrollY - 21;
    this.colorToolTip.style.transform = `translate(${horizontal}px, ${vertical}px)`;
    this.colorToolTip.style.display = "flex";
  }

  closeToolTip(event) {
    if (!event.target.matches(".toolbar-color")) return;
    this.colorToolTip.style.display = "none";
  }

  addNote(note) {
    const newNote = {
      title: note.title,
      text: note.text,
      color: "white",
      id:
        this.noteArray.length > 0
          ? this.noteArray[this.noteArray.length - 1].id + 1
          : 1,
    };
    this.noteArray = [...this.noteArray, newNote];
    // this.noteArray.push(newNote)
    this.render();
    this.closeForm();
  }

  editNote() {
    const title = this.modalTitle.value;
    const text = this.modalText.value;
    this.noteArray.map((note) => {
      if (note.id == Number(this.id)) {
        note.title = title;
        note.text = text;
      }
    });
    this.render();
  }

  editNoteColor(color) {
    this.noteArray.map((note) => {
      if (note.id == Number(this.id)) {
        note.color = color;
      }
    });
    this.render();
  }

  selectNote(event) {
    const selectNote = event.target.closest(".note");
    if (!selectNote) return;
    const [notetitle, notetext] = selectNote.children;
    this.title = notetitle.innerText;
    this.text = notetext.innerText;
    this.id = selectNote.dataset.id;
  }

  deleteNote(event) {
    event.stopPropagation();
    if (!event.target.matches(".toolbar-delete")) return;
    const id = event.target.dataset.id;
    this.noteArray = this.noteArray.filter((note) => note.id !== Number(id));
    this.render();
  }

  render() {
    this.saveNotes();
    this.display();
  }

  saveNotes() {
    localStorage.setItem("notes", JSON.stringify(this.noteArray));
  }

  display() {
    const hasNote = this.noteArray.length > 0;
    if (hasNote) {
      this.placeholder.style.display = "none";
    } else {
      this.placeholder.style.display = "flex";
    }
    this.notes.innerHTML = this.noteArray
      .map(
        (note) =>
          ` <div style="background: ${note.color}" class="note" data-id ="${note.id}">
                <div class="note-title">${note.title}</div>
                <div class="note-text">${note.text}</div>
                <div class="toolbar-container">
                    <div class="toolbar">
                        <img class="toolbar-color" src="https://image.flaticon.com/icons/png/512/3199/3199899.png" data-id ="${note.id}">
                        <img class="toolbar-delete" src="images/delete.png" data-id ="${note.id}">
                    </div>
                </div>
            </div>`
      )
      .join("");
  }
}
new App();

// =============== DARK MODE ===============

// const body = document.querySelector('body');
const toggleSwitch = document.querySelector('input[type="checkbox"]');
const header = document.querySelector(".header-title");
const div = document.querySelector(".theme-switch-wrapper");
const toggleIcon = document.querySelector(".toggle-icon");
const placeholderText = document.querySelector("#placeholder-text");

//  Dark Mode
function darkMode() {
  header.style.color = "white";
  div.style.color = "#000";
  toggleIcon.children[0].textContent = "Dark Mode";
  toggleIcon.children[0].style.color = "white";
  toggleIcon.children[1].classList.remove("fa-sun");
  toggleIcon.children[1].classList.add("fa-moon");
  toggleIcon.children[1].style.color = "white";
  placeholderText.style.color = "white";
}
//  Light Mode
function lightMode() {
  header.style.color = "#5f6368";
  toggleIcon.children[0].textContent = "Light Mode";
  toggleIcon.children[0].style.color = "#424242";
  toggleIcon.children[1].classList.remove("fa-moon");
  toggleIcon.children[1].classList.add("fa-sun");
  toggleIcon.children[1].style.color = "#222";
  placeholderText.style.color = "#80868b";
}

// Switch Theme
function switchTheme(event) {
  const target = event.target.checked;
  if (target == true) {
    document.documentElement.setAttribute("data-theme", "dark");
    darkMode();
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    lightMode();
  }
}

//  Events
toggleSwitch.addEventListener("change", switchTheme);
