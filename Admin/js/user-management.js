/* =====================================================
   USER DATA
===================================================== */

const users = [

    {
        name: "Ananya Sharma",
        phone: "+91 98765 43210",
        email: "ananya.sharma@gmail.com",
        date: "25 Sep 2026",
        status: "Unblock"
    },

    {
        name: "Rahul Kumar",
        phone: "+91 98765 12345",
        email: "rahul.kumar@gmail.com",
        date: "25 Sep 2026",
        status: "Unblock"
    },

    {
        name: "Priya Nair",
        phone: "+91 99887 66554",
        email: "priya.nair@gmail.com",
        date: "24 Sep 2026",
        status: "Block"
    },

    {
        name: "Arjun Menon",
        phone: "+91 98765 77889",
        email: "arjun.menon@gmail.com",
        date: "24 Sep 2026",
        status: "Unblock"
    },

    {
        name: "Sneha Reddy",
        phone: "+91 99887 11223",
        email: "sneha.reddy@gmail.com",
        date: "23 Sep 2026",
        status: "Unblock"
    },

    {
        name: "Karthik Raj",
        phone: "+91 98765 99887",
        email: "karthik.raj@gmail.com",
        date: "23 Sep 2026",
        status: "Block"
    },

    {
        name: "Meera Krishnan",
        phone: "+91 98765 55443",
        email: "meera.krishnan@gmail.com",
        date: "22 Sep 2026",
        status: "Unblock"
    },

    {
        name: "Vikram Singh",
        phone: "+91 99887 44556",
        email: "vikram.singh@gmail.com",
        date: "22 Sep 2026",
        status: "Block"
    },

    {
        name: "Divya Iyer",
        phone: "+91 98765 22334",
        email: "divya.iyer@gmail.com",
        date: "21 Sep 2026",
        status: "Unblock"
    }

];


/* =====================================================
   DISPLAY USERS
===================================================== */

function displayUsers(userList) {

    const tableBody =
        document.getElementById("userTableBody");


    tableBody.innerHTML = "";


    if (userList.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="text-align:center; padding:30px;"
                >

                    No users found

                </td>

            </tr>

        `;

        return;

    }


    userList.forEach(function(user) {

        const originalIndex =
            users.indexOf(user);


        const row =
            document.createElement("tr");


        const statusClass =
            user.status.toLowerCase() === "block"
            ? "blocked"
            : "unblocked";


        row.innerHTML = `

            <td>
                ${originalIndex + 1}
            </td>


            <td>

                <div class="user-icon">
                    👤
                </div>

            </td>


            <td>

                <span class="user-name">
                    ${user.name}
                </span>

            </td>


            <td>

                <button
                    class="status-btn ${statusClass}"
                    onclick="changeStatus(${originalIndex})"
                >

                    ${user.status}

                </button>

            </td>


            <td>

                <span class="phone-number">
                    ${user.phone}
                </span>

            </td>


            <td>

                <span class="email">
                    ${user.email}
                </span>

            </td>


            <td>

                ${user.date}

            </td>

        `;


        tableBody.appendChild(row);

    });

}


/* =====================================================
   CHANGE USER STATUS
===================================================== */

function changeStatus(index) {

    if (users[index].status === "Block") {

        users[index].status = "Unblock";

    }

    else {

        users[index].status = "Block";

    }


    displayUsers(getFilteredUsers());

}


/* =====================================================
   SEARCH USERS
===================================================== */

const searchInput =
    document.getElementById("searchInput");


function getFilteredUsers() {

    const searchValue =
        searchInput.value
            .trim()
            .toLowerCase();


    if (searchValue === "") {

        return users;

    }


    return users.filter(function(user) {

        return (

            user.name
                .toLowerCase()
                .includes(searchValue)

            ||

            user.phone
                .toLowerCase()
                .includes(searchValue)

            ||

            user.email
                .toLowerCase()
                .includes(searchValue)

            ||

            user.status
                .toLowerCase()
                .includes(searchValue)

        );

    });

}


searchInput.addEventListener("input", function() {

    displayUsers(getFilteredUsers());

});


/* =====================================================
   SIDE MENU
===================================================== */

const menuBtn =
    document.getElementById("menuBtn");


const sideMenu =
    document.getElementById("sideMenu");


menuBtn.addEventListener("click", function(event) {

    event.stopPropagation();

    sideMenu.classList.toggle("open");

});


/* =====================================================
   CLOSE SIDE MENU
===================================================== */

document.addEventListener("click", function(event) {

    if (

        sideMenu.classList.contains("open")

        &&

        !sideMenu.contains(event.target)

        &&

        event.target !== menuBtn

    ) {

        sideMenu.classList.remove("open");

    }

});


/* =====================================================
   ADMIN POPUP
===================================================== */

const adminArea =
    document.getElementById("adminArea");


const adminPopup =
    document.getElementById("adminPopup");


adminArea.addEventListener("click", function(event) {

    event.stopPropagation();

    adminPopup.classList.toggle("show");

});


/* =====================================================
   CLOSE ADMIN POPUP
===================================================== */

document.addEventListener("click", function(event) {

    if (

        adminPopup.classList.contains("show")

        &&

        !adminPopup.contains(event.target)

        &&

        event.target !== adminArea

    ) {

        adminPopup.classList.remove("show");

    }

});


/* =====================================================
   LOGOUT
===================================================== */

const logoutLink =
    document.getElementById("logoutLink");


logoutLink.addEventListener("click", function(event) {

    const confirmLogout =
        confirm("Are you sure you want to logout?");


    if (!confirmLogout) {

        event.preventDefault();

    }

});


const popupLogout =
    document.getElementById("popupLogout");


popupLogout.addEventListener("click", function(event) {

    const confirmLogout =
        confirm("Are you sure you want to logout?");


    if (!confirmLogout) {

        event.preventDefault();

    }

});


/* =====================================================
   INITIAL DISPLAY
===================================================== */

displayUsers(users);