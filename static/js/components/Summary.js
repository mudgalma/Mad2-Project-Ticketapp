const summry = Vue.component("summry", {
    template: `
      <div>
      <button type="submit" class="btn btn-primary" @click="goback">Go back</button>
      <div v-if="showmsgg">
      <h1 style="color: red;">{{ermsgg}}</h1>
      </div>
      <div v-if="!showmsgg">
      <h1>Summary Page</h1>
      <div class="image-grid">
        <div v-for="i in plot_data" :key="i" class="image-container">
          <img :src="'/static/js/' + i + '.png'" />
        </div>
      </div>
      </div>
    </div>
    
  
      `,
    data() {
        return {
            plot_data: "",
            ermsgg: "",
            showmsgg: false,
        };
    },
    mounted() {
        this.fetchdata();
    },
    methods: {
        goback() {
            this.$router.push("/admindashboard")
        },
        fetchdata() {
            const token = localStorage.getItem("auth_token");
            fetch(`http://127.0.0.1:5000/api/summary`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication-Token": token,
                    },
                })
                .then((response) => {
                    console.log(response)
                    if (response.ok) {
                        return response.json();
                    } else if (response.status === 401) {
                        throw new Error("Not Authorised!!!");
                    } else {
                        throw new Error("Summary not available");
                    }
                })
                .then((data) => {
                    this.plot_data = data;
                })
                .catch((error) => {
                    this.showmsgg = true;
                    this.ermsgg = error;
                    setTimeout(() => {
                        this.$router.push("/admindashboard")
                    })
                });
        },
    },
});

export default summry;