const userbookings = Vue.component("userbookings", {
    template: `<div>
      <h3>bookings</h3>
      <div class="row justify-content-center">
        <div class="card border-primary col-11" v-for="venue in bookedshow">
          <div class="card-header bg-light border-primary">
            <b>{{venue.venue_name}}</b> {{venue.show_name}} {{venue.venue_place}} -{{venue.venue_location}}  {{venue.timings}}
            {{venue.seats_booked}}
            <span style="float:right">
              <button type="button" class="btn btn-primary" data-bs-toggle="modal" :data-bs-target="'#staticBackdrop' + venue.sb_id">
                rate
              </button>
            </span>
  
            <div :id="'staticBackdrop' + venue.sb_id" class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" :aria-labelledby="'staticBackdropLabel' + venue.sb_id" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                <h4 v-if="smsg" style="color: red;">{{ message }}</h4>
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" :id="'staticBackdropLabel' + venue.sb_id">Modal title</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <div>
                      <h2>Rate the Show</h2>
                      <form @submit.prevent="submitRating">
                        <div class="form-group">
                          <label for="showName">Show Name:</label>
                          <input type="text" id="showName" v-model="showName" required />
                        </div>
                        <div class="form-group">
                          <label for="rating">Rating:</label>
                          <div class="rating-options">
                            <label v-for="option in ratingOptions" :key="option.value">
                              <input type="radio" :value="option.value" v-model="selectedRating" />
                              {{ option.label }}
                            </label>
                          </div>
                        </div>
                        <div class="form-group">
                          <label for="review">Review:</label>
                          <textarea id="review" v-model="review" rows="4"></textarea>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="Rate(venue.sb_id)">Submit</button>
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
            bookedshow: [],
            showName: "",
            selectedRating: null,
            review: "",
            ratingOptions: [
                { label: "1 (Terrible)", value: 1 },
                { label: "2 (Poor)", value: 2 },
                { label: "3 (Average)", value: 3 },
                { label: "4 (Good)", value: 4 },
                { label: "5 (Excellent)", value: 5 },
            ],
            message: "",
            cmsg: ""
        };
    },
    methods: {
        fetchdata() {
            const token = localStorage.getItem('auth_token');
            fetch(`http://127.0.0.1:5000/api/bookedshow`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication-Token": token
                    },
                })
                .then((response) => {
                    if (response.ok) {
                        return response.json()
                    } else if (response.status === 404) {
                        throw new Error("No shows Booked!!");
                    } else if (response.status === 401) {
                        throw new Error("Please Login to see the Booked details!!");
                    }
                })
                .then((data) => {
                    this.bookedshow = data;
                })
                .catch((error) => {
                    this.cmsg = true;
                    setTimeout(() => {
                        this.cmsg = false;
                    }, 3000);
                    this.message = "review already done";
                    console.error(error);

                })
        },
        async Rate(show_id) {
            const data2 = {
                rating: this.selectedRating,
                review: this.review,
            }
            try {
                const token = localStorage.getItem('auth_token');
                const response = await fetch(`/api/rating/create/${show_id}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication-Token": token
                    },
                    body: JSON.stringify(data2),
                });

                const result = await response.json();
                console.log("Success:", result);
            } catch (error) {
                console.error("Error:", error);
            }
        },
    },
    mounted() {
        this.fetchdata();
    }
})

export default userbookings;