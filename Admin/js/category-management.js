/* =========================================================
   CATEGORY DATA
========================================================= */

let categories = [

    {
        id: 1,
        name: "Rings",
        description: "Diamond, gold and platinum rings",
        products: 24,
        status: "listed"
    },

    {
        id: 2,
        name: "Necklaces",
        description: "Gold, diamond and platinum necklaces",
        products: 18,
        status: "listed"
    },

    {
        id: 3,
        name: "Earrings",
        description: "Studs, drops and diamond earrings",
        products: 32,
        status: "listed"
    },

    {
        id: 4,
        name: "Bracelets",
        description: "Elegant gold and diamond bracelets",
        products: 15,
        status: "listed"
    },

    {
        id: 5,
        name: "Bangles",
        description: "Traditional and modern bangles",
        products: 21,
        status: "unlisted"
    },

    {
        id: 6,
        name: "Chains",
        description: "Gold and diamond chains",
        products: 12,
        status: "listed"
    },

    {
        id: 7,
        name: "Pendants",
        description: "Diamond and gold pendants",
        products: 16,
        status: "listed"
    },

    {
        id: 8,
        name: "Anklets",
        description: "Elegant anklets and jewellery",
        products: 8,
        status: "unlisted"
    }

];


/* =========================================================
   ELEMENTS
========================================================= */

const tableBody =
    document.getElementById("categoryTableBody");

const searchInput =
    document.getElementById("categorySearch");

const noResults =
    document.getElementById("noResults");


/* =========================================================
   RENDER CATEGORIES
========================================================= */

function renderCategories(searchText = "") {

    tableBody.innerHTML = "";

    const search =
        searchText.toLowerCase().trim();


    const filteredCategories =
        categories.filter(function (category) {

            return category.name
                .toLowerCase()
                .includes(search);

        });


    if (filteredCategories.length === 0) {

        noResults.style.display = "block";

        return;

    }


    noResults.style.display = "none";


    filteredCategories.forEach(
        function (category, index) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>


                <td>

                    <div class="category-name">
                        ${category.name}
                    </div>

                    <div class="category-description">
                        ${category.description}
                    </div>

                </td>


                <td>

                    <span class="product-count">
                        ${category.products}
                    </span>

                </td>


                <td>

                    <button
                        class="status-btn ${category.status}"
                        data-id="${category.id}"
                    >
                        ${
                            category.status === "listed"
                                ? "Listed"
                                : "Unlisted"
                        }
                    </button>

                </td>


                <td>

                    <button
                        class="edit-btn"
                        data-id="${category.id}"
                    >
                        Edit
                    </button>

                </td>


                <td>

                    <button
                        class="delete-btn"
                        data-id="${category.id}"
                    >
                        Delete
                    </button>

                </td>

            `;


            tableBody.appendChild(row);

        }
    );


    attachRowEvents();

}


/* =========================================================
   ROW EVENTS
========================================================= */

function attachRowEvents() {


    /* STATUS */

    document
        .querySelectorAll(".status-btn")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const id =
                        Number(button.dataset.id);


                    const category =
                        categories.find(
                            item => item.id === id
                        );


                    if (!category) return;


                    if (
                        category.status ===
                        "listed"
                    ) {

                        category.status =
                            "unlisted";

                    } else {

                        category.status =
                            "listed";

                    }


                    renderCategories(
                        searchInput.value
                    );


                    showSuccess(
                        "Category status updated."
                    );

                }
            );

        });


    /* EDIT */

    document
        .querySelectorAll(".edit-btn")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const id =
                        Number(button.dataset.id);

                    openEditModal(id);

                }
            );

        });


    /* DELETE */

    document
        .querySelectorAll(".delete-btn")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const id =
                        Number(button.dataset.id);

                    openDeleteModal(id);

                }
            );

        });

}


/* =========================================================
   SEARCH
========================================================= */

searchInput.addEventListener(
    "input",
    function () {

        renderCategories(
            searchInput.value
        );

    }
);


/* =========================================================
   DELETE MODAL
========================================================= */

const deleteModal =
    document.getElementById("deleteModal");

const deleteCategoryName =
    document.getElementById(
        "deleteCategoryName"
    );

const deleteConfirm =
    document.getElementById("deleteConfirm");


let deleteCategoryId = null;


function openDeleteModal(id) {

    const category =
        categories.find(
            item => item.id === id
        );


    if (!category) return;


    deleteCategoryId = id;


    deleteCategoryName.textContent =
        category.name;


    deleteModal.classList.add("show");

}


function closeDeleteModal() {

    deleteModal.classList.remove("show");

    deleteCategoryId = null;

}


document
    .getElementById("deleteCancel")
    .addEventListener(
        "click",
        closeDeleteModal
    );


document
    .getElementById("deleteClose")
    .addEventListener(
        "click",
        closeDeleteModal
    );


deleteConfirm.addEventListener(
    "click",
    function () {

        if (deleteCategoryId === null)
            return;


        categories =
            categories.filter(
                category =>
                    category.id !==
                    deleteCategoryId
            );


        closeDeleteModal();


        renderCategories(
            searchInput.value
        );


        showSuccess(
            "Category deleted successfully."
        );

    }
);


/* =========================================================
   EDIT MODAL
========================================================= */

const editModal =
    document.getElementById("editModal");

const editCategoryName =
    document.getElementById(
        "editCategoryName"
    );

const editCategoryDescription =
    document.getElementById(
        "editCategoryDescription"
    );

const editCategoryStatus =
    document.getElementById(
        "editCategoryStatus"
    );


let editingCategoryId = null;


function openEditModal(id) {

    const category =
        categories.find(
            item => item.id === id
        );


    if (!category) return;


    editingCategoryId = id;


    editCategoryName.value =
        category.name;


    editCategoryDescription.value =
        category.description;


    editCategoryStatus.value =
        category.status;


    editModal.classList.add("show");

}


function closeEditModal() {

    editModal.classList.remove("show");

    editingCategoryId = null;

}


document
    .getElementById("editClose")
    .addEventListener(
        "click",
        closeEditModal
    );


document
    .getElementById("editCancel")
    .addEventListener(
        "click",
        closeEditModal
    );


/* UPDATE */

document
    .getElementById("editSave")
    .addEventListener(
        "click",
        function () {

            if (editingCategoryId === null)
                return;


            const name =
                editCategoryName.value.trim();


            const description =
                editCategoryDescription
                    .value
                    .trim();


            const status =
                editCategoryStatus.value;


            if (!name) {

                alert(
                    "Please enter a category name."
                );

                return;

            }


            const category =
                categories.find(
                    item =>
                        item.id ===
                        editingCategoryId
                );


            if (!category) return;


            category.name = name;

            category.description =
                description;

            category.status =
                status;


            closeEditModal();


            renderCategories(
                searchInput.value
            );


            showSuccess(
                "Category updated successfully."
            );

        }
    );


/* =========================================================
   ADD CATEGORY MODAL
========================================================= */

const addModal =
    document.getElementById("addModal");


const addCategoryName =
    document.getElementById(
        "addCategoryName"
    );


const addCategoryDescription =
    document.getElementById(
        "addCategoryDescription"
    );


const addCategoryStatus =
    document.getElementById(
        "addCategoryStatus"
    );


function openAddModal() {

    addCategoryName.value = "";

    addCategoryDescription.value = "";

    addCategoryStatus.value =
        "listed";

    addModal.classList.add("show");

}


function closeAddModal() {

    addModal.classList.remove("show");

}


document
    .getElementById("addCategoryBtn")
    .addEventListener(
        "click",
        openAddModal
    );


document
    .getElementById("addClose")
    .addEventListener(
        "click",
        closeAddModal
    );


document
    .getElementById("addCancel")
    .addEventListener(
        "click",
        closeAddModal
    );


/* ADD */

document
    .getElementById("addSave")
    .addEventListener(
        "click",
        function () {

            const name =
                addCategoryName.value.trim();


            const description =
                addCategoryDescription
                    .value
                    .trim();


            const status =
                addCategoryStatus.value;


            if (!name) {

                alert(
                    "Please enter a category name."
                );

                return;

            }


            /* Prevent duplicate category */

            const exists =
                categories.some(
                    category =>
                        category.name
                            .toLowerCase() ===
                        name.toLowerCase()
                );


            if (exists) {

                alert(
                    "This category already exists."
                );

                return;

            }


            const newCategory = {

                id:
                    Date.now(),

                name:
                    name,

                description:
                    description,

                products:
                    0,

                status:
                    status

            };


            categories.push(
                newCategory
            );


            closeAddModal();


            renderCategories(
                searchInput.value
            );


            showSuccess(
                "Category added successfully."
            );

        }
    );


/* =========================================================
   SUCCESS MESSAGE
========================================================= */

const successMessage =
    document.getElementById(
        "successMessage"
    );


let successTimer;


function showSuccess(message) {

    successMessage.textContent =
        message;


    successMessage.classList.add(
        "show"
    );


    clearTimeout(successTimer);


    successTimer =
        setTimeout(
            function () {

                successMessage.classList.remove(
                    "show"
                );

            },
            2500
        );

}


/* =========================================================
   SIDE MENU
========================================================= */

const menuBtn =
    document.getElementById("menuBtn");

const sideMenu =
    document.getElementById("sideMenu");

const closeMenu =
    document.getElementById("closeMenu");

const menuBackdrop =
    document.getElementById(
        "menuBackdrop"
    );


function openMenu() {

    sideMenu.classList.add("open");

    menuBackdrop.classList.add("show");

}


function closeSideMenu() {

    sideMenu.classList.remove("open");

    menuBackdrop.classList.remove(
        "show"
    );

}


menuBtn.addEventListener(
    "click",
    openMenu
);


closeMenu.addEventListener(
    "click",
    closeSideMenu
);


menuBackdrop.addEventListener(
    "click",
    closeSideMenu
);


/* =========================================================
   LOGOUT
========================================================= */

document
    .getElementById("logoutBtn")
    .addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            const confirmLogout =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (confirmLogout) {

                window.location.href =
                    "login.html";

            }

        }
    );


/* =========================================================
   ADMIN ICON
========================================================= */

document
    .getElementById("adminIcon")
    .addEventListener(
        "click",
        function () {

            window.location.href =
                "profile.html";

        }
    );


/* =========================================================
   CLOSE MODALS WHEN CLICKING OUTSIDE
========================================================= */

window.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            deleteModal
        ) {

            closeDeleteModal();

        }


        if (
            event.target ===
            editModal
        ) {

            closeEditModal();

        }


        if (
            event.target ===
            addModal
        ) {

            closeAddModal();

        }

    }
);


/* =========================================================
   INITIAL LOAD
========================================================= */

renderCategories();