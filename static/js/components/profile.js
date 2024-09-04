const Profile = Vue.component("Profile", {
    template: `
    <div class="container">
    <div v-if="showmsgg" class="mt-5">
      <h1 style="color: red;">{{ ermsgg }}</h1>
    </div>
    <div v-else class="mt-5">
      <h4 v-if="showmsg" style="color: green; text-align: center;">{{ msg }}</h4>
      <h1 style="text-align: center;">Profile Page</h1>
      <div class="text-center mt-3">
        
        <h4 class="mt-3">Name: {{ profiledata.user_name }}</h4>
        <h4>E-mail: {{ profiledata.email }}</h4>
      
        <br>
        <br>
      </div>
    </div>
  </div>
  
      `,
    data() {
        return {
            profiledata: "",
            errormsgg: "",
            showmsgg: false,
            msg: "",
            showmsg: false,
        };
    },
    mounted() {
        const token = localStorage.getItem("auth_token");
        fetch("http://127.0.0.1:5000/api/profile", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": token,
                },
            })
            .then((response) => {
                if (response.ok) {
                    console.log(response)
                    return response.json();
                } else if (response.status === 401) {
                    throw new Error("Not Authorised!!!");
                } else {
                    throw new Error("profile not available");
                }
            })
            .then((data) => {
                this.profiledata = data;
                console.log(this.profiledata)
            })
            .catch((error) => {
                this.showmsgg = true;
                this.errormsgg = error;
                console.error(error);
            });
    },

});


export default Profile;