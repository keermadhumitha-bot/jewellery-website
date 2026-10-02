/* ==================================================
   ADMIN DASHBOARD JAVASCRIPT
================================================== */


/* ==================================================
   1. ADMIN POPUP
================================================== */

const adminButton =
    document.getElementById("adminButton");

const adminName =
    document.getElementById("adminName");

const adminPopup =
    document.getElementById("adminPopup");


function toggleAdminPopup() {

    if (!adminPopup) return;

    adminPopup.classList.toggle("show");

}


/* Admin icon */

if (adminButton) {

    adminButton.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            toggleAdminPopup();

        }
    );

}


/* ADMIN text */

if (adminName) {

    adminName.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            toggleAdminPopup();

        }
    );

}


/* Close popup */

document.addEventListener(
    "click",
    function (event) {

        if (!adminPopup) return;

        if (
            !adminPopup.contains(event.target) &&
            event.target !== adminButton &&
            event.target !== adminName
        ) {

            adminPopup.classList.remove("show");

        }

    }
);



/* ==================================================
   2. SEARCH SYSTEM
================================================== */

const searchInput =
    document.getElementById("adminSearch");

const searchResults =
    document.getElementById("searchResults");


const searchData = [

    {
        name: "Diamond Crystal Lotus Ring",
        type: "Product",
        page: "products.html"
    },

    {
        name: "Diamond Crystal Necklace",
        type: "Product",
        page: "products.html"
    },

    {
        name: "Diamond Crystal Earrings",
        type: "Product",
        page: "products.html"
    },

    {
        name: "Gold Ring",
        type: "Category",
        page: "category.html"
    },

    {
        name: "Gold Necklace",
        type: "Category",
        page: "category.html"
    },

    {
        name: "Silver Jewellery",
        type: "Category",
        page: "category.html"
    },

    {
        name: "User Management",
        type: "User",
        page: "users.html"
    },

    {
        name: "Order Management",
        type: "Order",
        page: "orders.html"
    }

];


/*
   IMPORTANT:

   Only activate search if BOTH
   elements actually exist.
*/

if (searchInput && searchResults) {

    searchInput.addEventListener(
        "input",
        function () {

            const keyword =
                searchInput.value
                    .trim()
                    .toLowerCase();


            searchResults.innerHTML = "";


            if (keyword === "") {

                searchResults.style.display =
                    "none";

                return;

            }


            const matches =
                searchData.filter(
                    item =>
                        item.name
                            .toLowerCase()
                            .includes(keyword)
                );


            if (matches.length === 0) {

                searchResults.innerHTML = `
                    <div class="search-result">
                        No results found
                    </div>
                `;

            }

            else {

                matches.forEach(
                    item => {

                        const result =
                            document.createElement("div");


                        result.className =
                            "search-result";


                        result.innerHTML = `
                            <strong>
                                ${item.name}
                            </strong>

                            <small>
                                — ${item.type}
                            </small>
                        `;


                        result.addEventListener(
                            "click",
                            function () {

                                window.location.href =
                                    item.page;

                            }
                        );


                        searchResults.appendChild(
                            result
                        );

                    }
                );

            }


            searchResults.style.display =
                "block";

        }
    );

}



/* ==================================================
   3. VIEW ALL TRENDING PRODUCTS
================================================== */

const viewAllBtn =
    document.getElementById("viewAllBtn");


if (viewAllBtn) {

    viewAllBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "trending-products.html";

        }
    );

}



/* ==================================================
   4. BAR CHART DATA
================================================== */

const chartData = {

    today: {

        Earrings: [18, 10, 12, 26],

        Rings: [58, 23, 45, 67],

        Bracelet: [51, 56, 50, 90],

        Bangle: [56, 43, 94, 67],

        Necklace: [40, 79, 73, 54]

    },


    month1: {

        Earrings: [30, 45, 25, 50],

        Rings: [55, 60, 45, 72],

        Bracelet: [65, 50, 70, 82],

        Bangle: [48, 76, 85, 63],

        Necklace: [70, 55, 78, 90]

    },


    month2: {

        Earrings: [42, 52, 35, 68],

        Rings: [62, 72, 54, 80],

        Bracelet: [70, 64, 78, 90],

        Bangle: [55, 83, 92, 75],

        Necklace: [76, 67, 85, 94]

    },


    year: {

        Earrings: [60, 72, 65, 80],

        Rings: [75, 82, 70, 88],

        Bracelet: [80, 74, 85, 91],

        Bangle: [70, 90, 95, 82],

        Necklace: [85, 78, 92, 96]

    }

};



/* ==================================================
   5. BAR COLORS
================================================== */

const barColors = {

    Earrings: "#8065db",

    Rings: "#ff8582",

    Bracelet: "#30b1cf",

    Bangle: "#ffa944",

    Necklace: "#668fd4"

};



/* ==================================================
   6. BAR GROUP NAMES
================================================== */

const groupNames = [

    "1 Dec",

    "2 Dec",

    "3 Dec",

    "4 Dec"

];



/* ==================================================
   7. GET BAR ELEMENTS
================================================== */

const barsContainer =
    document.getElementById(
        "barsContainer"
    );


const periodSelect =
    document.getElementById(
        "periodSelect"
    );



/* ==================================================
   8. CREATE BAR CHART
================================================== */

function createBarChart(
    period = "today"
) {

    console.log(
        "Creating bar chart:",
        period
    );


    /* If chart container doesn't exist */

    if (!barsContainer) {

        console.error(
            "barsContainer was not found!"
        );

        return;

    }


    /* Clear previous chart */

    barsContainer.innerHTML = "";


    /* Get selected data */

    const data =
        chartData[period];


    if (!data) {

        console.error(
            "No chart data found for:",
            period
        );

        return;

    }


    const categories =
        Object.keys(data);



    /* ==================================================
       CREATE 4 BAR GROUPS
    ================================================== */

    for (
        let groupIndex = 0;
        groupIndex < 4;
        groupIndex++
    ) {


        const group =
            document.createElement(
                "div"
            );


        group.className =
            "bar-group";


        /* Group layout */

        group.style.height =
            "100%";

        group.style.display =
            "flex";

        group.style.alignItems =
            "flex-end";

        group.style.justifyContent =
            "center";

        group.style.gap =
            "3px";

        group.style.position =
            "relative";

        group.style.flex =
            "1";



        /* ==================================================
           CREATE 5 BARS
        ================================================== */

        categories.forEach(
            function (category) {


                const value =
                    data[
                        category
                    ][
                        groupIndex
                    ];


                const bar =
                    document.createElement(
                        "div"
                    );


                bar.className =
                    "bar " +
                    category.toLowerCase();


                /* IMPORTANT BAR STYLES */

                bar.style.height =
                    value + "%";

                bar.style.width =
                    "10px";

                bar.style.minHeight =
                    "2px";

                bar.style.backgroundColor =
                    barColors[category];

                bar.style.display =
                    "block";

                bar.style.borderRadius =
                    "3px 3px 0 0";

                bar.style.position =
                    "relative";

                bar.style.flexShrink =
                    "0";

                bar.style.cursor =
                    "pointer";


                /* Save value */

                bar.dataset.value =
                    value;



                /* ==================================================
                   HOVER
                ================================================== */

                bar.addEventListener(
                    "mouseenter",
                    function () {

                        bar.style.transform =
                            "translateY(-5px)";

                        bar.style.boxShadow =
                            "0 6px 12px rgba(0,0,0,0.2)";

                    }
                );


                bar.addEventListener(
                    "mouseleave",
                    function () {

                        bar.style.transform =
                            "translateY(0)";

                        bar.style.boxShadow =
                            "none";

                    }
                );


                /* Add bar */

                group.appendChild(
                    bar
                );

            }
        );



        /* ==================================================
           X AXIS LABEL
        ================================================== */

        const label =
            document.createElement(
                "span"
            );


        label.textContent =
            groupNames[
                groupIndex
            ];


        label.style.position =
            "absolute";

        label.style.bottom =
            "-22px";

        label.style.left =
            "50%";

        label.style.transform =
            "translateX(-50%)";

        label.style.fontSize =
            "8px";

        label.style.whiteSpace =
            "nowrap";


        group.appendChild(
            label
        );


        /* Add group */

        barsContainer.appendChild(
            group
        );

    }


    console.log(
        "Bar chart created successfully."
    );

}



/* ==================================================
   9. CREATE INITIAL CHART
================================================== */

createBarChart(
    "today"
);



/* ==================================================
   10. CHANGE PERIOD
================================================== */

if (periodSelect) {

    periodSelect.addEventListener(
        "change",
        function () {

            createBarChart(
                periodSelect.value
            );

        }
    );

}