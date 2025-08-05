const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));
const serviceId = parseInt(
  new URLSearchParams(window.location.search).get("serviceId")
);
const url = "http://localhost:5000/api";
const dateInput = document.getElementById("dateInput");
const slotContainer = document.getElementById("slotContainer");

if (!token || !user || user.role !== "customer") {
  alert("Only customers can book appointments.");
  window.location.href = "/view/login.html";
}

// On date select
dateInput.addEventListener("change", async () => {
  const date = dateInput.value;
  if (!date) return;
  
  try {
    const res = await axios.post(
      `${url}/appointment/avail-slots`,
      { serviceId, date },
      {
        headers: { Authorization: `${token}` },
      }
    );
    console.log(res);
    displaySlots(res.data);
  } catch (err) {
    console.log(err);
    slotContainer.innerHTML = `<p class="text-danger">No available slots found.</p>`;
  }
});

// Show staff + slots
function displaySlots(data) {
  slotContainer.innerHTML = "";

  data.forEach((staff) => {
    const div = document.createElement("div");
    div.className = "mb-4";
    
    div.innerHTML = `
    <h5>${staff.staffName}</h5>
    <div class="d-flex flex-wrap gap-2 mt-2" id="slots-${staff.staffId}">
        ${staff.availableSlots
          .map(
            (time) => `
          <button class="btn btn-outline-primary btn-sm" onclick="bookSlot(${staff.staffId}, '${time}')">${time}</button>
          `
          )
          .join("")}
          </div>
      <hr />
      `;

    slotContainer.appendChild(div);
  });
}

// Book slot
async function bookSlot(staffId, startTime) {
  const cashfree = Cashfree({
    mode: "sandbox",
  });
  const date = dateInput.value;
  if (!confirm(`Book appointment at ${startTime} on ${date}?`)) return;

  try {
    const validate = await axios.post(
      `${url}/appointment/validate`,
      {
        serviceId,
        staffId,
        date,
        startTime,
      },
      {
        headers: { Authorization: `${token}` },
      }
    );
    if (validate.data.valid) {
      const response = await axios.post(
        `${url}/payment/pay`,
        {
          serviceId,
          staffId,
          date,
          startTime,
        },
        {
          headers: { Authorization: `${token}` },
        }
      );

      const data = response.data;
      const paymentSessionId = data.paymentSessionId;
      const checkoutOptions = {
        paymentSessionId,
        redirectTarget: "_self",
      };
      await cashfree.checkout(checkoutOptions);
    }
  } catch (err) {
    alert("Failed to book appointment.");
  }
}
