import Show from './Show.js'
const home = Vue.component("home", {
    template: `
<div>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
    <a class="navbar-brand" href="#">Navbar</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent1" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent1">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="/">Home</a>
        </li>
        </ul>
        
     
        <button type="button" class="btn btn-primary" data-bs-toggle="modal"  data-bs-target="#model2">
        searchcity
        </button>
    
     
    </div>
    </div>
    </nav>

    <div class=" row justify-content-center">
        <div class="card border-primary col-11" v-for="venue in venues" :key="venue.venue_name">
            <div class="card-header bg-light-primary">
            <div v-if="Object.keys(venues).length === 0"><h3>no venuecreated</h3>

            </div>
            <div>

                <b>{{venue.venue_name}}</b>{{venue.place}}
            </div>
            </div>
            <div v-if="Object.keys(venue.shows).length === 0"><h3>no show created</h3>

            </div>
            <div v-else class="card-body">
                <div class="row">
                    <div class="card my-3 mx-3 col-4" style="width: 18rem;"  v-for="show in venue.shows" >
                        <div class="card-body">
                            <h3 class="card-title">{{show.show_name}}</h3>
                            <h5 class="card-title">Ratings:{{show.ratings}}</h5>
                            <h5 class="card-title">Price:{{show.price}}</h5>
                            <p class="card-text">Tags:{{show.tags}}</p>
                           
                            
                            <button type="button" class="btn btn-success" @click ="booktickets(venue.venueid,show.show_id)">
                            booktickets
                            </button>
                        </div>
                    </div>
                </div>
     
                <div class="modal fade" id="model2" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div class="my-3 mx-5">
                            <div class="modal-body">
                                <form class="d-flex" role="search">
                                    <input class="form-control me-2" type="search"v-model="query" @click="searchCity2" placeholder="city Search" aria-label="Search">
                                    <button class="btn btn-outline-success" type="submit">Search</button>
                                </form>
                                <div class="row" id="cityResults">
                                    <div class="col-md-3" v-for="city in filteredCities" :key="city">
                                        <div @click="searchCity(city)" data-bs-dismiss="modal" class="city-item">{{ city }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  

    
</div>`,

    data() {
        return {
            dict: {},
            shows: [],
            venues: {},
            venueid: "",
            venue_name: "",
            place: "",
            location: "",
            Capacity: "",
            show_name: "",
            ratings: "",
            timings: "",
            tags: "",
            price: "",
            seats: "",
            movie_desc: "",
            updatedata: {},
            query: "",

            cities: [
                'Mumbai',
                'Delhi',
                'Bangalore',
                'Chennai',
                'Kolkata',
                'Hyderabad',
                'Pune',
                'Ahmedabad',
                'Jaipur',
                'Lucknow',
                'Kanpur',
                'Nagpur',
                'Patna',
                'Indore',
                'Thane',
                'Bhopal',
                'Visakhapatnam',
                'Agra',
                'Varanasi',
                'Meerut',
                'Allahabad',
                'Ranchi',
                'Chandigarh',
                'Mysore',
                'Vadodara',
                'Surat',
                'Rajkot',
                'Nashik',
                'Ludhiana',
                'Amritsar',
                'Jodhpur',
                'Raipur',
                'Kota',
                'Guwahati',
                'Kochi',
                'Thiruvananthapuram',
                'Coimbatore',
                'Madurai',
                'Vijayawada',
                'Warangal',
                'Srinagar',
                'Aurangabad',
                'Dhanbad',
                'Gorakhpur',
                'Navi Mumbai',
                'Faridabad',
                'Noida',
            ],



        }
    },
    computed: {
        filteredCities() {
            return this.cities.filter(city => city.toLowerCase().includes(this.query.toLowerCase()));
        },
    },
    methods: {
        convertKeysToDict(data) {
            const result = {};
            for (const key in data) {
                const venue = JSON.parse(key);
                const venueDetails = data[key];

                result[venue.venue_name] = {
                    venueid: venue.venueid,
                    venue_name: venue.venue_name,
                    location: venue.location,
                    place: venue.place,
                    capacity: venue.capacity,
                    shows: venueDetails,
                };
            }
            return result;
        },
        logout() {

            localStorage.removeItem('auth_token')
                // this logout end point already there in flask security
            fetch('/logout').then((res) => {
                if (res.ok) {
                    this.$router.push({ name: 'login' })
                }
            })
        },

        async fetchvenuedata() {
            const res = await fetch('/venues', {
                method: 'GET',
                headers: {
                    'Authentication-Token': localStorage.getItem('auth_token'),
                }

            })
            const data = await res.json()
            this.venues = this.convertKeysToDict(data)
            console.log(this.convertKeysToDict(data))

        },
        searchCity2() {
            this.$router.push({
                name: "citysearch",
                params: {
                    place: this.query,

                },
            });
            // Handle city selection or further actions

        },
        searchCity(city) {
            // Handle city selection or further actions
            this.query = city
            this.searchCity2()
        },
        booktickets(venue_id, show_id) {
            console.log(venue_id);
            console.log(show_id);
            this.$router.push({
                name: "bookings",
                params: {
                    venueId: venue_id,
                    showId: show_id,
                },
            });
        },
    },


    components: {
        Show,
    },

    // venueshow(venues, shows) {
    //     const dictionary = {};
    //     venues.forEach((venue) => {
    //         const venue_name = venue.venue_name
    //         const venueId = venue.id;
    //         const venueShows = shows.filter((show) => show.venue_id === venueId);
    //         dictionary[venue_name] = venueShows;
    //     });
    //     console.log(dictionary)
    //     return dictionary;
    // },

    mounted() {
        this.fetchvenuedata();

    },





})
export default home