const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));
const userGreeting = document.getElementById("userGreeting");
const url = "http://localhost:5000/api";
if (user && user.name) {
  userGreeting.textContent = `Welcome, ${user.name} (${user.role})`;
  document
    .querySelectorAll(".authorize")
    .forEach((tag) => (tag.style.display = "none"));
  document.querySelectorAll(".admin").forEach((tag) => {
    if (user.role === "admin") {
      tag.style.display = "block";
    } else {
      tag.style.display = "none";
    }
  });
  if (user.role === "customer" || user.role === "staff") {
    document.querySelector(".customer").style.display = "block";
    document.querySelector(".staff").style.display = "block";
  }
  document.getElementById("logoutItem").style.display = "block";
} else {
  userGreeting.style.display = "none";
  document
    .querySelectorAll(".admin")
    .forEach((tag) => (tag.style.display = "none"));
  document.querySelector(".customer").style.display = "none";
}
function logout() {
  localStorage.clear();
  window.location.href = "/view/login.html";
}
async function loadServices() {
  try {
    const res = await axios.get(`${url}/service/`, {
      headers: { Authorization: `${token}` },
    });
    const resServices=res.data.data;

    const serviceList = document.getElementById("serviceList");
    if (resServices) {
      // serviceHeading
      document.getElementById("serviceHeading").textContent = "Our Services";
    }
    resServices.forEach((service) => {
      const col = document.createElement("div");
      col.className = "col-md-4 mb-4";

      col.innerHTML = `
  <div class="card shadow-sm h-100 d-flex flex-column">
    <div class="card-body d-flex flex-column">
      <h5 class="card-title">${service.name}</h5>
      <p class="card-text">${
        service.description || "No description available"
      }</p>
      <p><strong>Duration:</strong> ${service.duration} mins</p>
      <p><strong>Price:</strong> ₹${service.price}</p>
      <div class="mt-auto">
        <a href="/view/book.html?serviceId=${
          service.id
        }" class="btn btn-primary w-100">Book Now</a>
      </div>
    </div>
  </div>
`;
      serviceList.appendChild(col);
    });
  } catch (err) {
    alert("Failed to load services");
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (user && user.role === "customer") {
    loadServices();
  }
});
