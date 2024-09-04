import Show from './Show.js'
const admindashboard = Vue.component("admindashboard", {
    template: `
<div>
    <!-- Button trigger modal -->
    <button type="button" class="btn btn-primary" data-bs-toggle="modal" style=' margin-top: 20px' data-bs-target="#mode1">
    Create_venue 
    </button>
    <h4 v-if="sw">{{msg}}</h4>
    <div class="row justify-content-center">
        <div class="card border-primary col-11" v-for="venue in venues" :key="venue.venue_name">
            <div class="card-header bg-light primary">
                <b>{{venue.venue_name}}</b>{{venue.place}}
                <span style="float:right">
                <button @click="exportVenue(venue.venueid)" class="btn btn-warning">Export Venue</button></span>
                <span style="float:right">
                <button @click="deleteVenue(venue.venueid)" class="btn btn-danger">Delete Venue</button></span>
                <span style="float:right"><button type="button" @click="venuedata(venue)" class="btn btn-primary"  data-bs-toggle="modal"  data-bs-target="#model10">Update Venue</button>
                </span>
            </div>
            
       
            <div v-if="Object.keys(venue.shows).length===0"><h3>no show created</h3>

                <!-- Button trigger modal -->
                <button type="button" class="btn btn-success"  data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                create show
                </button>

                <!-- Modal -->
                <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div class="my-3 mx-5">
                            <div class="modal-body">
                                <div>
                                    <label >Show Name</label>
                                    <input type="text" v-model="show_name"></input>
                                </div>
                                <div class="my-3 ">
                                    <label>Ratings</label>
                                    <input type="text" v-model="ratings"></input>
                                </div>
                                <div class="my-3 ">
                                    <label>Timings</label>
                                    <input type="datetime-local" v-model="timings"></input>
                                </div>
                                <div class="my-3 ">
                                    <label>Tags</label>
                                    <input type="text" v-model="tags"></input>
                                </div>
                                <div class="my-3">
                                    <label>Price</label>
                                    <input type="text" v-model="price"></input>
                                </div>
                                <div class="my-3">
                                    <label>seats</label>
                                    <input type="text" v-model="seats"></input>
                                </div>
                                <div class="my-3">
                                    <label>movie_desc</label>
                                    <input type="text" v-model="movie_desc"></input>
                                </div>

                            </div>
                            
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button"  @click="addshow(venue.venueid)" class="btn btn-success" data-bs-dismiss="modal">Submit</button>
                       
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="card-body">
                <div class="row">
                    <div class="card my-3 mx-3 col-4" style="width: 18rem;"  v-for="show in venue.shows" :key="show.show_id">
                        <div class="card-body">
                            <h3 class="card-title">{{show.show_name}}</h3>
                            <h5 class="card-title">Ratings:{{show.ratings}}</h5>
                            <h5 class="card-title">Price:{{show.price}}</h5>
                            <p class="card-text">Tags:{{show.tags}}</p>
                            <button @click="delete_show(show.show_id)" class="btn btn-danger">delete</button>
                            <button type="button" @click ="showdata(show)" class="btn btn-primary"  data-bs-toggle="modal" data-bs-target="#model3">
                            update
                            </button>
                            <button type="button" class="btn btn-success"  data-bs-toggle="modal" data-bs-target="#model2">
                            create
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
                                <div>
                                    <label >Show Name</label>
                                    <input type="text" v-model="show_name"></input>
                                </div>
                                <div class="my-3 ">
                                    <label>Ratings</label>
                                    <input type="text" v-model="ratings"></input>
                                </div>
                                <div class="my-3 ">
                                    <label>Timings</label>
                                    <input type="datetime-local" v-model="timings"></input>
                                </div>
                                <div class="my-3 ">
                                    <label>Tags</label>
                                    <input type="text" v-model="tags"></input>
                                </div>
                                <div class="my-3">
                                    <label>Price</label>
                                    <input type="text" v-model="price"></input>
                                </div>
                                <div class="my-3">
                                    <label>seats</label>
                                    <input type="text" v-model="seats"></input>
                                </div>
                                <div class="my-3">
                                    <label>movie_desc</label>
                                    <input type="text" v-model="movie_desc"></input>
                                </div>

                            </div>
                            
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button"  @click="addshow(venue.venueid)" class="btn btn-success" data-bs-dismiss="modal">Submit</button>
                       
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal fade" id="model3" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div class="my-3 mx-5">
                            <div class="modal-body">
                                <div>
                                    <label >Show Name</label>
                                    <input type="text" v-model="updatedata.show_name" ></input>
                                </div>
                                <div class="my-3 ">
                                    <label>Ratings</label>
                                    <input type="text" v-model="updatedata.ratings"></input>
                                </div>
                                <div class="my-3 ">
                                    <label>Tags</label>
                                    <input type="text" v-model="updatedata.tags" ></input>
                                </div>
                                <div class="my-3">
                                    <label>Price</label>
                                    <input type="text" v-model="updatedata.price"></input>
                                </div>
                                <div class="my-3">
                                    <label>seats</label>
                                    <input type="text" v-model="updatedata.seats"></input>
                                </div>
                                <div class="my-3">
                                    <label>movie_desc</label>
                                    <input type="text" v-model="updatedata.movie_desc"></input>
                                </div>

                            </div>
                            
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button"  @click="updateshow(updatedata.show_id)" class="btn btn-success" data-bs-dismiss="modal">Upate</button>
                       
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal fade" id="model10" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="my-3">
                                <label>Enter Venue here:</label>
                                <input type ="text" v-model="updatevenue.venue_name">
                            </div>
                            <div class="my-3">
                                <label>Enter Place :</label>
                                <input type="text" v-model="updatevenue.place">
                            </div>
                            <div class="my-3">
                                <label>Enter location:</label>
                                <input type="text" v-model="updatevenue.location">
                            </div>
                            <div>
                                <label>Capacity:</label>
                                <input type="text" v-model="updatevenue.capacity">
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button"  @click="updateVenue(updatevenue.venueid)" data-bs-dismiss="modal" class="btn btn-primary">Submit</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
  

    <!-- Modal -->
    <div class="modal fade" id="mode1" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="my-3">
                        <label>Enter Venue here:</label>
                        <input type ="text" v-model="venue_name">
                    </div>
                    <div class="my-3">
                        <label>Enter Place :</label>
                        <input type="text" v-model="place">
                    </div>
                    <div class="my-3">
                        <label>Enter location:</label>
                        <input type="text" v-model="location">
                    </div>
                    <div>
                        <label>Capacity:</label>
                        <input type="text" v-model="capacity">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" @click="addvenue" data-bs-dismiss="modal" class="btn btn-primary">Submit</button>
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
            capacity: "",
            show_name: "",
            ratings: "",
            timings: "",
            tags: "",
            price: "",
            seats: "",
            movie_desc: "",
            updatedata: {},
            updatevenue: {},
            msg:"",
            sw:false


        }
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




        async addvenue() {
            const data2 = {
                venue_name: this.venue_name,
                place: this.place,
                location: this.location,
                capacity: this.capacity,

            };
            try {
                const response = await fetch("/createvenue", {
                    method: "POST", // or 'PUT'
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data2),
                });

                const result = await response.json();
                this.fetchvenuedata();
                console.log("Success:", result);
                this.$router.go(0);
            } catch (error) {
                console.error("Error:", error);
            }
        },
        async addshow(vid) {
            const data4 = {
                show_name: this.show_name,
                ratings: this.ratings,
                timings: this.timings,
                tags: this.tags,
                price: this.price,
                venueid: this.venueid,
                seats: this.seats,
                movie_desc: this.movie_desc


            };
            try {
                const response = await fetch(`/creatshow/${vid}`, {
                    method: "POST", // or 'PUT'
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data4),
                });
                console.log("Data4:", data4)
                const result = await response.json();
                this.fetchvenuedata();
                console.log("Success:", result);
                this.$router.go(0);
            } catch (error) {
                console.error("Error:", error);
            }
        },
        async updateshow(id) {
            const data4 = {
                show_name: this.updatedata.show_name,
                ratings: this.updatedata.ratings,
                tags: this.updatedata.tags,
                price: this.updatedata.price,
                venueid: this.updatedata.venueid,
                seats: this.updatedata.seats,
                movie_desc: this.updatedata.movie_desc


            };
            
            try {
                const response = await fetch(`/updateshow/${id}`, {
                    method: "POST", // or 'PUT'
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data4),
                });
                console.log("Data4:", data4)
                const result = await response.json();
                this.fetchvenuedata();
                console.log("Success:", result);
                this.$router.go(0);
            } catch (error) {
                console.error("Error:", error);
            }
        },

        showdata(show) {
            this.updatedata = {...show }
        },
        venuedata(venue) {
            this.updatevenue = {...venue }
        },
        exportVenue(venueid){
            fetch(`/exportreport/${venueid}`, {
                method: 'GET',
            })
            .then((response) => {
                if (response.ok) {
                    this.sw=true;
                    this.msg="Venue report exported successfully";
                    console.log('Venue report exported successfully');
                 


                } else {
                   
                    console.error('Failed to export report');
                }
            })
            .catch((error) => {
                this.sw=true;
                this.msg=error.message;
                console.error('Error:', error.message);
            });
        },
        deleteVenue(venueid) {
            // Call the delete venue function with the venueid
            fetch(`/deletevenue/${venueid}`, {
                    method: 'DELETE',
                })
                .then((response) => {
                    if (response.ok) {
                        // Venue deleted successfully
                        // You can update your data or perform other actions as needed
                        console.log('Venue deleted successfully');
                        this.fetchvenuedata();

                        this.$router.go(0);
                    } else {
                        // Handle error here
                        console.error('Failed to delete venue');
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        },
        updateVenue(venueid) {
            const updatedVenueData = {
                "venue_name": this.updatevenue.venue_name,
                "place": this.updatevenue.place,
                "location": this.updatevenue.location,
                "capacity": this.updatevenue.capacity,
            };

            fetch(`/updatevenue/${venueid}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedVenueData),
                })
                .then((response) => {
                    if (response.ok) {
                        // Venue updated successfully
                        // You can update your data or perform other actions as needed
                        console.log('Venue updated successfully');
                        this.fetchvenuedata();

                        this.$router.go(0);
                    } else {
                        // Handle error here
                        console.error('Failed to update venue');
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        },









        delete_show: function(id) {
            fetch(`/deleteshow/${id}`).then(r => r.json()).then(d => {
                console.log(d);
                this.$router.go(0);
            })
        }





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
export default admindashboard