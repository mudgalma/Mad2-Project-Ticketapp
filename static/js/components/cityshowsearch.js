const cityshow = Vue.component("cityshow", {
    template: `
<div>
    <div class="row justify-content-center">
    <div v-if="error">
        <h1><p>No venue/show found in this city</p></h1>
        <div>
        <h4><router-link to="#" @click.native="goBack" >Go Back</router-link></h4>
        </div>  
    </div> 
    <div v-else class="card border-primary col-11" v-for="venue in venueshow" :key="venue.venue_name">

        <div class="card-header bg-light border-primary">
            <b>{{venue.venue_name}}</b>
            {{venue.place}}
            <span style="float:right"></span>
        </div>
        <div v-if="Object.keys(venue.shows).length === 0"><h3>no show created</h3></div>
            <div v-else class="card-body">
                <div class="row">
                    <div class="card my-3 mx-3 col-4" style="width: 18rem;"  v-for="show in venue.shows" >
                        <div class="card-body">
                            <h3 class="card-title">{{show.show_name}}</h3>
                            <h5 class="card-title">Ratings:{{show.ratings}}</h5>
                            <h5 class="card-title">Price:{{show.price}}</h5>
                            <p class="card-text">Tags:{{show.tags}}</p>
                            <button type="button" @click ="booktickets(venue.venueid,show.show_id)" class="btn btn-primary"  data-bs-toggle="modal" data-bs-target="#model3">
                            Book tickets
                            </button>
                           
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
            venueshow: {},
            error: ""
        }


    },
    computed: {
        place() {
            return this.$route.params.place;

        },
        show_name() {
            return this.$route.params.show_name;

        }

    },
    methods: {
        convertKeysToDict(data) {
            const result = {};
            for (const key in data) {
                const venue = JSON.parse(key); // Parse the key to get the venue object
                const venueDetails = data[key]; // Array of show objects for the venue

                // Add the venue details to the result object
                result[venue.venueid] = {
                    venueid: venue.venueid,
                    venue_name: venue.venue_name,
                    location: venue.location,
                    place: venue.place,
                    shows: venueDetails, // Assuming the array of show objects is named 'shows'
                };
            }

            console.log(result);
            return result;
        },
        fetchVenuesData() {
            const data = {
                city: this.place,
                show_name: this.show_name,
            };

            fetch("user/search/show_name", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                })
                .then((response) => response.json())
                .then((data) => {

                    this.venueshow = this.convertKeysToDict(data);
                    console.log(this.venueshow)
                    this.error = false
                })
                .catch((error) => {
                    this.error = true
                    this.venueshow = {}
                    console.log(error);
                });
        },
        goBack() {
            this.$router.push("/"); // This navigates back one step in the router's history
        },

        booktickets(venueid, show_id) {
            console.log(venueid);
            console.log(show_id);
            this.$router.push({
                name: "bookings",
                params: {
                    venueId: venueid,
                    showId: show_id,
                },
            });
        },

    },
    mounted() {
        this.fetchVenuesData();
    }


})
export default cityshow