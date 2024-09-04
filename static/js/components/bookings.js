const bookings = Vue.component("bookings", {
    template: `
<div> 
    <B><H3>Show details</H3></B>
    <hr style="margin-top:20px">  
    <div class="row justify-content-center">
        <div class="card border-primary col-11">
            <div class="card-header bg-light primary">
                <b>{{shows['venue_name']}}</b>  - {{shows['venue_place']}}-{{shows['venue_location']}} <br>
                <b>Available seats</b> : <b>{{shows['seats']}}</b>
                
            </div>
            <div  class="card-body">
                <div class="row">
                <div class="card my-3 mx-3 col-4" style="width: 18rem;" >
                    <div class="card-body">
                        <h3 class="card-title">{{shows['show_name']}}</h3>
                        <h5 class="card-title">Ratings:{{shows['ratings']}}</h5>
                        <h5 class="card-title">Price:{{shows['price']}}</h5>
                        <p class="card-text">Tags:{{shows['tags']}}</p>
                        <p class="card-text">Timings:{{shows['timings']}}</p>
                       
                        <button type="button" class="btn btn-success"  data-bs-toggle="modal" data-bs-target="#model3">
                        bookticket
                        </button>
            
                    </div>
                </div>
            </div>
        </div>
    </div>
    <hr style="margin-top:20px">
    <h4>Movie description</h4>
    {{shows['movie_description']}}
   
    <div class="modal fade" id="model3" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div class="my-3 mx-5">
                <div class="modal-body">
                <div>
                    <label >Number of seats</label>
                    <input type="text" v-model="booked_seats" ></input>
                </div>
                <div class="my-3 ">
                    <label>Price</label>
                    <input type="text" v-model="price"></input>
                </div>
                <div class="my-3 ">
                    <label>Total</label>
                    <input type="text" v-model="total"></input>
                </div>

                <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button"  @click="booktickets()" class="btn btn-success" data-bs-dismiss="modal">confirm_bookings</button>

                </div>
            </div>
        </div>
    </div>
</div>`,



    data() {
        return {
            shows: {},
            profiledata: null,
            booked_seats: "",
            price: "",
            ttprice: null,
        }

    },

    computed: {
        show_id() {
            return this.$route.params.showId;
        },
        venue_id() {
            return this.$route.params.venueId;
        },
        total() {
            // Calculate the total based on numSeats and price
            return this.booked_seats * this.price;
        }
    },
    methods: {
        booktickets() {



            const payload = {
                NOS: this.booked_seats,
                Tprice: this.tticketprice,
            };

            this.isBookingInProgress = true;
            const token = localStorage.getItem('auth_token');
            fetch(`http://127.0.0.1:5000/api/bookedshow/create/${this.show_id}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication-Token": token
                    },
                    body: JSON.stringify(payload),
                })
                .then((response) => {
                    console.log(response);
                    return response.json();
                })
                .then((data) => {
                    console.log(data);
                    this.$router.push({
                        name: "userbookings",

                    });
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    this.isBookingInProgress = false; // Reset the flag once booking is completed (success or error)
                });
        },
    },

    mounted() {
        console.log(this.show_id)
        const token = localStorage.getItem('auth_token');

        fetch(`http://127.0.0.1:5000/api/book/${this.show_id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": token
                },
            })
            .then((response) => {
                if (response.ok) {
                    console.log(response)
                    return response.json()
                } else if (response.status == 401) {
                    throw new Error("error");
                } else {
                    throw new Error("error");
                }
            })
            .then((data) => {
                console.log(data)
                this.shows = data
                this.price = data.price
                console.log(this.price)
                this.total2 = this.total
                console.log(this.shows)

            })
            .catch((error) => {


                console.error(error);
            });
    },



})
export default bookings