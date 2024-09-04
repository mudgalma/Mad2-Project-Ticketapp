import profile from "./components/profile.js";
import home from "./components/home.js";
import login from "./components/login.js";
import signup from "./components/signup.js";
import adminlogin from "./components/adminlogin.js";
import admindashboard from "./components/admindashboard.js";
import Logout from "./components/logout.js";
import citysearch from "./components/citysearch.js ";
import bookings from "./components/bookings.js ";
import userbookings from "./components/userbookings.js ";
import cityshow from "./components/cityshowsearch.js";
import page_not_found from "./components/Page_Not_found.js";
import summary from "./components/Summary.js";



const routes = [{
        path: '/profile',
        name: "profile",
        component: profile
    },

    {
        path: '/',
        name: "home",
        component: home
    },
    {
        path: '/login',
        name: "login",
        component: login
    },
    {
        path: '/signup',
        name: "signup",
        component: signup
    },
    {
        path: '/adminlogin',
        name: "adminlogin",
        component: adminlogin
    },
    {
        path: '/admindashboard',
        name: "admindashboard",
        component: admindashboard
    },
    {
        path: '/logout',
        name: "Logout",
        component: Logout
    },
    {
        path: '/citysearch/:place',
        name: "citysearch",
        component: citysearch
    },
    {
        path: '/bookings/:venueId/:showId',
        name: "bookings",
        component: bookings
    }, {
        path: '/userbookings',
        name: "userbookings",
        component: userbookings
    }, {
        path: '/citysearch/:place/:show_name',
        name: "cityshow",
        component: cityshow
    }, {
        path: '*',
        name: "page_not_found",
        component: page_not_found
    }, {
        path: '/summary',
        name: "summary",
        component: summary
    }




]

const router = new VueRouter({
    routes,
    base: '/',
})

export default router;