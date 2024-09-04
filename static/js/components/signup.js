const signup = Vue.component("signup", {
    template: `
      <div>
        <div class="back">
          <div class="div-center">
            <div class="content">
              <h3>Signup</h3>
              <hr />
              <form @submit.prevent="signup">
                <div class="form-group">
                  <label for="exampleInputEmail1">Email address</label>
                  <input type="email" class="form-control" id="exampleInputEmail1" placeholder="Email" v-model="credentials.email">
                </div>
                <div class="form-group">
                  <label for="exampleInputUsername">Username</label>
                  <input type="text" class="form-control" id="exampleInputUsername" placeholder="Username" v-model="credentials.username">
                </div>
                <div class="form-group">
                  <label for="exampleInputPassword1">Password</label>
                  <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" v-model="credentials.password">
                </div>
                <div class="form-group">
                  <button type="submit" class="btn btn-primary">Signup</button>
                </div>
              </form>
              <hr />
            </div>
          </div>
        </div>
      </div>
    `,
  
    data() {
      return {
        credentials: {
          username: null, // Change from 'Username' to 'username'
          email: null,
          password: null,
        },
      };
    },
    methods: {
      signup() {
        const data = {
          username: this.credentials.username,
          email: this.credentials.email,
          password: this.credentials.password,
        };
  
        fetch("/registers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((response) => {
            if (response.status === 200) return response.json();
          })
          .then((data) => {
            if(data.message==="successfully registered!!"){
                setTimeout(() => {
                    this.$router.push("/login");
                  }, 2000);
            }
          })
          .catch((error) => {
            // Handle errors
          });
      },
    },
  });
  
  export default signup;
  