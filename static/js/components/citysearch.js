 // If you are not using Vuex
 const citysearch = Vue.component("citysearch", {
     template: `
<div>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
    <a class="navbar-brand" href="#">Navbar</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#">Home</a>
        </li>
      
     
        <li class="nav-item">
          <a class="nav-link disabled" aria-disabled="true">Disabled</a>
        </li>
      </ul>
      <form class="d-flex" role="search" @submit.prevent="cityshowsearch(query)">
        <input class="form-control me-2" type="search" v-model="query" placeholder="Show Search" aria-label="Search">
        <button class="btn btn-outline-success" type="submit" @click="cityshowsearch">Search</button>
      </form>

    </div>
    </div>
    </nav>
    <div v-if="error">
    <h1><p>No venues found</p></h1>
    </div>
    <div v-else>
    <div class="row justify-content-center">
    <div class="card border-primary col-11" v-for="venue in venshow" :key="venue.venue_name">
            <b>{{venue.venue_name}}</b>
            {{venue.place}}
            <span style="float:right"></span>
        <div v-if="Object.keys(venue.shows).length === 0">
        <h3>no show created</h3>
        </div>
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
    </div>
</div>`,
     data() {
         return {
             city: "",
             venshow: {},
             query: "",
             error: false
         };
     },
     computed: {
         place() {
             return this.$route.params.place;
         },
     },


     mounted() {
         this.fetchVenuesData();
     },
     methods: {
         convertKeysToDict(data) {
             const result = {};
             for (const key in data) {
                 const venue = JSON.parse(key); // Parse the key to get the venue object
                 const venueDetails = data[key]; // Array of show objects for the venue

                 // Add the venue details to the result object
                 result[venue.venue_id] = {
                     venue_id: venue.venue_id,
                     venue_name: venue.venue_name,
                     city: venue.city,
                     location: venue.location,
                     place: venue.place,
                     shows: venueDetails, // Assuming the array of show objects is named 'shows'
                 };
             }

             console.log(result);
             return result;
         },
         fetchVenuesData() {
             const place = {
                 city: this.place
             };

             fetch("user/search", {
                     method: "POST",
                     headers: {
                         "Content-Type": "application/json",
                     },
                     body: JSON.stringify(place),
                 })
                 .then((response) => response.json())
                 .then((data) => {
                     this.venshow = this.convertKeysToDict(data);
                     this.error = false
                 })
                 .catch((e) => {
                     console.log(e);
                     this.error = true
                     this.venshow = {}
                 });
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
         cityshowsearch() {
             this.$router.push({
                 name: "cityshow",
                 params: {
                     place: this.place,
                     show_name: this.query,
                 },
             });
         }

     },
 });

 export default citysearch;