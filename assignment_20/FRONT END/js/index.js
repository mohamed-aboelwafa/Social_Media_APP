const baseURL = "http://localhost:3000";

$("#login").click(() => {
  const email = $("#email").val();
  const password = $("#password").val();
  const data = {
    email,
    password,
  };
  axios({
    method: "post",
    url: `${baseURL}/auth/login`,
    data: data,
    headers: { "Content-Type": "application/json; charset=UTF-8" },
  })
    .then(function (response) {
      const { data, message, status } = response.data;
      console.log({ data: response.data });

      if (message ) {
        localStorage.setItem("token", data.accessToken);
        window.location.href = "chat.html";
      } else {
        console.log("In-valid email or password");
        alert("In-valid email or password");
      }
    })
    .catch(function (error) {
      console.log(error);
    });
});
