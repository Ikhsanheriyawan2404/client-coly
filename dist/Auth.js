class Authentication {
    constructor() {
        
    }

    check = async ()  => {
        let token = localStorage.getItem("accessToken");
        if (!token) return false;
        const response = await fetch(`http://localhost:3019/api/users`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            }).catch((err) => console.log(err));

        if (response.status == 200) {
            return true;
        } else if (response.status == 401){
            return false;
        } else {
            return false;
        }
    }
}

const auth = new Authentication();