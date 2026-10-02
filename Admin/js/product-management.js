/* =====================================================
   PRODUCT MANAGEMENT JAVASCRIPT
===================================================== */


/* =====================================================
   SIDE MENU
===================================================== */

const menuBtn =
    document.getElementById("menuBtn");

const sideMenu =
    document.getElementById("sideMenu");

const menuOverlay =
    document.getElementById("menuOverlay");

const closeMenu =
    document.getElementById("closeMenu");


function openMenu() {

    sideMenu.classList.add("open");

    menuOverlay.classList.add("show");

}


function closeSideMenu() {

    sideMenu.classList.remove("open");

    menuOverlay.classList.remove("show");

}


menuBtn.addEventListener(
    "click",
    openMenu
);


closeMenu.addEventListener(
    "click",
    closeSideMenu
);


menuOverlay.addEventListener(
    "click",
    closeSideMenu
);



/* =====================================================
   SEARCH PRODUCT
===================================================== */

const productSearch =
    document.getElementById("productSearch");

const productRows =
    document.querySelectorAll(
        "#productTableBody tr"
    );


productSearch.addEventListener(
    "input",
    function () {

        const searchText =
            productSearch.value
                .toLowerCase()
                .trim();


        productRows.forEach(
            function (row) {

                const productName =
                    row.querySelector(
                        ".product-cell span"
                    )
                    .textContent
                    .toLowerCase();


                if (
                    productName.includes(
                        searchText
                    )
                ) {

                    row.style.display = "";

                } else {

                    row.style.display = "none";

                }

            }
        );

    }
);



/* =====================================================
   STATUS
===================================================== */

function toggleStatus(button) {

    if (
        button.classList.contains(
            "unlisted"
        )
    ) {

        button.classList.remove(
            "unlisted"
        );

        button.classList.add(
            "listed"
        );

        button.textContent =
            "Listed";

        showMessage(
            "Product is now listed"
        );

    } else {

        button.classList.remove(
            "listed"
        );

        button.classList.add(
            "unlisted"
        );

        button.textContent =
            "Unlisted";

        showMessage(
            "Product is now unlisted"
        );

    }

}



/* =====================================================
   DELETE
===================================================== */

const deleteModal =
    document.getElementById(
        "deleteModal"
    );

const cancelDelete =
    document.getElementById(
        "cancelDelete"
    );

const confirmDelete =
    document.getElementById(
        "confirmDelete"
    );


let selectedRow = null;


function openDeleteModal(button) {

    selectedRow =
        button.closest("tr");

    deleteModal.classList.add(
        "show"
    );

}


function closeDeleteModal() {

    deleteModal.classList.remove(
        "show"
    );

    selectedRow = null;

}


cancelDelete.addEventListener(
    "click",
    closeDeleteModal
);


confirmDelete.addEventListener(
    "click",
    function () {

        if (selectedRow) {

            selectedRow.remove();

            renumberProducts();

            showMessage(
                "Product deleted successfully"
            );

        }

        closeDeleteModal();

    }
);



/* =====================================================
   RENUMBER PRODUCTS
===================================================== */

function renumberProducts() {

    const rows =
        document.querySelectorAll(
            "#productTableBody tr"
        );


    rows.forEach(
        function (row, index) {

            row.children[0].textContent =
                index + 1;

        }
    );

}



/* =====================================================
   EDIT PRODUCT
===================================================== */

const editModal =
    document.getElementById(
        "editModal"
    );


let editingRow = null;


function openEditModal(button) {

    editingRow =
        button.closest("tr");


    const productName =
        editingRow.querySelector(
            ".product-cell span"
        ).textContent.trim();


    const stockText =
        editingRow.querySelector(
            ".stock"
        ).textContent.trim();


    const priceText =
        editingRow.children[3]
            .textContent
            .replace("Rs", "")
            .replace(/,/g, "")
            .trim();


    document.getElementById(
        "editProductName"
    ).value = productName;


    document.getElementById(
        "editStock"
    ).value =
        stockText === "Out of stock"
            ? 0
            : parseInt(stockText);


    document.getElementById(
        "editPrice"
    ).value =
        parseInt(priceText) || "";


    document.getElementById(
        "editDescription"
    ).value = "";


    document.getElementById(
        "editColour"
    ).value = "";


    document.getElementById(
        "editFileName"
    ).textContent =
        "No file added";


    editModal.classList.add(
        "show"
    );

}


function closeEditModal() {

    editModal.classList.remove(
        "show"
    );

    editingRow = null;

}


function updateProduct() {

    if (!editingRow) {

        return;

    }


    const newName =
        document.getElementById(
            "editProductName"
        ).value.trim();


    const newStock =
        document.getElementById(
            "editStock"
        ).value;


    const newPrice =
        document.getElementById(
            "editPrice"
        ).value;


    if (newName === "") {

        alert(
            "Please enter product name"
        );

        return;

    }


    /* PRODUCT NAME */

    editingRow.querySelector(
        ".product-cell span"
    ).textContent = newName;



    /* STOCK */

    const stockCell =
        editingRow.querySelector(
            ".stock"
        );


    if (
        newStock === "" ||
        Number(newStock) <= 0
    ) {

        stockCell.textContent =
            "Out of stock";

        stockCell.className =
            "stock out-of-stock";

    } else {

        stockCell.textContent =
            newStock;

        stockCell.className =
            "stock available";

    }



    /* PRICE */

    if (newPrice !== "") {

        editingRow.children[3]
            .textContent =
            "Rs " +
            Number(newPrice)
                .toLocaleString("en-IN");

    }


    closeEditModal();


    showMessage(
        "Product updated successfully"
    );

}



/* =====================================================
   EDIT FILE NAME
===================================================== */

const editImage =
    document.getElementById(
        "editImage"
    );


editImage.addEventListener(
    "change",
    function () {

        const file =
            editImage.files[0];


        if (file) {

            document.getElementById(
                "editFileName"
            ).textContent =
                file.name;

        } else {

            document.getElementById(
                "editFileName"
            ).textContent =
                "No file added";

        }

    }
);



/* =====================================================
   ADD PRODUCT
===================================================== */

const addModal =
    document.getElementById(
        "addModal"
    );


const addProductBtn =
    document.getElementById(
        "addProductBtn"
    );


addProductBtn.addEventListener(
    "click",
    function () {

        addModal.classList.add(
            "show"
        );

    }
);


function closeAddModal() {

    addModal.classList.remove(
        "show"
    );

}


function addProduct() {

    const name =
        document.getElementById(
            "addProductName"
        ).value.trim();


    const stock =
        document.getElementById(
            "addStock"
        ).value;


    const price =
        document.getElementById(
            "addPrice"
        ).value;


    const image =
        document.getElementById(
            "addImage"
        ).files[0];


    if (
        name === "" ||
        stock === "" ||
        price === ""
    ) {

        alert(
            "Please fill Product Name, Stock and Price"
        );

        return;

    }


    const tableBody =
        document.getElementById(
            "productTableBody"
        );


    const row =
        document.createElement("tr");


    const number =
        tableBody.children.length + 1;


    let imagePath =
        "assets/images/ring.png";


    if (image) {

        /*
           For now the selected file is only
           displayed as a temporary browser URL.
        */

        imagePath =
            URL.createObjectURL(image);

    }


    const stockHTML =
        Number(stock) <= 0

            ? `<td class="stock out-of-stock">
                    Out of stock
               </td>`

            : `<td class="stock available">
                    ${stock}
               </td>`;


    row.innerHTML = `

        <td>
            ${number}
        </td>


        <td class="product-cell">

            <img
                src="${imagePath}"
                alt="${name}">

            <span>
                ${name}
            </span>

        </td>


        ${stockHTML}


        <td>
            Rs ${Number(price).toLocaleString("en-IN")}
        </td>


        <td>

            <button
                class="status-btn listed"
                onclick="toggleStatus(this)">

                Listed

            </button>

        </td>


        <td>

            <button
                class="edit-btn"
                onclick="openEditModal(this)">

                Edit

            </button>

        </td>


        <td>

            <button
                class="delete-btn"
                onclick="openDeleteModal(this)">

                Delete

            </button>

        </td>

    `;


    tableBody.appendChild(row);


    closeAddModal();


    clearAddForm();


    showMessage(
        "Product added successfully"
    );

}



/* =====================================================
   ADD FILE NAME
===================================================== */

const addImage =
    document.getElementById(
        "addImage"
    );


addImage.addEventListener(
    "change",
    function () {

        const file =
            addImage.files[0];


        if (file) {

            document.getElementById(
                "addFileName"
            ).textContent =
                file.name;

        } else {

            document.getElementById(
                "addFileName"
            ).textContent =
                "No file added";

        }

    }
);



/* =====================================================
   CLEAR ADD FORM
===================================================== */

function clearAddForm() {

    document.getElementById(
        "addProductName"
    ).value = "";


    document.getElementById(
        "addDescription"
    ).value = "";


    document.getElementById(
        "addStock"
    ).value = "";


    document.getElementById(
        "addPrice"
    ).value = "";


    document.getElementById(
        "addColour"
    ).value = "";


    document.getElementById(
        "addImage"
    ).value = "";


    document.getElementById(
        "addFileName"
    ).textContent =
        "No file added";

}



/* =====================================================
   CLOSE MODALS WHEN CLICKING OUTSIDE
===================================================== */

deleteModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            deleteModal
        ) {

            closeDeleteModal();

        }

    }
);


editModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            editModal
        ) {

            closeEditModal();

        }

    }
);


addModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            addModal
        ) {

            closeAddModal();

        }

    }
);



/* =====================================================
   SUCCESS MESSAGE
===================================================== */

function showMessage(message) {

    const oldMessage =
        document.querySelector(
            ".success-message"
        );


    if (oldMessage) {

        oldMessage.remove();

    }


    const messageBox =
        document.createElement(
            "div"
        );


    messageBox.className =
        "success-message";


    messageBox.textContent =
        message;


    document.body.appendChild(
        messageBox
    );


    setTimeout(
        function () {

            messageBox.remove();

        },
        2500
    );

}