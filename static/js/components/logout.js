const Logout=Vue.component("Logout",{
    data(){
        return {
           
        }
    },
	
    mounted(){
			fetch("/logout",{
				method:"POST",
				headers:{
					'Content-Type':'application/json'
				}
			})
			.then(response=>{
				if(response.status===200){
					localStorage.removeItem('auth_token');
					// Clear cookies (assuming you know the cookie names)
					document.cookie = 'cookie_name_1=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
					document.cookie = 'cookie_name_2=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
			  
					// Clear session storage
					sessionStorage.clear();
			  
					// Redirect to the login page
					this.$router.push("/login");
				}
			})
		
    }
})


export default Logout;

