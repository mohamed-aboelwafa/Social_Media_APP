
const baseUrl = "http://localhost:3000"

const login = (email , password)=>{
    fetch(`${baseUrl}/auth/login`,{
        method:"POST",
        body: JSON.stringify({
            email,
            password
        }),

    }).then(async(res)=>{
        const response = await res.json()
        const token = response.data.accessToken
        const clientIo = await io(baseUrl , {auth: `Bearer ${token}`})
        main(clientIo);
    })
}

document.getElementById("login").addEventListener("click",()=>{
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    login(email,password)
})

const main = (clientIo)=>{
    clientIo.emit("login_success","hello from front")
    clientIo.on("user_data",(data)=>{
        console.log(data);
        document.getElementById("name").innerHTML = data.name
    })
}

clientIo.on("ack", (name1, name2, name3, cb)=>{
    console.log({
        name1,
        name2,
        name3
    });
    setTimeout(()=>{
        cb("DONE")
    }, 2000)
})

clientIo.on("error",(err)=>{
    console.log({err});
})